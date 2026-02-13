import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase-admin';
import { hashPassword, safeCompare, isAdmin, checkRateLimit, getClientIp } from '@/lib/server-utils';

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

        if (!id) {
            return NextResponse.json({ error: 'Missing id' }, { status: 400 });
        }

        const db = getAdminDb();
        const docRef = db.collection('guestbook').doc(id);

        // 1. Master key (timing-safe)
        const masterKey = process.env.GUESTBOOK_MASTER_KEY;
        if (masterKey && password && safeCompare(password, masterKey)) {
            await docRef.delete();
            return NextResponse.json({ success: true });
        }

        // 2. Admin credentials (timing-safe)
        if (adminNickname && adminPassword && isAdmin(adminNickname, adminPassword)) {
            await docRef.delete();
            return NextResponse.json({ success: true });
        }

        // 3. Regular password — hash and compare server-side
        if (password) {
            const pwHash = hashPassword(password);
            const docSnap = await docRef.get();
            if (docSnap.exists && docSnap.data()?.passwordHash === pwHash) {
                await docRef.delete();
                return NextResponse.json({ success: true });
            }
        }

        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    } catch (err) {
        console.error('[guestbook DELETE]', err);
        return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
}
