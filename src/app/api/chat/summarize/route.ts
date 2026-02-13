import { NextRequest, NextResponse } from 'next/server';
import { ChatMessage, callGemini, GeminiApiError } from '@/lib/gemini';

const SUMMARIZE_PROMPT = `당신은 대화 요약 전문가입니다. 아래 대화를 분석하여 JSON 형식으로 응답해주세요.

## 추출할 정보
1. name: 손님이 밝힌 이름 (없으면 null)
2. nickname: 손님의 별명 (없으면 null)
3. interests: 손님의 관심사 배열 (없으면 빈 배열)
4. importantFacts: 손님에 대한 중요한 사실들 배열 (직업, 가족, 취미 등)
5. summary: 대화 내용 2-3문장 요약

## 응답 형식 (JSON만 출력)
{
  "name": "이름 또는 null",
  "nickname": "별명 또는 null",
  "interests": ["관심사1", "관심사2"],
  "importantFacts": ["사실1", "사실2"],
  "summary": "대화 요약"
}

## 대화 내용
`;

export async function POST(request: NextRequest) {
    try {
        let messages: ChatMessage[];

        try {
            const body = await request.json();
            messages = body.messages;
        } catch (parseErr) {
            console.error('Request parse error:', parseErr);
            return NextResponse.json(
                { error: 'Invalid request body' },
                { status: 400 }
            );
        }

        if (!messages || messages.length === 0) {
            return NextResponse.json({
                name: null,
                nickname: null,
                interests: [],
                importantFacts: [],
                summary: '대화 내용이 없습니다.',
            });
        }

        const conversationText = messages
            .map(m => `${m.role === 'user' ? '손님' : '알파'}: ${m.content}`)
            .join('\n');

        const { text } = await callGemini(
            SUMMARIZE_PROMPT + conversationText,
            [{ role: 'user', parts: [{ text: '위 대화를 분석해주세요.' }] }],
            { temperature: 0.3 }
        );

        try {
            const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) ||
                              text.match(/(\{[\s\S]*\})/);
            if (jsonMatch) {
                const parsed = JSON.parse(jsonMatch[1]);
                return NextResponse.json(parsed);
            }
        } catch (parseError) {
            console.error('JSON parse error:', parseError);
        }

        return NextResponse.json({
            name: null,
            nickname: null,
            interests: [],
            importantFacts: [],
            summary: '대화 요약을 생성하지 못했습니다.',
        });
    } catch (error) {
        if (error instanceof GeminiApiError) {
            return NextResponse.json({ error: error.message }, { status: error.status });
        }
        console.error('Summarize API error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
