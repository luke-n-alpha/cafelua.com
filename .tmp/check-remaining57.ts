import { NAVER_POSTS } from '../src/data/desk/_naver-posts';

const missing: { slug: string; titleOk: boolean; contentOk: boolean; contentKoLen: number }[] = [];

for (const p of NAVER_POSTS) {
  const ko = (p.titleKo || '').trim();
  const en = (p.titleEn || '').trim();
  const cko = (p.contentKo || '').trim();
  const cen = (p.contentEn || '').trim();

  const titleOk = en !== '' && en !== ko;
  const contentOk = cen !== '' && cen !== cko;

  if (titleOk && contentOk) continue;
  missing.push({ slug: p.slug, titleOk, contentOk, contentKoLen: cko.length });
}

console.log(`Missing: ${missing.length}`);
console.log('');

// 분류
const onlyTitle = missing.filter(m => m.contentOk && !m.titleOk);
const onlyContent = missing.filter(m => m.titleOk && !m.contentOk);
const both = missing.filter(m => !m.titleOk && !m.contentOk);

console.log(`title만 누락: ${onlyTitle.length}`);
onlyTitle.forEach(m => console.log(`  - ${m.slug}`));

console.log(`\ncontent만 누락: ${onlyContent.length}`);
onlyContent.forEach(m => console.log(`  - ${m.slug} (ko: ${m.contentKoLen}자)`));

console.log(`\n둘 다 누락: ${both.length}`);
both.forEach(m => console.log(`  - ${m.slug} (ko: ${m.contentKoLen}자)`));
