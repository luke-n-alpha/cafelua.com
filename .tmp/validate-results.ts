/**
 * 기존 result 파일들을 합치고, 이상한 결과(너무 짧거나 비정상)를 검출
 */
import * as fs from 'fs';
import * as path from 'path';

const RESULTS_DIR = '.tmp/translate-results';

interface Result {
  slug: string;
  titleEn: string;
  contentEn: string;
  shard: number;
}

// 모든 result 수집 (최신 것 우선 - 마지막 등장이 최종)
const resultMap = new Map<string, Result>();
let totalLines = 0;

for (let s = 0; s < 5; s++) {
  const file = path.join(RESULTS_DIR, `shard-${s}.jsonl`);
  if (!fs.existsSync(file)) continue;
  for (const line of fs.readFileSync(file, 'utf-8').split('\n')) {
    if (!line.trim()) continue;
    totalLines++;
    try {
      const { slug, titleEn, contentEn } = JSON.parse(line);
      if (!slug) continue;
      resultMap.set(slug, { slug, titleEn: titleEn || '', contentEn: contentEn || '', shard: s });
    } catch {}
  }
}

console.log(`총 result 라인: ${totalLines}`);
console.log(`고유 slug: ${resultMap.size}`);
console.log(`중복 라인 (재번역): ${totalLines - resultMap.size}`);

// 이상 결과 검출
const issues: { slug: string; issue: string; titleLen: number; contentLen: number }[] = [];

for (const [slug, r] of resultMap) {
  const titleLen = r.titleEn.length;
  const contentLen = r.contentEn.length;

  if (!r.titleEn.trim()) {
    issues.push({ slug, issue: 'title 비어있음', titleLen, contentLen });
  } else if (titleLen < 5) {
    issues.push({ slug, issue: `title 너무 짧음 (${titleLen}자): "${r.titleEn}"`, titleLen, contentLen });
  }

  if (!r.contentEn.trim()) {
    issues.push({ slug, issue: 'content 비어있음', titleLen, contentLen });
  } else if (contentLen < 20) {
    issues.push({ slug, issue: `content 너무 짧음 (${contentLen}자): "${r.contentEn.slice(0, 50)}"`, titleLen, contentLen });
  }

  // content가 한글만인 경우 (번역 안 됨)
  const koreanRatio = (r.contentEn.match(/[가-힣]/g) || []).length / Math.max(1, r.contentEn.length);
  if (koreanRatio > 0.3 && contentLen > 50) {
    issues.push({ slug, issue: `content 한글 비율 높음 (${(koreanRatio * 100).toFixed(0)}%)`, titleLen, contentLen });
  }
}

console.log(`\n=== 이상 결과: ${issues.length}건 ===`);
for (const i of issues) {
  console.log(`  [${i.issue}] ${i.slug}`);
}

if (issues.length === 0) {
  console.log('  (문제 없음)');
}

// 크기 분포
const sizes = [...resultMap.values()].map(r => r.contentEn.length).sort((a, b) => a - b);
console.log(`\n=== content 크기 분포 ===`);
console.log(`  최소: ${sizes[0]}`);
console.log(`  p10: ${sizes[Math.floor(sizes.length * 0.1)]}`);
console.log(`  p50: ${sizes[Math.floor(sizes.length * 0.5)]}`);
console.log(`  p90: ${sizes[Math.floor(sizes.length * 0.9)]}`);
console.log(`  최대: ${sizes[sizes.length - 1]}`);
