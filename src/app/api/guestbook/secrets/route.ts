import { NextRequest, NextResponse } from 'next/server';
import { listSecretGuestbookEntries } from '@/lib/guest-store';
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

        const admin = checkIsAdmin(nickname, password);
        const entries = await listSecretGuestbookEntries();

        const secrets: Record<string, string> = {};

        if (admin) {
            for (const entry of entries) {
                secrets[entry.id] = entry.message;
            }
        } else {
            const pwHash = hashPassword(password);
            for (const entry of entries) {
                if (entry.nickname === nickname && entry.passwordHash === pwHash) {
                    secrets[entry.id] = entry.message;
                }
            }
        }

        return NextResponse.json({ isAdmin: admin, secrets });
    } catch (err) {
        console.error('[guestbook/secrets POST]', err);
        return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
}
