import { NextRequest, NextResponse } from 'next/server';
import {
    addGuestbookEntry,
    listGuestbookEntries,
    readGuestbookEntry,
} from '@/lib/guest-store';
import { hashPassword, checkRateLimit, getClientIp } from '@/lib/server-utils';
import { sendEmail, buildGuestbookReplyNotificationEmail, buildOwnerNotificationEmail, ownerAddress } from '@/lib/email';

const ENTRY_ID_RE = /^[a-zA-Z0-9]{10,30}$/;

/** GET /api/guestbook/entries?limit=20&after=<ISO timestamp> */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const limitCount = Math.min(Number(searchParams.get('limit')) || 20, 50);
        const afterParam = searchParams.get('after');

        let after: Date | null = null;
        if (afterParam) {
            const parsed = new Date(afterParam);
            if (!isNaN(parsed.getTime())) after = parsed;
        }

        const records = await listGuestbookEntries(limitCount, after);

        const entries = records.map((entry) => ({
            id: entry.id,
            nickname: entry.nickname,
            message: entry.deleted ? '' : (entry.isSecret ? '' : entry.message),
            isSecret: entry.isSecret,
            createdAt: entry.createdAt?.toISOString() ?? null,
            parentId: entry.parentId,
            deleted: entry.deleted,
        }));

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

        // If reply, verify parent exists and enforce 1-level nesting
        let parent = null;
        if (parentId) {
            if (!ENTRY_ID_RE.test(parentId)) {
                return NextResponse.json({ error: 'Invalid parentId' }, { status: 400 });
            }
            parent = await readGuestbookEntry(parentId);
            if (!parent || parent.deleted) {
                return NextResponse.json({ error: 'Parent entry not found' }, { status: 404 });
            }
            if (parent.parentId) {
                return NextResponse.json({ error: 'Cannot reply to a reply' }, { status: 400 });
            }
        }

        const id = await addGuestbookEntry({
            nickname: trimNick,
            message: trimMsg,
            passwordHash: hashPassword(trimPass),
            isSecret: isSecret ?? false,
            parentId: parentId || null,
            email: trimEmail,
        });

        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.cafelua.com';
        const guestbookUrl = `${baseUrl}/ko/guestbook`;

        // Send reply notification email (fire and forget)
        if (parent?.email) {
            const emailData = buildGuestbookReplyNotificationEmail({
                parentNickname: parent.nickname,
                replyNickname: trimNick,
                replyContent: trimMsg,
                guestbookUrl,
            });
            sendEmail({ to: parent.email, ...emailData }).catch(() => {});
        }

        // And the master's own copy, for every entry — not only replies.
        // A secret entry is announced without its text.
        sendEmail({
            to: ownerAddress(),
            ...buildOwnerNotificationEmail({
                kind: 'guestbook',
                isReply: Boolean(parentId),
                nickname: trimNick,
                content: isSecret ? '(비밀글입니다)' : trimMsg,
                where: '방명록',
                url: guestbookUrl,
            }),
        }).catch(() => {});

        return NextResponse.json({ id });
    } catch (err) {
        console.error('[guestbook/entries POST]', err);
        return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
}
