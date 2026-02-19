/**
 * 네이버 블로그 스크래퍼 → DeskPost[] 변환기
 *
 * Playwright로 실제 브라우저를 띄워 네이버 블로그 포스트를 긁어옵니다.
 * (agent-browser도 내부적으로 Playwright 사용 — 배치 작업엔 직접 호출이 효율적)
 *
 * Usage:
 *   npx tsx scripts/fetch-naver-blog.ts
 *   npx tsx scripts/fetch-naver-blog.ts --max 50        # 최대 50개
 *   npx tsx scripts/fetch-naver-blog.ts --download       # 이미지도 다운로드
 *   npx tsx scripts/fetch-naver-blog.ts --category 일상  # 특정 카테고리만
 *
 * 결과: src/data/desk/_naver-posts.ts 파일로 저장
 */

import { chromium, type Page } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';
import * as http from 'http';
import { fileURLToPath, pathToFileURL } from 'url';

process.on('uncaughtException', (err) => {
    console.error('\n💥 uncaughtException:', err);
    if (err && (err as Error).stack) console.error((err as Error).stack);
    process.exit(1);
});

process.on('unhandledRejection', (err) => {
    console.error('\n💥 unhandledRejection:', err);
    if (err && (err as Error).stack) console.error((err as Error).stack);
    process.exit(1);
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BLOG_ID = 'fstory97';
const BASE_URL = `https://blog.naver.com`;
const POST_LIST_URL = `${BASE_URL}/PostList.naver?blogId=${BLOG_ID}&from=postList&categoryNo=0`;
const OUTPUT_FILE = path.join(__dirname, '..', 'src', 'data', 'desk', '_naver-posts.ts');
const IMAGE_DIR = path.join(__dirname, '..', 'public', 'desk');
const MISSING_IMAGE_FALLBACK = '/desk/missing-image.webp';
const TMP_DIR = path.join(__dirname, '..', '.tmp');
const PROGRESS_LOG_FILE = path.join(TMP_DIR, 'fetch-naver-progress.log');
const CHECKPOINT_FILE = path.join(TMP_DIR, 'fetch-naver-checkpoint.json');
const PARTIAL_OUTPUT_FILE = path.join(path.dirname(OUTPUT_FILE), '_naver-posts.partial.ts');

interface ScrapedPost {
    postNo: string;
    title: string;
    date: string;
    category: string;
    sourceCategoryNo?: string;
    sourceCategory?: string;
    tags: string[];
    content: string;
    images: string[];
    url: string;
}

interface PostListItem {
    postNo: string;
    title: string;
    listDate: string;
    categoryNo: string;
    categoryName: string;
}

// ── CLI args ──
const args = process.argv.slice(2);
const maxPosts = getArgValue('--max', 999);
const startPage = Math.max(1, getArgValue('--start-page', 1));
const endPage = Math.max(0, getArgValue('--end-page', 0));
const countPerPage = Math.max(1, Math.min(30, getArgValue('--count-per-page', 15)));
const shouldDownload = args.includes('--download');
const appendMode = args.includes('--append');
const fullResync = args.includes('--full-resync');
const filterCategory = getArgValue('--category', '') as string;
const checkpointEvery = Math.max(1, getArgValue('--checkpoint-every', 20));
const postTimeoutMs = Math.max(10000, getArgValue('--post-timeout-ms', 90000));
const imageTimeoutMs = Math.max(3000, getArgValue('--image-timeout-ms', 20000));

function getArgValue(flag: string, defaultVal: number): number;
function getArgValue(flag: string, defaultVal: string): string;
function getArgValue(flag: string, defaultVal: number | string): number | string {
    const idx = args.indexOf(flag);
    if (idx === -1 || idx + 1 >= args.length) return defaultVal;
    return typeof defaultVal === 'number' ? parseInt(args[idx + 1], 10) : args[idx + 1];
}

// ── Helpers ──

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function ensureTmpDir() {
    if (!fs.existsSync(TMP_DIR)) fs.mkdirSync(TMP_DIR, { recursive: true });
}

function appendProgressLog(message: string) {
    ensureTmpDir();
    const ts = new Date().toISOString();
    fs.appendFileSync(PROGRESS_LOG_FILE, `[${ts}] ${message}\n`, 'utf-8');
}

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
    return new Promise<T>((resolve, reject) => {
        const timer = setTimeout(() => reject(new Error(`${label} timeout after ${ms}ms`)), ms);
        promise.then(
            (value) => {
                clearTimeout(timer);
                resolve(value);
            },
            (error) => {
                clearTimeout(timer);
                reject(error);
            },
        );
    });
}

function normalizeDate(input: string): string {
    const trimmed = input.trim();
    const dot = trimmed.match(/(\d{4})\.\s*(\d{1,2})\.\s*(\d{1,2})/);
    if (dot) return `${dot[1]}-${dot[2].padStart(2, '0')}-${dot[3].padStart(2, '0')}`;
    const dash = trimmed.match(/(\d{4})-(\d{1,2})-(\d{1,2})/);
    if (dash) return `${dash[1]}-${dash[2].padStart(2, '0')}-${dash[3].padStart(2, '0')}`;
    return '';
}

function decodeTitle(raw: string): string {
    const trimmed = raw.trim().replace(/\+/g, ' ');
    if (!/%[0-9A-Fa-f]{2}/.test(trimmed)) return trimmed;
    try {
        return decodeURIComponent(trimmed);
    } catch {
        return trimmed;
    }
}

function slugify(date: string, title: string): string {
    const dateCompact = date.replace(/-/g, '');
    const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9가-힣\s-]/g, '')
        .replace(/\s+/g, '-')
        .slice(0, 50)
        .replace(/-+$/, '');
    return `${dateCompact}-${slug || 'post'}`;
}

