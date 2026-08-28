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

    test('publishes all nine recovered fstory.net restore points', () => {
        const archiveRoot = path.join(legacyRoot, 'fstory-homepage');
        const manifest = JSON.parse(fs.readFileSync(path.join(archiveRoot, 'snapshots.json'), 'utf8'));

        expect(manifest.snapshots).toHaveLength(9);
        for (const snapshot of manifest.snapshots) {
            const entryPath = path.join(archiveRoot, snapshot.timestamp, 'index.html');
            expect(fs.existsSync(entryPath)).toBe(true);
            expect(fs.readFileSync(entryPath, 'utf8')).toMatch(/charset\s*=\s*["']?utf-8/i);
        }
    });
});
