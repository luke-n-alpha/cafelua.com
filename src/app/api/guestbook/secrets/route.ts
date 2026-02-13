import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase-admin';
import { hashPassword, isAdmin as checkIsAdmin, checkRateLimit, getClientIp } from '@/lib/server-utils';

export async function POST(request: NextRequest) {
    const ip = getClientIp(request);
    if (!checkRateLimit(`secrets:${ip}`, 5, 60_000)) {
        return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    try {
        const { nickname, password } = (await request.json()) as {
            nickname?: string;
            password?: string;
        };

        if (!nickname || !password) {
            return NextResponse.json({ error: 'Missing credentials' }, { status: 400 });
        }

        const db = getAdminDb();
        const admin = checkIsAdmin(nickname, password);

        const snapshot = await db.collection('guestbook')
            .where('isSecret', '==', true)
            .get();

        const secrets: Record<string, string> = {};

        if (admin) {
            snapshot.docs.forEach((d) => {
                secrets[d.id] = d.data().message;
            });
        } else {
            const pwHash = hashPassword(password);
            snapshot.docs.forEach((d) => {
                const data = d.data();
                if (data.nickname === nickname && data.passwordHash === pwHash) {
                    secrets[d.id] = data.message;
                }
            });
        }

        return NextResponse.json({ isAdmin: admin, secrets });
    } catch (err) {
        console.error('[guestbook/secrets POST]', err);
        return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
}