function guessCategory(category: string, title: string): string {
    const combined = `${category} ${title}`.toLowerCase();
    if (combined.includes('리뷰') || combined.includes('review') || combined.includes('감상')) return 'review';
    if (combined.includes('기술') || combined.includes('tech') || combined.includes('개발') ||
        combined.includes('코딩') || combined.includes('프로그') || combined.includes('ai') ||
        combined.includes('코드')) return 'tech';
    if (combined.includes('에세이') || combined.includes('일상') || combined.includes('생각') ||
        combined.includes('잡담') || combined.includes('일기')) return 'essay';
    return 'misc';
}

function downloadFile(url: string, dest: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const dir = path.dirname(dest);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

        const client = url.startsWith('https') ? https : http;
        client.get(url, { headers: { 'User-Agent': 'Mozilla/5.0', 'Referer': BASE_URL } }, (res) => {
            if (res.statusCode === 301 || res.statusCode === 302 || res.statusCode === 307 || res.statusCode === 308) {
                const redirectUrl = res.headers.location;
                if (redirectUrl) {
                    const nextUrl = redirectUrl.startsWith('http') ? redirectUrl : new URL(redirectUrl, url).toString();
                    return downloadFile(nextUrl, dest).then(resolve).catch(reject);
                }
            }
            if (res.statusCode !== 200) {
                reject(new Error(`HTTP ${res.statusCode} for ${url}`));
                return;
            }
            const stream = fs.createWriteStream(dest);
            res.pipe(stream);
            stream.on('finish', () => { stream.close(); resolve(); });
            stream.on('error', reject);
        }).on('error', reject);
    });
}

// ── 1. 포스트 목록 수집 ──

