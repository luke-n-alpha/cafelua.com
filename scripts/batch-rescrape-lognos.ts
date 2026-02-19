import { chromium, type Page } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { NAVER_POSTS } from '../src/data/desk/_naver-posts.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const BLOG_ID = 'fstory97';
const BASE_URL = 'https://blog.naver.com';
const POSTS_FILE = path.join(__dirname, '..', 'src', 'data', 'desk', '_naver-posts.ts');
const INPUT = path.join(__dirname, '..', '.tmp', 'menu-noise-lognos-remaining.txt');

function sleep(ms: number) { return new Promise((r) => setTimeout(r, ms)); }

function normalizeDate(input: string): string {
  const trimmed = (input || '').trim();
  const dot = trimmed.match(/(\d{4})\.\s*(\d{1,2})\.\s*(\d{1,2})/);
  if (dot) return `${dot[1]}-${dot[2].padStart(2, '0')}-${dot[3].padStart(2, '0')}`;
  const dash = trimmed.match(/(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (dash) return `${dash[1]}-${dash[2].padStart(2, '0')}-${dash[3].padStart(2, '0')}`;
  return '';
}

function slugify(date: string, title: string): string {
  const dateCompact = date.replace(/-/g, '');
  const slug = title.toLowerCase().replace(/[^a-z0-9가-힣\s-]/g, '').replace(/\s+/g, '-').slice(0, 50).replace(/-+$/, '');
  return `${dateCompact}-${slug || 'post'}`;
}

function normalizeCategory(raw: string): string {
  const val = (raw || '').trim().toLowerCase();
  const allowed = new Set(['cafelua', 'ai', 'it', 'believer', 'xrcloud', 'review', 'art', 'private', 'essay', 'tech', 'misc']);
  if (allowed.has(val)) return val;
  return 'misc';
}

function extractLogNo(url: string): string {
  return (url.match(/\/(\d+)(?:\?|$)/)?.[1]) || '';
}

async function scrapePost(page: Page, logNo: string) {
  const url = `${BASE_URL}/${BLOG_ID}/${logNo}`;
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
  await sleep(1200);

  let contentFrame = page;
  const mainFrame = page.frames().find(f => f.url().includes('PostView.naver') || f.url().includes('postView'));
  if (mainFrame) contentFrame = mainFrame as unknown as Page;

  const data = await contentFrame.evaluate(() => {
    const __name = <T,>(v: T) => v;
    const metaDate =
      document.querySelector('meta[property="article:published_time"]')?.getAttribute('content') ||
      document.querySelector('meta[property="og:article:published_time"]')?.getAttribute('content') ||
      document.querySelector('meta[name="date"]')?.getAttribute('content') || '';
    const timeDate = document.querySelector('time')?.getAttribute('datetime') || document.querySelector('time')?.textContent || '';
    const titleEl = document.querySelector('.se-title-text, .pcol1 .itemSubjectBoldfont, .htitle, .se_title .se_textView, h3.se_textarea, .title_post, [class*="title"] .se-text-paragraph, #title_1');
    const title = (titleEl?.textContent || '').trim();
    const dateEl = document.querySelector('.se_publishDate, .blog_date, .se-date, .date, .post_date, [class*="date"], .se_publishDate_layer');
    const dateStr = (dateEl?.textContent || '').trim();

    let fallbackDate = '';
    const bodyText = document.body?.innerText || '';
    const bodyMatch = bodyText.match(/(\d{4})\.\s*(\d{1,2})\.\s*(\d{1,2})/);
    if (bodyMatch) fallbackDate = `${bodyMatch[1]}-${bodyMatch[2].padStart(2, '0')}-${bodyMatch[3].padStart(2, '0')}`;

    const catEl = document.querySelector('.blog_category a, .category a, [class*="cate"] a, .post_category');
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

    const tags: string[] = [];
    container.querySelectorAll('.se-hashtag, .se-hashtag a, a[class*="hashtag"], a[href*="/hashtag/"], a[href*="hashtag"]').forEach((el) => {
      const text = (el.textContent || '').trim();
      if (!text) return;
      const normalized = text.startsWith('#') ? text.slice(1).trim() : text.trim();
      if (!normalized || normalized === '태그' || normalized.length > 40) return;
      tags.push(normalized);
    });

    const images: string[] = [];
    const seen = new Set<string>();
    let imgIndex = 0;
    const getImgSrc = (img: HTMLImageElement) => img.dataset.lazySrc || img.dataset.src || img.getAttribute('data-lazy-src') || img.getAttribute('data-src') || img.getAttribute('data-original') || img.currentSrc || img.src || '';

    const serialize = (node: Node): string => {
      if (node.nodeType === Node.TEXT_NODE) return node.textContent || '';
      if (node.nodeType !== Node.ELEMENT_NODE) return '';
      const el = node as HTMLElement;
      const tag = el.tagName.toLowerCase();
      if (tag === 'script' || tag === 'style' || tag === 'noscript' || tag === 'svg' || tag === 'path') return '';
      if (tag === 'img') {
        const imageEl = el as HTMLImageElement;
        const src = getImgSrc(imageEl);
        const className = `${imageEl.className || ''} ${imageEl.parentElement?.className || ''}`.toLowerCase();
        const isOglinkImage = className.includes('oglink') || Boolean(imageEl.closest('.se-module-oglink, .se-oglink-thumbnail, .se-oglink-info, [class*="oglink"]'));
        if (src && !seen.has(src) && !src.includes('static.naver') && !src.includes('blogpfthumb') && !src.includes('dthumb-phinf.pstatic.net') && src.startsWith('http') && !isOglinkImage) {
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
        if (!/youtu\.be|youtube\.com|tv\.naver\.com|serviceapi\.nmv\.naver\.com|blog\.naver\.com\/PostView/i.test(src)) return '';
        return `\n\n${src}\n\n`;
      }
      const childText = Array.from(el.childNodes).map(serialize).join('');
      if (tag === 'br') return '\n';
      if (tag === 'strong' || tag === 'b') return `**${childText}**`;
      if (tag === 'em' || tag === 'i') return `*${childText}*`;
      if (tag === 'a') {
        const href = (el as HTMLAnchorElement).href || '';
        const compact = childText.replace(/\s+/g, ' ').trim();
        if (!href) return compact || childText;
        if (/\{\{IMG:\d+\}\}/.test(childText)) return `${childText}\n\n${href}\n\n`;
        if (compact.length === 0) return href;
        if (compact.length > 140 || compact.includes('\n')) return `${compact}\n\n${href}\n\n`;
        return `[${compact}](${href})`;
      }
      if (/^h[1-6]$/.test(tag)) return `\n\n${'#'.repeat(Number(tag[1]))} ${childText.trim()}\n\n`;
      if (tag === 'li') return `- ${childText.trim()}\n`;
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

  const date = normalizeDate(data.metaDate || '') || normalizeDate(data.timeDate || '') || normalizeDate(data.dateStr || '') || data.fallbackDate || '';
  return { url, title: data.title, date, category: data.category, tags: Array.from(new Set((data.tags || []).map((t: string) => t.trim()).filter(Boolean))), content: data.content, images: data.images };
}

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

async function main() {
  if (!fs.existsSync(INPUT)) throw new Error(`input not found: ${INPUT}`);
  const logs = fs.readFileSync(INPUT, 'utf-8').split('\n').map((x) => x.trim()).filter(Boolean);
  const posts: any[] = [...NAVER_POSTS];

  const browser = await chromium.launch({ headless: true, chromiumSandbox: false, args: ['--no-sandbox'] });
  const page = await browser.newPage();

  let ok = 0;
  let fail = 0;
  for (let i = 0; i < logs.length; i++) {
    const logNo = logs[i];
    const idx = posts.findIndex((p) => extractLogNo(p.externalUrl || '') === logNo);
    if (idx === -1) continue;
    const existing = posts[idx];
    try {
      const data = await scrapePost(page, logNo);
      if (!data.title) throw new Error('empty title');

      const effectiveDate = data.date || existing.date;
      const slug = slugify(effectiveDate, data.title);
      const category = normalizeCategory(data.category || existing.category || 'misc');
      const tags = Array.from(new Set([category, ...(data.tags || [])].filter(Boolean)));

      const existingLocalImages = (existing.images || []).filter((x: string) => x.startsWith('/desk/'));
      const images = existingLocalImages.length > 0 ? existingLocalImages : (data.images || existing.images || []);
      const thumbnail = existingLocalImages.length > 0 ? existingLocalImages[0] : (images[0] || existing.thumbnail || '');

      posts[idx] = {
        ...existing,
        slug,
        date: effectiveDate,
        titleKo: data.title,
        titleEn: data.title,
        contentKo: data.content,
        contentEn: existing.contentEn || '',
        category,
        tags,
        thumbnail,
        images,
      };
      ok += 1;
      if ((i + 1) % 10 === 0) console.log(`[${i + 1}/${logs.length}] ok=${ok} fail=${fail}`);
    } catch (e) {
      fail += 1;
      console.log(`[${i + 1}/${logs.length}] FAIL ${logNo}: ${(e as Error).message}`);
    }
    await sleep(250);
  }

  fs.writeFileSync(POSTS_FILE, render(posts), 'utf-8');
  await browser.close();
  console.log(`done ok=${ok} fail=${fail}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
