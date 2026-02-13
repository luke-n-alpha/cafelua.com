/**
 * Server-side utilities for guestbook API routes.
 * MUST only be imported in server-side code (API routes).
 */
import { timingSafeEqual, createHash } from 'node:crypto';

// --- Crypto ---

/** Constant-time string comparison (prevents timing attacks) */
export function safeCompare(a: string, b: string): boolean {
    const bufA = createHash('sha256').update(a).digest();
    const bufB = createHash('sha256').update(b).digest();
    return timingSafeEqual(bufA, bufB);
}

/** SHA-256 hash — same output as client-side Web Crypto version */
export function hashPassword(password: string): string {
    return createHash('sha256').update(password).digest('hex');
}

// --- Auth ---

export function isAdmin(nickname: string, password: string): boolean {
    const adminNickname = process.env.GUESTBOOK_ADMIN_NICKNAME;
    const adminPassword = process.env.GUESTBOOK_ADMIN_PASSWORD;
    if (!adminNickname || !adminPassword) return false;
    return safeCompare(nickname, adminNickname) && safeCompare(password, adminPassword);
}

// --- Rate Limiting (in-memory, per-process) ---

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(key: string, maxAttempts = 5, windowMs = 60_000): boolean {
    const now = Date.now();
    const entry = rateLimitMap.get(key);
    if (!entry || now > entry.resetAt) {
        rateLimitMap.set(key, { count: 1, resetAt: now + windowMs });
        return true;
    }
    if (entry.count >= maxAttempts) return false;
    entry.count++;
    return true;
}

export function getClientIp(request: Request): string {
    const forwarded = request.headers.get('x-forwarded-for');
    return forwarded?.split(',')[0]?.trim() || 'unknown';
}
