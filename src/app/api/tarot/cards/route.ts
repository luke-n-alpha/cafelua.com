import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { FALLBACK_TAROT_CARDS } from '@/data/tarot/fallbackCards';

// 카드 폴더명 목록
const CARD_FOLDERS = [
  '00-the-fool', '01-the-magician', '02-the-high-priestess', '03-the-empress',
  '04-the-emperor', '05-the-hierophant', '06-the-lovers', '07-the-chariot',
  '08-strength', '09-the-hermit', '10-wheel-of-fortune', '11-justice',
  '12-the-hanged-man', '13-death', '14-temperance', '15-the-devil',
  '16-the-tower', '17-the-star', '18-the-moon', '19-the-sun',
  '20-judgement', '21-the-world',
];

function getCardsBasePath(): string {
  const cwd = process.cwd();
  // Vercel에서는 프로젝트 루트, 로컬에서는 public-home일 수 있음
  if (cwd.endsWith('public-home')) {
    return path.join(cwd, '..', 'taro', 'cards');
  }
  return path.join(cwd, 'taro', 'cards');
}

export async function GET() {
  try {
    const basePath = getCardsBasePath();
    const cards = [];

    for (const folder of CARD_FOLDERS) {
      const metaPath = path.join(basePath, folder, 'meta.json');
      try {
        const content = await fs.readFile(metaPath, 'utf-8');
        const meta = JSON.parse(content);
        // 클라이언트에 필요한 정보만 반환 (해석 문서 제외)
        cards.push({
          id: meta.id,
          nameEn: meta.nameEn,
          nameKr: meta.nameKr,
          imagePath: meta.imagePath,
          keywords: meta.keywords,
        });
      } catch (e) {
        console.error(`Failed to load ${folder}:`, e);
      }
    }

    const source = cards.length > 0 ? cards : FALLBACK_TAROT_CARDS;

    return NextResponse.json({
      cards: source.map((meta) => ({
        id: meta.id,
        nameEn: meta.nameEn,
        nameKr: meta.nameKr,
        imagePath: meta.imagePath,
        keywords: meta.keywords,
      })),
    });
  } catch (error) {
    console.error('Failed to load cards:', error);
    return NextResponse.json(
      { error: 'Failed to load cards' },
      { status: 500 }
    );
  }
}
