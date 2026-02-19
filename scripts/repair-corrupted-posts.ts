import { chromium, type Page } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';
import * as http from 'http';
import { fileURLToPath } from 'url';
import { NAVER_POSTS } from '../src/data/desk/_naver-posts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const OUT_FILE = path.join(__dirname, '..', 'src', 'data', 'desk', '_naver-posts.ts');
const IMAGE_ROOT = path.join(__dirname, '..', 'public', 'desk');
const BLOG_ID = 'fstory97';

const args = process.argv.slice(2);
const max = Number(getArg('--max', '999'));
const shouldDownload = args.includes('--download');

function getArg(flag: string, def: string) {
  const i = args.indexOf(flag);
  if (i === -1 || i + 1 >= args.length) return def;
  return args[i + 1];
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function normalizeDate(input: string): string {
  const trimmed = (input || '').trim();
  const dot = trimmed.match(/(\d{4})\.\s*(\d{1,2})\.\s*(\d{1,2})/);
  if (dot) return `${dot[1]}-${dot[2].padStart(2, '0')}-${dot[3].padStart(2, '0')}`;
  const dash = trimmed.match(/(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (dash) return `${dash[1]}-${dash[2].padStart(2, '0')}-${dash[3].padStart(2, '0')}`;
  return '';
}

function isCorrupted(content: string): boolean {
  return content.startsWith('**각주1**') ||
    /JEagleEyeClient\.setEnable|autoCompleteToSearchSwitch|aPostAutoSourcingHtmlView|blog_market_bridge_set_delivery_popup|var gnb_service=/.test(content);
}

function extractLogNo(url?: string): string {
  if (!url) return '';
  const m = url.match(/\/fstory97\/(\d+)/);
  return m?.[1] || '';
}

function downloadFile(url: string, dest: string): Promise<void> {
  return new Promise((resolve, reject) => {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    const client = url.startsWith('https') ? https : http;
    client.get(url, { headers: { 'User-Agent': 'Mozilla/5.0', Referer: 'https://blog.naver.com' } }, (res) => {
      if ([301, 302, 307, 308].includes(Number(res.statusCode)) && res.headers.location) {
        const next = res.headers.location.startsWith('http') ? res.headers.location : new URL(res.headers.location, url).toString();
        return downloadFile(next, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) return reject(new Error(`HTTP ${res.statusCode}`));
      const ws = fs.createWriteStream(dest);
      res.pipe(ws);
      ws.on('finish', () => { ws.close(); resolve(); });
      ws.on('error', reject);
    }).on('error', reject);
  });
}

async function scrapeMobile(page: Page, logNo: string) {
  const url = `https://m.blog.naver.com/PostView.naver?blogId=${BLOG_ID}&logNo=${logNo}`;
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await sleep(1200);

  const data = await page.evaluate(() => {
    const __name = (v: unknown) => v;
    const root = document.querySelector('.se_doc_viewer') || document.querySelector('.post_ct') || document.body;
    const title = (root.querySelector('.se_textarea,.se-title-text,.title_post,h3')?.textContent || '').trim();
    const date = (root.querySelector('.blog_date,.se_publishDate,.se-date,.date')?.textContent || '').trim();
    const category = (root.querySelector('a[href*="categoryNo="]')?.textContent || '').trim();

    const images: string[] = [];
    const seen = new Set<string>();
    let imgIndex = 0;

    const getImgSrc = (img: HTMLImageElement) =>
      img.getAttribute('data-lazy-src') || img.getAttribute('data-src') || img.currentSrc || img.src || '';

    const serialize = (node: Node): string => {
      if (node.nodeType === Node.TEXT_NODE) return node.textContent || '';
      if (node.nodeType !== Node.ELEMENT_NODE) return '';
      const el = node as HTMLElement;
      const tag = el.tagName.toLowerCase();

      if (tag === 'img') {
        const img = el as HTMLImageElement;
        const src = getImgSrc(img).trim();
        const cls = `${img.className || ''} ${(img.parentElement?.className || '')}`.toLowerCase();
        const isOglink = cls.includes('oglink') || !!img.closest('.se_oglink, [class*="oglink"]');
        if (!src || seen.has(src) || isOglink) return '';
        if (src.includes('blogpfthumb') || src.includes('dthumb-phinf.pstatic.net')) return '';
        seen.add(src);
        images.push(src);
        imgIndex += 1;
        return `{{IMG:${imgIndex}}}`;
      }

      const child = Array.from(el.childNodes).map(serialize).join('');
      if (tag === 'br') return '\n';
      if (tag === 'strong' || tag === 'b') return `**${child}**`;
      if (tag === 'em' || tag === 'i') return `*${child}*`;
      if (tag === 'a') {
        const href = (el as HTMLAnchorElement).href || '';
        const txt = child.replace(/\s+/g, ' ').trim();
        if (!href) return txt;
        if (!txt) return href;
        if (/\{\{IMG:\d+\}\}/.test(child)) return `${child}\n\n${href}\n\n`;
        return `[${txt}](${href})`;
      }
      if (/^h[1-6]$/.test(tag)) {
        const level = Number(tag[1]);
        return `\n\n${'#'.repeat(level)} ${child.trim()}\n\n`;
      }
      if (tag === 'li') return `- ${child.trim()}\n`;
      return child;
    };

    const components = Array.from(root.querySelectorAll('.se_component, .se-component'));
    const parts: string[] = [];
    const targets = components.length ? components : Array.from(root.childNodes);
    for (const node of targets) {
      const cls = ((node as HTMLElement).className || '').toLowerCase();
      if (cls.includes('documenttitle') || cls.includes('reaction') || cls.includes('comment') || cls.includes('blog2_series')) continue;
      const text = serialize(node).trim();
      if (!text) continue;
      if (/^(이웃추가|본문 기타 기능|공유하기|댓글)/.test(text)) continue;
      parts.push(text);
    }

    const content = parts.join('\n\n').replace(/\n{3,}/g, '\n\n').trim();
    return { title, date, category, content, images };
  });

  return {
    title: data.title,
    date: normalizeDate(data.date) || '',
    category: data.category,
    content: data.content,
    images: data.images,
  };
}

function generate(posts: any[]) {
  const lines: string[] = [];
  lines.push(`import type { DeskPost } from './deskData';\n`);
  lines.push('/**');
  lines.push(` * 네이버 블로그에서 자동 스크래핑한 포스트 (${new Date().toISOString().slice(0,10)})`);
  lines.push(` * 블로그: https://blog.naver.com/${BLOG_ID}`);
  lines.push(` * 총 ${posts.length}개`);
  lines.push(' *');
  lines.push(' * NOTE: titleEn / contentEn 은 수동 번역 필요');
  lines.push(' */\n');
  lines.push('export const NAVER_POSTS: DeskPost[] = [');

  for (const p of posts) {
    lines.push('    {');
    lines.push(`        slug: ${JSON.stringify(p.slug)},`);
    lines.push(`        date: ${JSON.stringify(p.date)},`);
    lines.push(`        titleKo: ${JSON.stringify(p.titleKo)},`);
    lines.push(`        titleEn: ${JSON.stringify(p.titleEn || p.titleKo)}, // TODO: translate`);
    lines.push(`        contentKo: ${JSON.stringify(p.contentKo)},`);
    lines.push(`        contentEn: ${JSON.stringify(p.contentEn || '')}, // TODO: translate`);
    lines.push(`        category: ${JSON.stringify(p.category || 'misc')},`);
    if (p.sourceCategoryNo) lines.push(`        sourceCategoryNo: ${JSON.stringify(p.sourceCategoryNo)},`);
    if (p.sourceCategory) lines.push(`        sourceCategory: ${JSON.stringify(p.sourceCategory)},`);
    if (p.tags && p.tags.length) lines.push(`        tags: ${JSON.stringify(p.tags)},`);
    lines.push(`        thumbnail: ${JSON.stringify(p.thumbnail || '')},`);
    lines.push(`        images: ${JSON.stringify(p.images || [])},`);
    lines.push(`        externalUrl: ${JSON.stringify(p.externalUrl)},`);
    lines.push('    },');
  }
  lines.push('];\n');
  return lines.join('\n');
}

async function main() {
  const posts = [...(NAVER_POSTS as any[])];
  const targets = posts.filter((p) => isCorrupted(String(p.contentKo || '')) && extractLogNo(p.externalUrl)).slice(0, max);
  console.log(`대상: ${targets.length}개`);
  if (targets.length === 0) return;

  const browser = await chromium.launch({ headless: true, chromiumSandbox: false });
  const context = await browser.newContext({ locale: 'ko-KR' });
  const page = await context.newPage();

  for (let i = 0; i < targets.length; i++) {
    const target = targets[i];
    const logNo = extractLogNo(target.externalUrl);
    try {
      const s = await scrapeMobile(page, logNo);
      if (s.title) {
        target.titleKo = s.title;
        target.titleEn = s.title;
      }
      if (s.date) target.date = s.date;
      target.contentKo = s.content || target.contentKo;

      if (shouldDownload && s.images.length) {
        const local: string[] = [];
        for (let j = 0; j < s.images.length; j++) {
          const filename = `${String(j + 1).padStart(2, '0')}.webp`;
          const dest = path.join(IMAGE_ROOT, target.slug, filename);
          const pub = `/desk/${target.slug}/${filename}`;
          try {
            await downloadFile(s.images[j], dest);
            local.push(pub);
          } catch {
            local.push(s.images[j]);
          }
        }
        target.images = local;
        target.thumbnail = local[0] || target.thumbnail;
      }
      console.log(`✅ [${i + 1}/${targets.length}] ${target.slug}`);
    } catch (e) {
      console.log(`❌ [${i + 1}/${targets.length}] ${target.slug}: ${(e as Error).message}`);
    }
    await sleep(180);
  }

  fs.writeFileSync(OUT_FILE, generate(posts), 'utf-8');
  await browser.close();
  console.log('완료');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
