/**
 * 모든 result JSONL을 합쳐서 통합 done set을 만든 후,
 * 현재 5-샤드 분배에 맞는 checkpoint를 각각 생성한다.
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
const CP_DIR = '.tmp/translate-checkpoints';

// 1. 모든 result JSONL에서 고유 slug 수집
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

console.log(`통합 done set: ${allDone.size}개`);

// 2. 현재 미번역 대상 확인
const missing = NAVER_POSTS.filter(p => isMissing(p));
console.log(`미번역 대상: ${missing.length}개`);

// 3. 각 샤드별로 올바른 checkpoint 생성
for (let s = 0; s < SHARD_COUNT; s++) {
  const shardPosts = missing.filter((_, i) => i % SHARD_COUNT === s);
  const shardDone = shardPosts.filter(p => allDone.has(p.slug)).map(p => p.slug);
  const shardRemaining = shardPosts.length - shardDone.length;

  const cpFile = path.join(CP_DIR, `shard-${s}.json`);
  // 백업 기존 checkpoint
  if (fs.existsSync(cpFile)) {
    fs.copyFileSync(cpFile, cpFile + '.bak');
  }

  const payload = {
    updatedAt: new Date().toISOString(),
    done: shardDone,
  };
  fs.mkdirSync(CP_DIR, { recursive: true });
  fs.writeFileSync(cpFile, JSON.stringify(payload, null, 2), 'utf-8');

  console.log(`Shard ${s}: 할당=${shardPosts.length}, 완료=${shardDone.length}, 남은=${shardRemaining}`);
}

// 4. 전체 요약
const totalRemaining = missing.filter(p => !allDone.has(p.slug)).length;
console.log(`\n총 남은 번역: ${totalRemaining}개`);
