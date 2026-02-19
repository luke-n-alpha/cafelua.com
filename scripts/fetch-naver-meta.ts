/**
 * Fetch Naver blog metadata (date, category, hashtags) for existing posts.
 *
 * Usage:
 *   npx tsx scripts/fetch-naver-meta.ts --max 100
 *   npx tsx scripts/fetch-naver-meta.ts --out /tmp/naver-meta.json
 */

import { chromium, type Page } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BLOG_ID = 'fstory97';
const BASE_URL = `https://blog.naver.com`;
const POSTS_FILE = path.join(__dirname, '..', 'src', 'data', 'desk', '_naver-posts.ts');

const args = process.argv.slice(2);
const maxPosts = getArgValue('--max', 999);
const outFile = getArgValue('--out', '/tmp/naver-meta.json') as string;

function getArgValue(flag: string, defaultVal: number): number;
function getArgValue(flag: string, defaultVal: string): string;
function getArgValue(flag: string, defaultVal: number | string): number | string {
    const idx = args.indexOf(flag);
    if (idx === -1 || idx + 1 >= args.length) return defaultVal;
    return typeof defaultVal === 'number' ? parseInt(args[idx + 1], 10) : args[idx + 1];
}

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function extractLogNos(source: string): string[] {
    const matches = source.matchAll(/externalUrl:\s*"https:\/\/blog\.naver\.com\/fstory97\/(\d+)"/g);
    const list: string[] = [];
    for (const m of matches) {
        list.push(m[1]);
    }
    return list;
}

function normalizeDate(input: string): string {
    const trimmed = input.trim();
    const dot = trimmed.match(/(\d{4})\.\s*(\d{1,2})\.\s*(\d{1,2})/);
    if (dot) return `${dot[1]}-${dot[2].padStart(2, '0')}-${dot[3].padStart(2, '0')}`;
    const dash = trimmed.match(/(\d{4})-(\d{1,2})-(\d{1,2})/);
    if (dash) return `${dash[1]}-${dash[2].padStart(2, '0')}-${dash[3].padStart(2, '0')}`;
    return '';
}

async function scrapeMeta(page: Page, logNo: string) {
    const url = `${BASE_URL}/${BLOG_ID}/${logNo}`;
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    await sleep(1500);

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

        const dateEl = document.querySelector(
            '.se_publishDate, .blog_date, .se-date, .date, ' +
            '.post_date, [class*="date"], .se_publishDate_layer'
        );
        const dateText = (dateEl?.textContent || '').trim();

        let fallbackDate = '';
        const bodyText = document.body?.innerText || '';
        const bodyMatch = bodyText.match(/(\d{4})\.\s*(\d{1,2})\.\s*(\d{1,2})/);
        if (bodyMatch) {
            fallbackDate = `${bodyMatch[1]}-${bodyMatch[2].padStart(2, '0')}-${bodyMatch[3].padStart(2, '0')}`;
        }

        const catEl = document.querySelector(
            '.blog_category a, .category a, [class*="cate"] a, .post_category'
        );
        const category = (catEl?.textContent || '').trim();

        const tags: string[] = [];
        const tagSelectors = [
            '.se-hashtag', '.se-hashtag a', '.tag_area a', '.tag__item', '.tag a',
            'a[href*="tag"]', 'a[href*="Tag"]', 'a[href*="hashtag"]'
        ];
        document.querySelectorAll(tagSelectors.join(',')).forEach((el) => {
            const text = (el.textContent || '').trim();
            if (!text) return;
            const normalized = text.startsWith('#') ? text.slice(1).trim() : text.trim();
            if (normalized) tags.push(normalized);
        });

        return { metaDate, timeDate, dateText, fallbackDate, category, tags };
    });

    const dateFromMeta = normalizeDate(data.metaDate);
    const dateFromTime = normalizeDate(data.timeDate || '');
    const dateFromText = normalizeDate(data.dateText);
    const date = dateFromMeta || dateFromTime || dateFromText || data.fallbackDate || '';

    const uniqTags = Array.from(new Set(data.tags.map(t => t.trim()).filter(Boolean)));

    return {
        logNo,
        date,
        category: data.category,
        tags: uniqTags,
        url,
    };
}

async function main() {
    const source = fs.readFileSync(POSTS_FILE, 'utf-8');
    const logNos = extractLogNos(source).slice(0, maxPosts);
    console.log(`총 ${logNos.length}개 메타 수집 (max=${maxPosts})`);

    const browser = await chromium.launch({ headless: true, chromiumSandbox: false });
    const context = await browser.newContext({
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
        viewport: { width: 1280, height: 900 },
        locale: 'ko-KR',
    });
    const page = await context.newPage();

    const result: Record<string, { date: string; category: string; tags: string[] }> = {};

    try {
        for (let i = 0; i < logNos.length; i++) {
            const logNo = logNos[i];
            console.log(`📄 [${i + 1}/${logNos.length}] ${logNo}`);
            try {
                const meta = await scrapeMeta(page, logNo);
                result[logNo] = {
                    date: meta.date,
                    category: meta.category,
                    tags: meta.tags,
                };
                console.log(`  ✅ ${meta.date} | ${meta.category || '없음'} | #${meta.tags.length}`);
            } catch (err) {
                console.log(`  ❌ 실패: ${(err as Error).message}`);
            }
            await sleep(500 + Math.random() * 400);
        }
    } finally {
        await browser.close();
    }

    fs.writeFileSync(outFile, JSON.stringify(result, null, 2), 'utf-8');
    console.log(`\n✅ 저장 완료: ${outFile}`);
}

main().catch((err) => {
    console.error('\n💥 치명적 오류:', err);
    process.exit(1);
});
