import { NextRequest, NextResponse } from 'next/server';
import { FieldValue, Timestamp } from 'firebase-admin/firestore';
import { getAdminDb } from '@/lib/firebase-admin';
import { hashPassword, checkRateLimit, getClientIp } from '@/lib/server-utils';

const COLLECTION = 'guestbook';

/** GET /api/guestbook/entries?limit=20&after=<ISO timestamp> */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const limitCount = Math.min(Number(searchParams.get('limit')) || 20, 50);
        const afterParam = searchParams.get('after');

        const db = getAdminDb();
        let q = db.collection(COLLECTION).orderBy('createdAt', 'desc');

        if (afterParam) {
            const afterDate = new Date(afterParam);
            if (!isNaN(afterDate.getTime())) {
                q = q.startAfter(Timestamp.fromDate(afterDate));
            }
        }

        const snapshot = await q.limit(limitCount).get();

        const entries = snapshot.docs.map((d) => {
            const data = d.data();
            const ts = data.createdAt as Timestamp | null;
            return {
                id: d.id,
                nickname: data.nickname ?? '',
                message: data.isSecret ? '' : (data.message ?? ''),
                isSecret: data.isSecret ?? false,
                createdAt: ts?.toDate().toISOString() ?? null,
            };
        });

        const lastEntry = entries.length > 0 ? entries[entries.length - 1] : null;

        return NextResponse.json({
            entries,
            lastCursor: lastEntry?.createdAt ?? null,
        });
    } catch (err) {
        console.error('[guestbook/entries GET]', err);
        return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
}

/** POST /api/guestbook/entries — create a new entry */
export async function POST(request: NextRequest) {
    const ip = getClientIp(request);
    if (!checkRateLimit(`create:${ip}`, 2, 30_000)) {
        return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    try {
        const { nickname, message, password, isSecret } = (await request.json()) as {
            nickname?: string;
            message?: string;
            password?: string;
            isSecret?: boolean;
        };

        // Validate
        const trimNick = nickname?.trim();
        const trimMsg = message?.trim();
        const trimPass = password?.trim();

        if (!trimNick || trimNick.length > 20) {
            return NextResponse.json({ error: 'Invalid nickname' }, { status: 400 });
        }
        if (!trimMsg || trimMsg.length > 500) {
            return NextResponse.json({ error: 'Invalid message' }, { status: 400 });
        }
        if (!trimPass || trimPass.length < 6 || trimPass.length > 20) {
            return NextResponse.json({ error: 'Invalid password' }, { status: 400 });
        }

        const passwordHash = hashPassword(trimPass);

        const db = getAdminDb();
        const docRef = await db.collection(COLLECTION).add({
            nickname: trimNick,
            message: trimMsg,
            passwordHash,
            isSecret: isSecret ?? false,
            createdAt: FieldValue.serverTimestamp(),
        });

        return NextResponse.json({ id: docRef.id });
    } catch (err) {
        console.error('[guestbook/entries POST]', err);
        return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
}
