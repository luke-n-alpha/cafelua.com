import { NAVER_POSTS } from '../src/data/desk/_naver-posts';

let missingTitle = 0;
let missingContent = 0;
const missingSlugs: string[] = [];

for (const p of NAVER_POSTS) {
  const ko = (p.titleKo || '').trim();
  const en = (p.titleEn || '').trim();
  const cko = (p.contentKo || '').trim();
  const cen = (p.contentEn || '').trim();

  const titleMissing = (en === '' || en === ko);
  const contentMissing = (cen === '' || cen === cko);

  if (titleMissing) missingTitle++;
  if (contentMissing) missingContent++;
  if (titleMissing || contentMissing) missingSlugs.push(p.slug);
}

console.log(`Total posts: ${NAVER_POSTS.length}`);
console.log(`Missing titleEn: ${missingTitle}`);
console.log(`Missing contentEn: ${missingContent}`);
console.log(`Total missing (title or content): ${missingSlugs.length}`);
if (missingSlugs.length <= 10) {
  missingSlugs.forEach(s => console.log('  - ' + s));
}
