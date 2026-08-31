#!/usr/bin/env node
/**
 * Ask every outside address the restored pages link to whether it still answers.
 *
 * These pages were written between 1997 and 2003 and point at a web that has
 * mostly closed. A link to a host that no longer exists is merely dead; a link
 * to one that has changed hands is worse, because it still opens, and what it
 * opens is not what Luke linked to. Both are decided here rather than in the
 * publisher, so the verdict is a checked-in artefact a person can read and
 * argue with, and a rerun shows up as a diff rather than as silent new
 * behaviour.
 *
 * A host is called lost when the name does not resolve, when nothing answers on
 * it, or when it answers 404, 410 or 444. Anything else is left alone: a 403 or
 * a 401 usually means a live site turning away a robot, and guessing past that
 * would take down links that still work.
 *
 * Usage: node scripts/check-fstory-external-links.mjs [--edition ver2-merged]
 */

import { readdir, readFile, writeFile } from 'node:fs/promises';
import { lookup } from 'node:dns/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const appRoot = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const publishedRoot = path.join(appRoot, 'public/fstory-homepage');
const OUT_FILE = path.join(appRoot, 'scripts/fstory-external-links.json');

const editionArgument = process.argv.indexOf('--edition');
const edition = editionArgument > -1 ? process.argv[editionArgument + 1] : 'ver2-merged';

const LOST_CODES = new Set([404, 410, 444]);
const CONCURRENCY = 8;
const TIMEOUT = 10000;

// Spam left on the 2002 guestboard by people selling something. The addresses
// still answer, and what they answer with is adult advertising. The archive
// keeps the posts, because they are part of what the board was; it does not
// forward anyone to them.
const SPAM = /(^|\.)((sexmart|sexying|sexhari)\b|.*\bsex[a-z]*\.(co\.tv|rg\.ro))/i;

const collect = async (directory, found = new Map()) => {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
        const file = path.join(directory, entry.name);
        if (entry.isDirectory()) { await collect(file, found); continue; }
        if (!/\.html?$/i.test(entry.name)) continue;
        const text = await readFile(file, 'utf8');
        for (const match of text.matchAll(/href\s*=\s*"(https?:\/\/[^"]+)"/gi)) {
            const address = match[1];
            found.set(address, (found.get(address) ?? 0) + 1);
        }
    }
    return found;
};

const hostOf = (address) => {
    try { return new URL(address).hostname; } catch { return null; }
};

const ask = async (address) => {
    const host = hostOf(address);
    if (!host) return { verdict: 'lost', reason: 'unreadable address' };
    if (SPAM.test(host)) return { verdict: 'lost', reason: 'spam' };
    try {
        await lookup(host);
    } catch {
        return { verdict: 'lost', reason: 'no such host' };
    }
    const stop = AbortSignal.timeout(TIMEOUT);
    try {
        const answer = await fetch(address, {
            redirect: 'follow',
            signal: stop,
            headers: { 'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
        });
        if (LOST_CODES.has(answer.status)) return { verdict: 'lost', reason: `${answer.status}` };
        return { verdict: 'answers', reason: `${answer.status}` };
    } catch {
        return { verdict: 'lost', reason: 'nothing answered' };
    }
};

const found = await collect(path.join(publishedRoot, edition));
const addresses = [...found.keys()].sort();
console.log(`${addresses.length}개 주소를 확인합니다 (${edition})`);

const verdicts = new Map();
let at = 0;
await Promise.all(Array.from({ length: CONCURRENCY }, async () => {
    while (at < addresses.length) {
        const address = addresses[at];
        at += 1;
        verdicts.set(address, await ask(address));
    }
}));

const payload = {
    checked: new Date().toISOString().slice(0, 10),
    edition,
    note: 'lost = the address no longer answers, or answers with something other than what it was linked for. Regenerate with scripts/check-fstory-external-links.mjs.',
    links: Object.fromEntries(addresses.map((address) => [address, {
        ...verdicts.get(address),
        references: found.get(address),
    }])),
};
await writeFile(OUT_FILE, `${JSON.stringify(payload, null, 1)}\n`, 'utf8');

const lost = addresses.filter((address) => verdicts.get(address).verdict === 'lost');
console.log(`  닫힘 ${lost.length} / 응답 ${addresses.length - lost.length}`);
console.log(`  기록 ${path.relative(appRoot, OUT_FILE)}`);
