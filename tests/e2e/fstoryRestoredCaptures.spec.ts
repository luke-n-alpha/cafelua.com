import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { expect, test, type Page } from '@playwright/test';

type Edition = { id: string; label: string; period: string; representativeCapture: string };

const specDir = path.dirname(fileURLToPath(import.meta.url));
const archiveRoot = path.resolve(specDir, '../../public/fstory-homepage');
// One entry per design generation. Every capture that shares a design is merged
// into it, so crawling the editions covers the whole published archive.
const editions: Edition[] = JSON.parse(
    fs.readFileSync(path.join(archiveRoot, 'snapshots.json'), 'utf8'),
).editions;

const CRAWL_TIMEOUT_MS = 900000;
const PAGE_EXTENSIONS = /\.(html?|php|cgi)$/i;

// Every host these captures once talked to has been offline for two decades.
// Letting the browser wait on them would time the crawl out and tells us nothing
// about the restoration itself.
const blockExternalHosts = (page: Page) =>
    page.route('**/*', (route) => {
        const { hostname } = new URL(route.request().url());
        return hostname === '127.0.0.1' || hostname === 'localhost'
            ? route.continue()
            : route.abort();
    });

type Reference = { href: string; isPage: boolean };

// Each frame resolves its own relative links; using the top document as the base
// would invent paths the site never contained.
const collectReferences = async (page: Page, prefix: string): Promise<Reference[]> => {
    const perFrame = await Promise.all(
        page.frames().map(async (frame) => {
            const raw = await frame
                .evaluate(() =>
                    [
                        ...document.querySelectorAll<HTMLElement>(
                            'a[href], area[href], frame[src], iframe[src], img[src], input[src], script[src], link[href]',
                        ),
                    ].map((element) => element.getAttribute('href') || element.getAttribute('src') || ''),
                )
                .catch(() => [] as string[]);
            const base = frame.url();
            return raw.map((value) => {
                try {
                    const url = new URL(value, base);
                    return url.origin === new URL(base).origin
                        ? { href: url.pathname + url.search, isPage: PAGE_EXTENSIONS.test(url.pathname) }
                        : null;
                } catch {
                    return null;
                }
            });
        }),
    );
    return perFrame
        .flat()
        .filter((item): item is Reference => Boolean(item) && item!.href.startsWith(prefix));
};

// Zeroboard laid its tables out with `<img width=1 height=3>` spacers that carry
// no src at all. They rendered as nothing in 2002 and render as nothing now;
// giving them a picture would be inventing markup the site never had.
const brokenImages = async (page: Page) =>
    (
        await Promise.all(
            page.frames().map((frame) =>
                frame
                    .evaluate(() =>
                        [...document.images]
                            .filter((image) => (image.getAttribute('src') || '').trim().length > 0)
                            .filter((image) => image.complete && image.naturalWidth === 0)
                            .map((image) => image.currentSrc || image.src),
                    )
                    .catch(() => [] as string[]),
            ),
        )
    ).flat();

// The Atelier also opens two editions Luke kept himself, so a visitor meets them
// on the same desktop and they have to hold up to the same walk-through.
const annexes: Array<{ id: string; label: string; snapshot: string; entry: string }> =
    JSON.parse(fs.readFileSync(path.join(archiveRoot, 'snapshots.json'), 'utf8')).annexes ?? [];

const CURATED_EDITIONS = [
    { label: '1997 edition', prefix: '/1997-homepage/', entry: '/1997-homepage/index.html' },
    { label: '1998–2001.07 edition', prefix: '/1998-homepage/', entry: '/1998-homepage/main.html' },
];

const walk = async (page: Page, prefix: string, entry: string) => {
    const failures = new Set<string>();
    const broken = new Set<string>();
    await blockExternalHosts(page);
    page.on('response', (response) => {
        const { pathname } = new URL(response.url());
        if (response.status() >= 400 && pathname.startsWith(prefix)) {
            failures.add(`${response.status()} ${pathname} (subresource)`);
        }
    });

    const queue = [entry];
    const visited = new Set(queue);
    const assets = new Set<string>();
    while (queue.length) {
        const target = queue.shift()!;
        const response = await page.goto(target, { waitUntil: 'domcontentloaded' });
        if (response && response.status() >= 400) failures.add(`${response.status()} ${target}`);
        await page.waitForLoadState('load').catch(() => undefined);
        for (const source of await brokenImages(page)) broken.add(`${target} → ${source}`);
        for (const reference of await collectReferences(page, prefix)) {
            if (reference.isPage) {
                if (visited.has(reference.href)) continue;
                visited.add(reference.href);
                queue.push(reference.href);
            } else {
                assets.add(reference.href);
            }
        }
    }
    for (const asset of assets) {
        const answer = await page.request.get(asset);
        if (answer.status() >= 400) failures.add(`${answer.status()} ${asset} (asset)`);
    }
    return { failures, broken, visited, assets };
};