async function collectPostLinks(_page: Page): Promise<PostListItem[]> {
    const posts: PostListItem[] = [];
    const seen = new Set<string>();
    let emptyPages = 0;

    console.log('📋 포스트 목록 수집 중...');

    const targetCategories = [{ categoryNo: '0', categoryName: '전체보기', url: POST_LIST_URL }];

    const fetchPostListPage = async (pageNo: number, categoryNo: string, categoryName: string): Promise<PostListItem[]> => {
        let lastErr: Error | null = null;
        for (let attempt = 1; attempt <= 5; attempt++) {
            try {
                const rows = await _page.evaluate(async ({ blogId, pageNo, countPerPage, categoryNo, categoryName }) => {
                    const resp = await fetch(
                        `/api/blogs/${blogId}/post-list?categoryNo=${categoryNo}&itemCount=${countPerPage}&page=${pageNo}&userId=`,
                        { credentials: 'include' }
                    );
                    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
                    const payload = await resp.json() as {
                        isSuccess?: boolean;
                        result?: {
                            items?: Array<{
                                logNo?: number | string;
                                titleWithInspectMessage?: string;
                                addDate?: number;
                                categoryNo?: number | string;
                                categoryName?: string;
                            }>;
                        };
                    };
                    const items = payload?.result?.items || [];
                    return items.map((item) => {
                        const ts = Number(item.addDate || 0);
                        const d = Number.isFinite(ts) && ts > 0 ? new Date(ts) : null;
                        return {
                            postNo: String(item.logNo || '').trim(),
                            title: String(item.titleWithInspectMessage || '').trim(),
                            listDate: d
                                ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
                                : '',
                            categoryNo: String(item.categoryNo || categoryNo || '').trim(),
                            categoryName: String(item.categoryName || categoryName || '').trim(),
                        };
                    });
                }, { blogId: BLOG_ID, pageNo, countPerPage, categoryNo, categoryName });

                return rows.filter((item) => item.postNo.length > 0 && item.title.length > 0);
            } catch (err) {
                lastErr = err as Error;
                const delay = 700 * attempt;
                console.log(`  ⚠️ 목록 페이지 ${pageNo} (카테고리 ${categoryNo}) 시도 ${attempt}/5 실패: ${lastErr.message} (대기 ${delay}ms)`);
                await sleep(delay);
            }
        }

        throw lastErr || new Error(`목록 페이지 ${pageNo} 로드 실패`);
    };

    await _page.goto(`https://m.blog.naver.com/PostList.naver?blogId=${BLOG_ID}&categoryNo=0&listStyle=style2`, { waitUntil: 'domcontentloaded' });
    await sleep(600);

    for (const cat of targetCategories) {
        if (posts.length >= maxPosts) break;
        let currentPage = startPage;
        emptyPages = 0;
        console.log(`  - 카테고리 수집 시작: ${cat.categoryName} (categoryNo=${cat.categoryNo})`);
        while (posts.length < maxPosts) {
            if (endPage > 0 && currentPage > endPage) break;
            const newPosts = await fetchPostListPage(currentPage, cat.categoryNo, cat.categoryName);
            if (newPosts.length === 0) {
                emptyPages += 1;
                if (fullResync ? emptyPages >= 5 : emptyPages >= 2) break;
                currentPage += 1;
                continue;
            }

            let added = 0;
            for (const p of newPosts) {
                if (seen.has(p.postNo)) continue;
                seen.add(p.postNo);
                posts.push(p);
                added += 1;
                if (posts.length >= maxPosts) break;
            }

            emptyPages = 0;
            console.log(`    페이지 ${currentPage}: ${newPosts.length}개 발견, 신규 ${added}개 (총 ${posts.length}개)`);
            currentPage += 1;
            await sleep(250);
        }
    }

    console.log(`✅ 총 ${posts.length}개 포스트 링크 수집 완료\n`);
    return posts.slice(0, maxPosts);
}

// ── 2. 개별 포스트 스크래핑 ──

