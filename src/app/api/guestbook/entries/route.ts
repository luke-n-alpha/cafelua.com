import { NextRequest, NextResponse } from 'next/server';
import { FieldValue, Timestamp } from 'firebase-admin/firestore';
import { getAdminDb } from '@/lib/firebase-admin';
import { hashPassword, checkRateLimit, getClientIp } from '@/lib/server-utils';
import { sendEmail, buildGuestbookReplyNotificationEmail } from '@/lib/email';

const COLLECTION = 'guestbook';
const FIRESTORE_ID_RE = /^[a-zA-Z0-9]{10,30}$/;

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
            const deleted = data.deleted ?? false;
            return {
                id: d.id,
                nickname: data.nickname ?? '',
                message: deleted ? '' : (data.isSecret ? '' : (data.message ?? '')),
                isSecret: data.isSecret ?? false,
                createdAt: ts?.toDate().toISOString() ?? null,
                parentId: data.parentId ?? null,
                deleted,
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

/** POST /api/guestbook/entries — create a new entry or reply */
export async function POST(request: NextRequest) {
    const ip = getClientIp(request);
    if (!checkRateLimit(`create:${ip}`, 2, 30_000)) {
        return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    try {
        const { nickname, message, password, isSecret, parentId, email } = (await request.json()) as {
            nickname?: string;
            message?: string;
            password?: string;
            isSecret?: boolean;
            parentId?: string | null;
            email?: string;
        };

        // Validate
        const trimNick = nickname?.trim();
        const trimMsg = message?.trim();
        const trimPass = password?.trim();
        const trimEmail = email?.trim() || null;

        if (!trimNick || trimNick.length > 20) {
            return NextResponse.json({ error: 'Invalid nickname' }, { status: 400 });
        }
        if (!trimMsg || trimMsg.length > 500) {
            return NextResponse.json({ error: 'Invalid message' }, { status: 400 });
        }
        if (!trimPass || trimPass.length < 6 || trimPass.length > 20) {
            return NextResponse.json({ error: 'Invalid password' }, { status: 400 });
        }
        if (trimEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimEmail)) {
            return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
        }

        const db = getAdminDb();

        // If reply, verify parent exists and enforce 1-level nesting
        let parentDoc: FirebaseFirestore.DocumentData | undefined;
        if (parentId) {
            if (!FIRESTORE_ID_RE.test(parentId)) {
                return NextResponse.json({ error: 'Invalid parentId' }, { status: 400 });
            }
            const parentSnap = await db.collection(COLLECTION).doc(parentId).get();
            if (!parentSnap.exists || parentSnap.data()?.deleted) {
                return NextResponse.json({ error: 'Parent entry not found' }, { status: 404 });
            }
            parentDoc = parentSnap.data();
            if (parentDoc?.parentId) {
                return NextResponse.json({ error: 'Cannot reply to a reply' }, { status: 400 });
            }
        }

        const passwordHash = hashPassword(trimPass);

        const docData: Record<string, unknown> = {
            nickname: trimNick,
            message: trimMsg,
            passwordHash,
            isSecret: isSecret ?? false,
            parentId: parentId || null,
            createdAt: FieldValue.serverTimestamp(),
            deleted: false,
        };
        if (trimEmail) {
            docData.email = trimEmail;
        }

        const docRef = await db.collection(COLLECTION).add(docData);

        // Send reply notification email (fire and forget)
        if (parentId && parentDoc?.email) {
            const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.cafelua.com';
            const guestbookUrl = `${baseUrl}/ko/guestbook`;
            const emailData = buildGuestbookReplyNotificationEmail({
                parentNickname: parentDoc.nickname,
                replyNickname: trimNick,
                replyContent: trimMsg,
                guestbookUrl,
            });
            sendEmail({ to: parentDoc.email, ...emailData }).catch(() => {});
        }

        return NextResponse.json({ id: docRef.id });
    } catch (err) {
        console.error('[guestbook/entries POST]', err);
        return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
}
