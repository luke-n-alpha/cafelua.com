import { NAVER_POSTS } from '../src/data/desk/_naver-posts';
import * as fs from 'fs';

function isMissing(p: typeof NAVER_POSTS[number]): boolean {
  const ko = (p.titleKo || '').trim();
  const en = (p.titleEn || '').trim();
  const cko = (p.contentKo || '').trim();
  const cen = (p.contentEn || '').trim();
  return (en === '' || en === ko || cen === '' || cen === cko);
}

const missing = NAVER_POSTS.filter(p => isMissing(p));
console.log(`Total missing: ${missing.length}`);

for (let s = 0; s < 5; s++) {
  const shardPosts = missing.filter((_, i) => i % 5 === s);
  const cpFile = `.tmp/translate-checkpoints/shard-${s}.json`;
  const cp = JSON.parse(fs.readFileSync(cpFile, 'utf-8'));
  const doneSet = new Set(cp.done as string[]);

  // How many of THIS shard's posts are in done set?
  const shardDone = shardPosts.filter(p => doneSet.has(p.slug));
  const shardRemaining = shardPosts.filter(p => !doneSet.has(p.slug));

  console.log(`Shard ${s}: checkpoint total=${doneSet.size}, shard share=${shardPosts.length}, actually done for shard=${shardDone.length}, REMAINING=${shardRemaining.length}`);
  if (shardRemaining.length > 0 && shardRemaining.length <= 5) {
    shardRemaining.forEach(p => console.log(`  - ${p.slug}`));
  }
}
