import { callGemini, DEFAULT_MODEL, GeminiApiError } from './gemini';

describe('callGemini', () => {
    const originalApiKey = process.env.GEMINI_API_KEY;
    const originalFetch = global.fetch;

    afterEach(() => {
        jest.restoreAllMocks();
        if (originalApiKey === undefined) {
            delete process.env.GEMINI_API_KEY;
        } else {
            process.env.GEMINI_API_KEY = originalApiKey;
        }
        global.fetch = originalFetch;
    });

    it('fails closed when the Gemini API key is missing', async () => {
        delete process.env.GEMINI_API_KEY;

        await expect(callGemini('system', [])).rejects.toEqual(
            expect.objectContaining<Partial<GeminiApiError>>({ status: 500 })
        );
    });

    it('calls the platform-independent Gemini OpenAI endpoint', async () => {
        process.env.GEMINI_API_KEY = 'test-key';
        const fetchMock = jest.fn().mockResolvedValue({
            ok: true,
            json: async () => ({
                choices: [{ finish_reason: 'stop', message: { content: 'hello' } }]
            })
        });
        global.fetch = fetchMock as typeof fetch;

        await expect(callGemini('system', [{ role: 'user', parts: [{ text: 'hi' }] }]))
            .resolves.toEqual({ text: 'hello', finishReason: 'stop' });

        expect(fetchMock).toHaveBeenCalledWith(
            'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions',
            expect.objectContaining({
                method: 'POST',
                headers: expect.objectContaining({ Authorization: 'Bearer test-key' })
            })
        );
        const request = fetchMock.mock.calls[0][1];
        expect(JSON.parse(String(request?.body))).toEqual(expect.objectContaining({ model: DEFAULT_MODEL }));
    });

    it('normalizes legacy Vercel AI Gateway model IDs', async () => {
        process.env.GEMINI_API_KEY = 'test-key';
        const fetchMock = jest.fn().mockResolvedValue({
            ok: true,
            json: async () => ({
                choices: [{ finish_reason: 'stop', message: { content: 'hello' } }]
            })
        });
        global.fetch = fetchMock as typeof fetch;

        await callGemini('system', [], { model: 'google/gemini-3.1-flash-lite' });

        const request = fetchMock.mock.calls[0][1];
        expect(JSON.parse(String(request?.body))).toEqual(expect.objectContaining({
            model: 'gemini-3.1-flash-lite'
        }));
    });
});
