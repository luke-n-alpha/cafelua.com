// 타로 카드 로더 (공개용)
// 실제 데이터는 taro/cards/에서 로드

import { promises as fs } from 'fs';
import path from 'path';
import type { TarotCardMeta, DrawnCard, SpreadPosition } from './types';
import { SPREAD_POSITIONS } from './types';

// 카드 폴더명 목록 (22장)
const CARD_FOLDERS = [
  '00-the-fool', '01-the-magician', '02-the-high-priestess', '03-the-empress',
  '04-the-emperor', '05-the-hierophant', '06-the-lovers', '07-the-chariot',
  '08-strength', '09-the-hermit', '10-wheel-of-fortune', '11-justice',
  '12-the-hanged-man', '13-death', '14-temperance', '15-the-devil',
  '16-the-tower', '17-the-star', '18-the-moon', '19-the-sun',
  '20-judgement', '21-the-world',
];

// taro/cards 경로 (프로젝트 루트 기준)
function getCardsBasePath(): string {
  // Vercel 빌드 시에는 process.cwd()가 프로젝트 루트
  // 로컬에서는 public-home이 cwd일 수 있음
  const cwd = process.cwd();
  if (cwd.endsWith('public-home')) {
    return path.join(cwd, '..', 'taro', 'cards');
  }
  return path.join(cwd, 'taro', 'cards');
}

// 개별 카드 meta.json 로드
export async function loadCardMeta(cardId: number): Promise<TarotCardMeta | null> {
  try {
    const folder = CARD_FOLDERS[cardId];
    if (!folder) return null;

    const metaPath = path.join(getCardsBasePath(), folder, 'meta.json');
    const content = await fs.readFile(metaPath, 'utf-8');
    return JSON.parse(content) as TarotCardMeta;
  } catch (error) {
    console.error(`Failed to load card ${cardId}:`, error);
    return null;
  }
}

// 개별 카드 interpretation.md 로드
export async function loadCardInterpretation(cardId: number): Promise<string | null> {
  try {
    const folder = CARD_FOLDERS[cardId];
    if (!folder) return null;

    const mdPath = path.join(getCardsBasePath(), folder, 'interpretation.md');
    return await fs.readFile(mdPath, 'utf-8');
  } catch (error) {
    console.error(`Failed to load interpretation ${cardId}:`, error);
    return null;
  }
}

// 전체 덱 메타 로드
export async function loadAllCardsMeta(): Promise<TarotCardMeta[]> {
  const cards: TarotCardMeta[] = [];
  for (let i = 0; i < 22; i++) {
    const card = await loadCardMeta(i);
    if (card) cards.push(card);
  }
  return cards;
}

// 덱 요약 로드
export async function loadDeckSummary(): Promise<string | null> {
  try {
    const summaryPath = path.join(getCardsBasePath(), '..', 'deck-summary.md');
    return await fs.readFile(summaryPath, 'utf-8');
  } catch (error) {
    console.error('Failed to load deck summary:', error);
    return null;
  }
}

// 스프레드 가이드 로드
export async function loadSpreadGuide(): Promise<string | null> {
  try {
    const guidePath = path.join(getCardsBasePath(), '..', 'spread-guide.md');
    return await fs.readFile(guidePath, 'utf-8');
  } catch (error) {
    console.error('Failed to load spread guide:', error);
    return null;
  }
}

// 랜덤하게 n장 뽑기 (셔플)
export async function drawRandomCards(count: number = 9): Promise<DrawnCard[]> {
  const allCards = await loadAllCardsMeta();

  // 셔플
  const shuffled = [...allCards].sort(() => Math.random() - 0.5);
  const drawn = shuffled.slice(0, count);

  // 역방향 여부 랜덤 결정 (30% 확률)
  return drawn.map((card, index) => ({
    card,
    position: SPREAD_POSITIONS[index],
    isReversed: Math.random() < 0.3,
    isFlipped: false,
  }));
}

// 카드 해석용 컨텍스트 생성
export async function getCardContext(cardId: number, positionIndex: number): Promise<string> {
  const meta = await loadCardMeta(cardId);
  const interpretation = await loadCardInterpretation(cardId);
  const position = SPREAD_POSITIONS[positionIndex];

  if (!meta) return '';

  const objectsText = meta.objects.map(o =>
    `- ${o.traditional} → ${o.cafelua}: ${o.meaning}`
  ).join('\n');

  return `
## 현재 카드: ${meta.nameKr} (${meta.nameEn})

### 포지션: ${position.nameKr}
${position.description}

### 키워드
${meta.keywords.join(', ')}

### 카페루아 오브제
${objectsText}

### 정방향 의미
${meta.upright.join('\n- ')}

### 역방향 의미
${meta.reversed.join('\n- ')}

---
${interpretation || ''}
`.trim();
}
