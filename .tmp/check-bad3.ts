import * as fs from 'fs';
const lines = fs.readFileSync('.tmp/translate-results-merged/all.jsonl', 'utf-8').split('\n').filter(Boolean);
const slugs = [
  '20090302-드라고니아의-전설-1부-84화---진전-3-구드라고니아의-전설-창작물',
  '20090302-드라고니아의-전설-1부-72화---스엡-용병단-2-구드라고니아의-전설-창작물',
  '20110616-네이버-실시간-급상승-검색어의-사정-it에-대한-잡설-it이야기'
];
for (const slug of slugs) {
  const line = lines.find(l => l.includes(slug));
  if (line === undefined) { console.log(slug + ': NOT FOUND'); continue; }
  const r = JSON.parse(line);
  const total = r.contentEn.length;
  const koChars = (r.contentEn.match(/[가-힣]/g) || []).length;
  console.log('=== ' + slug + ' ===');
  console.log('Content length:', total, 'Korean chars:', koChars, 'Ratio:', (koChars / total * 100).toFixed(1) + '%');
  console.log('Preview:', r.contentEn.slice(0, 400));
  console.log('');
}