async function scrapePost(
    page: Page,
    postNo: string,
    fallbackTitle: string,
    listDate: string,
    listCategory = '',
    listCategoryNo = '',
): Promise<ScrapedPost | null> {
    const url = `${BASE_URL}/${BLOG_ID}/${postNo}`;

    try {
        // 일부 구형 포스트는 광고/트래커 요청이 끊기지 않아 networkidle이 잘 끝나지 않는다.
        // 본문 파싱은 DOM 로드만 되어도 가능하므로 domcontentloaded 기준으로 전환한다.
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
        await sleep(1200);

        // 네이버 블로그는 iframe 안에 본문이 있을 수 있음
        let contentFrame = page;
        const mainFrame = page.frames().find(f =>
            f.url().includes('PostView.naver') || f.url().includes('postView')
        );
        if (mainFrame) {
            contentFrame = mainFrame as unknown as Page;
        }

        const data = await contentFrame.evaluate(() => {
            // tsx/esbuild가 삽입하는 __name 헬퍼가 브라우저 컨텍스트에 없을 수 있어 방어 정의
            const __name = <T,>(v: T) => v;
            const metaDate =
                document.querySelector('meta[property="article:published_time"]')?.getAttribute('content') ||
                document.querySelector('meta[property="og:article:published_time"]')?.getAttribute('content') ||
                document.querySelector('meta[name="date"]')?.getAttribute('content') ||
                '';

            const timeDate =
                document.querySelector('time')?.getAttribute('datetime') ||
                document.querySelector('time')?.textContent ||
                '';

            // 제목
            const titleEl = document.querySelector(
                '.se-title-text, .pcol1 .itemSubjectBoldfont, .htitle, ' +
                '.se_title .se_textView, h3.se_textarea, .title_post, ' +
                '[class*="title"] .se-text-paragraph'
            );
            const title = (titleEl?.textContent || '').trim();

            // 날짜
            const dateEl = document.querySelector(
                '.se_publishDate, .blog_date, .se-date, .date, ' +
                '.post_date, [class*="date"], .se_publishDate_layer'
            );
            const dateStr = (dateEl?.textContent || '').trim();

            let fallbackDate = '';
            const bodyText = document.body?.innerText || '';
            const bodyMatch = bodyText.match(/(\d{4})\.\s*(\d{1,2})\.\s*(\d{1,2})/);
            if (bodyMatch) {
                fallbackDate = `${bodyMatch[1]}-${bodyMatch[2].padStart(2, '0')}-${bodyMatch[3].padStart(2, '0')}`;
            }

            // 카테고리
            const catEl = document.querySelector(
                '.blog_category a, .category a, [class*="cate"] a, .post_category'
            );
            const category = (catEl?.textContent || '').trim();

            const container = document.querySelector('#post_1 .post-view') ||
                document.querySelector('#printPost1 .post-view') ||
                document.querySelector('#printPost1 .post-view p')?.parentElement ||
                document.querySelector('#printPost1') ||
                document.querySelector('#post_1') ||
                document.querySelector('.post-body') ||
                document.querySelector('[id^="post-view"]') ||
                document.querySelector('.se-main-container') ||
                document.querySelector('.se_component_wrap') ||
                document.querySelector('#postViewArea') ||
                document.body;

            // 해시태그: 본문 내부의 hashtag 노드만 수집 (사이드바/메뉴 태그 제외)
            const tags: string[] = [];
            const tagSelectors = [
                '.se-hashtag',
                '.se-hashtag a',
                'a[class*="hashtag"]',
                'a[href*="/hashtag/"]',
                'a[href*="hashtag"]',
            ];
            container.querySelectorAll(tagSelectors.join(',')).forEach((el) => {
                const text = (el.textContent || '').trim();
                if (!text) return;
                const normalized = text.startsWith('#') ? text.slice(1).trim() : text.trim();
                if (!normalized) return;
                if (normalized === '태그') return;
                if (normalized.length > 40) return;
                tags.push(normalized);
            });

            const images: string[] = [];
            const seen = new Set<string>();
            let imgIndex = 0;

            const getImgSrc = (img: HTMLImageElement) => {
                return img.dataset.lazySrc ||
                    img.dataset.src ||
                    img.getAttribute('data-lazy-src') ||
                    img.getAttribute('data-src') ||
                    img.getAttribute('data-original') ||
                    img.currentSrc ||
                    img.src ||
                    '';
            };
            const serialize = (node: Node): string => {
                if (node.nodeType === Node.TEXT_NODE) {
                    return (node.textContent || '');
                }
                if (node.nodeType !== Node.ELEMENT_NODE) return '';
                const el = node as HTMLElement;
                const tag = el.tagName.toLowerCase();
                if (tag === 'script' || tag === 'style' || tag === 'noscript' || tag === 'svg' || tag === 'path') return '';
                if (tag === 'img') {
                    const imageEl = el as HTMLImageElement;
                    const src = getImgSrc(imageEl);
                    const className = `${imageEl.className || ''} ${imageEl.parentElement?.className || ''}`.toLowerCase();
                    const isOglinkImage = className.includes('oglink') || Boolean(imageEl.closest(
                        '.se-module-oglink, .se-oglink-thumbnail, .se-oglink-info, [class*="oglink"]'
                    ));
                    if (src && !seen.has(src) && !src.includes('static.naver') &&
                        !src.includes('blogpfthumb') &&
                        !src.includes('dthumb-phinf.pstatic.net') &&
                        src.startsWith('http') &&
                        !isOglinkImage) {
                        seen.add(src);
                        images.push(src);
                        imgIndex += 1;
                        return `{{IMG:${imgIndex}}}`;
                    }
                    return '';
                }
                if (tag === 'iframe') {
                    const src = (el as HTMLIFrameElement).src || el.getAttribute('src') || '';
                    if (!src) return '';
                    const isYouTube = /youtu\.be|youtube\.com/i.test(src);
                    const isNaverVideo = /tv\.naver\.com|serviceapi\.nmv\.naver\.com|blog\.naver\.com\/PostView/i.test(src);
                    if (!isYouTube && !isNaverVideo) return '';
                    return `\n\n${src}\n\n`;
                }

                if (tag === 'table') {
                    const rows = Array.from(el.querySelectorAll('tr'))
                        .map((tr) => Array.from(tr.querySelectorAll('th,td'))
                            .map((cell) => Array.from(cell.childNodes).map(serialize).join('').replace(/\s+/g, ' ').trim())
                            .filter(Boolean))
                        .filter((row) => row.length > 0);
                    if (rows.length < 2) return '';

                    const colCount = Math.max(...rows.map((r) => r.length));
                    const header = [...rows[0]];
                    while (header.length < colCount) header.push('');
                    for (let i = 0; i < header.length; i++) {
                        if (!header[i]) header[i] = `col${i + 1}`;
                    }
                    const body = rows.slice(1).map((row) => {
                        const out = [...row];
                        while (out.length < colCount) out.push('');
                        return out;
                    });
                    const md = [
                        `| ${header.join(' | ')} |`,
                        `| ${header.map(() => '---').join(' | ')} |`,
                        ...body.map((r) => `| ${r.join(' | ')} |`),
                    ].join('\n');
                    return `\n\n${md}\n\n`;
                }

                const childText = Array.from(el.childNodes).map(serialize).join('');

                if (tag === 'br') return '\n';
                if (tag === 'strong' || tag === 'b') return `**${childText}**`;
                if (tag === 'em' || tag === 'i') return `*${childText}*`;
                if (tag === 'a') {
                    const href = (el as HTMLAnchorElement).href || '';
                    const compact = childText.replace(/\s+/g, ' ').trim();
                    if (!href) return compact || childText;
                    // Naver link cards often wrap image markers and large preview text.
                    if (/\{\{IMG:\d+\}\}/.test(childText)) {
                        return `${childText}\n\n${href}\n\n`;
                    }
                    if (compact.length === 0) return href;
                    if (compact.length > 140 || compact.includes('\n')) return `${compact}\n\n${href}\n\n`;
                    return `[${compact}](${href})`;
                }
                if (tag === 'h1' || tag === 'h2' || tag === 'h3' || tag === 'h4' || tag === 'h5' || tag === 'h6') {
                    const level = parseInt(tag.replace('h', ''), 10);
                    return `\n\n${'#'.repeat(level)} ${childText.trim()}\n\n`;
                }
                if (tag === 'li') {
                    return `- ${childText.trim()}\n`;
                }
                return childText;
            };

            const blockNodes = container.querySelectorAll(':scope > .se-component, :scope > .se_component, :scope > p, :scope > div, :scope > ul, :scope > ol, :scope > table, :scope > h1, :scope > h2, :scope > h3, :scope > h4, :scope > h5, :scope > h6, :scope > figure, :scope > blockquote');
            const parts: string[] = [];
            if (blockNodes.length > 0) {
                blockNodes.forEach((node) => {
                    const cls = (node as HTMLElement).className || '';
                    if (/documentTitle|share|reaction|comment|profile|blog2_series|post_btn|btn_like|u_likeit|_floating|floating_bottom|banword_wrap|postListBody|se_toolbar/i.test(cls)) return;
                    const text = serialize(node).trim();
                    if (text) parts.push(text);
                });
            } else {
                const text = serialize(container).trim();
                if (text) parts.push(text);
            }

            const content = parts.join('\n\n').replace(/\n{3,}/g, '\n\n').trim();

            return { metaDate, timeDate, title, dateStr, fallbackDate, category, tags, content, images };
        });

        const dateFromList = normalizeDate(listDate || '');
        const dateFromMeta = normalizeDate(data.metaDate || '');
        const dateFromTime = normalizeDate(data.timeDate || '');
        const dateFromText = normalizeDate(data.dateStr || '');
        const date = dateFromList || dateFromMeta || dateFromTime || dateFromText || data.fallbackDate || new Date().toISOString().slice(0, 10);
        const uniqTags = Array.from(new Set((data.tags || []).map(t => t.trim()).filter(Boolean)));

        return {
            postNo,
            title: data.title || fallbackTitle,
            date,
            category: data.category || listCategory,
            sourceCategoryNo: listCategoryNo || undefined,
            sourceCategory: (data.category || listCategory) || undefined,
            tags: uniqTags,
            content: data.content,
            images: data.images,
            url,
        };
    } catch (err) {
        console.error(`  ❌ 포스트 ${postNo} 스크래핑 실패:`, (err as Error).message);
        return null;
    }
}

