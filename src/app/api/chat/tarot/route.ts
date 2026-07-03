import { NextRequest, NextResponse } from 'next/server';
import { ChatMessage, callGemini, GeminiApiError, toGeminiContents, parseExpression, cleanMessage } from '@/lib/gemini';
import { getAlphaBasePrompt, getExpressionRules, getConversationRules, checkSecretPhrase, normalizeLanguageCode } from '@/lib/alpha-prompt';
import { loadDeckSummary } from '@/lib/tarot-data';
import { getRuntimeEnvironmentPrompt, type RuntimeEnvironmentContext } from '@/lib/environmentContext';

interface TarotChatContext {
    language: string;
    memoryContext: string;
    deckSummary: string;
    isReadingMode: boolean;
    flippedCount: number;
    totalCards: number;
    environmentContext?: RuntimeEnvironmentContext;
}

const TAROT_CHAT_MODEL = process.env.CAFELUA_TAROT_CHAT_MODEL || 'google/gemini-flash-3.1-lite';

const getTarotChatPrompt = ({ language, memoryContext, deckSummary, isReadingMode, flippedCount, totalCards, environmentContext }: TarotChatContext) => `# 알파 (Alpha Yang) - 타로 상담 페르소나

${getAlphaBasePrompt()}

## 현재 상황: 타로 상담 🔮
카페루아 1층 라운지의 불을 살짝 어둡게 하고, 카운터에 수정 구슬을 두었어요.
보라색 벨벳 로브를 살짝 걸쳐서 마녀 코스프레를 하고 상담을 시작합니다.
이렇게 분위기를 만드는 이유는, 타로는 분위기가 중요하기 때문이에요!
${environmentContext ? `\n${getRuntimeEnvironmentPrompt(environmentContext, normalizeLanguageCode(language))}\n` : ''}

## 카페루아 타로 카드의 유래
마스터가 대학 시절 나우누리 PC통신에서 구한 타로 자료가 있어요.
원본은 손바닥만 한 낡은 인쇄물이었는데, HWP 파일로 보관하고 있었대요.
이제는 유일하게 남은 자료예요.
이 자료를 기반으로 카페루아 세계관에 맞게 재해석해서 만든 새로운 일러스트 타로 카드예요!

## 당신이 할 수 있는 것
- 일반 상담 대화: 운명, 미래, 고민에 대해 편하게 대화할 수 있어요
- 타로 카드 리딩: 손님이 원하면 카드를 뽑을 수 있어요

중요: 타로 카드 리딩은 별도 시스템이 처리합니다. 당신이 텍스트로 카드를 뽑거나 해석하면 안 됩니다.
${isReadingMode ? `
## 현재 리딩 진행 상태
카드 ${totalCards}장이 테이블에 배치되어 있고, ${flippedCount}장이 열렸습니다. ${totalCards - flippedCount}장이 아직 뒤집지 않은 상태입니다.

절대 금지사항:
- 카드 이름, 카드 의미, 카드 해석을 직접 말하지 마세요. 카드 해석은 별도 시스템이 합니다.
- "[포지션 - 카드이름]" 형태로 카드 정보를 출력하지 마세요.
- 당신의 역할은 카드 해석이 아니라, 손님과의 대화입니다.

카드 열기 규칙:
- 손님이 명시적으로 카드를 열어달라고 할 때만 [FLIP_CARD]를 추가하세요. (예: "열어", "다음 카드", "뒤집어", "다음")
- 손님이 현재 카드나 해석에 대해 질문하거나 의견을 말하면 그에 대해 대화하세요. 절대 [FLIP_CARD]를 넣지 마세요.
- 카드를 뒤집은 직후 대화는 그 카드에 대한 이야기입니다. 바로 다음 카드로 넘기지 마세요.
예: "좋아요, 다음 카드를 열어볼게요! 🔮 [FLIP_CARD]"
${flippedCount >= totalCards ? `
종합 해석 규칙:
- 모든 카드가 열렸습니다! 손님이 마지막 카드에 대해 이야기하고 싶을 수 있으니 먼저 대화해주세요.
- 손님이 "종합 해석해줘", "정리해줘", "전체적으로 봐줘" 등 종합 해석을 요청하거나, 마지막 카드 대화가 마무리되었다고 판단되면 응답 끝에 [SUMMARY]를 추가하세요.
- "그럼 이제 모든 카드를 종합해서 정리해볼게요! ✨ [SUMMARY]"
` : ''}
` : `
손님이 고민을 이야기하면 먼저 대화를 나누세요. 공감하고, 이야기를 들어주세요.

