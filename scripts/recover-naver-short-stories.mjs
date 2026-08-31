#!/usr/bin/env node
/**
 * Recover the short stories that are named on the blog but no longer in this
 * repository, and write them out as a reviewable file.
 *
 * Eighteen short stories are listed under the 단편소설 category of Luke's blog.
 * Two of them survive here as desk posts; the other sixteen were pulled in once
 * — the translation pipeline's working files still name every one of them — and
 * are gone from public/desk-posts/ now. The Korean originals are still in the
 * Naver scrape that pipeline ran against, `.tmp/_naver-posts.safe-backup.ts`,
 * which is 18MB of working data and is not committed.
 *
 * So this script is the bridge: it reads that backup while it is on disk and
 * writes the stories into scripts/fstory-short-stories.json, which is small,
 * committed, and readable — a person can see exactly what was recovered and
 * from where. The library build reads that file, never the backup, so the book
 * can be rebuilt on a machine that has never seen the scrape.
 *
 * It does not put the posts back on the desk. They were removed from there and
 * this script does not know why, so restoring them is Luke's call, not a side
 * effect of building a book.
 *
 * Usage: node scripts/recover-naver-short-stories.mjs
 */

import { readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const appRoot = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const BACKUP = path.join(appRoot, '.tmp/_naver-posts.safe-backup.ts');
const OUT_FILE = path.join(appRoot, 'scripts/fstory-short-stories.json');

// The two that stayed on the desk. They are read from the desk post rather than
// from the backup, because the desk copy is the one that is live and the one
// Luke edits.
const ON_THE_DESK = {
  '20060615-illusion-part-i-1998년': '1998',
  '20060615-안녕하세요-22세기입니다-2000년': '2000',
};

if (!existsSync(BACKUP)) {
  console.error(`백업이 없다: ${path.relative(appRoot, BACKUP)}`);
  console.error('이 파일은 커밋되지 않는 작업 자료다. 없으면 기존 결과물을 그대로 쓴다.');
  process.exit(1);
}

const blob = await readFile(BACKUP, 'utf8');

const deskText = async (slug) => {
  const file = path.join(appRoot, 'public/desk-posts', `${slug}.md`);
  if (!existsSync(file)) return null;
  const post = await readFile(file, 'utf8');
  const korean = post.split('<!-- ko -->')[1];
  return korean ? korean.split('<!-- en -->')[0].trim() : null;
};

// The backup is generated TypeScript: an array of objects, one per post, each
// starting at a four-space brace. Split on that and read the fields out rather
// than trying to evaluate 18MB of source.
const readField = (record, name) => {
  const found = new RegExp(`\\n\\s*${name}:\\s*"((?:[^"\\\\]|\\\\.)*)"`).exec(record);
  if (!found) return null;
  try { return JSON.parse(`"${found[1]}"`); } catch { return null; }
};

// Naver's editor left the title padded with the whitespace of the surrounding
// table, and the year Luke wrote in the title is the only record of when the
// story was written.
const cleanTitle = (raw) => (raw ?? '').split('\n')[0].replace(/\s+/g, ' ').trim()
  // "꿈을 실은 비행기 지은이 (1995년)" — the byline label ran into the title when
  // the post was made and has been part of it ever since.
  .replace(/\s*(?:지은이|글쓴이|끄적인놈|끄적인이)\s*(?=\(|$)/, '');
const yearOf = (title) => /\((\d{4})년/.exec(title)?.[1] ?? null;
const withoutYear = (title) => title.replace(/\s*\((\d{4})년[^)]*\)\s*$/, '').trim();

const stories = [];
for (const record of blob.split('\n    {\n')) {
  const slug = /^\s*slug:\s*"([^"]+)"/.exec(record)?.[1];
  if (!slug) continue;
  const isStory = slug.includes('단편소설') || slug in ON_THE_DESK;
  if (!isStory) continue;
  const title = cleanTitle(readField(record, 'titleKo'));
  // The two that are still on the desk are read from the desk post, not from
  // the backup. The backup is a scrape from before those files were edited
  // here, so taking its copy would quietly undo an edit Luke asked for.
  const text = slug in ON_THE_DESK ? await deskText(slug) : readField(record, 'contentKo');
  if (!title || !text?.trim()) continue;
  stories.push({
    slug,
    title: withoutYear(title) || title,
    // 컬트 판타지 (1996년 : 나우누리) — the note after the year says where he
    // posted it, and it belongs with the story.
    note: /\((?:\d{4})년\s*:\s*([^)]+)\)/.exec(title)?.[1]?.trim() ?? null,
    year: yearOf(title) ?? (/^(\d{4})/.exec(readField(record, 'date') ?? '')?.[1] ?? null),
    from: slug in ON_THE_DESK ? 'desk' : 'naver-backup',
    externalUrl: readField(record, 'externalUrl'),
    text: text.replace(/ /g, ' ').replace(/\r\n?/g, '\n').replace(/[ \t]+$/gm, '').trim(),
  });
}

stories.sort((a, b) => (a.year ?? '').localeCompare(b.year ?? '') || a.title.localeCompare(b.title));

await writeFile(OUT_FILE, `${JSON.stringify({
  recovered: new Date().toISOString().slice(0, 10),
  source: '.tmp/_naver-posts.safe-backup.ts (커밋되지 않는 네이버 스크랩 백업)',
  note: '단편소설 원문. scripts/build-fstory-library-books.mjs 가 이것을 읽어 서재의 단편소설집을 만든다. 되살리려면 recover-naver-short-stories.mjs 를 다시 실행한다.',
  stories,
}, null, 1)}\n`, 'utf8');

const years = stories.map((story) => story.year).filter(Boolean).sort();
console.log(`단편소설 ${stories.length}편을 꺼냈다 (${years[0]} ~ ${years.at(-1)})`);
for (const story of stories) {
  console.log(`  ${story.year ?? '????'}  ${story.text.length.toLocaleString('ko-KR').padStart(7)}자  ${story.title}`);
}
console.log(`기록 ${path.relative(appRoot, OUT_FILE)}`);
