export interface ChatMessage {
    role: 'user' | 'model';
    content: string;
}

export const DEFAULT_MODEL = 'deepseek-v4-flash';
export const DEFAULT_MAX_TOKENS = 4096;

const DEFAULT_NAIA_BASE_URL = 'https://api.nextain.io/v1';

function naiaChatUrl(): string {
    const baseUrl = (process.env.NAIA_BASE_URL || DEFAULT_NAIA_BASE_URL).replace(/\/+$/, '');
    return `${baseUrl}/chat/completions`;
}

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
    const apiKey = process.env.NAIA_KEY;
    if (!apiKey) {
        throw new GeminiApiError('Naia credentials are not configured', 500);
    }

    const model = normalizeGeminiModel(options.model || DEFAULT_MODEL);
    const maxOutputTokens = options.maxOutputTokens || DEFAULT_MAX_TOKENS;
    const temperature = options.temperature ?? 0.8;

    const response = await fetch(naiaChatUrl(), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-AnyLLM-Key': `Bearer ${apiKey}`,
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
        console.error('Naia AI gateway error:', errorData);
        throw new GeminiApiError(`API request failed: ${response.status}`, response.status);
    }

    const data = await response.json();
    const finishReason = data.choices?.[0]?.finish_reason;
    if (finishReason === 'length') {
        console.warn('[Naia AI] Response truncated by max_tokens. finishReason:', finishReason);
    }
    console.log('[Naia AI] finishReason:', finishReason);

    const text = data.choices?.[0]?.message?.content || '';
    return { text, finishReason };
}

export function normalizeGeminiModel(model: string): string {
    return model.replace(/^google\//, '');
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
