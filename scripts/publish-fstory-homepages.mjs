import { cp, mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const archiveRoot = path.resolve(appRoot, '../data/fstory-net-wayback/versions');
const sourceRoot = path.join(archiveRoot, 'reconstructed');
const objectsRoot = path.join(archiveRoot, 'objects');
const destinationRoot = path.join(appRoot, 'public/fstory-homepage');
const snapshots = [
  ['20010715123146', '2001-07-15', '도메인 호스팅 초기 화면'],
  ['20010723051951', '2001-07-23', 'Fstory 홈페이지 v1'],
  ['20010925220320', '2001-09-25', 'Fstory 홈페이지 v2 최초 확인'],
  ['20011202212712', '2001-12-02', 'Fstory 홈페이지 v2 중간 갱신'],
  ['20020325014505', '2002-03-25', 'Fstory 홈페이지 v2 중간 갱신'],
  ['20020924164928', '2002-09-24', 'Fstory 홈페이지 v2 중간 갱신'],
  ['20021120053627', '2002-11-20', 'Fstory 홈페이지 v2 중간 갱신'],
  ['20021128181318', '2002-11-28', 'Fstory 홈페이지 v2 대표 상태'],
  ['20030726202839', '2003-07-26', 'Fstory 홈페이지 v3'],
];
const textExtensions = new Set(['.html', '.htm', '.php', '.cgi', '.css', '.js']);
const utf8 = new TextDecoder('utf-8', { fatal: true });
const cp949 = new TextDecoder('euc-kr');
const patterns = [
  /((?:src|href|background)\s*=\s*["']?)([^"'\s>#]+)/gi,
  /(url\(\s*["']?)([^"')\s]+)/gi,
];
const decode = (bytes) => { try { return utf8.decode(bytes); } catch { return cp949.decode(bytes); } };
const canonical = (value) => { const u = new URL(value); return `${u.hostname.replace(/^www\./, '').toLowerCase()}${u.pathname || '/'}${u.search}`; };
const withCharset = (text, extension) => {
  if (!['.html', '.htm', '.php', '.cgi'].includes(extension)) return text;
  if (/<meta[^>]+charset=/i.test(text)) return text.replace(/charset\s*=\s*["']?[^\s"'>;]+/gi, 'charset=utf-8');
  return /<head[^>]*>/i.test(text) ? text.replace(/<head[^>]*>/i, (head) => `${head}\n<meta charset="utf-8">`) : `<meta charset="utf-8">\n${text}`;
};

const captures = JSON.parse(await readFile(path.join(archiveRoot, 'manifest.json'), 'utf8'))
  .filter((item) => item.recovered && item.timestamp < '20040000000000');
const capturesByUrl = new Map();
for (const item of captures) capturesByUrl.set(item.canonical, [...(capturesByUrl.get(item.canonical) || []), item]);
const closest = (items, timestamp) => [...items].sort((a, b) => {
  const da = Math.abs(Number(a.timestamp.slice(0, 8)) - Number(timestamp.slice(0, 8)));
  const db = Math.abs(Number(b.timestamp.slice(0, 8)) - Number(timestamp.slice(0, 8)));
  return da - db || a.timestamp.localeCompare(b.timestamp);
})[0];

const reports = [];
await mkdir(destinationRoot, { recursive: true });
for (const [timestamp] of snapshots) {
  const source = path.join(sourceRoot, timestamp);
  const destination = path.join(destinationRoot, timestamp);
  const records = JSON.parse(await readFile(path.join(source, 'manifest.json'), 'utf8'));
  const available = new Map(records.map((item) => [item.canonical, item]));
  const occupiedPaths = new Set(records.map((item) => (item.snapshotPath || item.sitePath).toLowerCase()));
  const queue = [...records];
  const processed = new Set();
  const restored = [];
  let rewrittenReferences = 0;
  await mkdir(destination, { recursive: true });
  await cp(path.join(source, 'files'), destination, { recursive: true, force: true, preserveTimestamps: true });

  for (let cursor = 0; cursor < queue.length; cursor += 1) {
    const record = queue[cursor];
    if (processed.has(record.canonical)) continue;
    processed.add(record.canonical);
    const localPath = record.snapshotPath || record.sitePath;
    const extension = path.extname(localPath).toLowerCase();
    if (!textExtensions.has(extension)) continue;
    const output = path.join(destination, localPath);
    let text = decode(await readFile(output));
    for (const pattern of patterns) text = text.replace(pattern, (whole, prefix, rawValue) => {
      const raw = rawValue.replace(/&amp;/gi, '&');
      if (/^(?:#|javascript:|mailto:|data:|tel:)/i.test(raw)) return whole;
      let resolved;
      try { resolved = new URL(raw, record.original); } catch { return whole; }
      if (!/(^|\.)fstory\.net$/i.test(resolved.hostname)) return whole;
      const key = canonical(resolved.href);
      let target = available.get(key);
      if (!target) {
        const alternatives = capturesByUrl.get(key);
        if (!alternatives?.length) return whole;
        const candidate = closest(alternatives, timestamp);
        if (occupiedPaths.has(candidate.sitePath.toLowerCase())) return whole;
        target = { ...candidate, snapshotPath: candidate.sitePath };
        available.set(key, target);
        occupiedPaths.add(candidate.sitePath.toLowerCase());
        queue.push(target);
        restored.push({ url: resolved.href, path: candidate.sitePath, capturedAt: candidate.timestamp, mimetype: candidate.mimetype, sha256: candidate.sha256 });
      }
      const targetPath = target.snapshotPath || target.sitePath;
      const relative = path.posix.relative(path.posix.dirname(localPath), targetPath) || path.posix.basename(targetPath);
      rewrittenReferences += 1;
      return `${prefix}${relative}`;
    });
    await writeFile(output, withCharset(text, extension), 'utf8');

    for (const item of queue.slice(cursor + 1)) {
      const itemPath = item.snapshotPath || item.sitePath;
      const itemOutput = path.join(destination, itemPath);
      try { await readFile(itemOutput); } catch {
        await mkdir(path.dirname(itemOutput), { recursive: true });
        await cp(path.join(objectsRoot, item.objectPath), itemOutput, { force: true, preserveTimestamps: true });
      }
    }
  }

  const convertUnprocessed = async (directory) => {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const file = path.join(directory, entry.name);
      if (entry.isDirectory()) { await convertUnprocessed(file); continue; }
      const extension = path.extname(entry.name).toLowerCase();
      if (!textExtensions.has(extension)) continue;
      const relative = path.relative(destination, file).replaceAll('\\', '/');
      const record = [...available.values()].find((item) => (item.snapshotPath || item.sitePath) === relative);
      if (record && processed.has(record.canonical)) continue;
      await writeFile(file, withCharset(decode(await readFile(file)), extension), 'utf8');
    }
  };
  await convertUnprocessed(destination);
  reports.push({ timestamp, originalFiles: records.length, restoredFiles: restored.length, rewrittenReferences, restored });
}

const versionSummary = JSON.parse(await readFile(path.join(archiveRoot, 'summary.json'), 'utf8'));
await writeFile(path.join(destinationRoot, 'restoration-report.json'), `${JSON.stringify({
  method: 'Exact canonical fstory.net URL matches recovered from another archived timestamp; no filename-only guesses.',
  generatedAt: new Date().toISOString(), snapshots: reports,
}, null, 2)}\n`);
await writeFile(path.join(destinationRoot, 'snapshots.json'), `${JSON.stringify({
  source: 'Internet Archive Wayback Machine captures of fstory.net',
  generatedFrom: '../data/fstory-net-wayback/versions/reconstructed',
  snapshots: snapshots.map(([timestamp, date, description]) => ({
    timestamp, date, description, entry: `/fstory-homepage/${timestamp}/index.html`,
    fileCount: versionSummary.snapshots?.find((item) => item.timestamp === timestamp)?.files ?? null,
    restoredFileCount: reports.find((item) => item.timestamp === timestamp)?.restoredFiles ?? 0,
  })),
}, null, 2)}\n`);
console.log(JSON.stringify({ published: snapshots.length, restoredFiles: reports.reduce((sum, item) => sum + item.restoredFiles, 0), rewrittenReferences: reports.reduce((sum, item) => sum + item.rewrittenReferences, 0), destinationRoot }, null, 2));
