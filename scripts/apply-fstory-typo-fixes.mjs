#!/usr/bin/env node
/**
 * Correct the typing mistakes in the recovered short stories.
 *
 * These stories were typed once in the nineties, keyed in again for a blog
 * years later, and scraped once more after that. Somewhere along that road
 * letters were dropped and swapped: 소연 became 손연, 굉장히 became 광장히,
 * 종료 became 종로, and 신혜's name became 신P. They are transcription damage,
 * not how Luke wrote, and they make the writing harder to read than it was.
 *
 * What is corrected is only that. The old spellings, the spacing Luke used, the
 * way people talked in 2000 — none of that is touched; it is the writing.
 * Every correction is written out in full in scripts/fstory-typo-fixes.json,
 * before and after, so a person can read the list and disagree with any line of
 * it.
 *
 * Running it twice changes nothing: a correction already made is recognised and
 * skipped. A correction that matches neither the old text nor the new one is an
 * error, because it means the file it was written against has moved.
 *
 * Usage: node scripts/apply-fstory-typo-fixes.mjs [--check]
 */

import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const appRoot = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const STORIES = path.join(appRoot, 'scripts/fstory-short-stories.json');
const FIXES = path.join(appRoot, 'scripts/fstory-typo-fixes.json');

const check = process.argv.includes('--check');

const payload = JSON.parse(await readFile(STORIES, 'utf8'));
const { fixes } = JSON.parse(await readFile(FIXES, 'utf8'));

let applied = 0;
let already = 0;
let unchanged = 0;
const missing = [];

for (const story of payload.stories) {
  const list = fixes[story.title];
  if (!list) continue;
  for (const [from, to] of list) {
    if (from === to) { unchanged += 1; continue; }
    const count = story.text.split(from).length - 1;
    if (count === 1) {
      story.text = story.text.replace(from, to);
      applied += 1;
      continue;
    }
    if (count === 0 && story.text.includes(to)) { already += 1; continue; }
    missing.push({ title: story.title, from, count });
  }
}

if (missing.length) {
  console.error(`원문에서 찾지 못한 교정 ${missing.length}건:`);
  for (const item of missing) {
    console.error(`  [${item.title}] ${item.count}회  ${JSON.stringify(item.from.slice(0, 60))}`);
  }
  console.error('교정 목록이 원문과 어긋난다. 목록을 고치거나 원문을 다시 뽑아야 한다.');
  process.exit(1);
}

if (check) {
  console.log(`고칠 것 ${applied}건, 이미 고쳐진 것 ${already}건, 손댈 필요 없는 항목 ${unchanged}건. 파일은 쓰지 않았다.`);
} else {
  payload.typosFixed = new Date().toISOString().slice(0, 10);
  await writeFile(STORIES, `${JSON.stringify(payload, null, 1)}\n`, 'utf8');
  console.log(`오탈자 ${applied}건을 고쳤다 (이미 고쳐진 것 ${already}건, 손댈 필요 없는 항목 ${unchanged}건)`);
  console.log(`  ${path.relative(appRoot, STORIES)}`);
}
