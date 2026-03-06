/**
 * Guestbook service — all operations go through server API routes.
 * No direct Firestore access from client.
 */
import type { GuestbookEntry } from '@/data/gallery/guestbookData';

export async function getEntries(
    limitCount: number = 20,
    afterCursor?: string | null
): Promise<{ entries: GuestbookEntry[]; lastCursor: string | null }> {
    const params = new URLSearchParams({ limit: String(limitCount) });
    if (afterCursor) params.set('after', afterCursor);

    const res = await fetch(`/api/guestbook/entries?${params}`);
    if (!res.ok) throw new Error('Failed to load entries');
    return res.json();
}

export async function addEntry(
    nickname: string,
    message: string,
    password: string,
    isSecret: boolean = false,
    parentId?: string | null,
    email?: string,
): Promise<{ id: string }> {
    const res = await fetch('/api/guestbook/entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nickname, message, password, isSecret, parentId: parentId || null, email: email || undefined }),
    });
    if (!res.ok) {
        if (res.status === 429) throw new Error('rate_limited');
        throw new Error('Failed to add entry');
    }
    return res.json();
}

export async function deleteEntry(id: string, password: string): Promise<{ success: boolean; softDeleted?: boolean }> {
    const res = await fetch('/api/guestbook', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, password }),
    });
    if (!res.ok) return { success: false };
    return res.json();
}

export async function adminDeleteEntry(
    id: string,
    adminNickname: string,
    adminPassword: string
): Promise<{ success: boolean; softDeleted?: boolean }> {
    const res = await fetch('/api/guestbook', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, adminNickname, adminPassword }),
    });
    if (!res.ok) return { success: false };
    return res.json();
}

export async function getSecretMessages(
    nickname: string,
    password: string
): Promise<{ isAdmin: boolean; secrets: Record<string, string> }> {
    const res = await fetch('/api/guestbook/secrets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nickname, password }),
    });
    if (!res.ok) throw new Error('Failed to fetch secrets');
    return res.json();
}