test.describe('restored fstory.net captures', () => {
    for (const edition of CURATED_EDITIONS) {
        test(`${edition.label} — every reachable page, picture and asset answers`, async ({ page }) => {
            test.setTimeout(CRAWL_TIMEOUT_MS);
            const { failures, broken, visited, assets } = await walk(page, edition.prefix, edition.entry);
            expect(visited.size).toBeGreaterThan(0);
            expect([...failures].sort()).toEqual([]);
            expect([...broken].sort()).toEqual([]);
            console.log(`${edition.label}: ${visited.size} pages, ${assets.size} assets`);
        });
    }

    for (const edition of editions) {
        test(`${edition.id} · ${edition.label} — every reachable page, picture and asset answers`, async ({ page }) => {
            test.setTimeout(CRAWL_TIMEOUT_MS);
            const prefix = `/fstory-homepage/${edition.representativeCapture}/`;
            const failures = new Set<string>();
            const broken = new Set<string>();

            await blockExternalHosts(page);
            page.on('response', (response) => {
                const { pathname } = new URL(response.url());
                if (response.status() >= 400 && pathname.startsWith(prefix)) {
                    failures.add(`${response.status()} ${pathname} (subresource)`);
                }
            });

            const queue = [`${prefix}index.html`];
            const visited = new Set(queue);
            const assets = new Set<string>();

            while (queue.length) {
                const target = queue.shift()!;
                const response = await page.goto(target, { waitUntil: 'domcontentloaded' });
                if (response && response.status() >= 400) failures.add(`${response.status()} ${target}`);
                await page.waitForLoadState('load').catch(() => undefined);
                for (const source of await brokenImages(page)) broken.add(`${target} → ${source}`);
                for (const reference of await collectReferences(page, prefix)) {
                    if (reference.isPage) {
                        if (visited.has(reference.href)) continue;
                        visited.add(reference.href);
                        queue.push(reference.href);
                    } else {
                        assets.add(reference.href);
                    }
                }
            }

            // Assets that no visited page happened to render — stylesheets behind
            // a media query, scripts, pictures inside a collapsed table — still
            // have to answer.
            for (const asset of assets) {
                const answer = await page.request.get(asset);
                if (answer.status() >= 400) failures.add(`${answer.status()} ${asset} (asset)`);
            }

            expect(visited.size).toBeGreaterThan(0);
            expect([...failures].sort()).toEqual([]);
            expect([...broken].sort()).toEqual([]);
            console.log(`${edition.id} ${edition.label}: ${visited.size} pages, ${assets.size} assets`);
        });
    }

    for (const annex of annexes) {
        test(`${annex.label} — the earlier address opens and its pictures load`, async ({ page }) => {
            test.setTimeout(CRAWL_TIMEOUT_MS);
            await blockExternalHosts(page);
            const entry = `/fstory-homepage/${annex.snapshot}/${annex.entry}`;
            const response = await page.goto(entry, { waitUntil: 'domcontentloaded' });
            expect(response?.status()).toBeLessThan(400);
            await page.waitForLoadState('load').catch(() => undefined);
            expect(await brokenImages(page)).toEqual([]);
        });
    }

    test('the notice page names the resource it could not restore', async ({ page }) => {
        const target = editions.at(-1)!.representativeCapture;
        await page.goto(`/fstory-homepage/${target}/_unrestored.html?p=%2Fzero%2Fzboard.php&k=board`);
        await expect(page.locator('#what')).toHaveText('/zero/zboard.php');
        await expect(page.locator('#headline')).toContainText('게시판');
    });

    test('the Cyworld hand-off shows the real address instead of a dead link', async ({ page }) => {
        await page.goto('/fstory-homepage/20030726202839/cyworld-unrestored.html');
        await expect(page.locator('.address')).toHaveText('http://www.cyworld.com/fstory');
        const picture = page.locator('.content img');
        await expect(picture).toBeVisible();
        expect(await picture.evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0);
    });

    test('no download or media link stays clickable', async ({ page }) => {
        test.setTimeout(CRAWL_TIMEOUT_MS);
        await blockExternalHosts(page);
        for (const edition of editions) {
            await page.goto(`/fstory-homepage/${edition.representativeCapture}/index.html`);
            // A locator re-resolves after a navigation; the 2001 parking page
            // redirects itself, which would destroy a page.evaluate context.
            expect(await page.locator('a[data-unrestored-href][href]').count()).toBe(0);
        }
    });
});
