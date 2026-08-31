import fs from 'fs';
import path from 'path';

const legacyRoot = path.resolve(__dirname, '../public');
const legacyDirs = [
    path.join(legacyRoot, '1997-homepage'),
    path.join(legacyRoot, '1998-homepage')
];

const bannedExtensions = new Set([
    '.cgi',
    '.pl',
    '.asp',
    '.php',
    '.gdbm',
    '.dbm',
    '.log',
    '.bak',
    '.psd'
]);

const bannedBasenames = new Set([
    'WS_FTP.LOG'
]);

const walkFiles = (dir: string): string[] => {
    const results: string[] = [];
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            results.push(...walkFiles(fullPath));
        } else {
            results.push(fullPath);
        }
    }
    return results;
};

describe('Legacy homepage bundles', () => {
    test('1997/1998 legacy folders exist with entry points', () => {
        expect(fs.existsSync(path.join(legacyRoot, '1997-homepage', 'index.html'))).toBe(true);
        expect(fs.existsSync(path.join(legacyRoot, '1998-homepage', 'main.html'))).toBe(true);
    });

    test('do not include server-side artifacts or logs', () => {
        for (const dir of legacyDirs) {
            expect(fs.existsSync(dir)).toBe(true);
            const files = walkFiles(dir);

            for (const filePath of files) {
                const base = path.basename(filePath);
                const ext = path.extname(base).toLowerCase();
                expect(bannedBasenames.has(base)).toBe(false);
                expect(bannedExtensions.has(ext)).toBe(false);
            }
        }
    });

    test('all legacy HTML declares UTF-8 meta charset', () => {
        const htmlExts = new Set(['.html', '.htm']);
        const metaRegex = /<meta\s+charset\s*=\s*['"]?utf-8/i;

        for (const dir of legacyDirs) {
            const files = walkFiles(dir).filter((filePath) => htmlExts.has(path.extname(filePath).toLowerCase()));
            for (const filePath of files) {
                const text = fs.readFileSync(filePath, 'utf8');
                expect(metaRegex.test(text)).toBe(true);
            }
        }
    });

    test('publishes the six merged fstory.net editions', () => {
        const archiveRoot = path.join(legacyRoot, 'fstory-homepage');
        const manifest = JSON.parse(fs.readFileSync(path.join(archiveRoot, 'snapshots.json'), 'utf8'));

        expect(manifest.editions).toHaveLength(6);
        for (const edition of manifest.editions) {
            const entryPath = path.join(archiveRoot, edition.representativeCapture, 'index.html');
            expect(fs.existsSync(entryPath)).toBe(true);
            expect(fs.readFileSync(entryPath, 'utf8')).toMatch(/charset\s*=\s*["']?utf-8/i);
        }
    });

    test('builds every edition from the captures that share its design', () => {
        const archiveRoot = path.join(legacyRoot, 'fstory-homepage');
        const manifest = JSON.parse(fs.readFileSync(path.join(archiveRoot, 'snapshots.json'), 'utf8'));

        expect(manifest.editions.length).toBeGreaterThan(1);
        for (const edition of manifest.editions) {
            // The representative has to be one of the captures the edition was
            // built from, or the folder name would name a capture nothing merged.
            expect(edition.builtFrom.some(
                (capture: { timestamp: string }) => capture.timestamp === edition.representativeCapture,
            )).toBe(true);
            expect(edition.builtFrom.filter(
                (capture: { representative: boolean }) => capture.representative,
            )).toHaveLength(1);
            expect(edition.publishedFileCount).toBeGreaterThan(0);
        }
    });

    test('keeps 2002-11-20 and 2002-11-28 apart because their frame layouts differ', () => {
        const archiveRoot = path.join(legacyRoot, 'fstory-homepage');
        const manifest = JSON.parse(fs.readFileSync(path.join(archiveRoot, 'snapshots.json'), 'utf8'));
        const editionOf = (capture: string) =>
            manifest.editions.find((edition: { builtFrom: { timestamp: string }[] }) =>
                edition.builtFrom.some((item) => item.timestamp === capture),
            )?.id;

        // Eight days apart, but a different site: they must never be merged into
        // one edition.
        expect(editionOf('20021120053627')).not.toBe(editionOf('20021128181318'));

        const older = fs.readFileSync(path.join(archiveRoot, '20021120053627', 'main.html'), 'utf8');
        const newer = fs.readFileSync(path.join(archiveRoot, '20021128181318', 'main.html'), 'utf8');
        expect(older).toContain('frame1.html');
        expect(newer).toContain('topmenu.html');
        expect(newer).toContain('bgm/bgm.html');
    });

    test('every edition carries its notice page and picture placeholder', () => {
        const archiveRoot = path.join(legacyRoot, 'fstory-homepage');
        const manifest = JSON.parse(fs.readFileSync(path.join(archiveRoot, 'snapshots.json'), 'utf8'));

        for (const edition of manifest.editions) {
            const root = path.join(archiveRoot, edition.representativeCapture);
            expect(fs.existsSync(path.join(root, '_unrestored.html'))).toBe(true);
            expect(fs.existsSync(path.join(root, '_missing-image.svg'))).toBe(true);
        }
    });

    test('leaves no live form, download link or unresolved picture in the published captures', () => {
        const archiveRoot = path.join(legacyRoot, 'fstory-homepage');
        const files = walkFiles(archiveRoot).filter((filePath) =>
            ['.html', '.htm', '.php', '.cgi'].includes(path.extname(filePath).toLowerCase()),
        );
        const liveForms: string[] = [];
        const clickableDeadLinks: string[] = [];

        for (const filePath of files) {
            const text = fs.readFileSync(filePath, 'utf8');
            for (const [tag] of text.matchAll(/<form\b[^>]*>/gi)) {
                if (!/data-unrestored/i.test(tag)) liveForms.push(`${filePath}: ${tag.slice(0, 90)}`);
            }
            for (const [tag] of text.matchAll(/<a\b[^>]*data-unrestored-href[^>]*>/gi)) {
                if (/\shref\s*=/i.test(tag)) clickableDeadLinks.push(`${filePath}: ${tag.slice(0, 90)}`);
            }
        }

        expect(liveForms).toEqual([]);
        expect(clickableDeadLinks).toEqual([]);
    });

    test('the generated Atelier archive module stays in step with the manifest', () => {
        const archiveRoot = path.join(legacyRoot, 'fstory-homepage');
        const manifest = JSON.parse(fs.readFileSync(path.join(archiveRoot, 'snapshots.json'), 'utf8'));
        const generated = fs.readFileSync(
            path.resolve(__dirname, '../src/data/fstoryArchive.ts'),
            'utf8',
        );

        for (const edition of manifest.editions) {
            expect(generated).toContain(edition.representativeCapture);
            expect(generated).toContain(edition.label);
        }
    });

    test('publishes one folder per design generation, not one per capture', () => {
        const archiveRoot = path.join(legacyRoot, 'fstory-homepage');
        const manifest = JSON.parse(fs.readFileSync(path.join(archiveRoot, 'snapshots.json'), 'utf8'));
        const published = fs
            .readdirSync(archiveRoot, { withFileTypes: true })
            .filter((entry) => entry.isDirectory())
            .map((entry) => entry.name)
            .sort();
        const expected = manifest.editions
            .map((edition: { representativeCapture: string }) => edition.representativeCapture)
            .sort();

        expect(published).toEqual(expected);

        // Every capture the archive holds is accounted for by exactly one edition,
        // so merging never silently drops one.
        const merged = manifest.editions.flatMap((edition: { builtFrom: { timestamp: string }[] }) =>
            edition.builtFrom.map((item) => item.timestamp),
        );
        expect(new Set(merged).size).toBe(merged.length);
        expect(merged.length).toBeGreaterThan(published.length);
    });

    test('restores the 1997 poems whose bodies survived in a later edition', () => {
        const poemDir = path.join(legacyRoot, '1997-homepage', 'gl', 'poem');
        const index = fs.readFileSync(path.join(legacyRoot, '1997-homepage', 'si.html'), 'utf8');

        // A link that still points at a poem page must find one. Six poems were
        // never republished anywhere, and those are routed to the notice instead.
        const linked = [...index.matchAll(/href=["']([^"']+)["']/gi)]
            .map((match) => match[1])
            .filter((href) => !href.includes('_unrestored.html'))
            .map((href) => /poem(\d+)\.html/.exec(href))
            .filter((match): match is RegExpExecArray => match !== null)
            .map((match) => Number(match[1]));
        expect(linked.length).toBeGreaterThan(60);
        for (const number of linked) {
            expect(fs.existsSync(path.join(poemDir, `poem${number}.html`))).toBe(true);
        }

        // A restored page carries its poem, not a placeholder or a notice.
        const restored = fs.readFileSync(path.join(poemDir, 'poem63.html'), 'utf8');
        expect(restored).toContain('쓸쓸한 저녁놀');
        expect(restored).not.toContain('_missing-image.svg');
        expect(restored).not.toContain('_unrestored.html');
    });

    test('the 1997 and 1998 editions leave no clickable link to a missing page', () => {
        for (const edition of ['1997-homepage', '1998-homepage']) {
            const root = path.join(legacyRoot, edition);
            const onDisk = new Set(
                walkFiles(root).map((filePath) => path.relative(root, filePath).replaceAll('\\', '/').toLowerCase()),
            );
            const dangling: string[] = [];

            for (const filePath of walkFiles(root)) {
                if (!['.html', '.htm'].includes(path.extname(filePath).toLowerCase())) continue;
                const relative = path.relative(root, filePath).replaceAll('\\', '/');
                const text = fs.readFileSync(filePath, 'utf8');
                for (const [, raw] of text.matchAll(/<a\b[^>]*?\shref\s*=\s*["']([^"']+)["']/gi)) {
                    if (/^(#|javascript:|mailto:|tel:|data:|https?:|\/\/)/i.test(raw.trim())) continue;
                    const bare = raw.split('?')[0].split('#')[0].replaceAll('\\', '/');
                    if (!bare) continue;
                    const target = path.posix
                        .normalize(path.posix.join(path.posix.dirname(relative), decodeURIComponent(bare)))
                        .toLowerCase();
                    if (!onDisk.has(target)) dangling.push(`${edition}/${relative} → ${raw}`);
                }
            }

            expect(dangling).toEqual([]);
        }
    });

    test('merges unique July 2001 content into the 1998 lineage', () => {
        const mergedRoot = path.join(legacyRoot, '1998-homepage');
        for (const relative of [
            'mydoc/novel/short/22cen1.html',
            'mydoc/novel/short/22cen2.html',
            'mydoc/novel/short/b612_1.html',
            'mydoc/novel/short/b612_2.html',
            'gallery/gallery3/Pic3.html',
            'gallery/gallery3/Pic4.html',
        ]) {
            expect(fs.existsSync(path.join(mergedRoot, relative))).toBe(true);
        }
        expect(fs.readFileSync(path.join(mergedRoot, 'mydoc/novel/short/short.html'), 'utf8'))
            .toContain('22cen1.html');
    });

    test('keeps the final Cyworld-linked edition usable without the retired service', () => {
        const finalRoot = path.join(legacyRoot, 'fstory-homepage', '20030726202839');
        const notice = fs.readFileSync(path.join(finalRoot, 'cyworld-unrestored.html'), 'utf8');

        expect(fs.existsSync(path.join(finalRoot, 'cycomeback_fstory97.jpg'))).toBe(true);
        expect(notice).toContain('http://www.cyworld.com/fstory');
        expect(notice).toContain('cycomeback_fstory97.jpg');

        for (const relative of ['index.html', 'topmenu.html', 'tech/menu.html', 'teatime/teatime.html']) {
            const html = fs.readFileSync(path.join(finalRoot, relative), 'utf8');
            expect(html).toContain('cyworld-unrestored.html');
            expect(html).not.toMatch(/cyworld\.com\/[^"'<>\s]*tid=16159007/i);
        }
    });
});
