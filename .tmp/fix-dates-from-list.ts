import fs from 'fs';
import path from 'path';
import { chromium } from 'playwright';
import { NAVER_POSTS } from '../src/data/desk/_naver-posts.ts';

async function main() {
  const BLOG_ID = 'fstory97';
  const OUT = path.join(process.cwd(), 'src/data/desk/_naver-posts.ts');
  const IMAGE_ROOT = path.join(process.cwd(), 'public', 'desk');
  const posts: any[] = [...NAVER_POSTS];
  const dateMap: Record<string, string> = {};

  const browser = await chromium.launch({ headless: true, chromiumSandbox: false, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.goto(`https://m.blog.naver.com/PostList.naver?blogId=${BLOG_ID}&categoryNo=0&listStyle=style2`, { waitUntil: 'domcontentloaded' });

  for (let p = 1; p <= 160; p++) {
    const rows = await page.evaluate(async ({ blogId, p }) => {
      const r = await fetch(`/api/blogs/${blogId}/post-list?categoryNo=0&itemCount=15&page=${p}&userId=`, { credentials: 'include' });
      if (!r.ok) return [] as Array<{ logNo: string; d: number }>;
      const j = await r.json() as any;
      const it = j?.result?.items || [];
      return it.map((x: any) => ({ logNo: String(x.logNo || ''), d: Number(x.addDate || 0) })).filter((x: any) => x.logNo);
    }, { blogId: BLOG_ID, p });

    for (const row of rows) {
      if (!row.d) continue;
      const d = new Date(row.d);
      const ds = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      dateMap[row.logNo] = ds;
    }
  }

  await browser.close();

  let updated = 0;
  let renamed = 0;
  for (const post of posts) {
    const m = (post.externalUrl || '').match(/\/(\d+)(?:\?|$)/);
    if (!m) continue;
    const logNo = m[1];
    const nd = dateMap[logNo];
    if (!nd) continue;

    const oldSlug = post.slug;
    const suffix = oldSlug.replace(/^\d{8}-/, '');
    const newSlug = `${nd.replace(/-/g, '')}-${suffix}`;

    const dateChanged = post.date !== nd;
    const slugChanged = oldSlug !== newSlug;
    if (!dateChanged && !slugChanged) continue;

    post.date = nd;
    post.slug = newSlug;

    const repl = (v: string) => (v && v.startsWith('/desk/')) ? v.replaceAll(`/desk/${oldSlug}`, `/desk/${newSlug}`) : v;
    post.thumbnail = repl(post.thumbnail || '');
    post.images = (post.images || []).map((x: string) => repl(x));

    const oldDir = path.join(IMAGE_ROOT, oldSlug);
    const newDir = path.join(IMAGE_ROOT, newSlug);
    if (slugChanged && fs.existsSync(oldDir) && !fs.existsSync(newDir)) {
      fs.renameSync(oldDir, newDir);
      renamed += 1;
    }
    updated += 1;
  }

  const lines: string[] = [];
  lines.push(`import type { DeskPost } from './deskData';\n`);
  lines.push('/**');
  lines.push(` * 네이버 블로그에서 자동 스크래핑한 포스트 (${new Date().toISOString().slice(0, 10)})`);
  lines.push(' * 블로그: https://blog.naver.com/fstory97');
  lines.push(` * 총 ${posts.length}개`);
  lines.push(' */\n');
  lines.push('export const NAVER_POSTS: DeskPost[] = [');
  for (const p of posts) {
    lines.push('    {');
    lines.push(`        slug: ${JSON.stringify(p.slug)},`);
    lines.push(`        date: ${JSON.stringify(p.date)},`);
    lines.push(`        titleKo: ${JSON.stringify(p.titleKo)},`);
    lines.push(`        titleEn: ${JSON.stringify(p.titleEn)}, // TODO: translate`);
    lines.push(`        contentKo: ${JSON.stringify(p.contentKo)},`);
    lines.push(`        contentEn: ${JSON.stringify(p.contentEn)}, // TODO: translate`);
    lines.push(`        category: ${JSON.stringify(p.category || 'misc')},`);
    if (p.sourceCategoryNo) lines.push(`        sourceCategoryNo: ${JSON.stringify(p.sourceCategoryNo)},`);
    if (p.sourceCategory) lines.push(`        sourceCategory: ${JSON.stringify(p.sourceCategory)},`);
    if (p.tags) lines.push(`        tags: ${JSON.stringify(p.tags)},`);
    lines.push(`        thumbnail: ${JSON.stringify(p.thumbnail || '')},`);
    lines.push(`        images: ${JSON.stringify(p.images || [])},`);
    if (p.externalUrl) lines.push(`        externalUrl: ${JSON.stringify(p.externalUrl)},`);
    lines.push('    },');
  }
  lines.push('];\n');

  fs.writeFileSync(OUT, lines.join('\n'), 'utf-8');
  console.log(`dateMap=${Object.keys(dateMap).length} updated=${updated} renamed=${renamed}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
