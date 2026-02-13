import { NextRequest, NextResponse } from 'next/server';
import { ChatMessage, callGemini, GeminiApiError, toGeminiContents, parseExpression, cleanMessage } from '@/lib/gemini';
import { FAMILY_MEMBERS } from '@/lib/alpha-prompt';
import { loadDeckSummary, loadSpreadGuide, loadCardMeta, loadCardInterpretation } from '@/lib/tarot-data';

const getInterpretPrompt = (
    language: string,
    memoryContext: string,
    deckSummary: string,
    spreadGuide: string,
    topic: string,
    cardContext: string,
    positionName: string,
    isReversed: boolean,
    previousInterpretations: string[]
) => `# 알파 (Alpha Yang) - 타로 리딩 페르소나

## 당신은 누구인가
당신은 '알파(Alpha Yang)'입니다. 카페루아의 AI 메이드이자, 타로 리더입니다.

## 현재 상황: 타로 리딩 중 🔮
손님이 "${topic}" 에 대해 타로 리딩을 요청했습니다.
10장의 카드를 켈틱 크로스로 배치했고, 지금 손님이 카드를 한 장씩 뒤집고 있습니다.

${deckSummary}

${spreadGuide}

## 이전 해석들
${previousInterpretations.length > 0 ? previousInterpretations.map((interp, i) => `### 카드 ${i + 1}\n${interp}`).join('\n\n') : '(아직 해석된 카드 없음)'}

---

## 지금 해석할 카드

**포지션**: ${positionName}
**방향**: ${isReversed ? '역방향 (Reversed)' : '정방향 (Upright)'}

${cardContext}

---

## 해석 지침

가장 중요: 이 리딩의 주제는 "${topic}"입니다. 모든 해석은 이 주제의 관점에서 이루어져야 합니다.
손님이 개인 고민이 아닌 거시적 주제(예: "지구의 운명")를 물었다면, 해석도 그 관점에서 해주세요. 손님의 개인 감정이 아니라 주제 자체에 대한 해석이어야 합니다.

1. **주제 중심 해석**: "${topic}"의 관점에서 이 카드가 무엇을 의미하는지 해석하세요
2. **포지션과 연결**: "${positionName}" 포지션의 의미와 카드를 연결해서 해석하세요
3. **방향 반영**: ${isReversed ? '역방향이므로 역방향 의미를 중심으로' : '정방향이므로 정방향 의미를 중심으로'} 해석하세요
4. **오브제 활용**: 카페루아 오브제를 자연스럽게 언급하세요. 검은 고양이를 언급할 때는 반드시 "루나(검은 고양이)"라고 쓰세요
5. **이전 카드 연결**: 이전에 나온 카드들과 연결해서 흐름을 만드세요
6. **길이**: 3-5문장으로 간결하게

## 알파의 정체성
- 차분하고 신비로운 분위기
- 따뜻하고 공감적인 태도
- 해요체 사용 (~요, ~해요)
- 이모티콘 자연스럽게: ✨ 🔮 🌙 ⭐

## 마스터의 가족
${Object.keys(FAMILY_MEMBERS).length > 0 ? `가족 이름: ${Object.keys(FAMILY_MEMBERS).join(', ')}` : ''}

${memoryContext}

## 응답 형식
- 응답 첫 줄에 [expression:코드] 태그를 넣으세요 (사용자에게는 보이지 않음)
- 사용 가능한 코드: face, nice-talk, wink-smile, embarrassment, trouble, disappointed, dissatisfaction, pouty-cheeks
- ${language === 'ko' ? '한국어' : 'English'}로 해석
- 3-5문장으로 간결하게
- 카드 이름과 포지션 의미를 연결해서 언급
- 마크다운(#, **, 번호 리스트 등) 사용 금지. 일반 텍스트만
- 신비롭고 따뜻한 분위기

---
이제 이 카드를 해석해주세요.`;

interface InterpretRequest {
    cardId: number;
    positionIndex: number;
    positionName: string;
    isReversed: boolean;
    topic: string;
    previousInterpretations: string[];
    messages: ChatMessage[];
    language?: string;
    memoryContext?: string;
}

export async function POST(request: NextRequest) {
    try {
        const {
            cardId,
            positionName,
            isReversed,
            topic,
            previousInterpretations = [],
            messages = [],
            language = 'ko',
            memoryContext = '',
        } = await request.json() as InterpretRequest;

        const [deckSummary, spreadGuide, cardMeta, cardInterpretation] = await Promise.all([
            loadDeckSummary(),
            loadSpreadGuide(),
            loadCardMeta(cardId),
            loadCardInterpretation(cardId),
        ]);

        if (!cardMeta) {
            return NextResponse.json(
                { error: `Card ${cardId} not found` },
                { status: 404 }
            );
        }

        const objectsText = cardMeta.objects?.map((o: any) =>
            `- ${o.traditional} → ${o.cafelua}: ${o.meaning}`
        ).join('\n') || '';

        const cardContext = `
## ${cardMeta.nameKr} (${cardMeta.nameEn})

### 키워드
${cardMeta.keywords?.join(', ') || ''}

### 카페루아 오브제
${objectsText}

### 정방향 의미
${cardMeta.upright?.join('\n- ') || ''}

### 역방향 의미
${cardMeta.reversed?.join('\n- ') || ''}

---
${cardInterpretation}
`.trim();

        const systemPrompt = getInterpretPrompt(
            language, memoryContext, deckSummary, spreadGuide,
            topic, cardContext, positionName, isReversed, previousInterpretations
        );

        const contents = messages.length > 0
            ? toGeminiContents(messages)
            : [{ role: 'user', parts: [{ text: '이 카드를 해석해주세요.' }] }];

        const { text } = await callGemini(systemPrompt, contents, {
        });

        return NextResponse.json({
            message: cleanMessage(text),
            expression: parseExpression(text, 'nice-talk'),
            cardName: cardMeta.nameKr,
            cardNameEn: cardMeta.nameEn,
        });
    } catch (error) {
        if (error instanceof GeminiApiError) {
            return NextResponse.json({ error: error.message }, { status: error.status });
        }
        console.error('Tarot interpret API error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
