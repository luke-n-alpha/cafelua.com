import * as fs from 'fs';
import * as path from 'path';
import * as http from 'http';
import * as https from 'https';
import { fileURLToPath } from 'url';
import { NAVER_POSTS } from '../src/data/desk/_naver-posts';

type DeskPost = (typeof NAVER_POSTS)[number];

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const OUT_FILE = path.join(__dirname, '..', 'src', 'data', 'desk', '_naver-posts.ts');
const IMAGE_ROOT = path.join(__dirname, '..', 'public', 'desk');
const MISSING_IMAGE = '/desk/missing-image.webp';

const args = process.argv.slice(2);
const max = Number(getArg('--max', '999999'));
const delayMs = Number(getArg('--delay', '90'));

function getArg(flag: string, fallback: string): string {
  const idx = args.indexOf(flag);
  if (idx === -1 || idx + 1 >= args.length) return fallback;
  return args[idx + 1];
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function isRemote(src?: string) {
  return !!src && /^https?:\/\//i.test(src);
}

function downloadFile(url: string, dest: string): Promise<void> {
  return new Promise((resolve, reject) => {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    const client = url.startsWith('https') ? https : http;
    const req = client.get(
      url,
      { headers: { 'User-Agent': 'Mozilla/5.0', Referer: 'https://blog.naver.com' } },
      (res) => {
        if ([301, 302, 307, 308].includes(Number(res.statusCode)) && res.headers.location) {
          const next = res.headers.location.startsWith('http')
            ? res.headers.location
            : new URL(res.headers.location, url).toString();
          return downloadFile(next, dest).then(resolve).catch(reject);
        }
        if (res.statusCode !== 200) return reject(new Error(`HTTP ${res.statusCode}`));
        const ws = fs.createWriteStream(dest);
        res.pipe(ws);
        ws.on('finish', () => {
          ws.close();
          resolve();
        });
        ws.on('error', reject);
      },
    );
    req.setTimeout(15000, () => {
      req.destroy(new Error('timeout'));
    });
    req.on('error', reject);
  });
}

function generate(posts: DeskPost[]) {
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
    lines.push(`        category: ${JSON.stringify(p.category)},`);
    if ((p as any).sourceCategoryNo) lines.push(`        sourceCategoryNo: ${JSON.stringify((p as any).sourceCategoryNo)},`);
    if ((p as any).sourceCategory) lines.push(`        sourceCategory: ${JSON.stringify((p as any).sourceCategory)},`);
    if (Array.isArray((p as any).tags)) lines.push(`        tags: ${JSON.stringify((p as any).tags)},`);
    lines.push(`        thumbnail: ${JSON.stringify((p as any).thumbnail || '')},`);
    lines.push(`        images: ${JSON.stringify((p as any).images || [])},`);
    lines.push(`        externalUrl: ${JSON.stringify((p as any).externalUrl || '')},`);
    lines.push('    },');
  }
  lines.push('];\n');
  return lines.join('\n');
}

async function main() {
  const posts = [...NAVER_POSTS] as DeskPost[];
  let converted = 0;
  let failed = 0;

  for (let i = 0; i < posts.length && converted < max; i++) {
    const p: any = posts[i];
    const imgs = Array.isArray(p.images) ? p.images : [];
    const remoteImgs = imgs.filter((src: string) => isRemote(src));
    const hasRemoteThumb = isRemote(p.thumbnail);
    if (!remoteImgs.length && !hasRemoteThumb) continue;

    const local: string[] = [];
    for (let j = 0; j < imgs.length; j++) {
      const src = imgs[j];
      if (!isRemote(src)) {
        local.push(src);
        continue;
      }

      const filename = `${String(j + 1).padStart(2, '0')}.webp`;
      const dest = path.join(IMAGE_ROOT, p.slug, filename);
      const pub = `/desk/${p.slug}/${filename}`;
      let ok = false;
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          await downloadFile(src, dest);
          local.push(pub);
          ok = true;
          break;
        } catch {
          await sleep(120 * attempt);
        }
      }
      if (!ok) {
        failed += 1;
        local.push(MISSING_IMAGE);
      }
      await sleep(delayMs);
    }

    p.images = local;
    p.thumbnail = local[0] || (hasRemoteThumb ? MISSING_IMAGE : p.thumbnail || '');
    converted += 1;
    if (converted % 10 === 0) {
      fs.writeFileSync(OUT_FILE, generate(posts), 'utf-8');
      console.log(`...converted ${converted}, failed ${failed}`);
    }
  }

  fs.writeFileSync(OUT_FILE, generate(posts), 'utf-8');
  console.log(`done. converted=${converted}, failed=${failed}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
