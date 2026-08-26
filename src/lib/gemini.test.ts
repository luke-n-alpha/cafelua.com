import { callGemini, normalizeGeminiModel } from './gemini';

describe('Naia AI gateway integration', () => {
    const originalKey = process.env.NAIA_KEY;
    const originalBaseUrl = process.env.NAIA_BASE_URL;

    afterEach(() => {
        if (originalKey === undefined) delete process.env.NAIA_KEY;
        else process.env.NAIA_KEY = originalKey;
        if (originalBaseUrl === undefined) delete process.env.NAIA_BASE_URL;
        else process.env.NAIA_BASE_URL = originalBaseUrl;
        jest.restoreAllMocks();
    });

    it('normalizes a legacy provider-prefixed model name', () => {
        expect(normalizeGeminiModel('google/gemini-3.1-flash-lite')).toBe('gemini-3.1-flash-lite');
    });

    it('calls the Naia gateway with the account key', async () => {
        process.env.NAIA_KEY = 'test-key';
        const fetchMock = jest.fn().mockResolvedValue({
            ok: true,
            json: async () => ({
                choices: [{ message: { content: 'hello' }, finish_reason: 'stop' }],
            }),
        });
        Object.defineProperty(global, 'fetch', { value: fetchMock, configurable: true });

        await expect(callGemini('system', [], { model: 'deepseek-v4-flash' })).resolves.toEqual({
            text: 'hello',
            finishReason: 'stop',
        });

        expect(fetchMock).toHaveBeenCalledWith(
            'https://api.nextain.io/v1/chat/completions',
            expect.objectContaining({
                headers: expect.objectContaining({ 'X-AnyLLM-Key': 'Bearer test-key' }),
                body: expect.stringContaining('"model":"deepseek-v4-flash"'),
            })
        );
    });

    it('supports a deployment-specific Naia gateway base URL', async () => {
        process.env.NAIA_KEY = 'test-key';
        process.env.NAIA_BASE_URL = 'https://gateway.example/v1/';
        const fetchMock = jest.fn().mockResolvedValue({
            ok: true,
            json: async () => ({ choices: [{ message: { content: 'ok' } }] }),
        });
        Object.defineProperty(global, 'fetch', { value: fetchMock, configurable: true });

        await callGemini('system', []);

        expect(fetchMock).toHaveBeenCalledWith(
            'https://gateway.example/v1/chat/completions',
            expect.any(Object)
        );
    });
});
