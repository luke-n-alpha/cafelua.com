/**
 * Fetch original post dates from Naver blog for all posts in _naver-posts.ts
 * Outputs a JSON map: { logNo: "YYYY-MM-DD" }
 *
 * Usage: npx tsx scripts/fetch-naver-dates.ts
 */

import { NAVER_POSTS } from '../src/data/desk/_naver-posts';

const BLOG_ID = 'fstory97';
const DELAY_MS = 300; // polite delay between requests

interface DateMap {
    [logNo: string]: string;
}

async function fetchPostDate(logNo: string): Promise<string | null> {
    const url = `https://blog.naver.com/PostView.naver?blogId=${BLOG_ID}&logNo=${logNo}`;
    try {
        const res = await fetch(url, {
            headers: { 'User-Agent': 'Mozilla/5.0 (compatible; blog-date-fetcher)' },
        });
        const html = await res.text();

        // Pattern: class="se_publishDate pcol2">2026. 2. 5. 11:21<
        const match = html.match(/se_publishDate[^>]*>(\d{4})\.\s*(\d{1,2})\.\s*(\d{1,2})\./);
        if (match) {
            const [, y, m, d] = match;
            return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
        }

        // Fallback: blogArticle__dateAndCategory
        const match2 = html.match(/blogArticle__dateAndCategory[^>]*>(\d{4})\.\s*(\d{1,2})\.\s*(\d{1,2})\./);
        if (match2) {
            const [, y, m, d] = match2;
            return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
        }

        return null;
    } catch {
        return null;
    }
}

async function main() {
    const dateMap: DateMap = {};
    let success = 0;
    let failed = 0;

    for (let i = 0; i < NAVER_POSTS.length; i++) {
        const post = NAVER_POSTS[i];
        const match = post.externalUrl?.match(/\/(\d+)$/);
        if (!match) continue;

        const logNo = match[1];
        const date = await fetchPostDate(logNo);

        if (date) {
            dateMap[logNo] = date;
            success++;
            process.stderr.write(`[${i + 1}/${NAVER_POSTS.length}] ${logNo} → ${date}\n`);
        } else {
            failed++;
            process.stderr.write(`[${i + 1}/${NAVER_POSTS.length}] ${logNo} → FAILED\n`);
        }

        // Polite delay
        if (i < NAVER_POSTS.length - 1) {
            await new Promise((r) => setTimeout(r, DELAY_MS));
        }
    }

    // Output result
    console.log(JSON.stringify(dateMap, null, 2));
    process.stderr.write(`\nDone: ${success} success, ${failed} failed\n`);
}

main();
