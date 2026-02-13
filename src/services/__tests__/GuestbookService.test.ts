/**
 * GuestbookService unit tests
 * All Firestore access is now via server API — test fetch calls only.
 */

global.fetch = jest.fn();

import { getEntries, addEntry, deleteEntry, adminDeleteEntry, getSecretMessages } from '../GuestbookService';

beforeEach(() => {
    jest.clearAllMocks();
});

describe('GuestbookService', () => {
    describe('getEntries', () => {
        it('should call entries API with limit', async () => {
            const mockEntries = [
                { id: 'doc1', nickname: 'test', message: 'hello', isSecret: false, createdAt: '2026-02-13T12:00:00Z' },
            ];
            (global.fetch as jest.Mock).mockResolvedValue({
                ok: true,
                json: async () => ({ entries: mockEntries, lastCursor: '2026-02-13T12:00:00Z' }),
            });

            const result = await getEntries(10);

            expect(global.fetch).toHaveBeenCalledWith('/api/guestbook/entries?limit=10');
            expect(result.entries).toHaveLength(1);
            expect(result.entries[0].id).toBe('doc1');
            expect(result.lastCursor).toBe('2026-02-13T12:00:00Z');
        });

        it('should pass cursor for pagination', async () => {
            (global.fetch as jest.Mock).mockResolvedValue({
                ok: true,
                json: async () => ({ entries: [], lastCursor: null }),
            });

            await getEntries(20, '2026-02-13T10:00:00Z');

            expect(global.fetch).toHaveBeenCalledWith(
                '/api/guestbook/entries?limit=20&after=2026-02-13T10%3A00%3A00Z'
            );
        });

        it('should throw on API error', async () => {
            (global.fetch as jest.Mock).mockResolvedValue({ ok: false });

            await expect(getEntries()).rejects.toThrow('Failed to load entries');
        });
    });

    describe('addEntry', () => {
        it('should call entries POST API', async () => {
            (global.fetch as jest.Mock).mockResolvedValue({
                ok: true,
                json: async () => ({ id: 'new-doc' }),
            });

            const result = await addEntry('testUser', 'hello', 'pass12', false);

            expect(global.fetch).toHaveBeenCalledWith('/api/guestbook/entries', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nickname: 'testUser', message: 'hello', password: 'pass12', isSecret: false }),
            });
            expect(result.id).toBe('new-doc');
        });

        it('should throw rate_limited on 429', async () => {
            (global.fetch as jest.Mock).mockResolvedValue({ ok: false, status: 429 });

            await expect(addEntry('u', 'm', 'pass12', false)).rejects.toThrow('rate_limited');
        });

        it('should throw on other errors', async () => {
            (global.fetch as jest.Mock).mockResolvedValue({ ok: false, status: 500 });

            await expect(addEntry('u', 'm', 'pass12', false)).rejects.toThrow('Failed to add entry');
        });
    });

    describe('deleteEntry', () => {
        it('should call DELETE API with password', async () => {
            (global.fetch as jest.Mock).mockResolvedValue({ ok: true });

            const result = await deleteEntry('doc1', 'mypass1');

            expect(global.fetch).toHaveBeenCalledWith('/api/guestbook', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: 'doc1', password: 'mypass1' }),
            });
            expect(result).toBe(true);
        });

        it('should return false when server rejects', async () => {
            (global.fetch as jest.Mock).mockResolvedValue({ ok: false });

            expect(await deleteEntry('doc1', 'wrong')).toBe(false);
        });
    });

    describe('adminDeleteEntry', () => {
        it('should call DELETE API with admin credentials', async () => {
            (global.fetch as jest.Mock).mockResolvedValue({ ok: true });

            const result = await adminDeleteEntry('doc1', 'luke', 'adminpass');

            expect(global.fetch).toHaveBeenCalledWith('/api/guestbook', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: 'doc1', adminNickname: 'luke', adminPassword: 'adminpass' }),
            });
            expect(result).toBe(true);
        });
    });

    describe('getSecretMessages', () => {
        it('should call secrets API and return result', async () => {
            const mockResponse = { isAdmin: false, secrets: { doc1: 'secret msg' } };
            (global.fetch as jest.Mock).mockResolvedValue({
                ok: true,
                json: async () => mockResponse,
            });

            const result = await getSecretMessages('user1', 'pass12');

            expect(global.fetch).toHaveBeenCalledWith('/api/guestbook/secrets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nickname: 'user1', password: 'pass12' }),
            });
            expect(result).toEqual(mockResponse);
        });

        it('should throw on API error', async () => {
            (global.fetch as jest.Mock).mockResolvedValue({ ok: false });

            await expect(getSecretMessages('u', 'p')).rejects.toThrow('Failed to fetch secrets');
        });
    });
});
