import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import sharp from 'sharp';

const args = Object.fromEntries(process.argv.slice(2).map((arg) => {
  const [key, ...value] = arg.replace(/^--/, '').split('=');
  return [key, value.join('=')];
}));

for (const key of ['ko', 'en', 'slug']) {
  if (!args[key]) throw new Error(`Missing --${key}=...`);
}

const root = process.cwd();
const postSlug = args.slug;
const koRoot = path.resolve(args.ko);
const enRoot = path.resolve(args.en);
const publicAssetRoot = path.join(root, 'public', 'desk', postSlug);
const outputPath = path.join(root, 'public', 'desk-posts', `${postSlug}.md`);

const extractBody = (source) => {
  const heading = source.search(/^#\s+/m);
  if (heading < 0) throw new Error('Post heading not found');
  return source.slice(heading).replace(/^#\s+[^\r\n]+\r?\n+/, '').trim();
};

const replaceAssets = (body, locale) => body
  .replaceAll('assets/image-1.png', `/desk/${postSlug}/hero.webp`)
  .replaceAll('assets/image.png', `/desk/${postSlug}/reader-${locale}.webp`)
  .replaceAll('assets/library.png', `/desk/${postSlug}/reader-${locale}.webp`);

const [koSource, enSource] = await Promise.all([
  fs.readFile(path.join(koRoot, 'index.md'), 'utf8'),
  fs.readFile(path.join(enRoot, 'index.md'), 'utf8'),
]);

await fs.mkdir(publicAssetRoot, { recursive: true });
await Promise.all([
  sharp(path.join(koRoot, 'assets', 'image-1.png')).webp({ quality: 84, effort: 6 }).toFile(path.join(publicAssetRoot, 'hero.webp')),
  sharp(path.join(koRoot, 'assets', 'image.png')).webp({ quality: 84, effort: 6 }).toFile(path.join(publicAssetRoot, 'reader-ko.webp')),
  sharp(path.join(enRoot, 'assets', 'image.png')).webp({ quality: 84, effort: 6 }).toFile(path.join(publicAssetRoot, 'reader-en.webp')),
]);

const output = `---
date: "2026-07-23"
titleKo: "카페루아 0.2.0 업데이트 — 2층 서재를 열었습니다"
titleEn: "Cafe Lua 0.2.0 Update — The Second-Floor Library Is Open"
category: cafelua
tags:
  - 카페루아
  - 서재
  - 전자책
  - 화성침공
  - 하네스 엔지니어링
images: []
thumbnail: /desk/${postSlug}/hero.webp
---

<!-- ko -->
${replaceAssets(extractBody(koSource), 'ko')}

<!-- en -->
${replaceAssets(extractBody(enSource), 'en')}
`;

await fs.writeFile(outputPath, output, 'utf8');
console.log(`Exported ${outputPath}`);
