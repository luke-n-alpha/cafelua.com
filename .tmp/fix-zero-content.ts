import fs from 'fs';
import path from 'path';
import { chromium } from 'playwright';
import { NAVER_POSTS } from '../src/data/desk/_naver-posts.ts';

function render(posts: any[]) {
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
  return lines.join('\n');
}

function cleanText(raw: string) {
  const noise = [/^NAVER$/i,/^블로그$/,/^블로그 검색$/,/^이 블로그에서 검색$/,/^메뉴 바로가기$/,/^본문 바로가기$/,/^내 블로그$/,/^이웃블로그$/,/^블로그 홈$/,/^로그인$/,/^사용자 링크$/,/^카테고리$/, /^태그$/];
  const lines = raw.split('\n').map(l=>l.trim()).filter(Boolean).filter(l=>!noise.some(r=>r.test(l)));
  return lines.join('\n\n').replace(/\n{3,}/g,'\n\n').trim();
}

async function main() {
  const posts: any[] = [...NAVER_POSTS];
  const targets = posts.filter(p => (p.contentKo || '').trim().length === 0 && p.externalUrl);
  console.log('targets', targets.length);

  const browser = await chromium.launch({ headless: true, chromiumSandbox: false, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  let ok=0, fail=0;

  for (let i=0;i<targets.length;i++) {
    const p = targets[i];
    try {
      await page.goto(p.externalUrl, { waitUntil: 'domcontentloaded', timeout: 45000 });
      await page.waitForTimeout(1200);
      const frame = page.frames().find(f => f.url().includes('PostView.naver') || f.url().includes('postView')) || page.mainFrame();
      const txt = await frame.evaluate(() => {
        const c = document.querySelector('#post_1 .post-view') || document.querySelector('#printPost1 .post-view') || document.querySelector('#printPost1') || document.querySelector('#post_1') || document.querySelector('[id^="post-view"]') || document.body;
        return (c as HTMLElement).innerText || '';
      });
      const cleaned = cleanText(txt);
      if (cleaned.length > 0) {
        const idx = posts.findIndex(x => x.slug === p.slug && x.externalUrl === p.externalUrl);
        if (idx >= 0) posts[idx].contentKo = cleaned;
        ok++;
      } else fail++;
    } catch {
      fail++;
    }
    if ((i+1)%10===0) console.log(`[${i+1}/${targets.length}] ok=${ok} fail=${fail}`);
  }

  await browser.close();
  fs.writeFileSync(path.join(process.cwd(),'src/data/desk/_naver-posts.ts'), render(posts), 'utf-8');
  console.log('done', {ok, fail});
}

main().catch(e=>{console.error(e); process.exit(1);});
