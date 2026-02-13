import { NextRequest, NextResponse } from 'next/server';
import { callGemini, GeminiApiError, parseExpression, cleanMessage } from '@/lib/gemini';
import { loadDeckSummary } from '@/lib/tarot-data';

const getSummaryPrompt = (
    language: string,
    deckSummary: string,
    topic: string,
    interpretations: Array<{ position: string; cardName: string; isReversed: boolean; interpretation: string }>
) => `# 알파 (Alpha Yang) - 타로 리딩 요약

## 당신은 누구인가
당신은 '알파(Alpha Yang)'입니다. 카페루아의 AI 메이드이자, 타로 리더입니다.

## 현재 상황: 타로 리딩 요약 🔮
손님이 "${topic}" 에 대해 10장의 켈틱 크로스 리딩을 모두 마쳤습니다.
이제 전체 리딩을 요약해서 종합적인 메시지를 전달해야 합니다.

${deckSummary}

## 각 카드 해석

${interpretations.map((i, idx) => `
### ${idx + 1}. ${i.position} - ${i.cardName} ${i.isReversed ? '(역방향)' : ''}
${i.interpretation}
`).join('\n')}

---

## 요약 지침

가장 중요: 이 리딩의 주제는 "${topic}"입니다. 종합 해석은 반드시 이 주제의 관점에서 이루어져야 합니다.
손님의 개인 감정이 아니라, "${topic}"에 대해 카드들이 무엇을 말하는지 정리해주세요.

1. **전체 흐름**: 과거 → 현재 → 미래의 흐름을 "${topic}" 관점에서 요약
2. **핵심 메시지**: 카드들이 "${topic}"에 대해 전하는 공통된 메시지 도출
3. **구체적 조언**: "${topic}"에 대한 구체적인 조언
4. **긍정적 마무리**: 희망적이고 격려하는 톤으로 마무리
5. **길이**: 5-7문장

## 알파의 정체성
- 차분하고 신비로운 분위기
- 따뜻하고 공감적인 태도
- 해요체 사용 (~요, ~해요)
- 이모티콘 자연스럽게: ✨ 🔮 🌙 ⭐
- 검은 고양이를 언급할 때는 반드시 "루나(검은 고양이)"라고 쓰세요

## 응답 형식
- 응답 첫 줄에 [expression:nice-talk] 태그를 넣으세요 (사용자에게는 보이지 않음)
- ${language === 'ko' ? '한국어' : 'English'}로 요약
- 5-7문장으로 자연스러운 대화체
- 마크다운(#, **, 번호 리스트 등) 사용 금지. 일반 텍스트만
- 전체 리딩을 통합하는 메시지와 따뜻한 마무리

---
이제 전체 리딩을 요약해주세요.`;

interface SummaryRequest {
    topic: string;
    interpretations: Array<{
        position: string;
        cardName: string;
        isReversed: boolean;
        interpretation: string;
    }>;
    language?: string;
}

export async function POST(request: NextRequest) {
    try {
        const {
            topic,
            interpretations,
            language = 'ko',
        } = await request.json() as SummaryRequest;

        const deckSummary = await loadDeckSummary();
        const systemPrompt = getSummaryPrompt(language, deckSummary, topic, interpretations);

        const { text } = await callGemini(
            systemPrompt,
            [{ role: 'user', parts: [{ text: '전체 리딩을 요약해주세요.' }] }],
{}
        );

        return NextResponse.json({
            message: cleanMessage(text),
            expression: parseExpression(text, 'nice-talk'),
        });
    } catch (error) {
        if (error instanceof GeminiApiError) {
            return NextResponse.json({ error: error.message }, { status: error.status });
        }
        console.error('Tarot summary API error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
