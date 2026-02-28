/**
 * v1 + v2 결과 합산 후 최종 검증
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

interface Result { slug: string; titleEn: string; contentEn: string }

// v1 + v2 결과 합산 (v2가 최신이므로 v2 우선)
const resultMap = new Map<string, Result>();

// v1 먼저
for (let s = 0; s < 5; s++) {
  const file = `.tmp/translate-results/shard-${s}.jsonl`;
  if (!fs.existsSync(file)) continue;
  for (const line of fs.readFileSync(file, 'utf-8').split('\n')) {
    if (!line.trim()) continue;
    try {
      const r = JSON.parse(line) as Result;
      if (r.slug) resultMap.set(r.slug, r);
    } catch {}
  }
}

// v2 덮어쓰기
for (let s = 0; s < 5; s++) {
  const file = `.tmp/translate-results-v2/shard-${s}.jsonl`;
  if (!fs.existsSync(file)) continue;
  for (const line of fs.readFileSync(file, 'utf-8').split('\n')) {
    if (!line.trim()) continue;
    try {
      const r = JSON.parse(line) as Result;
      if (r.slug) resultMap.set(r.slug, r);
    } catch {}
  }
}

console.log(`총 번역 결과 (고유): ${resultMap.size}`);

// 미번역 대상과 매칭
const missing = NAVER_POSTS.filter(p => isMissing(p));
const stillMissing = missing.filter(p => !resultMap.has(p.slug));
console.log(`미번역 대상: ${missing.length}`);
console.log(`결과에 없는 slug: ${stillMissing.length}`);
if (stillMissing.length > 0) {
  console.log('누락 slug:');
  stillMissing.forEach(p => console.log(`  - ${p.slug}`));
}

// 품질 검사
let badCount = 0;
for (const [slug, r] of resultMap) {
  const contentLen = r.contentEn.length;
  if (contentLen <= 50) continue;
  const koreanRatio = (r.contentEn.match(/[가-힣]/g) || []).length / contentLen;
  if (koreanRatio > 0.3) {
    badCount++;
    if (badCount <= 5) console.log(`품질 의심: ${slug} (한글 ${(koreanRatio*100).toFixed(0)}%)`);
  }
}
console.log(`\n품질 의심 (한글>30%): ${badCount}건`);

// 통합 result 디렉토리 생성
const MERGED_DIR = '.tmp/translate-results-merged';
fs.mkdirSync(MERGED_DIR, { recursive: true });
const mergedLines: string[] = [];
for (const [, r] of resultMap) {
  mergedLines.push(JSON.stringify(r));
}
fs.writeFileSync(path.join(MERGED_DIR, 'all.jsonl'), mergedLines.join('\n') + '\n', 'utf-8');
console.log(`\n통합 결과 저장: ${MERGED_DIR}/all.jsonl (${mergedLines.length}건)`);
