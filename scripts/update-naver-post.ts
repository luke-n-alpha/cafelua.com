/**
 * Update a single Naver blog post in _naver-posts.ts by logNo.
 *
 * Usage:
 *   node --loader ts-node/esm scripts/update-naver-post.ts --log 224130231081 --download
 */

import { chromium, type Page } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';
import * as http from 'http';
import { fileURLToPath, pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BLOG_ID = 'fstory97';
const BASE_URL = `https://blog.naver.com`;
const POSTS_FILE = path.join(__dirname, '..', 'src', 'data', 'desk', '_naver-posts.ts');
const IMAGE_ROOT = path.join(__dirname, '..', 'public', 'desk');

const args = process.argv.slice(2);
const logNo = getArgValue('--log', '');
const shouldDownload = args.includes('--download');

if (!logNo) {
    console.error('❌ --log is required');
    process.exit(1);
}

function getArgValue(flag: string, defaultVal: string): string {
    const idx = args.indexOf(flag);
    if (idx === -1 || idx + 1 >= args.length) return defaultVal;
    return args[idx + 1];
}

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function normalizeDate(input: string): string {
    const trimmed = input.trim();
    const dot = trimmed.match(/(\d{4})\.\s*(\d{1,2})\.\s*(\d{1,2})/);
    if (dot) return `${dot[1]}-${dot[2].padStart(2, '0')}-${dot[3].padStart(2, '0')}`;
    const dash = trimmed.match(/(\d{4})-(\d{1,2})-(\d{1,2})/);
    if (dash) return `${dash[1]}-${dash[2].padStart(2, '0')}-${dash[3].padStart(2, '0')}`;
    return '';
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

function normalizeCategory(raw: string): string {
    const val = (raw || '').trim().toLowerCase();
    const allowed = new Set(['cafelua', 'ai', 'it', 'believer', 'xrcloud', 'review', 'art', 'private', 'essay', 'tech', 'misc']);
    if (allowed.has(val)) return val;
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

async function scrapePost(page: Page, logNoValue: string) {
    const url = `${BASE_URL}/${BLOG_ID}/${logNoValue}`;
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await sleep(2000);

    let contentFrame = page;
    const mainFrame = page.frames().find(f =>
        f.url().includes('PostView.naver') || f.url().includes('postView')
    );
    if (mainFrame) {
        contentFrame = mainFrame as unknown as Page;
    }

    const data = await contentFrame.evaluate(() => {
        const metaDate =
            document.querySelector('meta[property="article:published_time"]')?.getAttribute('content') ||
            document.querySelector('meta[property="og:article:published_time"]')?.getAttribute('content') ||
            document.querySelector('meta[name="date"]')?.getAttribute('content') ||
            '';

        const timeDate =
            document.querySelector('time')?.getAttribute('datetime') ||
            document.querySelector('time')?.textContent ||
            '';

        const titleEl = document.querySelector('.se_textarea, .se-title-text, .title_post, h3');
        const title = (titleEl?.textContent || '').trim();

        const dateEl = document.querySelector('.blog_date, .se_publishDate, .se-date, .date, .post_date, [class*="date"]');
        const dateStr = (dateEl?.textContent || '').trim();

        let fallbackDate = '';
        const bodyText = document.body?.innerText || '';
        const bodyMatch = bodyText.match(/(\d{4})\.\s*(\d{1,2})\.\s*(\d{1,2})/);
        if (bodyMatch) {
            fallbackDate = `${bodyMatch[1]}-${bodyMatch[2].padStart(2, '0')}-${bodyMatch[3].padStart(2, '0')}`;
        }

        const catEl = document.querySelector('a[href*="categoryNo="], .blog_category a, .category a, [class*="cate"] a, .post_category');
        const category = (catEl?.textContent || '').trim();

        const container = document.querySelector('#post_1 .post-view') ||
            document.querySelector('#printPost1 .post-view') ||
            document.querySelector('#printPost1 .post-view p')?.parentElement ||
            document.querySelector('#printPost1') ||
            document.querySelector('#post_1') ||
            document.querySelector('.post-body') ||
            document.querySelector('[id^="post-view"]') ||
            document.querySelector('.se_doc_viewer') ||
            document.querySelector('.post_ct') ||
            document.querySelector('.se-main-container') ||
            document.querySelector('.se_component_wrap') ||
            document.querySelector('#postViewArea') ||
            document.body;

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

        const content = parts.join('\n\n').replace(/\\n{3,}/g, '\\n\\n').trim();

        return { metaDate, timeDate, title, dateStr, fallbackDate, category, tags, content, images };
    });

    const dateFromMeta = normalizeDate(data.metaDate || '');
    const dateFromTime = normalizeDate(data.timeDate || '');
    const dateFromText = normalizeDate(data.dateStr || '');
    const date = dateFromMeta || dateFromTime || dateFromText || data.fallbackDate || '';
    const uniqTags = Array.from(new Set((data.tags || []).map(t => t.trim()).filter(Boolean)));

    return {
        url,
        title: data.title,
        date,
        category: data.category,
        tags: uniqTags,
        content: data.content,
        images: data.images,
    };
}

async function main() {
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
        const data = await scrapePost(page, logNo);
        if (!data.title) {
            console.log('❌ 제목을 찾지 못했습니다.');
            return;
        }

        const source = fs.readFileSync(POSTS_FILE, 'utf-8');
        const sourceCount = (source.match(/slug:\s*"/g) || []).length;
        const mod = await import(`${pathToFileURL(POSTS_FILE).href}?t=${Date.now()}`);
        const existing = Array.isArray(mod.NAVER_POSTS) ? mod.NAVER_POSTS : [];
        if (existing.length === 0 && sourceCount > 100) {
            throw new Error(`기존 포스트 로드 이상: sourceCount=${sourceCount}, existing=0`);
        }
        const targetLogNo = logNoValue(data.url);
        const existingPost = existing.find((p: any) => logNoValue(p?.externalUrl || '') === targetLogNo);
        const effectiveDate = data.date || existingPost?.date || new Date().toISOString().slice(0, 10);
        const slug = slugify(effectiveDate, data.title);
        let images = data.images;

        if (shouldDownload && images.length > 0) {
            const imgDir = path.join(IMAGE_ROOT, slug);
            const localPaths: string[] = [];
            for (let i = 0; i < images.length; i++) {
                const filename = `${String(i + 1).padStart(2, '0')}.webp`;
                const dest = path.join(imgDir, filename);
                const publicPath = `/desk/${slug}/${filename}`;
                try {
                    await downloadFile(images[i], dest);
                    localPaths.push(publicPath);
                } catch {
                    localPaths.push(images[i]);
                }
            }
            images = localPaths;
        }

        const thumbnail = images.length > 0 ? images[0] : '';

        const normalizedCategory = normalizeCategory(data.category || 'misc');
        const normalizedTags = Array.from(new Set([normalizedCategory, ...data.tags].filter(Boolean)));

        // Regex 블록 치환은 대용량 파일 손상 위험이 있어, 객체 병합 후 전체 재출력으로 고정
        const nextPost = {
            slug,
            date: effectiveDate,
            titleKo: data.title,
            titleEn: data.title, // TODO: translate
            contentKo: data.content,
            contentEn: '', // TODO: translate
            category: normalizedCategory,
            tags: normalizedTags,
            thumbnail,
            images,
            externalUrl: data.url,
        } as any;

        let replaced = false;
        const merged = existing.map((p: any) => {
            const pLogNo = logNoValue(p?.externalUrl || '');
            if (pLogNo && pLogNo === targetLogNo) {
                replaced = true;
                return {
                    ...p,
                    ...nextPost,
                    sourceCategoryNo: p.sourceCategoryNo ?? undefined,
                    sourceCategory: p.sourceCategory ?? undefined,
                };
            }
            return p;
        });
        if (!replaced) {
            merged.push(nextPost);
            console.log('ℹ️ 대상 포스트 미존재: 신규 추가로 처리');
        }

        const updated = renderPosts(merged);
        const updatedCount = (updated.match(/slug:\s*"/g) || []).length;
        if (updatedCount < Math.floor(sourceCount * 0.9)) {
            throw new Error(`출력 포스트 급감 감지: before=${sourceCount}, after=${updatedCount}`);
        }
        fs.writeFileSync(POSTS_FILE, updated, 'utf-8');
        console.log(`✅ 포스트 업데이트 완료 (before=${sourceCount}, after=${updatedCount})`);
    } finally {
        await browser.close();
    }
}

function logNoValue(url: string): string {
    const byQuery = url.match(/[?&]logNo=(\d+)/i)?.[1];
    if (byQuery) return byQuery;
    return url.match(/\/(\d+)(?:\?.*)?$/)?.[1] || '';
}

function renderPosts(posts: any[]): string {
    const lines: string[] = [];
    lines.push(`import type { DeskPost } from './deskData';\n`);
    lines.push('/**');
    lines.push(` * 네이버 블로그에서 자동 스크래핑한 포스트 (${new Date().toISOString().slice(0, 10)})`);
    lines.push(` * 블로그: https://blog.naver.com/${BLOG_ID}`);
    lines.push(` * 총 ${posts.length}개`);
    lines.push(' *');
    lines.push(' * NOTE: titleEn / contentEn 은 수동 번역 필요');
    lines.push(' */\n');
    lines.push('export const NAVER_POSTS: DeskPost[] = [');

    for (const post of posts) {
        lines.push('    {');
        lines.push(`        slug: ${JSON.stringify(post.slug)},`);
        lines.push(`        date: ${JSON.stringify(post.date)},`);
        lines.push(`        titleKo: ${JSON.stringify(post.titleKo || '')},`);
        lines.push(`        titleEn: ${JSON.stringify(post.titleEn || post.titleKo || '')}, // TODO: translate`);
        lines.push(`        contentKo: ${JSON.stringify(post.contentKo || '')},`);
        lines.push(`        contentEn: ${JSON.stringify(post.contentEn || '')}, // TODO: translate`);
        lines.push(`        category: ${JSON.stringify(post.category || 'misc')},`);
        if (post.sourceCategoryNo) lines.push(`        sourceCategoryNo: ${JSON.stringify(post.sourceCategoryNo)},`);
        if (post.sourceCategory) lines.push(`        sourceCategory: ${JSON.stringify(post.sourceCategory)},`);
        if (Array.isArray(post.tags) && post.tags.length > 0) lines.push(`        tags: ${JSON.stringify(post.tags)},`);
        lines.push(`        thumbnail: ${JSON.stringify(post.thumbnail || '')},`);
        lines.push(`        images: ${JSON.stringify(Array.isArray(post.images) ? post.images : [])},`);
        lines.push(`        externalUrl: ${JSON.stringify(post.externalUrl || '')},`);
        lines.push('    },');
    }
    lines.push('];\n');
    return lines.join('\n');
}

main().catch((err) => {
    console.error('\n💥 치명적 오류:', err);
    process.exit(1);
});
