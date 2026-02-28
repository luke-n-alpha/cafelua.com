/**
 * 미번역 + 불량 번역을 합쳐서 5개 샤드에 균등 분배
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
const RESULTS_V2_DIR = '.tmp/translate-results-v2';
const CP_V2_DIR = '.tmp/translate-checkpoints-v2';

// 모든 기존 result 수집
interface ResultEntry { slug: string; titleEn: string; contentEn: string }
const resultMap = new Map<string, ResultEntry>();
for (let s = 0; s < SHARD_COUNT; s++) {
  const file = path.join(RESULTS_DIR, `shard-${s}.jsonl`);
  if (!fs.existsSync(file)) continue;
  for (const line of fs.readFileSync(file, 'utf-8').split('\n')) {
    if (!line.trim()) continue;
    try {
      const parsed = JSON.parse(line) as ResultEntry;
      if (parsed.slug) resultMap.set(parsed.slug, parsed);
    } catch {}
  }
}

// 한글 비율 높은 불량 번역 slug 찾기
const badSlugs = new Set<string>();
for (const [slug, r] of resultMap) {
  const contentLen = r.contentEn.length;
  if (contentLen <= 50) continue; // 짧은 건 skip
  const koreanChars = (r.contentEn.match(/[가-힣]/g) || []).length;
  const ratio = koreanChars / contentLen;
  if (ratio > 0.3) {
    badSlugs.add(slug);
  }
}

// 미번역 slug
const missingPosts = NAVER_POSTS.filter(p => isMissing(p));
const doneSlugs = new Set(resultMap.keys());
const untranslated = missingPosts.filter(p => !doneSlugs.has(p.slug)).map(p => p.slug);

// 합치기
const allTargets = [...new Set([...untranslated, ...badSlugs])];
console.log(`미번역: ${untranslated.length}개`);
console.log(`불량 번역 (재번역): ${badSlugs.length}개`);
console.log(`합계 (중복 제거): ${allTargets.length}개`);

// 균등 분배
fs.mkdirSync(TARGETS_DIR, { recursive: true });
fs.mkdirSync(RESULTS_V2_DIR, { recursive: true });
fs.mkdirSync(CP_V2_DIR, { recursive: true });

const perShard = Math.ceil(allTargets.length / SHARD_COUNT);
for (let s = 0; s < SHARD_COUNT; s++) {
  const start = s * perShard;
  const end = Math.min(start + perShard, allTargets.length);
  const shardSlugs = allTargets.slice(start, end);
  fs.writeFileSync(path.join(TARGETS_DIR, `shard-${s}.txt`), shardSlugs.join('\n') + '\n', 'utf-8');
  fs.writeFileSync(
    path.join(CP_V2_DIR, `shard-${s}.json`),
    JSON.stringify({ updatedAt: new Date().toISOString(), done: [] }, null, 2),
    'utf-8'
  );
  console.log(`Shard ${s}: ${shardSlugs.length}개`);
}

console.log(`\n실행 명령 (각 터미널에서):`);
for (let s = 0; s < SHARD_COUNT; s++) {
  console.log(`npx tsx scripts/translate-naver-posts.ts --target-list-file ${TARGETS_DIR}/shard-${s}.txt --result-only --result-file ${RESULTS_V2_DIR}/shard-${s}.jsonl --checkpoint-file ${CP_V2_DIR}/shard-${s}.json --resume --skip-on-error`);
}
