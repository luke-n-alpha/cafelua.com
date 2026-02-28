import { NAVER_POSTS } from '../src/data/desk/_naver-posts';
import * as fs from 'fs';

const cp = JSON.parse(fs.readFileSync('.tmp/translate-checkpoints/shard-3.json', 'utf-8'));
const done = new Set(cp.done as string[]);

function isMissing(p: typeof NAVER_POSTS[number]): boolean {
  const ko = (p.titleKo || '').trim();
  const en = (p.titleEn || '').trim();
  const cko = (p.contentKo || '').trim();
  const cen = (p.contentEn || '').trim();
  return (en === '' || en === ko || cen === '' || cen === cko);
}

const targets = NAVER_POSTS
  .filter(p => isMissing(p))
  .filter((_, i) => i % 5 === 3)
  .filter(p => !done.has(p.slug));

console.log('Remaining for shard 3:', targets.length);
if (targets.length > 0) {
  const t = targets[0];
  console.log('Next slug (likely failed):', t.slug);
  console.log('Content length:', (t.contentKo || '').length);
  console.log('Title:', t.titleKo);
  // Show first 200 chars of content
  console.log('Content preview:', (t.contentKo || '').slice(0, 200));
}
