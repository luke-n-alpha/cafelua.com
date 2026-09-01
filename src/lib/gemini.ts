export interface ChatMessage {
    role: 'user' | 'model';
    content: string;
}

// 안정 모델 코드. 특정 배포 플랫폼에 종속되지 않는다.
export const DEFAULT_MODEL = 'gemini-3.1-flash-lite';
export const DEFAULT_MAX_TOKENS = 4096;

// 구글의 OpenAI 호환 엔드포인트. 나이아 게이트웨이가 없을 때만 쓴다.
const GOOGLE_URL = 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions';

/**
 * 어디에 물어볼지 정한다.
 *
 * 카페루아는 나이아 게이트웨이를 거쳐 모델을 부른다. 게이트웨이가
 * OpenAI 호환이라 요청 모양은 그대로이고, 모델 이름만 바꾸면 제미나이든
 * 딥시크든 같은 자리에서 답한다. 그래서 이 파일은 제미나이 전용이 아니다.
 *
 * NAIA_KEY 가 없는 곳(로컬에서 게이트웨이 없이 띄울 때)에서는 구글
 * 엔드포인트로 직접 간다. 둘 다 없으면 부르지 않고 멈춘다 — 조용히
 * 넘어가면 화면에는 알파가 대답을 못 하는 이유가 남지 않는다.
 */
function resolveEndpoint(): { url: string; apiKey: string; via: string } {
    const naiaKey = process.env.NAIA_KEY;
    if (naiaKey) {
        const base = (process.env.NAIA_BASE_URL || 'https://api.nextain.io/v1').replace(/\/+$/, '');
        return { url: `${base}/chat/completions`, apiKey: naiaKey, via: 'naia' };
    }
    const geminiKey = process.env.GEMINI_API_KEY;
    if (geminiKey) {
        return { url: GOOGLE_URL, apiKey: geminiKey, via: 'google' };
    }
    throw new GeminiApiError(
        'Model credentials are not configured. Set NAIA_KEY (and NAIA_BASE_URL), or GEMINI_API_KEY.',
        500,
    );
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
    const { url, apiKey, via } = resolveEndpoint();

    // Vercel AI Gateway used provider-prefixed model IDs (for example,
    // `google/gemini-*`). Neither the naia gateway nor Google's
    // OpenAI-compatible endpoint wants that prefix.
    const model = (options.model || DEFAULT_MODEL).replace(/^google\//, '');
    const maxOutputTokens = options.maxOutputTokens || DEFAULT_MAX_TOKENS;
    const temperature = options.temperature ?? 0.8;

    const response = await fetch(url, {
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
        // Which gateway and which model, or the next person reads "401" and has
        // no idea whose key was refused.
        console.error(`[chat] ${via} gateway refused model ${model}:`, response.status, errorData);
        throw new GeminiApiError(`API request failed: ${response.status}`, response.status);
    }

    const data = await response.json();
    const finishReason = data.choices?.[0]?.finish_reason;
    if (finishReason === 'length') {
        console.warn('[chat] Response truncated by max_tokens. finishReason:', finishReason);
    }
    console.log(`[chat] via=${via} model=${model} finishReason=${finishReason}`);

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
