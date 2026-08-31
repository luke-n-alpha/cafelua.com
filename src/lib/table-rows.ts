/**
 * The small, pure pieces of talking to Table Storage — no client, no network.
 *
 * They live apart from `guest-store` so they can be tested on their own, and
 * because they carry the two rules that are easy to break by accident: an id
 * has to keep the shape the routes validate, and a value that would be null
 * has to disappear rather than be written.
 */

import { randomBytes } from 'node:crypto';

/**
 * Ids in the shape the routes already validate: 20 alphanumeric characters,
 * the same shape Firestore handed out, so the ids carried over from there keep
 * working and the client-side regex does not have to change.
 */
const ID_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export function newId(): string {
    const bytes = randomBytes(20);
    let out = '';
    for (const byte of bytes) out += ID_ALPHABET[byte % ID_ALPHABET.length];
    return out;
}

/**
 * Table Storage has no null. A property that would be null is left off the row
 * instead, and the readers below treat an absent property and a null as the
 * same thing. False, zero and the empty string are values, not absences, and
 * stay.
 */
export function withoutEmpty(row: Record<string, unknown>): Record<string, unknown> {
    const out: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(row)) {
        if (value === null || value === undefined) continue;
        out[key] = value;
    }
    return out;
}

export const text = (value: unknown): string => (typeof value === 'string' ? value : '');

export const flag = (value: unknown): boolean => value === true;

export const optional = (value: unknown): string | null =>
    (typeof value === 'string' && value.length > 0 ? value : null);

export const moment = (value: unknown): Date | null => {
    if (value instanceof Date) return value;
    if (typeof value === 'string') {
        const parsed = new Date(value);
        return Number.isNaN(parsed.getTime()) ? null : parsed;
    }
    return null;
};