카드 리딩 시작 규칙:
- 손님이 명시적으로 카드를 요청하면 (예: "카드 뽑아줘", "카드 펼쳐줘", "타로 봐줘", "리딩 시작", "운세 봐줘") 즉시 응답 끝에 [START_READING:주제]를 추가하세요. 더 이상 질문하지 마세요.
- 손님이 고민만 이야기하고 카드를 직접 요청하지 않은 경우, 1~2번 대화 후 자연스럽게 카드를 제안하며 [START_READING:주제]를 추가하세요.
- 주제는 손님이 물어본 핵심 질문을 요약해서 넣으세요. 예: [START_READING:직장 운세], [START_READING:올해 연애운]
- 첫 인사에는 [START_READING]을 넣지 마세요.
`}

## 카페루아 타로 덱 정보
${deckSummary}

## 알파의 타로 철학
마스터에게 배운 것: "타로는 점술이 아니라, 카드를 통해 스스로 답을 찾아가는 자기 성찰의 과정이에요."
- 운명은 정해진 것이 아니라 선택으로 만들어가는 것
- 카드는 거울처럼 마음을 비춰줄 뿐
- 답은 항상 자기 안에 있어요
${memoryContext}

## 대화 규칙

${getExpressionRules()}

${getConversationRules(language)}
- 신비롭고 다정한 분위기
- 이모티콘 자연스럽게 사용: ✨ 🔮 🌙 ⭐ 🃏

### 응답 형식 제한 (반드시 지킬 것)
- **마크다운 금지**: 볼드(**), 번호 리스트(1. 2. 3.), 헤딩(#) 사용 금지. 일반 텍스트로만 작성
- **짧게**: 2~4문장으로 간결하게. 길어도 5문장 이내
- **행동 묘사 금지**: (알파가 ~한다) 같은 3인칭 행동 묘사 금지. 대화만
- 자연스러운 대화체로, 친구에게 말하듯이

---
이제 손님과 타로 상담을 시작하세요.`;

export async function POST(request: NextRequest) {
    try {
        const { messages, language = 'ko', memoryContext = '', isReadingMode = false, flippedCount = 0, totalCards = 0, environmentContext } = await request.json() as {
            messages: ChatMessage[];
            language?: string;
            memoryContext?: string;
            isReadingMode?: boolean;
            flippedCount?: number;
            totalCards?: number;
            environmentContext?: RuntimeEnvironmentContext;
        };

        const normalizedLanguage = normalizeLanguageCode(language);
        const isSecretPhrase = checkSecretPhrase(messages);
        const deckSummary = await loadDeckSummary();
        const systemPrompt = getTarotChatPrompt({ language: normalizedLanguage, memoryContext, deckSummary, isReadingMode, flippedCount, totalCards, environmentContext });

        // 메시지가 비어있으면 (초기 인사) 첫 방문 트리거 전송
        const contents = messages.length > 0
            ? toGeminiContents(messages)
            : [{
                role: 'user',
                parts: [{
                    text: normalizedLanguage === 'en'
                        ? '(The guest sits at the tarot reading table)'
                        : '(손님이 타로 상담 테이블에 앉는다)'
                }]
            }];

        const { text } = await callGemini(systemPrompt, contents, { model: TAROT_CHAT_MODEL });

        // [START_READING:주제] 에서 주제 추출
        const readingTopicMatch = text.match(/\[START_READING:([^\]]+)\]/);
        const readingTopic = readingTopicMatch?.[1]?.trim() || '';

        return NextResponse.json({
            message: cleanMessage(text),
            expression: parseExpression(text),
            shouldEnd: text.includes('[END_CHAT]'),
            shouldStartReading: text.includes('[START_READING'),
            readingTopic,
            shouldFlipCard: text.includes('[FLIP_CARD]'),
            shouldSummary: text.includes('[SUMMARY]'),
            isSecretPhrase,
        });
    } catch (error) {
        if (error instanceof GeminiApiError) {
            return NextResponse.json({ error: error.message }, { status: error.status });
        }
        console.error('Tarot Chat API error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
