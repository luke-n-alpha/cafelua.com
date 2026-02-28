/**
 * 이미지 전용/매우 짧은 콘텐츠 포스트: contentEn을 contentKo 기반으로 설정
 * ({{IMG:1}} 같은 마커는 번역 불필요)
 */
import * as fs from 'fs';
import { NAVER_POSTS } from '../src/data/desk/_naver-posts';

const shortSlugs = [
  '20250420-카페루아-라이프-알파와-검은-고양이',
  '20250406-카페루아-라이프-카페루아의-시간',
  '20140101-2014-푸른말과-같은-한해가-되세요-일러스트-창작물',
  '20110119-공유-스무번째-이야기-세상보기-it이야기',
  '20091127-공유-도둑고양이의-삶-까망고양이-창작물',
  '20080814-공유-모두의-마음속에-대한민국이-펄럭입니다-my-diary-사적이야기',
  '20071217-공유-25년-함께-한-이은욱-부사장이-말하는-문국현-세상보기-it이야기',
  '20060719-공유-문제의-단체사진최휘영대표님이-없으셩-my-diary-사적이야기',
  '20060719-공유-문제의-단체사진최휘영대표님이-없으셩-my-diary-사적이야기-70006328454',
  '20060719-공유-문제의-단체사진최휘영대표님이-없으셩-my-diary-사적이야기-70006328452',
  '20060622-숲속얘기의-싸이월드-갤러리-05-일러스트-창작물',
  '20060622-숲속얘기의-싸이월드-갤러리-04-일러스트-창작물',
  '20060622-숲속얘기의-싸이월드-갤러리-03-일러스트-창작물',
  '20060621-야미양-일러스트-창작물',
  '20060621-얼음-소년-일러스트-창작물',
  '20060621-여행-가고-프다-일러스트-창작물',
  '20060621-escape-일러스트-창작물',
  '20060621-구름새-일러스트-창작물',
  '20060620-오해-일러스트-창작물',
];

// Generate result JSONL for these short posts
const resultFile = '.tmp/translate-results-v3/short-content.jsonl';
const lines: string[] = [];

for (const slug of shortSlugs) {
  const post = NAVER_POSTS.find(p => p.slug === slug);
  if (post === undefined) {
    console.log(`NOT FOUND: ${slug}`);
    continue;
  }

  const contentKo = (post.contentKo || '').trim();

  // For image-only posts, contentEn = contentKo (just markers)
  // For very short posts (<200 chars), use a placeholder translation
  let contentEn = contentKo;
  if (contentKo.length === 0) {
    contentEn = '(No content)';
  }

  // Use existing titleEn if available, otherwise titleKo
  const titleEn = (post.titleEn || '').trim() || post.titleKo;

  lines.push(JSON.stringify({ slug, titleEn, contentEn }));
  console.log(`${slug}: contentKo=${contentKo.length}자 → contentEn set`);
}

fs.mkdirSync('.tmp/translate-results-v3', { recursive: true });
fs.writeFileSync(resultFile, lines.join('\n') + '\n', 'utf-8');
console.log(`\nSaved ${lines.length} entries to ${resultFile}`);
