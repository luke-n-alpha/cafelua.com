/**
 * 남은 미번역 slug를 5개 샤드에 균등 분배하여 target-list 파일 생성
 */
import * as fs from 'fs';
import * as path from 'path';
import { NAVER_POSTS } from '../src/data/desk/_naver-posts';

function isMissing(p: typeof NAVER_POSTS[number]): boolean {
  const ko = (p.titleKo || '').trim();
  const en = (p.titleEn || '').trim();
  const cko = (p.contentKo || '').trim();
  const cen = (p.contentEn || '').trim();
  return (en === '' || en === ko || cen === '' || cen === cko);
}

const SHARD_COUNT = 5;
const RESULTS_DIR = '.tmp/translate-results';
const TARGETS_DIR = '.tmp/translate-targets-v2';

// 모든 result에서 done set
const allDone = new Set<string>();
for (let s = 0; s < SHARD_COUNT; s++) {
  const file = path.join(RESULTS_DIR, `shard-${s}.jsonl`);
  if (!fs.existsSync(file)) continue;
  for (const line of fs.readFileSync(file, 'utf-8').split('\n')) {
    if (!line.trim()) continue;
    try {
      const { slug } = JSON.parse(line);
      if (slug) allDone.add(slug);
    } catch {}
  }
}

// 남은 미번역 slug
const remaining = NAVER_POSTS
  .filter(p => isMissing(p))
  .filter(p => !allDone.has(p.slug))
  .map(p => p.slug);

console.log(`남은 미번역: ${remaining.length}개`);

// 균등 분배
fs.mkdirSync(TARGETS_DIR, { recursive: true });
const perShard = Math.ceil(remaining.length / SHARD_COUNT);

for (let s = 0; s < SHARD_COUNT; s++) {
  const start = s * perShard;
  const end = Math.min(start + perShard, remaining.length);
  const shardSlugs = remaining.slice(start, end);
  const file = path.join(TARGETS_DIR, `shard-${s}.txt`);
  fs.writeFileSync(file, shardSlugs.join('\n') + '\n', 'utf-8');
  console.log(`Shard ${s}: ${shardSlugs.length}개`);
}

// 새 checkpoint도 비워서 생성 (target-list 모드에서는 checkpoint가 resume 역할)
const CP_DIR = '.tmp/translate-checkpoints-v2';
fs.mkdirSync(CP_DIR, { recursive: true });
for (let s = 0; s < SHARD_COUNT; s++) {
  fs.writeFileSync(
    path.join(CP_DIR, `shard-${s}.json`),
    JSON.stringify({ updatedAt: new Date().toISOString(), done: [] }, null, 2),
    'utf-8'
  );
}

console.log(`\n실행 명령:`);
for (let s = 0; s < SHARD_COUNT; s++) {
  console.log(`npx tsx scripts/translate-naver-posts.ts --target-list-file ${TARGETS_DIR}/shard-${s}.txt --result-only --result-file .tmp/translate-results-v2/shard-${s}.jsonl --checkpoint-file ${CP_DIR}/shard-${s}.json --resume --skip-on-error`);
}
