export interface ChatMessage {
    role: 'user' | 'model';
    content: string;
}

export const DEFAULT_MODEL = 'gemini-2.5-flash';
export const DEFAULT_MAX_TOKENS = 4096;

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
    const apiKey = process.env.GEMINI_TOKEN;
    if (!apiKey) {
        throw new GeminiApiError('Gemini API key is not configured', 500);
    }

    const model = options.model || DEFAULT_MODEL;
    const maxOutputTokens = options.maxOutputTokens || DEFAULT_MAX_TOKENS;
    const temperature = options.temperature ?? 0.8;

    const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-goog-api-key': apiKey,
            },
            body: JSON.stringify({
                systemInstruction: { parts: [{ text: systemPrompt }] },
                contents,
                generationConfig: { maxOutputTokens, temperature },
            }),
        }
    );

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Gemini API error:', errorData);
        throw new GeminiApiError(`API request failed: ${response.status}`, response.status);
    }

    const data = await response.json();
    const finishReason = data.candidates?.[0]?.finishReason;
    if (finishReason === 'MAX_TOKENS') {
        console.warn('[Gemini] Response truncated by maxOutputTokens. finishReason:', finishReason);
    }
    console.log('[Gemini] finishReason:', finishReason);

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
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
