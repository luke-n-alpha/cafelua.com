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
 * Answering is not the same as still being there. Most of these addresses were
 * personal homepages on free hosts, and what answers today is a domain broker,
 * a forwarding service with nothing behind it, or a business that bought the
 * name. So the check reads what comes back and calls an address lost when:
 *
 *   - the name does not resolve, or nothing answers, or it answers 404/410/444
 *   - the page offers the domain for sale, or says it is coming soon, parked,
 *     under construction, forbidden, or an invalid address
 *   - it lands on a different registrable domain than the one linked
 *   - it sits on a free host whose personal pages are all gone, and which now
 *     answers every name with the same placeholder
 *   - there is almost no text on it: a redirect stub or an empty frameset
 *
 * Anything with real text of its own, at the domain it was linked at, is left
 * alone. That keeps the broadcasters, newspapers and companies that are still
 * running, and drops the rest.
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

// What a domain broker or an empty host says. Matched against the page's own
// text, so a page merely mentioning one of these words in passing needs to be
// short as well before it counts.
const FOR_SALE = /(hugedomains|is for sale|buy this domain|ready for development|coming soon|domain (?:is )?(?:for sale|parked)|parked (?:free )?(?:at|by)|under construction|이 ?도메인.{0,12}(?:판매|구입|삽니다)|도메인.{0,6}(?:판매|분양)|sedo\.com|afternic)/i;
const REFUSED = /(403 forbidden|access denied|invalid url|401 unauthorized|service unavailable|dns resolution error|error 10\d\d|this site can'?t be reached)/i;

// Two the rules above cannot catch, judged by reading them. Both answer at the
// address Luke linked, with real text, under the same domain — and neither is
// what he linked to. Named here with the reason so the call is reviewable
// rather than buried in a regular expression.
const TOOK_THE_NAME = new Map([
    ['zeroboard.com', '게시판 프로그램 자리에 동명의 다른 회사'],
    ['benchbee.co.kr', '검색 노출용 문구만 남은 자리'],
]);

// Free hosts and forwarding services from that era. Every name on them now
// answers with the same placeholder, so the address resolves and leads nowhere.
const CLOSED_HOSTS = /\.(wo\.to|wo\.tc|ce\.ro|co\.tv|rg\.ro|ml\.org|nayana\.org|nahome\.org|new21\.net|netian\.com|hihome\.com|com\.ne\.kr|hosting\.co\.kr)$/i;

// The last two labels: chosun.co.kr and www.chosun.co.kr are the same place,
// carjun.com and 万象城 are not.
const registrable = (host) => {
    const parts = host.toLowerCase().split('.');
    const twoLevel = /\.(co|or|ne|pe|go|re|ac|com|net|org|gov|edu)\.[a-z]{2}$/i.test(host);
    return parts.slice(twoLevel ? -3 : -2).join('.');
};

const readable = (html) => html
    .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&[a-z#0-9]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
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
        // Both the links that still go somewhere and the ones an earlier run
        // already closed, which keep their address in data-closed-outside.
        const patterns = [
            /href\s*=\s*"(https?:\/\/[^"]+)"/gi,
            /data-closed-outside\s*=\s*"(https?:\/\/[^"]+)"/gi,
        ];
        for (const pattern of patterns) {
            for (const match of text.matchAll(pattern)) {
                found.set(match[1], (found.get(match[1]) ?? 0) + 1);
            }
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
    if (CLOSED_HOSTS.test(host)) return { verdict: 'lost', reason: 'free host, nothing behind the name' };
    const takenOver = TOOK_THE_NAME.get(registrable(host));
    if (takenOver) return { verdict: 'lost', reason: takenOver };
    const stop = AbortSignal.timeout(TIMEOUT);
    try {
        const answer = await fetch(address, {
            redirect: 'follow',
            signal: stop,
            headers: { 'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
        });
        if (LOST_CODES.has(answer.status)) return { verdict: 'lost', reason: `${answer.status}` };

        const landed = new URL(answer.url).hostname;
        if (registrable(landed) !== registrable(host)) {
            return { verdict: 'lost', reason: `now goes to ${registrable(landed)}` };
        }

        const html = (await answer.text()).slice(0, 200000);
        const words = readable(html);
        const title = (/<title[^>]*>([^<]*)/i.exec(html)?.[1] ?? '').trim();
        if (REFUSED.test(words.slice(0, 400)) || REFUSED.test(title)) {
            return { verdict: 'lost', reason: 'turns the visitor away' };
        }
        if (FOR_SALE.test(title) || FOR_SALE.test(words.slice(0, 1200))) {
            return { verdict: 'lost', reason: 'the domain is being sold or is empty' };
        }
        // A redirect stub or an empty frameset: it resolves, it answers, and
        // there is nothing on it to read.
        if (words.length < 200) return { verdict: 'lost', reason: 'nothing on the page' };
        // The page's whole text is its own address, which is what a parking
        // page says when it has nothing else to say.
        if (words.length < 3000 && title && registrable(title.replace(/^www\./i, '')) === registrable(host)) {
            return { verdict: 'lost', reason: 'parked on its own name' };
        }
        return { verdict: 'answers', reason: `${answer.status}`, title: title.slice(0, 70) };
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

// Merge rather than replace. An address that has since been closed no longer
// appears as a live link, and dropping it from the file would take the verdict
// with it — the publisher would open the link again on the next build.
let previous = {};
try {
    previous = JSON.parse(await readFile(OUT_FILE, 'utf8')).links ?? {};
} catch { /* first run */ }

const merged = { ...previous };
for (const address of addresses) {
    merged[address] = { ...verdicts.get(address), references: found.get(address) };
}
const payload = {
    checked: new Date().toISOString().slice(0, 10),
    edition,
    note: 'lost = the address no longer answers, or answers with something other than what it was linked for. Regenerate with scripts/check-fstory-external-links.mjs.',
    links: Object.fromEntries(Object.keys(merged).sort().map((address) => [address, merged[address]])),
};
await writeFile(OUT_FILE, `${JSON.stringify(payload, null, 1)}\n`, 'utf8');

const lost = addresses.filter((address) => verdicts.get(address).verdict === 'lost');
console.log(`  닫힘 ${lost.length} / 응답 ${addresses.length - lost.length}`);
console.log(`  기록 ${path.relative(appRoot, OUT_FILE)}`);
