import * as fs from 'fs';
import { NAVER_POSTS } from '../src/data/desk/_naver-posts';

function isMissing(p: typeof NAVER_POSTS[number]): boolean {
  const ko = (p.titleKo || '').trim();
  const en = (p.titleEn || '').trim();
  const cko = (p.contentKo || '').trim();
  const cen = (p.contentEn || '').trim();
  return (en === '' || en === ko || cen === '' || cen === cko);
}

// 1. Result JSONL 파일에서 slug 수집 (중복 포함)
console.log('=== 1. Result JSONL 분석 ===');
const allResultSlugs: Map<string, number[]> = new Map();
for (let s = 0; s < 5; s++) {
  const file = `.tmp/translate-results/shard-${s}.jsonl`;
  if (!fs.existsSync(file)) continue;
  const lines = fs.readFileSync(file, 'utf-8').split('\n').filter(l => l.trim());
  for (const line of lines) {
    try {
      const { slug } = JSON.parse(line);
      if (!slug) continue;
      if (!allResultSlugs.has(slug)) allResultSlugs.set(slug, []);
      allResultSlugs.get(slug)!.push(s);
    } catch {}
  }
}

// 샤드 간 중복 slug 찾기
const crossShardDups: string[] = [];
const withinShardDups: string[] = [];
for (const [slug, shards] of allResultSlugs) {
  const uniqueShards = new Set(shards);
  if (uniqueShards.size > 1) crossShardDups.push(slug);
  if (shards.length > uniqueShards.size) withinShardDups.push(slug);
}

console.log(`총 고유 slug (results): ${allResultSlugs.size}`);
console.log(`샤드 간 중복 (같은 slug가 다른 샤드에): ${crossShardDups.length}`);
if (crossShardDups.length > 0 && crossShardDups.length <= 10) {
  crossShardDups.forEach(s => console.log(`  - ${s} → shards: [${allResultSlugs.get(s)!.join(',')}]`));
}
console.log(`샤드 내 중복 (같은 slug가 같은 샤드에 여러번): ${withinShardDups.length}`);

// 2. Checkpoint 간 중복 분석
console.log('\n=== 2. Checkpoint 분석 ===');
const cpSlugs: Map<string, number[]> = new Map();
for (let s = 0; s < 5; s++) {
  const file = `.tmp/translate-checkpoints/shard-${s}.json`;
  if (!fs.existsSync(file)) continue;
  const cp = JSON.parse(fs.readFileSync(file, 'utf-8'));
  const done = (cp.done || []) as string[];
  for (const slug of done) {
    if (!cpSlugs.has(slug)) cpSlugs.set(slug, []);
    cpSlugs.get(slug)!.push(s);
  }
}

const cpCrossDups = [...cpSlugs.entries()].filter(([, shards]) => new Set(shards).size > 1);
console.log(`총 고유 slug (checkpoints): ${cpSlugs.size}`);
console.log(`샤드 간 중복 checkpoint: ${cpCrossDups.length}`);
if (cpCrossDups.length <= 20) {
  cpCrossDups.forEach(([slug, shards]) => console.log(`  - ${slug} → shards: [${[...new Set(shards)].join(',')}]`));
}

// 3. 현재 샤드 분배 vs 실제 checkpoint 매핑
console.log('\n=== 3. 샤드 분배 정확도 ===');
const missing = NAVER_POSTS.filter(p => isMissing(p));
for (let s = 0; s < 5; s++) {
  const shardPosts = new Set(missing.filter((_, i) => i % 5 === s).map(p => p.slug));
  const file = `.tmp/translate-checkpoints/shard-${s}.json`;
  const cp = JSON.parse(fs.readFileSync(file, 'utf-8'));
  const done = new Set((cp.done || []) as string[]);

  let matchOwnShard = 0;
  let matchOtherShard = 0;
  for (const slug of done) {
    if (shardPosts.has(slug)) matchOwnShard++;
    else matchOtherShard++;
  }
  console.log(`Shard ${s}: checkpoint ${done.size}개 중 자기 샤드=${matchOwnShard}, 다른 샤드 것=${matchOtherShard} (${Math.round(matchOtherShard/done.size*100)}% 낭비)`);
}

// 4. 실제 번역 완료 상태 (모든 result를 합쳐서)
console.log('\n=== 4. 실제 번역 완료 현황 ===');
const uniqueDone = new Set(allResultSlugs.keys());
const missingSet = new Set(missing.map(p => p.slug));
let trulyDone = 0;
for (const slug of uniqueDone) {
  if (missingSet.has(slug)) trulyDone++;
}
console.log(`미번역 대상: ${missing.length}`);
console.log(`Result 파일에 있는 고유 slug: ${uniqueDone.size}`);
console.log(`그 중 미번역 대상과 매칭: ${trulyDone}`);
console.log(`실제 남은 번역: ${missing.length - trulyDone}`);
