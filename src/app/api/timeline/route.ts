import { NextRequest, NextResponse } from 'next/server';
import { listGuestbookEntries, listRecentComments } from '@/lib/guest-store';

export const revalidate = 60;

type Item = {
    kind: 'guestbook' | 'comment';
    id: string;
    nickname: string;
    text: string;
    createdAt: string | null;
    href: string;
    where: string;
    isOwner: boolean;
};

/** Remove the date prefix a migrated slug carries and space out the hyphens. */
function titleFromSlug(slug: string): string {
    return slug.replace(/^\d{8}-/, '').replace(/-/g, ' ');
}

/**
 * GET /api/timeline?limit=20
 *
 * The guestbook and every post's comments in one stream, newest first — what
 * the front door's timeline panel shows. Nothing private goes out: a secret
 * guestbook entry is listed by its author and time with its text withheld, and
 * a deleted one is left out entirely.
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const limit = Math.min(Number(searchParams.get('limit')) || 20, 50);

        const [entries, comments] = await Promise.all([
            listGuestbookEntries(limit, null),
            listRecentComments(limit),
        ]);

        const items: Item[] = [];

        for (const entry of entries) {
            if (entry.deleted) continue;
            items.push({
                kind: 'guestbook',
                id: entry.id,
                nickname: entry.nickname,
                text: entry.isSecret ? '' : entry.message,
                createdAt: entry.createdAt?.toISOString() ?? null,
                href: '/guestbook',
                where: '방명록',
                isOwner: entry.isOwner,
            });
        }

        for (const comment of comments) {
            if (comment.deleted) continue;
            const path = comment.postType === 'desk'
                ? `/desk/${comment.postSlug}`
                : `/gallery/diary/${comment.postSlug}`;
            items.push({
                kind: 'comment',
                id: comment.id,
                nickname: comment.nickname,
                text: comment.content,
                createdAt: comment.createdAt?.toISOString() ?? null,
                href: path,
                where: titleFromSlug(comment.postSlug),
                isOwner: comment.isOwner,
            });
        }

        items.sort((a, b) => {
            const left = a.createdAt ? Date.parse(a.createdAt) : 0;
            const right = b.createdAt ? Date.parse(b.createdAt) : 0;
            return right - left;
        });

        return NextResponse.json({ items: items.slice(0, limit) });
    } catch (err) {
        console.error('[timeline GET]', err);
        return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
}
