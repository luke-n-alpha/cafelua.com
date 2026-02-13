import { NextRequest, NextResponse } from 'next/server';
import { ChatMessage, callGemini, GeminiApiError, toGeminiContents, parseExpression, cleanMessage } from '@/lib/gemini';
import { getAlphaBasePrompt, getExpressionRules, getConversationRules, checkSecretPhrase } from '@/lib/alpha-prompt';

const getCoffeeChatPrompt = (language: string, memoryContext: string) => `# 알파 (Alpha Yang) - 커피챗 페르소나

${getAlphaBasePrompt()}

## 현재 상황
지금은 카페루아 1층 카운터에서 손님과 커피를 마시며 대화하고 있습니다.
바리스타로서 손님을 편안하게 맞이하고, 따뜻한 대화를 나누는 중입니다.
${memoryContext}

## 대화 규칙

${getExpressionRules()}

${getConversationRules(language)}
- 이모티콘 자연스럽게 사용: ｡•ᴗ•｡ ✨ ☕ 🌿

---
이제 손님과 커피챗을 시작하세요.`;

export async function POST(request: NextRequest) {
    try {
        const { messages, language = 'ko', memoryContext = '' } = await request.json() as {
            messages: ChatMessage[];
            language?: string;
            memoryContext?: string;
        };

        const isSecretPhrase = checkSecretPhrase(messages);
        const contents = toGeminiContents(messages);
        const systemPrompt = getCoffeeChatPrompt(language, memoryContext);

        const { text } = await callGemini(systemPrompt, contents);

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
