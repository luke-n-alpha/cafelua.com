import { DESK_POSTS } from '../src/data/desk/deskData';
import { NAVER_POSTS } from '../src/data/desk/_naver-posts';

console.log(`_naver-posts.ts 전체: ${NAVER_POSTS.length}`);
console.log(`DESK_POSTS (필터 후): ${DESK_POSTS.length}`);
console.log(`제외된 포스트: ${NAVER_POSTS.length - DESK_POSTS.length + 1}`); // +1 for manual post

// 한글만 남은 포스트 확인
const untranslated = DESK_POSTS.filter(p => {
  const en = (p.contentEn || '').trim();
  const ko = (p.contentKo || '').trim();
  return en === '' || en === ko;
});
console.log(`\nDESK_POSTS 내 미번역: ${untranslated.length}`);
untranslated.forEach(p => console.log(`  - ${p.slug}`));
