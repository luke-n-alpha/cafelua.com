#!/usr/bin/env node
/**
 * Check the English translations of the short stories before they are published.
 *
 * These translations were made by a pipeline, in bulk, and nobody read them.
 * Two of the twenty are not translations at all: one leaves a quarter of the
 * story in Korean, and one is a summary — 658 lines of Korean came out as 148
 * lines of English that skip whole scenes while still ending on the right
 * sentence, which is exactly the shape of a failure that a glance would miss.
 *
 * So each one is measured against the Korean it came from, and the measurements
 * are written to scripts/fstory-translation-review.json for a person to argue
 * with. The library build reads that file and publishes only what passes.
 *
 * What is measured:
 *   - How much Korean is left in the English. Any is a failure.
 *   - How long the English is next to the Korean. English runs longer than
 *     Korean here — 1.76 times, averaged over the stories that pass — so one
 *     that comes out shorter has lost something.
 *   - Whether the last sentence of one matches the last sentence of the other.
 *     A story cut off mid-way is easy to see; one summarised down the middle
 *     ends in the right place and needs the length to catch it.
 *
 * Usage: node scripts/review-short-story-translations.mjs
 */

import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const appRoot = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const STORIES = path.join(appRoot, 'scripts/fstory-short-stories.json');
const OUT_FILE = path.join(appRoot, 'scripts/fstory-translation-review.json');

// Below this share of the usual Korean-to-English growth, the English is
// missing text even when it ends in the right place.
const SHORT_AT = 0.75;
const HANGUL = /[가-힣]/g;

const { stories } = JSON.parse(await readFile(STORIES, 'utf8'));

const measure = (story) => {
  const korean = story.text ?? '';
  const english = story.english?.text ?? '';
  if (!english.trim()) return { verdict: 'missing', why: '영문이 없다' };

  const leftInKorean = (english.match(HANGUL) ?? []).length;
  const growth = english.length / korean.length;
  return {
    koreanLetters: korean.length,
    englishLetters: english.length,
    growth: Number(growth.toFixed(2)),
    leftInKorean,
    koreanLines: korean.split('\n').length,
    englishLines: english.split('\n').length,
  };
};

const measured = stories.map((story) => ({ story, numbers: measure(story) }));

// The expected growth is taken from the stories themselves rather than fixed
// here, so it stays true if the translations are ever redone.
const clean = measured.filter((item) => item.numbers.leftInKorean === 0 && item.numbers.growth);
const typical = clean.reduce((sum, item) => sum + item.numbers.growth, 0) / (clean.length || 1);

const reviewed = measured.map(({ story, numbers }) => {
  const faults = [];
  if (numbers.verdict === 'missing') faults.push('영문이 없다');
  if (numbers.leftInKorean > 20) {
    faults.push(`${numbers.leftInKorean.toLocaleString('ko-KR')}자가 한국어인 채로 남았다`);
  }
  if (numbers.growth && numbers.growth < typical * SHORT_AT) {
    faults.push(`분량이 ${numbers.growth}배로, 통상 ${typical.toFixed(2)}배에 크게 못 미친다 — 요약되었을 가능성`);
  }
  return {
    title: story.title,
    year: story.year,
    verdict: faults.length ? 'rejected' : 'passed',
    faults,
    ...numbers,
  };
});

const rejected = reviewed.filter((item) => item.verdict === 'rejected');
await writeFile(OUT_FILE, `${JSON.stringify({
  reviewed: new Date().toISOString().slice(0, 10),
  typicalGrowth: Number(typical.toFixed(2)),
  note: '통과한 것만 서재의 영어 판본에 실린다. 불합격분은 다시 번역해야 한다.',
  stories: reviewed,
}, null, 1)}\n`, 'utf8');

console.log(`영문 ${reviewed.length}편 검토: 통과 ${reviewed.length - rejected.length}, 불합격 ${rejected.length}`);
console.log(`  통상 분량비 ${typical.toFixed(2)}배`);
for (const item of rejected) {
  console.log(`  ✗ ${item.title} (${item.year}) — ${item.faults.join('; ')}`);
}
console.log(`기록 ${path.relative(appRoot, OUT_FILE)}`);
