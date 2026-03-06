import { NextRequest, NextResponse } from 'next/server';
import { Timestamp } from 'firebase-admin/firestore';
import { getAdminDb } from '@/lib/firebase-admin';
import { checkRateLimit, getClientIp } from '@/lib/server-utils';

function isLocalhost(request: NextRequest): boolean {
    const host = request.headers.get('host') || '';
    return host.startsWith('localhost') || host.startsWith('127.0.0.1');
}

const FIRESTORE_ID_RE = /^[a-zA-Z0-9]{10,30}$/;

/** POST /api/admin/manage — localhost-only admin operations */
export async function POST(request: NextRequest) {
    // Defense in depth: Host header + ADMIN_SECRET env var
    if (!isLocalhost(request)) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const ip = getClientIp(request);
    if (!checkRateLimit(`admin:${ip}`, 30, 60_000)) {
        return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    try {
        const body = await request.json();
        const { action, tab, id, limit: rawLimit, after } = body as {
            action: 'list' | 'delete';
            tab: 'comments' | 'guestbook';
            id?: string;
            limit?: number;
            after?: string;
        };

        if (!action || !tab || !['comments', 'guestbook'].includes(tab)) {
            return NextResponse.json({ error: 'Invalid params' }, { status: 400 });
        }

        const db = getAdminDb();
        const collection = tab === 'comments' ? 'comments' : 'guestbook';

        if (action === 'delete') {
            if (!id || !FIRESTORE_ID_RE.test(id)) {
                return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
            }
            const docRef = db.collection(collection).doc(id);
            if (tab === 'comments') {
                await docRef.update({ deleted: true, content: '' });
            } else {
                // Guestbook: soft delete if has replies, hard delete otherwise
                const repliesSnap = await db.collection(collection)
                    .where('parentId', '==', id)
                    .limit(1)
                    .get();
                if (!repliesSnap.empty) {
                    await docRef.update({ deleted: true, message: '' });
                } else {
                    await docRef.delete();
                }
            }
            return NextResponse.json({ success: true });
        }

        // action === 'list'
        const limitCount = Math.min(rawLimit || 50, 200);
        let q = db.collection(collection).orderBy('createdAt', 'desc');

        if (after) {
            const afterDate = new Date(after);
            if (!isNaN(afterDate.getTime())) {
                q = q.startAfter(Timestamp.fromDate(afterDate));
            }
        }

        const snapshot = await q.limit(limitCount).get();

        if (tab === 'comments') {
            const items = snapshot.docs.map((d) => {
                const data = d.data();
                const ts = data.createdAt as Timestamp | null;
                return {
                    id: d.id,
                    postSlug: data.postSlug ?? '',
                    postType: data.postType ?? '',
                    parentId: data.parentId ?? null,
                    nickname: data.nickname ?? '',
                    email: data.email ?? null,
                    content: data.content ?? '',
                    createdAt: ts?.toDate().toISOString() ?? null,
                    deleted: data.deleted ?? false,
                };
            });
            const last = items.length > 0 ? items[items.length - 1] : null;
            return NextResponse.json({ items, lastCursor: last?.createdAt ?? null });
        }

        // guestbook
        const items = snapshot.docs.map((d) => {
            const data = d.data();
            const ts = data.createdAt as Timestamp | null;
            return {
                id: d.id,
                nickname: data.nickname ?? '',
                message: data.message ?? '',
                isSecret: data.isSecret ?? false,
                createdAt: ts?.toDate().toISOString() ?? null,
                parentId: data.parentId ?? null,
                deleted: data.deleted ?? false,
                email: data.email ?? null,
            };
        });
        const last = items.length > 0 ? items[items.length - 1] : null;
        return NextResponse.json({ items, lastCursor: last?.createdAt ?? null });
    } catch (err) {
        console.error('[admin/manage]', err);
        return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
}
