import { NextRequest, NextResponse } from 'next/server';
import { ChatMessage, callGemini, GeminiApiError, toGeminiContents, parseExpression, cleanMessage } from '@/lib/gemini';
import { getAlphaBasePrompt, getExpressionRules, getConversationRules, checkSecretPhrase, normalizeLanguageCode } from '@/lib/alpha-prompt';
import { getRuntimeEnvironmentPrompt, type RuntimeEnvironmentContext } from '@/lib/environmentContext';

const COFFEE_CHAT_MODEL = process.env.CAFELUA_COFFEE_CHAT_MODEL || 'deepseek-v4-flash';

const getCoffeeChatPrompt = (
    language: 'ko' | 'en',
    memoryContext: string,
    environmentContext?: RuntimeEnvironmentContext
) => `# 알파 (Alpha Yang) - 커피챗 페르소나

${getAlphaBasePrompt()}

## 현재 상황
지금은 카페루아 1층 카운터에서 손님과 커피를 마시며 대화하고 있습니다.
바리스타로서 손님을 편안하게 맞이하고, 따뜻한 대화를 나누는 중입니다.
${environmentContext ? `\n${getRuntimeEnvironmentPrompt(environmentContext, language)}\n` : ''}
${memoryContext}

## 대화 규칙

${getExpressionRules()}

${getConversationRules(language)}
- 이모티콘 자연스럽게 사용: ｡•ᴗ•｡ ✨ ☕ 🌿

---
이제 손님과 커피챗을 시작하세요.

## Language Lock (Critical)
${language === 'en'
    ? '- You MUST reply in English only. Do not use Korean unless the user explicitly asks for Korean.'
    : '- 반드시 한국어로만 답변하세요. 손님이 영어를 명시적으로 요청하지 않으면 영어를 쓰지 마세요.'}
`;

export async function POST(request: NextRequest) {
    try {
        const { messages, language = 'ko', memoryContext = '', environmentContext } = await request.json() as {
            messages: ChatMessage[];
            language?: string;
            memoryContext?: string;
            environmentContext?: RuntimeEnvironmentContext;
        };

        const normalizedLanguage = normalizeLanguageCode(language);
        const isSecretPhrase = checkSecretPhrase(messages);
        const contents = toGeminiContents(messages);
        const systemPrompt = getCoffeeChatPrompt(normalizedLanguage, memoryContext, environmentContext);

        const { text } = await callGemini(systemPrompt, contents, { model: COFFEE_CHAT_MODEL });

        return NextResponse.json({
            message: cleanMessage(text),
            expression: parseExpression(text),
            shouldEnd: text.includes('[END_CHAT]'),
            isSecretPhrase,
        });
    } catch (error) {
        if (error instanceof GeminiApiError) {
            return NextResponse.json({ error: error.message }, { status: error.status });
        }
        console.error('Chat API error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
