export interface ChatMessage {
    role: 'user' | 'model';
    content: string;
}

// Vercel AI Gateway 모델 슬러그 (provider/model). 회사(nextain) 팀 크레딧으로 라우팅됨.
export const DEFAULT_MODEL = 'google/gemini-2.5-flash';
export const DEFAULT_MAX_TOKENS = 4096;

// Vercel AI Gateway OpenAI 호환 엔드포인트
const GATEWAY_URL = 'https://ai-gateway.vercel.sh/v1/chat/completions';

interface OpenAIMessage {
    role: string;
    content: string;
}

// 기존 Gemini native contents({role, parts}) → OpenAI 호환 messages({role, content}) 변환
function toOpenAIMessages(systemPrompt: string, contents: GeminiContent[]): OpenAIMessage[] {
    const messages: OpenAIMessage[] = [{ role: 'system', content: systemPrompt }];
    for (const c of contents) {
        messages.push({
            role: c.role === 'model' ? 'assistant' : c.role,
            content: c.parts.map(p => p.text).join(''),
        });
    }
    return messages;
}

export interface GeminiContent {
    role: string;
    parts: { text: string }[];
}

export interface CallGeminiOptions {
    model?: string;
    maxOutputTokens?: number;
    temperature?: number;
}

export interface CallGeminiResult {
    text: string;
    finishReason: string | undefined;
}

export async function callGemini(
    systemPrompt: string,
    contents: GeminiContent[],
    options: CallGeminiOptions = {}
): Promise<CallGeminiResult> {
    // Vercel AI Gateway 인증: 배포 환경은 VERCEL_OIDC_TOKEN 자동 주입,
    // 로컬/CI는 AI_GATEWAY_API_KEY fallback (`vercel env pull`로 OIDC 토큰 갱신 가능).
    const apiKey = process.env.AI_GATEWAY_API_KEY || process.env.VERCEL_OIDC_TOKEN;
    if (!apiKey) {
        throw new GeminiApiError('AI Gateway credentials are not configured', 500);
    }

    const model = options.model || DEFAULT_MODEL;
    const maxOutputTokens = options.maxOutputTokens || DEFAULT_MAX_TOKENS;
    const temperature = options.temperature ?? 0.8;

    const response = await fetch(GATEWAY_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
            model,
            messages: toOpenAIMessages(systemPrompt, contents),
            max_tokens: maxOutputTokens,
            temperature,
        }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('AI Gateway error:', errorData);
        throw new GeminiApiError(`API request failed: ${response.status}`, response.status);
    }

    const data = await response.json();
    const finishReason = data.choices?.[0]?.finish_reason;
    if (finishReason === 'length') {
        console.warn('[Gemini] Response truncated by max_tokens. finishReason:', finishReason);
    }
    console.log('[Gemini] finishReason:', finishReason);

    const text = data.choices?.[0]?.message?.content || '';
    return { text, finishReason };
}

export class GeminiApiError extends Error {
    constructor(message: string, public status: number) {
        super(message);
    }
}

export function toGeminiContents(messages: ChatMessage[]): GeminiContent[] {
    return messages.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }],
    }));
}

export function parseExpression(text: string, fallback = 'face'): string {
    // [expression:code] 형태
    const match = text.match(/\[expression:([^\]]+)\]/);
    if (match?.[1]) {
        const first = match[1].split(/[,\s]+/)[0].trim();
        return first || fallback;
    }
    // [nice-talk] 같이 expression: 없이 출력하는 경우
    const expressionCodes = ['face', 'nice-talk', 'wink-smile', 'embarrassment', 'trouble', 'disappointed', 'dissatisfaction', 'pouty-cheeks'];
    for (const code of expressionCodes) {
        if (text.includes(`[${code}]`)) return code;
    }
    return fallback;
}

export function cleanMessage(text: string): string {
    const expressionCodes = ['face', 'nice-talk', 'wink-smile', 'embarrassment', 'trouble', 'disappointed', 'dissatisfaction', 'pouty-cheeks'];
    let cleaned = text
        .replace(/\[expression:[^\]]*\]\n?/g, '')
        .replace(/\[END_CHAT\]/g, '')
        .replace(/\[START_READING(?::[^\]]*)?\]/g, '')
        .replace(/\[FLIP_CARD\]/g, '')
        .replace(/\[SUMMARY\]/g, '');
    // AI가 [nice-talk] 같이 expression: 없이 출력하는 경우 제거
    for (const code of expressionCodes) {
        cleaned = cleaned.replace(new RegExp(`\\[${code}\\]\\n?`, 'g'), '');
    }
    return cleaned.trim();
}
