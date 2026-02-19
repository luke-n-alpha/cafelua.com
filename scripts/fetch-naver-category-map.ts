import { chromium } from 'playwright';
import * as fs from 'fs';

const BLOG_ID = 'fstory97';
const OUT = '/tmp/naver-category-map.json';

type Cat = { categoryNo: string; categoryName: string };

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function main() {
  const browser = await chromium.launch({ headless: true, chromiumSandbox: false });
  const context = await browser.newContext({ locale: 'ko-KR' });
  const page = await context.newPage();

  await page.goto(`https://blog.naver.com/PostList.naver?blogId=${BLOG_ID}&from=postList&categoryNo=0`, { waitUntil: 'domcontentloaded' });
  await sleep(800);

  const categories: Cat[] = await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll<HTMLAnchorElement>('a[href*="categoryNo="]'));
    const map = new Map<string, string>();
    for (const a of links) {
      const href = a.getAttribute('href') || '';
      const m = href.match(/categoryNo=(\d+)/);
      if (!m) continue;
      const no = m[1];
      if (no === '0') continue;
      const name = (a.textContent || '').replace(/\s+/g, ' ').trim();
      if (!name) continue;
      if (!map.has(no)) map.set(no, name);
    }
    return Array.from(map.entries()).map(([categoryNo, categoryName]) => ({ categoryNo, categoryName }));
  });

  if (categories.length === 0) {
    throw new Error('카테고리 메뉴를 찾지 못했습니다.');
  }

  const result: Record<string, { categoryNo: string; categoryName: string }> = {};

  await page.goto(`https://m.blog.naver.com/PostList.naver?blogId=${BLOG_ID}&categoryNo=0&listStyle=style2`, { waitUntil: 'domcontentloaded' });
  await sleep(500);

  for (const cat of categories) {
    console.log(`카테고리 수집: ${cat.categoryName} (${cat.categoryNo})`);
    let pageNo = 1;
    let empty = 0;

    while (empty < 2) {
      const rows = await page.evaluate(async ({ blogId, categoryNo, pageNo }) => {
        const resp = await fetch(`/api/blogs/${blogId}/post-list?categoryNo=${categoryNo}&itemCount=15&page=${pageNo}&userId=`, { credentials: 'include' });
        if (!resp.ok) return [] as Array<{ postNo: string }>;
        const payload = await resp.json() as { result?: { items?: Array<{ logNo?: string | number }> } };
        const items = payload?.result?.items || [];
        return items.map((it) => ({ postNo: String(it.logNo || '').trim() })).filter((x) => x.postNo.length > 0);
      }, { blogId: BLOG_ID, categoryNo: cat.categoryNo, pageNo });

      if (rows.length === 0) {
        empty += 1;
        pageNo += 1;
        continue;
      }

      empty = 0;
      for (const row of rows) {
        result[row.postNo] = { categoryNo: cat.categoryNo, categoryName: cat.categoryName };
      }
      pageNo += 1;
      await sleep(120);
    }
  }

  fs.writeFileSync(OUT, JSON.stringify(result, null, 2), 'utf-8');
  console.log(`완료: ${Object.keys(result).length}개 매핑 저장 -> ${OUT}`);
  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
