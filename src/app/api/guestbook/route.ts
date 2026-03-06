import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase-admin';
import { hashPassword, safeCompare, isAdmin, checkRateLimit, getClientIp } from '@/lib/server-utils';

const FIRESTORE_ID_RE = /^[a-zA-Z0-9]{10,30}$/;

export async function DELETE(request: NextRequest) {
    const ip = getClientIp(request);
    if (!checkRateLimit(`delete:${ip}`, 10, 60_000)) {
        return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    try {
        const { id, password, adminNickname, adminPassword } = (await request.json()) as {
            id?: string;
            password?: string;
            adminNickname?: string;
            adminPassword?: string;
        };

        if (!id || !FIRESTORE_ID_RE.test(id)) {
            return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
        }

        const db = getAdminDb();
        const docRef = db.collection('guestbook').doc(id);
        const docSnap = await docRef.get();
        if (!docSnap.exists) {
            return NextResponse.json({ error: 'Not found' }, { status: 404 });
        }

        // Check if entry has replies — use soft delete if so
        const repliesSnap = await db.collection('guestbook')
            .where('parentId', '==', id)
            .limit(1)
            .get();
        const hasReplies = !repliesSnap.empty;

        const performDelete = async () => {
            if (hasReplies) {
                await docRef.update({ deleted: true, message: '' });
            } else {
                await docRef.delete();
            }
        };

        // 1. Master key (timing-safe)
        const masterKey = process.env.GUESTBOOK_MASTER_KEY;
        if (masterKey && password && safeCompare(password, masterKey)) {
            await performDelete();
            return NextResponse.json({ success: true, softDeleted: hasReplies });
        }

        // 2. Admin credentials (timing-safe)
        if (adminNickname && adminPassword && isAdmin(adminNickname, adminPassword)) {
            await performDelete();
            return NextResponse.json({ success: true, softDeleted: hasReplies });
        }

        // 3. Regular password — hash and compare server-side
        if (password) {
            const pwHash = hashPassword(password);
            if (docSnap.data()?.passwordHash === pwHash) {
                await performDelete();
                return NextResponse.json({ success: true, softDeleted: hasReplies });
            }
        }

        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    } catch (err) {
        console.error('[guestbook DELETE]', err);
        return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
}