// ── 3. 결과 출력 ──

function generateOutput(posts: ScrapedPost[], downloadedImages: Map<string, string[]>): string {
    const lines: string[] = [];
    lines.push(`import type { DeskPost } from './deskData';\n`);
    lines.push(`/**`);
    lines.push(` * 네이버 블로그에서 자동 스크래핑한 포스트 (${new Date().toISOString().slice(0, 10)})`);
    lines.push(` * 블로그: https://blog.naver.com/${BLOG_ID}`);
    lines.push(` * 총 ${posts.length}개`);
    lines.push(` *`);
    lines.push(` * NOTE: titleEn / contentEn 은 수동 번역 필요`);
    lines.push(` */\n`);
    lines.push(`export const NAVER_POSTS: DeskPost[] = [`);

    const usedSlugs = new Set<string>();
    for (const post of posts) {
        const baseSlug = slugify(post.date, post.title);
        const postNoSuffix = post.postNo ? `-${post.postNo}` : '';
        let slug = baseSlug;
        if (usedSlugs.has(slug)) slug = `${baseSlug}${postNoSuffix}`;
        let dedupIndex = 2;
        while (usedSlugs.has(slug)) {
            slug = `${baseSlug}${postNoSuffix}-${dedupIndex}`;
            dedupIndex += 1;
        }
        usedSlugs.add(slug);
        const cat = guessCategory(post.category, post.title);
        const tags = Array.from(new Set([post.category, ...post.tags].map(t => (t || '').trim()).filter(Boolean)));
        const localImages = downloadedImages.get(post.postNo) || [];
        const images = shouldDownload && localImages.length > 0 ? localImages : post.images;
        const thumbnail = images.length > 0 ? images[0] : '';

        lines.push(`    {`);
        lines.push(`        slug: ${JSON.stringify(slug)},`);
        lines.push(`        date: ${JSON.stringify(post.date)},`);
        lines.push(`        titleKo: ${JSON.stringify(post.title)},`);
        lines.push(`        titleEn: ${JSON.stringify(post.title)}, // TODO: translate`);
        lines.push(`        contentKo: ${JSON.stringify(post.content)},`);
        lines.push(`        contentEn: '', // TODO: translate`);
        lines.push(`        category: ${JSON.stringify(cat)},`);
        if (post.sourceCategoryNo) {
            lines.push(`        sourceCategoryNo: ${JSON.stringify(post.sourceCategoryNo)},`);
        }
        if (post.sourceCategory) {
            lines.push(`        sourceCategory: ${JSON.stringify(post.sourceCategory)},`);
        }
        if (tags.length > 0) {
            lines.push(`        tags: ${JSON.stringify(tags)},`);
        }
        lines.push(`        thumbnail: ${JSON.stringify(thumbnail)},`);
        lines.push(`        images: ${JSON.stringify(images)},`);
        lines.push(`        externalUrl: ${JSON.stringify(post.url)},`);
        lines.push(`    },`);
    }

    lines.push(`];\n`);
    return lines.join('\n');
}

