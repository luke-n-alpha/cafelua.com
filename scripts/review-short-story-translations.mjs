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
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const appRoot = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const STORIES = path.join(appRoot, 'scripts/fstory-short-stories.json');
const OUT_FILE = path.join(appRoot, 'scripts/fstory-translation-review.json');

// Below this share of the usual Korean-to-English growth, the English is
// missing text even when it ends in the right place.
const SHORT_AT = 0.75;
const HANGUL = /[가-힣]/g;


/**
 * A translation done by hand, kept as scripts/translations/<제목>.en.txt.
 *
 * The pipeline's translations are what they are; where one of them failed the
 * review, the story is translated properly and the result put here. A file in
 * that folder always wins over the pipeline's version, so the review and the
 * book both read the same text and a retranslation shows up as a plain diff.
 */
const HAND_TRANSLATED = path.join(appRoot, 'scripts/translations');
const handTranslation = async (title) => {
  const file = path.join(HAND_TRANSLATED, `${title}.en.txt`);
  if (!existsSync(file)) return null;
  const text = (await readFile(file, 'utf8')).trim();
  return text ? { title: null, text, by: 'hand' } : null;
};

const { stories } = JSON.parse(await readFile(STORIES, 'utf8'));
for (const story of stories) {
  const hand = await handTranslation(story.title);
  if (hand) story.english = hand;
}

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
//
// It is taken separately for each source. A translation done by hand runs
// longer than the pipeline's, consistently, and mixing the two lifts the
// baseline until sound pipeline translations start failing against it — which
// is what happened to 메리크리스마스, a complete and faithful translation that
// the shared baseline called a summary. A translation is judged against others
// made the same way.
const baselineFor = (by) => {
  const clean = measured.filter((item) =>
    (item.story.english?.by ?? 'pipeline') === by
    && item.numbers.leftInKorean === 0
    && item.numbers.growth);
  if (!clean.length) return null;
  return clean.reduce((sum, item) => sum + item.numbers.growth, 0) / clean.length;
};
const baselines = new Map([['pipeline', baselineFor('pipeline')], ['hand', baselineFor('hand')]]);
const overall = measured.filter((item) => item.numbers.growth);
const typical = overall.reduce((sum, item) => sum + item.numbers.growth, 0) / (overall.length || 1);

const reviewed = measured.map(({ story, numbers }) => {
  const faults = [];
  if (numbers.verdict === 'missing') faults.push('영문이 없다');
  if (numbers.leftInKorean > 20) {
    faults.push(`${numbers.leftInKorean.toLocaleString('ko-KR')}자가 한국어인 채로 남았다`);
  }
  const by = story.english?.by ?? 'pipeline';
  const expected = baselines.get(by) ?? typical;
  if (numbers.growth && numbers.growth < expected * SHORT_AT) {
    faults.push(`분량이 ${numbers.growth}배로, ${by === 'hand' ? '손번역' : '기계번역'} 통상 ${expected.toFixed(2)}배에 크게 못 미친다 — 요약되었을 가능성`);
  }
  return {
    title: story.title,
    year: story.year,
    by,
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
for (const [by, value] of baselines) {
  if (value) console.log(`  ${by === 'hand' ? '손번역' : '기계번역'} 통상 분량비 ${value.toFixed(2)}배`);
}
for (const item of rejected) {
  console.log(`  ✗ ${item.title} (${item.year}) — ${item.faults.join('; ')}`);
}
console.log(`기록 ${path.relative(appRoot, OUT_FILE)}`);