function toPostNo(url: string): string {
    const m = url.match(/\/(\d+)(?:\?.*)?$/);
    return m?.[1] || '';
}

function deskPostToScraped(post: {
    titleKo: string;
    date: string;
    category: string;
    tags?: string[];
    contentKo: string;
    images: string[];
    externalUrl?: string;
}): ScrapedPost | null {
    if (!post.externalUrl) return null;
    return {
        postNo: toPostNo(post.externalUrl),
        title: post.titleKo,
        date: post.date,
        category: post.category || 'misc',
        sourceCategoryNo: (post as any).sourceCategoryNo || undefined,
        sourceCategory: (post as any).sourceCategory || undefined,
        tags: post.tags || [],
        content: post.contentKo,
        images: post.images || [],
        url: post.externalUrl,
    };
}

async function loadExistingScrapedPosts(): Promise<ScrapedPost[]> {
    if (!fs.existsSync(OUTPUT_FILE)) return [];
    try {
        const mod = await import(pathToFileURL(OUTPUT_FILE).href);
        const existing = Array.isArray(mod.NAVER_POSTS) ? mod.NAVER_POSTS : [];
        return existing
            .map(deskPostToScraped)
            .filter((p: ScrapedPost | null): p is ScrapedPost => Boolean(p));
    } catch {
        return [];
    }
}

// ── Main ──

async function main() {
    ensureTmpDir();
    fs.writeFileSync(PROGRESS_LOG_FILE, '', 'utf-8');
    console.log(`\n🔍 네이버 블로그 스크래퍼`);
    console.log(`   블로그: ${BLOG_ID}`);
    console.log(`   최대: ${maxPosts}개`);
    console.log(`   시작 페이지: ${startPage}`);
    console.log(`   페이지당 글 수: ${countPerPage}`);
    console.log(`   누적 모드: ${appendMode ? '예' : '아니오'}`);
    console.log(`   이미지 다운로드: ${shouldDownload ? '예' : '아니오'}`);
    console.log(`   체크포인트: ${checkpointEvery}개마다`);
    console.log(`   포스트 타임아웃: ${postTimeoutMs}ms`);
    console.log(`   이미지 타임아웃: ${imageTimeoutMs}ms`);
    if (filterCategory) console.log(`   카테고리 필터: ${filterCategory}`);
    console.log('');
    appendProgressLog(
        `START max=${maxPosts} startPage=${startPage} endPage=${endPage || 'auto'} countPerPage=${countPerPage} download=${shouldDownload}`,
    );

    const browser = await chromium.launch({
        headless: true,
        chromiumSandbox: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--no-zygote', '--disable-dev-shm-usage'],
    });
    const context = await browser.newContext({
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
        viewport: { width: 1280, height: 900 },
        locale: 'ko-KR',
    });
    const page = await context.newPage();

    try {
        // 1. 포스트 목록 수집
        const postLinks = await collectPostLinks(page);

        if (postLinks.length === 0) {
            console.log('❌ 수집된 포스트가 없습니다.');
            return;
        }

        // 2. 각 포스트 스크래핑
        const scrapedPosts: ScrapedPost[] = [];
        const downloadedImages = new Map<string, string[]>();
        let attempted = 0;
        let succeeded = 0;
        let failed = 0;
        const existingPostNos = new Set<string>();
        if (appendMode) {
            const existing = await loadExistingScrapedPosts();
            for (const p of existing) existingPostNos.add(p.postNo || toPostNo(p.url));
            console.log(`   ℹ️ 기존 postNo 집합 로드: ${existingPostNos.size}개`);
        }

        for (let i = 0; i < postLinks.length; i++) {
            const { postNo, title, listDate, categoryName, categoryNo } = postLinks[i];
            attempted += 1;
            const startedAt = Date.now();
            console.log(`📄 [${i + 1}/${postLinks.length}] ${title.slice(0, 40)}... (${postNo})`);
            appendProgressLog(`POST_START index=${i + 1}/${postLinks.length} postNo=${postNo} title=${JSON.stringify(title.slice(0, 80))}`);

            if (appendMode && existingPostNos.has(postNo)) {
                console.log(`  ⏭ 기존 수집분 중복(postNo=${postNo}), 스킵`);
                appendProgressLog(`POST_SKIP_DUP index=${i + 1}/${postLinks.length} postNo=${postNo}`);
                continue;
            }

            const post = await withTimeout(
                scrapePost(page, postNo, title, listDate, categoryName, categoryNo),
                postTimeoutMs,
                `scrapePost(${postNo})`,
            ).catch((err) => {
                console.log(`  ❌ 포스트 ${postNo} 타임아웃/실패: ${(err as Error).message}`);
                appendProgressLog(`POST_FAIL index=${i + 1}/${postLinks.length} postNo=${postNo} error=${JSON.stringify((err as Error).message)}`);
                return null;
            });
            if (!post) {
                failed += 1;
                continue;
            }

            // 카테고리 필터
            if (filterCategory && !post.category.includes(filterCategory)) {
                console.log(`  ⏭ 카테고리 불일치 (${post.category}), 스킵`);
                appendProgressLog(`POST_SKIP_CATEGORY index=${i + 1}/${postLinks.length} postNo=${postNo} category=${JSON.stringify(post.category)}`);
                continue;
            }

            console.log(`  ✅ 제목: ${post.title.slice(0, 50)}`);
            console.log(`     날짜: ${post.date} | 카테고리: ${post.category || '없음'} | 태그: ${post.tags.length}개`);
            console.log(`     본문: ${post.content.length}자 | 이미지: ${post.images.length}개`);

            // 3. 이미지 다운로드 (선택적)
            if (shouldDownload && post.images.length > 0) {
                const slug = slugify(post.date, post.title);
                const imgDir = path.join(IMAGE_DIR, slug);
                const localPaths: string[] = [];

                for (let j = 0; j < post.images.length; j++) {
                    const ext = '.webp'; // 네이버 이미지는 보통 jpg/png이지만 경로는 단순화
                    const filename = `${String(j + 1).padStart(2, '0')}${ext}`;
                    const destPath = path.join(imgDir, filename);
                    const publicPath = `/desk/${slug}/${filename}`;

                    let downloaded = false;
                    let lastErr: Error | null = null;
                    for (let attempt = 1; attempt <= 3; attempt++) {
                        try {
                            await withTimeout(
                                downloadFile(post.images[j], destPath),
                                imageTimeoutMs,
                                `downloadFile(${post.postNo}:${j + 1})`,
                            );
                            localPaths.push(publicPath);
                            console.log(`  📥 이미지 ${j + 1}/${post.images.length} 다운로드 완료`);
                            downloaded = true;
                            break;
                        } catch (err) {
                            lastErr = err as Error;
                            const delay = 500 * attempt;
                            console.log(`  ⚠️ 이미지 ${j + 1} 다운로드 실패 (시도 ${attempt}/3): ${lastErr.message}`);
                            await sleep(delay);
                        }
                    }

                    if (!downloaded) {
                        console.log(`  🧩 이미지 ${j + 1} 누락 처리: ${MISSING_IMAGE_FALLBACK}`);
                        localPaths.push(MISSING_IMAGE_FALLBACK);
                    }
                }

                downloadedImages.set(post.postNo, localPaths);
            }

            scrapedPosts.push(post);
            succeeded += 1;
            const elapsedMs = Date.now() - startedAt;
            appendProgressLog(
                `POST_OK index=${i + 1}/${postLinks.length} postNo=${postNo} elapsedMs=${elapsedMs} contentLen=${post.content.length} images=${post.images.length}`,
            );

            if ((i + 1) % checkpointEvery === 0 || i === postLinks.length - 1) {
                const checkpoint = {
                    updatedAt: new Date().toISOString(),
                    totalCandidates: postLinks.length,
                    attempted,
                    succeeded,
                    failed,
                    lastIndex: i + 1,
                    lastPostNo: postNo,
                    scrapedCount: scrapedPosts.length,
                };
                fs.writeFileSync(CHECKPOINT_FILE, JSON.stringify(checkpoint, null, 2), 'utf-8');
                const partialOutput = generateOutput(scrapedPosts, downloadedImages);
                fs.writeFileSync(PARTIAL_OUTPUT_FILE, partialOutput, 'utf-8');
                appendProgressLog(`CHECKPOINT ${JSON.stringify(checkpoint)}`);
            }
            await sleep(500 + Math.random() * 500); // 요청 간 딜레이
        }

        // 4. 결과 파일 저장
        if (scrapedPosts.length === 0) {
            console.log('\n❌ 스크래핑된 포스트가 없습니다.');
            return;
        }

        let finalPosts = scrapedPosts;
        if (appendMode) {
            const existing = await loadExistingScrapedPosts();
            const byPostNo = new Map<string, ScrapedPost>();
            for (const p of existing) byPostNo.set(p.postNo || toPostNo(p.url), p);
            for (const p of scrapedPosts) byPostNo.set(p.postNo || toPostNo(p.url), p);
            finalPosts = Array.from(byPostNo.values());
            console.log(`   ℹ️ 기존 ${existing.length}개 + 신규 ${scrapedPosts.length}개 => 병합 ${finalPosts.length}개`);
        }

        // 날짜순 정렬 (최신순)
        finalPosts.sort((a, b) => {
            const byDate = b.date.localeCompare(a.date);
            if (byDate !== 0) return byDate;
            return (b.postNo || '').localeCompare(a.postNo || '');
        });

        const output = generateOutput(finalPosts, downloadedImages);

        const outputDir = path.dirname(OUTPUT_FILE);
        if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
        fs.writeFileSync(OUTPUT_FILE, output, 'utf-8');
        fs.writeFileSync(
            CHECKPOINT_FILE,
            JSON.stringify(
                {
                    updatedAt: new Date().toISOString(),
                    status: 'completed',
                    totalCandidates: postLinks.length,
                    attempted,
                    succeeded,
                    failed,
                    saved: finalPosts.length,
                },
                null,
                2,
            ),
            'utf-8',
        );
        appendProgressLog(`DONE saved=${finalPosts.length} attempted=${attempted} succeeded=${succeeded} failed=${failed}`);

        console.log(`\n✅ 완료! ${finalPosts.length}개 포스트 저장됨`);
        console.log(`   📁 ${OUTPUT_FILE}`);
        console.log(`\n다음 단계:`);
        console.log(`   1. ${OUTPUT_FILE} 열어서 내용 확인`);
        console.log(`   2. 필요한 포스트를 deskData.ts의 DESK_POSTS에 복사`);
        console.log(`   3. titleEn / contentEn 번역 추가`);

    } finally {
        await browser.close();
    }
}

main().catch((err) => {
    console.error('\n💥 치명적 오류:', err);
    process.exit(1);
});
