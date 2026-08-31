// Canonical generator for the restored fstory.net homepages served from
// public/fstory-homepage. Never hand-edit the generated output; change this
// script or the archive data layer under ../data/fstory-net-wayback instead.
//
// Pipeline
//   1. copy each reconstructed capture into public/fstory-homepage/<timestamp>
//   2. resolve every reference in every text file against the full archive
//   3. pull in files the capture window missed but the archive still holds
//   4. repair whatever the archive genuinely never stored, honestly:
//        - missing pictures become a labelled placeholder, never invented art
//        - missing pages route to a period-styled "not restored" notice
//        - missing downloads, media and forms are disabled outright
//   5. write the manifest, the restoration report and the recovery report
import { cp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ANNEXES, LINEAGES, PATH_ALIASES, RETIRED_HOSTS, SNAPSHOTS } from './fstory-lineage.mjs';

const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dataRoot = path.resolve(appRoot, '../data/fstory-net-wayback');
const archiveRoot = path.join(dataRoot, 'versions');
const sourceRoot = path.join(archiveRoot, 'reconstructed');
const objectsRoot = path.join(archiveRoot, 'objects');
const destinationRoot = path.join(appRoot, 'public/fstory-homepage');
const legacy1998Root = path.join(appRoot, 'public/1998-homepage');
// Luke reposted this on his blog in 2008; the archive layer keeps it with its
// source URL. See ../data/fstory-net-wayback/manual/README.md
const cyworldComebackImage = path.join(dataRoot, 'manual/cycomeback_fstory97.jpg');

const NOTICE_PAGE = '_unrestored.html';
const DYNAMIC = new Set(['.php', '.cgi', '.asp']);
const mergedGuestbook = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../../data/fstory-net-wayback/versions/merged/chollian-guestbook.html',
);
const PLACEHOLDER_IMAGE = '_missing-image.svg';
const textExtensions = new Set(['.html', '.htm', '.php', '.cgi', '.css', '.js']);
const htmlExtensions = new Set(['.html', '.htm', '.php', '.cgi']);
const mediaExtensions = new Set(['.mp3', '.wav', '.mid', '.midi', '.rm', '.ram', '.asf', '.wma', '.avi', '.mpg', '.mpeg', '.smf', '.swf']);
const downloadExtensions = new Set(['.zip', '.rar', '.7z', '.exe', '.msi', '.gz', '.tar', '.lzh', '.hwp', '.doc', '.xls', '.ppt', '.pdf']);
const imageExtensions = new Set(['.gif', '.jpg', '.jpeg', '.png', '.bmp']);

// Attributes that address a resource, grouped by how a dead one must be repaired.
const NAVIGATION_ATTRIBUTES = { a: ['href'], area: ['href'] };
const EMBED_ATTRIBUTES = {
  img: ['src', 'lowsrc'], input: ['src'], embed: ['src'], object: ['data'],
  bgsound: ['src'], script: ['src'], link: ['href'],
};
const FRAME_ATTRIBUTES = { frame: ['src'], iframe: ['src'] };
const BACKGROUND_ATTRIBUTES = { body: ['background'], td: ['background'], table: ['background'], tr: ['background'], th: ['background'] };
const FORM_ATTRIBUTES = { form: ['action'] };
const ALL_ATTRIBUTES = {};
for (const group of [NAVIGATION_ATTRIBUTES, EMBED_ATTRIBUTES, FRAME_ATTRIBUTES, BACKGROUND_ATTRIBUTES, FORM_ATTRIBUTES]) {
  for (const [tag, attributes] of Object.entries(group)) {
    ALL_ATTRIBUTES[tag] = [...new Set([...(ALL_ATTRIBUTES[tag] || []), ...attributes])];
  }
}

const TAG_NAME_PATTERN = /^<([a-zA-Z][\w:-]*)/;
// Period markup contains both stray quotes (`src="x""`) and literal `>` inside
// quoted values, so neither a greedy nor a quote-naive regex survives it. Scan
// the way a browser does: a quote only opens a value when it follows `=`.
const scanTags = (text) => {
  const tags = [];
  for (let index = 0; index < text.length; index += 1) {
    if (text[index] !== '<') continue;
    const name = TAG_NAME_PATTERN.exec(text.slice(index, index + 48));
    if (!name) continue;
    let cursor = index + name[0].length;
    let quote = null;
    let afterEquals = false;
    for (; cursor < text.length; cursor += 1) {
      const character = text[cursor];
      if (quote) { if (character === quote) quote = null; continue; }
      if (character === '>') break;
      if (character === '=') { afterEquals = true; continue; }
      if (/\s/.test(character)) continue;
      if (afterEquals) { if (character === '"' || character === "'") quote = character; afterEquals = false; }
    }
    if (cursor >= text.length) continue;
    let body = text.slice(index + name[0].length, cursor);
    const selfClose = body.endsWith('/') ? '/' : '';
    if (selfClose) body = body.slice(0, -1);
    tags.push({ index, whole: text.slice(index, cursor + 1), name: name[1], body, selfClose });
    index = cursor;
  }
  return tags;
};
const ATTRIBUTE_PATTERN = /([a-zA-Z_:][\w:.-]*)\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/g;
const CSS_URL_PATTERN = /url\(\s*(["']?)([^)"']+)\1\s*\)/gi;
const SCRIPT_URL_PATTERN = /((?:window\.open|location\.replace|location\.href\s*=|location\s*=)\s*\(?\s*)(["'])([^"']+)\2/gi;
// Rollover menus preload their artwork with `image.src = "…"`, which no attribute
// rewrite can reach. A dead one requests a file that is not there.
// The trailing group catches `image.src = "icon/" + name`, where the literal is
// only the first half of the address. Replacing the literal alone would leave
// the rest of the expression appended to the placeholder.
const SCRIPT_IMAGE_PATTERN = /(\.src\s*=\s*)(["'])([^"'<>\s]*)\2((?:\s*\+\s*[\w.$[\]'"]+)*)/gi;

const utf8 = new TextDecoder('utf-8', { fatal: true });
const cp949 = new TextDecoder('euc-kr');
const decode = (bytes) => { try { return utf8.decode(bytes); } catch { return cp949.decode(bytes); } };

const withCharset = (text, extension) => {
  if (!htmlExtensions.has(extension)) return text;
  if (/<meta[^>]+charset=/i.test(text)) return text.replace(/charset\s*=\s*["']?[^\s"'>;]+/gi, 'charset=utf-8');
  return /<head[^>]*>/i.test(text) ? text.replace(/<head[^>]*>/i, (head) => `${head}\n<meta charset="utf-8">`) : `<meta charset="utf-8">\n${text}`;
};

const canonicalOf = (url) => {
  const parsed = new URL(url);
  const own = ownPathOf(parsed);
  if (own !== null) return `fstory.net${own || '/'}${parsed.search}`;
  return `${parsed.hostname.replace(/^www\./, '').toLowerCase()}${parsed.pathname || '/'}${parsed.search}`;
};
// The homepage lived at several addresses over the years, and the pages link
// between them freely. `fstory.cafe24.com` was the hosting account the domain
// pointed at; `my.netian.com/~fstory` and the two Chollian paths were earlier
// accounts. Neighbouring accounts on the same shared hosts belong to other
// people, so the path matters as much as the name.
const OWN_ADDRESSES = [
  { host: /(^|\.)fstory\.net$/i, prefix: '', to: '' },
  { host: /^fstory\.cafe24\.com$/i, prefix: '', to: '' },
  { host: /^my\.netian\.com$/i, prefix: '/~fstory', to: '/netian' },
  { host: /^user\.chollian\.net$/i, prefix: '/~foreststory', to: '/chollian' },
  { host: /^cgi\.chollian\.net$/i, prefix: '/~foreststory', to: '/chollian/cgi' },
];

// Returns the site-relative path this URL means, or null when it points at
// somebody else's page.
const ownPathOf = (url) => {
  for (const { host, prefix, to } of OWN_ADDRESSES) {
    if (!host.test(url.hostname)) continue;
    if (!prefix) return url.pathname;
    if (url.pathname === prefix) return `${to}/`;
    if (url.pathname.startsWith(`${prefix}/`)) return to + url.pathname.slice(prefix.length);
    return null;
  }
  return null;
};
const isFstory = (hostname) => OWN_ADDRESSES.some(({ host }) => host.test(hostname));
const isRetiredHost = (hostname) => RETIRED_HOSTS.some(({ host }) =>
  hostname.toLowerCase() === host || hostname.toLowerCase().endsWith(`.${host}`));
const attributeValue = (raw) => (/^["']/.test(raw) ? raw.slice(1, -1) : raw);
const quoteFor = (raw) => (/^["']/.test(raw) ? raw[0] : '"');

// ---------------------------------------------------------------- archive index

const loadManifest = async (file) => JSON.parse(await readFile(file, 'utf8'));
const archiveRecords = (await loadManifest(path.join(archiveRoot, 'manifest.json')))
  .filter((item) => item.recovered && item.timestamp < '20040000000000');
const byCanonical = new Map();
const bySitePath = new Map();
for (const record of archiveRecords) {
  const site = record.sitePath || '';
  byCanonical.set(record.canonical, [...(byCanonical.get(record.canonical) || []), record]);
  const key = site.toLowerCase();
  if (key) bySitePath.set(key, [...(bySitePath.get(key) || []), record]);
}
const closestTo = (records, timestamp) => [...records].sort((a, b) => {
  const da = Math.abs(Number(a.timestamp.slice(0, 8)) - Number(timestamp.slice(0, 8)));
  const db = Math.abs(Number(b.timestamp.slice(0, 8)) - Number(timestamp.slice(0, 8)));
  return da - db || a.timestamp.localeCompare(b.timestamp);
})[0];

const aliasOf = (relative) => {
  for (const { from, to } of PATH_ALIASES) {
    if (relative.toLowerCase().startsWith(from.toLowerCase())) return to + relative.slice(from.length);
  }
  return null;
};

// ------------------------------------------------------- Cyworld hand-off
//
// From the November 2002 redesign onward several menus were delegated to Luke's
// own Cyworld mini-hompy (user id 16159007, later the /fstory vanity address).
// Cyworld is shut down, so route only his own links to an honest local notice
// and leave other people's mini-hompy links untouched. The surviving comeback
// image was later republished on his blog and is reused as primary-source
// artwork in the final capture rather than inventing a replacement.
const CYWORLD_NOTICE = 'cyworld-unrestored.html';
const CYWORLD_IMAGE = 'cycomeback_fstory97.jpg';
const lukeCyworldPatterns = [
  /https?:\/\/(?:www\.)?cyworld\.com\/fstory(?:[/?#][^"'<>\s]*)?/gi,
  /https?:\/\/[\w.-]*cyworld\.com\/[^"'<>\s]*(?:tid|id)=16159007[^"'<>\s]*/gi,
];

const cyworldNoticeDocument = (heading, withImage) => `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>숲속얘기의 싸이월드 미니홈피</title>
<style>
html, body { min-height: 100%; }
body { margin: 0; background: #fff; color: #44515b; font: 12px/1.7 돋움, Dotum, 굴림, sans-serif; }
.frame { width: min(570px, calc(100% - 28px)); margin: 24px auto; border: 1px solid #9ab6c4; background: #f7fbfd; box-shadow: 3px 3px 0 #dce8ed; }
.title { padding: 7px 12px; border-bottom: 1px solid #9ab6c4; background: #d9edf5; color: #225577; font-weight: bold; }
.content { padding: 18px; text-align: center; }
.content img { display: block; width: 400px; max-width: 100%; height: auto; margin: 0 auto 18px; border: 1px solid #b7c6cc; }
h1 { margin: 0 0 8px; color: #ee6b32; font-size: 16px; }
.address { display: inline-block; margin: 3px 0 14px; padding: 2px 8px; background: #fff; border: 1px solid #cbd9df; color: #225577; font-family: Verdana, sans-serif; }
p { margin: 5px 0; }
.note { color: #697780; }
.back { margin-top: 18px; padding-top: 10px; border-top: 1px dotted #9ab6c4; }
a { color: #225577; font-weight: bold; text-decoration: none; }
a:hover { color: #ee4411; }
</style>
</head>
<body>
  <div class="frame">
    <div class="title">${heading}</div>
    <div class="content">
${withImage ? `      <img src="${CYWORLD_IMAGE}" alt="Come back! 싸이월드 미니홈피로 돌아가는 숲속얘기">\n` : ''}      <h1>숲속얘기의 싸이월드 미니홈피</h1>
      <div class="address">http://www.cyworld.com/fstory</div>
      <p>이 메뉴의 글과 그림은 싸이월드 미니홈피에 연결되어 있었습니다.</p>
      <p class="note">싸이월드는 서비스가 중지되어 이 부분은 복구하지 못했습니다.</p>
      <div class="back"><a href="javascript:history.back()">← 이전 화면으로</a></div>
    </div>
  </div>
</body>
</html>
`;

const routeCyworld = async (root, directory = root) => {
  let rewrites = 0;
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) { rewrites += await routeCyworld(root, file); continue; }
    if (!htmlExtensions.has(path.extname(entry.name).toLowerCase())) continue;
    // The notice page prints the mini-hompy address as evidence; never rewrite it.
    if (entry.name === CYWORLD_NOTICE) continue;
    const text = decode(await readFile(file));
    const relative = path.relative(root, file).replaceAll('\\', '/');
    const href = path.posix.relative(path.posix.dirname(relative), CYWORLD_NOTICE) || CYWORLD_NOTICE;
    let next = text;
    for (const pattern of lukeCyworldPatterns) next = next.replace(pattern, href);
    if (next !== text) { await writeFile(file, next, 'utf8'); rewrites += 1; }
  }
  return rewrites;
};

// ------------------------------------------------------------------- publishing

const noticeDocument = (snapshot, palette) => `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>복원되지 않은 자료 · fstory.net ${snapshot.date}</title>
<style>
html, body { min-height: 100%; }
body { margin: 0; ${palette}; font: 12px/1.8 돋움, Dotum, 굴림, sans-serif; color: #3d4a52; }
.frame { width: min(520px, calc(100% - 24px)); margin: 26px auto; border: 1px solid #9ab6c4; background: #fbfdfe; box-shadow: 3px 3px 0 #dbe7ec; }
.title { padding: 7px 12px; border-bottom: 1px solid #9ab6c4; background: #d9edf5; color: #225577; font-weight: bold; }
.content { padding: 18px; }
h1 { margin: 0 0 10px; font-size: 15px; color: #ee6b32; }
p { margin: 6px 0; }
.what { display: block; margin: 10px 0 14px; padding: 6px 9px; background: #fff; border: 1px solid #cbd9df; color: #225577; font-family: Verdana, monospace; word-break: break-all; }
.note { color: #6d7a82; }
.back { margin-top: 18px; padding-top: 10px; border-top: 1px dotted #9ab6c4; }
a { color: #225577; font-weight: bold; text-decoration: none; }
a:hover { color: #ee4411; }
</style>
</head>
<body>
  <div class="frame">
    <div class="title">fstory.net ${snapshot.date} · 복원되지 않은 자료</div>
    <div class="content">
      <h1 id="headline">이 자료는 복원하지 못했습니다</h1>
      <code class="what" id="what">(주소 정보 없음)</code>
      <p id="reason">당시 인터넷 아카이브가 이 주소를 저장하지 않아 원본이 남아 있지 않습니다.</p>
      <p class="note">복원본은 공개 보관본에서 회수할 수 있는 범위까지만 담고 있습니다. 없는 내용을 지어내지 않기 위해 빈 자리를 그대로 두었습니다.</p>
      <div class="back"><a href="javascript:history.back()">← 이전 화면으로</a></div>
    </div>
  </div>
<script>
(function () {
  var reasons = {
    page: '당시 인터넷 아카이브가 이 페이지를 저장하지 않아 원본이 남아 있지 않습니다.',
    board: '제로보드 게시판의 이 글은 서버에서 그때그때 만들어 보여 주던 화면입니다. 정적 보관본에는 남아 있지 않습니다.',
    media: '배경 음악과 동영상 파일은 인터넷 아카이브가 저장하지 않았습니다.',
    form: '글쓰기·검색·로그인 같은 기능은 서버 프로그램이 처리하던 것이라 정적 복원본에서는 동작하지 않습니다.',
    cyworld: '싸이월드 미니홈피는 서비스가 종료되어 원본 자료를 회수할 수 없습니다.',
    external: '이 메뉴는 다른 사이트에 있던 자료를 불러왔습니다. 그 서비스가 문을 닫아 원본을 볼 수 없습니다.'
  };
  var params = new URLSearchParams(location.search);
  var what = params.get('p');
  var kind = params.get('k');
  if (what) document.getElementById('what').textContent = what;
  if (kind && reasons[kind]) document.getElementById('reason').textContent = reasons[kind];
  if (kind === 'board') document.getElementById('headline').textContent = '게시판 글이 보관되지 않았습니다';
  if (kind === 'media') document.getElementById('headline').textContent = '음악·영상 파일이 보관되지 않았습니다';
  if (kind === 'external') document.getElementById('headline').textContent = '연결된 바깥 서비스가 문을 닫았습니다';
  if (kind === 'form') document.getElementById('headline').textContent = '이 기능은 동작하지 않습니다';
})();
</script>
</body>
</html>
`;

const placeholderDocument = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 120" preserveAspectRatio="xMidYMid meet" role="img" aria-label="복원되지 않은 그림">
  <rect x="0.5" y="0.5" width="159" height="119" fill="#f3f4ef" stroke="#b9bdb2" stroke-dasharray="4 3"/>
  <path d="M34 84 L64 50 L84 72 L100 58 L126 84 Z" fill="#d8dcd0"/>
  <circle cx="106" cy="40" r="9" fill="#d8dcd0"/>
  <text x="80" y="106" font-family="Dotum, sans-serif" font-size="11" fill="#7c8377" text-anchor="middle">그림 없음</text>
</svg>
`;

const countFiles = async (directory) => {
  if (!existsSync(directory)) return 0;
  let total = 0;
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    total += entry.isDirectory() ? await countFiles(path.join(directory, entry.name)) : 1;
  }
  return total;
};

// One edition is one design generation, not one capture. Wayback crawled the
// same site many times without the site changing, so publishing every capture
// separately would offer a visitor nine near-identical copies and hide the fact
// that only six designs ever existed. Each generation is published once, built
// from every capture that belongs to it: the representative capture defines
// what the page says, and the others only fill in files its crawl happened to
// miss. Which captures share a generation is decided by scripts/fstory-lineage.mjs
// from the composed frame chrome, the menu link set and the DOM skeleton hash.
const publishEdition = async ({ lineage, captures }) => {
  const { representative } = lineage;
  const date = captures.find(([timestamp]) => timestamp === representative)?.[1] ?? captures.at(-1)[1];
  const timestamp = representative;
  const destination = path.join(destinationRoot, representative);
  // Supporting captures first, oldest to newest, then the representative last.
  // `cp` overwrites, so the representative always wins a collision and the rest
  // contribute only what it does not already have.
  const order = [
    ...captures.map(([id]) => id).filter((id) => id !== representative),
    representative,
  ];
  const manifests = [];
  for (const id of order) {
    manifests.push([id, await loadManifest(path.join(sourceRoot, id, 'manifest.json'))]);
  }
  const records = manifests.flatMap(([, items]) => items);
  const localPathOf = (item) => item.snapshotPath || item.sitePath;
  // Later entries overwrite earlier ones, so the representative's own idea of
  // where a file came from is the one that survives.
  const originalByLocal = new Map(records.map((item) => [localPathOf(item), item.original]));
  const occupied = new Set(records.map((item) => localPathOf(item).toLowerCase()));
  const onDisk = new Map();          // lowercase relative path -> actual relative path
  const renamed = new Map();         // lowercase original address -> published path

  // Regenerate from scratch so a rerun is deterministic and never inherits
  // artefacts of an earlier version of this script.
  await rm(destination, { recursive: true, force: true });
  await mkdir(destination, { recursive: true });
  const contributed = [];
  for (const id of order) {
    const before = await countFiles(destination);
    await cp(path.join(sourceRoot, id, 'files'), destination, { recursive: true, force: true, preserveTimestamps: true });
    const after = await countFiles(destination);
    contributed.push({ capture: id, newFiles: after - before, representative: id === representative });
  }

  // Luke's own Cyworld mini-hompy gets a dedicated notice before the reference
  // sweep runs, so those menus land on the page that shows the real address and
  // the surviving artwork instead of the generic "not restored" card.
  const isFinalEdition = timestamp === '20030726202839';
  await writeFile(
    path.join(destination, CYWORLD_NOTICE),
    cyworldNoticeDocument(
      isFinalEdition ? "Fstory's Homepage ver 3.0 &gt; Cyworld" : "Fstory's Homepage ver 2.0 &gt; Cyworld",
      isFinalEdition,
    ),
    'utf8',
  );
  if (isFinalEdition) {
    await cp(cyworldComebackImage, path.join(destination, CYWORLD_IMAGE), { force: true, preserveTimestamps: true });
  }
  const cyworldRewrites = await routeCyworld(destination);
  if (!cyworldRewrites && !isFinalEdition) await rm(path.join(destination, CYWORLD_NOTICE), { force: true });

  const stats = {
    rewrittenReferences: 0, restoredFromArchive: 0, aliasResolved: 0, caseResolved: 0,
    placeholderImages: 0, droppedBackgrounds: 0, disabledDownloads: 0, disabledMedia: 0,
    disabledForms: 0, noticeLinks: 0, unresolvedKept: 0, extensionsAdded: 0,
    staticised: 0, guestbookMerged: 0,
    externalImages: 0, externalAssets: 0, externalFrames: 0, externalLinks: 0,
  };

  // Zeroboard stored uploaded icons with no file extension, and the site served
  // them anyway. A static host cannot: `trailingSlash` turns an extensionless
  // path into a 308 redirect and the picture never arrives. Give each one the
  // extension its own bytes declare, and remember the original name so every
  // reference still resolves.
  const SIGNATURES = [
    ['.gif', Buffer.from('GIF8', 'ascii')],
    ['.png', Buffer.from([0x89, 0x50, 0x4e, 0x47])],
    ['.jpg', Buffer.from([0xff, 0xd8, 0xff])],
    ['.bmp', Buffer.from('BM', 'ascii')],
  ];
  const addExtensions = async (directory) => {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const file = path.join(directory, entry.name);
      if (entry.isDirectory()) { await addExtensions(file); continue; }
      if (path.extname(entry.name)) continue;
      const head = (await readFile(file)).subarray(0, 8);
      const match = SIGNATURES.find(([, signature]) => head.subarray(0, signature.length).equals(signature));
      if (!match) continue;
      const relative = path.relative(destination, file).replaceAll('\\', '/');
      const next = `${relative}${match[0]}`;
      await cp(file, path.join(destination, next), { force: true, preserveTimestamps: true });
      await rm(file, { force: true });
      renamed.set(relative.toLowerCase(), next);
      stats.extensionsAdded += 1;
    }
  };

  const indexDisk = async (directory) => {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const file = path.join(directory, entry.name);
      if (entry.isDirectory()) { await indexDisk(file); continue; }
      const relative = path.relative(destination, file).replaceAll('\\', '/');
      onDisk.set(relative.toLowerCase(), relative);
    }
  };
  await addExtensions(destination);

  // Every board page here is an archived rendering that happens to carry a
  // server-side extension. Left as `.php` or `.cgi` a static host either offers
  // it as a download or refuses it outright, so the whole tree is published as
  // plain HTML. The original addresses stay in the archive manifest and in the
  // links, which are rewritten to match.
  const toStatic = async (directory) => {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const file = path.join(directory, entry.name);
      if (entry.isDirectory()) { await toStatic(file); continue; }
      const extension = path.extname(entry.name).toLowerCase();
      if (!DYNAMIC.has(extension)) continue;
      const relative = path.relative(destination, file).replaceAll('\\', '/');
      const next = `${relative.slice(0, -extension.length)}.html`;
      await cp(file, path.join(destination, next), { force: true, preserveTimestamps: true });
      await rm(file, { force: true });
      renamed.set(relative.toLowerCase(), next);
      stats.staticised += 1;
    }
  };
  await toStatic(destination);

  // The guestbook was captured one page at a time, so no single capture holds
  // every post. Publish the merged rebuild instead of whichever page the
  // crawler happened to fetch. See scripts/merge-fstory-guestbook.mjs.
  const guestbookTarget = path.join(destination, 'chollian/cgi/pury/purybbs.html');
  if (existsSync(guestbookTarget) && existsSync(mergedGuestbook)) {
    await cp(mergedGuestbook, guestbookTarget, { force: true, preserveTimestamps: true });
    stats.guestbookMerged = 1;
  }

  await indexDisk(destination);

  const restored = [];
  const unresolved = new Map();

  const pullFromArchive = async (record, wanted) => {
    // Board pages restored mid-sweep have to become plain HTML too, or three
    // stray `.php` files survive the conversion.
    const extension = path.extname(wanted).toLowerCase();
    const relative = DYNAMIC.has(extension) ? `${wanted.slice(0, -extension.length)}.html` : wanted;
    if (relative !== wanted) renamed.set(wanted.toLowerCase(), relative);
    const output = path.join(destination, relative);
    if (!existsSync(output)) {
      await mkdir(path.dirname(output), { recursive: true });
      await cp(path.join(objectsRoot, record.objectPath), output, { force: true, preserveTimestamps: true });
    }
    onDisk.set(relative.toLowerCase(), relative);
    occupied.add(relative.toLowerCase());
    restored.push({ url: record.original, path: relative, capturedAt: record.timestamp, mimetype: record.mimetype, sha256: record.sha256 });
    stats.restoredFromArchive += 1;
    return relative;
  };

  // Resolve one reference to a relative path inside this snapshot, restoring the
  // file from the wider archive when the capture window happened to miss it.
  const resolve = async (raw, sourceRelative) => {
    const value = raw.replace(/&amp;/gi, '&').trim();
    if (!value || /^(?:#|javascript:|mailto:|tel:|data:|about:)/i.test(value)) return { kind: 'ignore' };
    const base = originalByLocal.get(sourceRelative) || `http://fstory.net/${sourceRelative}`;
    let url;
    try { url = new URL(value, base); } catch { return { kind: 'ignore' }; }
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return { kind: 'ignore' };
    const own = ownPathOf(url);
    if (own === null) return { kind: 'external', url };

    let relative = decodeURIComponent(own).replace(/^\/+/, '') || 'index.html';
    if (relative.endsWith('/')) relative += 'index.html';
    // These two are written after the sweep, so a plain on-disk check would call
    // them missing and wrap an already-rewritten notice link in a second one.
    if (relative === NOTICE_PAGE || relative === PLACEHOLDER_IMAGE) {
      return { kind: 'local', relative, url };
    }
    if (relative.split('/').includes('..')) return { kind: 'missing', url, relative };

    const attempts = [relative];
    const extended = renamed.get(relative.toLowerCase());
    if (extended) attempts.unshift(extended);
    const aliased = aliasOf(relative);
    if (aliased) attempts.push(aliased);

    for (const candidate of attempts) {
      const isAlias = candidate !== relative;
      const exact = onDisk.get(candidate.toLowerCase());
      if (exact) {
        if (isAlias) stats.aliasResolved += 1;
        else if (exact !== candidate) stats.caseResolved += 1;
        return { kind: 'local', relative: exact, url };
      }
      const canonical = canonicalOf(new URL(`http://fstory.net/${candidate}${url.search}`).href);
      const exactArchive = byCanonical.get(canonical);
      if (exactArchive?.length) {
        const record = closestTo(exactArchive, timestamp);
        const target = record.sitePath;
        if (!occupied.has(target.toLowerCase()) || onDisk.has(target.toLowerCase())) {
          if (isAlias) stats.aliasResolved += 1;
          return { kind: 'local', relative: await pullFromArchive(record, target), url };
        }
      }
      // Query-free lookup is safe for static assets but never for board scripts,
      // where a different query means different content.
      const extension = path.extname(candidate).toLowerCase();
      if (!htmlExtensions.has(extension) || !url.search) {
        const byPath = bySitePath.get(candidate.toLowerCase());
        if (byPath?.length) {
          const record = closestTo(byPath, timestamp);
          if (isAlias) stats.aliasResolved += 1;
          return { kind: 'local', relative: await pullFromArchive(record, record.sitePath), url };
        }
      }
    }
    return { kind: 'missing', url, relative };
  };

  const noticeHref = (sourceRelative, url, kind) => {
    const notice = path.posix.relative(path.posix.dirname(sourceRelative), NOTICE_PAGE) || NOTICE_PAGE;
    const target = isFstory(url.hostname) ? `${url.pathname}${url.search}`.replace(/^\/+/, '/') : url.href;
    return `${notice}?p=${encodeURIComponent(target)}&k=${kind}`;
  };
  const placeholderHref = (sourceRelative) =>
    path.posix.relative(path.posix.dirname(sourceRelative), PLACEHOLDER_IMAGE) || PLACEHOLDER_IMAGE;
  const relativeTo = (sourceRelative, target) =>
    path.posix.relative(path.posix.dirname(sourceRelative), target) || path.posix.basename(target);

  const noteUnresolved = (url, treatment) => {
    const key = `${url.pathname}${url.search}`;
    const entry = unresolved.get(key) || { path: url.pathname, query: url.search, treatment, count: 0 };
    entry.count += 1;
    unresolved.set(key, entry);
  };

  const classify = (url) => {
    const extension = path.extname(url.pathname).toLowerCase();
    if (mediaExtensions.has(extension)) return 'media';
    if (downloadExtensions.has(extension)) return 'download';
    if (/\/(download|file_down)[^/]*\.(php|cgi|asp)$/i.test(url.pathname)) return 'download';
    if (/\.(php|cgi|asp)$/i.test(url.pathname)) return 'board';
    if (imageExtensions.has(extension)) return 'image';
    return 'page';
  };

  const rewriteTag = async (whole, name, body, selfClose, sourceRelative) => {
    const tag = name.toLowerCase();
    const attributes = ALL_ATTRIBUTES[tag];
    if (!attributes) return whole;
    // Splice by index: period markup writes `src = "x"` as often as `src="x"`,
    // so a reconstructed `key=value` needle would silently miss half of them.
    const edits = [];
    let extra = '';

    for (const match of body.matchAll(ATTRIBUTE_PATTERN)) {
      const [attributeText, key, rawValue] = match;
      if (!attributes.includes(key.toLowerCase())) continue;
      const value = attributeValue(rawValue);
      const quote = quoteFor(rawValue);
      const at = match.index;
      const span = attributeText.length;
      const replace = (next) => edits.push([at, span, next]);

      if (FORM_ATTRIBUTES[tag]?.includes(key.toLowerCase())) {
        replace(`data-unrestored-action=${quote}${value}${quote}`);
        continue;
      }

      const outcome = await resolve(value, sourceRelative);
      if (outcome.kind === 'ignore') continue;

      // Nothing outside fstory.net was archived, and every inline picture or
      // frame those hosts served has been gone for two decades. Replace them so
      // no visitor meets a broken image or an empty frame; keep the address in a
      // data attribute as evidence. Ordinary outbound links stay untouched
      // unless the service behind them is known to have closed.
      if (outcome.kind === 'external') {
        const attribute = key.toLowerCase();
        if (EMBED_ATTRIBUTES[tag]?.includes(attribute)) {
          if (tag === 'img' || tag === 'input') {
            replace(`${key}=${quote}${placeholderHref(sourceRelative)}${quote} data-unrestored-${attribute}=${quote}${value}${quote}`);
            stats.externalImages += 1;
          } else {
            replace(`data-unrestored-${attribute}=${quote}${value}${quote}`);
            stats.externalAssets += 1;
          }
        } else if (FRAME_ATTRIBUTES[tag]?.includes(attribute)) {
          replace(`${key}=${quote}${noticeHref(sourceRelative, outcome.url, 'external')}${quote}`);
          stats.externalFrames += 1;
        } else if (BACKGROUND_ATTRIBUTES[tag]?.includes(attribute)) {
          replace(`data-unrestored-background=${quote}${value}${quote}`);
          stats.externalAssets += 1;
        } else if (NAVIGATION_ATTRIBUTES[tag]?.includes(attribute) && isRetiredHost(outcome.url.hostname)) {
          replace(`${key}=${quote}${noticeHref(sourceRelative, outcome.url, 'external')}${quote}`);
          stats.externalLinks += 1;
        }
        continue;
      }

      if (outcome.kind === 'local') {
        const next = relativeTo(sourceRelative, outcome.relative) + (outcome.url.search || '') + (outcome.url.hash || '');
        if (next !== value) { replace(`${key}=${quote}${next}${quote}`); stats.rewrittenReferences += 1; }
        continue;
      }

      const category = classify(outcome.url);
      const attribute = key.toLowerCase();
      if (BACKGROUND_ATTRIBUTES[tag]?.includes(attribute)) {
        replace(`data-unrestored-background=${quote}${value}${quote}`);
        stats.droppedBackgrounds += 1;
        noteUnresolved(outcome.url, 'background-dropped');
      } else if (EMBED_ATTRIBUTES[tag]?.includes(attribute)) {
        if (tag === 'script' || tag === 'link') {
          replace(`data-unrestored-${attribute}=${quote}${value}${quote}`);
          noteUnresolved(outcome.url, 'inert-asset');
        } else if (tag === 'embed' || tag === 'bgsound' || tag === 'object') {
          replace(`data-unrestored-${attribute}=${quote}${value}${quote}`);
          stats.disabledMedia += 1;
          noteUnresolved(outcome.url, 'media-disabled');
        } else {
          replace(`${key}=${quote}${placeholderHref(sourceRelative)}${quote} data-unrestored-${attribute}=${quote}${value}${quote}`);
          stats.placeholderImages += 1;
          noteUnresolved(outcome.url, 'placeholder-image');
        }
      } else if (FRAME_ATTRIBUTES[tag]?.includes(attribute)) {
        replace(`${key}=${quote}${noticeHref(sourceRelative, outcome.url, category === 'board' ? 'board' : 'page')}${quote}`);
        stats.noticeLinks += 1;
        noteUnresolved(outcome.url, 'notice-frame');
      } else if (NAVIGATION_ATTRIBUTES[tag]?.includes(attribute)) {
        if (category === 'download' || category === 'media') {
          const reason = category === 'download'
            ? '원본 파일이 보관되지 않아 내려받을 수 없습니다'
            : '원본 음악·영상 파일이 보관되지 않았습니다';
          replace(`data-unrestored-href=${quote}${value}${quote} title=${quote}${reason}${quote}`);
          extra = ' data-unrestored="disabled"';
          if (category === 'download') stats.disabledDownloads += 1; else stats.disabledMedia += 1;
          noteUnresolved(outcome.url, category === 'download' ? 'download-disabled' : 'media-disabled');
        } else {
          replace(`${key}=${quote}${noticeHref(sourceRelative, outcome.url, category === 'board' ? 'board' : 'page')}${quote}`);
          stats.noticeLinks += 1;
          noteUnresolved(outcome.url, 'notice-link');
        }
      }
    }

    if (tag === 'form' && !/data-unrestored\s*=/.test(body)) {
      extra = ' onsubmit="return false" data-unrestored="form"';
      stats.disabledForms += 1;
    }
    if (!edits.length && !extra) return whole;
    let nextBody = '';
    let cursor = 0;
    for (const [at, span, next] of edits) {
      nextBody += body.slice(cursor, at) + next;
      cursor = at + span;
    }
    nextBody += body.slice(cursor);
    return `<${name}${nextBody}${extra}${selfClose}>`;
  };

  // Zeroboard writes its popup and row-click URLs into inline script, sometimes
  // built at runtime ("view_info.php?member_no=" + no) and sometimes inside
  // doubly-quoted PHP output. No attribute rewrite reaches those, and the board
  // itself is unrestorable, so resolve every script-borne board URL literal and
  // point the dead ones at the notice page.
  // A leaked PHP template ("+homepage+") or a runtime-built board URL. The two
  // alternatives let a single-quoted literal hold double quotes and vice versa,
  // which is exactly how Zeroboard's generated markup nests them.
  // Parentheses are excluded so a whole `onclick="window.open('…')"` value can
  // never be mistaken for the URL it contains.
  const SCRIPT_URL_LITERAL = /'([^'()<>\s]*(?:\.(?:php|cgi|asp)|"\+|\+")[^'()<>\s]*)'|"([^"()<>\s]*(?:\.(?:php|cgi|asp)|'\+|\+')[^"()<>\s]*)"/gi;
  const rewriteScriptLiterals = async (text, sourceRelative) => {
    const edits = [];
    for (const match of [...text.matchAll(SCRIPT_URL_LITERAL)]) {
      const literal = match[1] ?? match[2];
      if (!literal || literal.includes(NOTICE_PAGE)) continue;
      const leaked = /["']\+|\+["']/.test(literal);
      const outcome = leaked && !/\.(?:php|cgi|asp)/i.test(literal) ? null : await resolve(literal, sourceRelative);
      if (outcome && outcome.kind !== 'missing') continue;
      const notice = path.posix.relative(path.posix.dirname(sourceRelative), NOTICE_PAGE) || NOTICE_PAGE;
      const next = outcome
        ? noticeHref(sourceRelative, outcome.url, 'board')
        : `${notice}?p=${encodeURIComponent(literal)}&k=board`;
      edits.push([match.index + 1, literal.length, next]);
      stats.noticeLinks += 1;
      if (outcome) noteUnresolved(outcome.url, 'notice-script-literal');
      else noteUnresolved({ pathname: literal, search: '' }, 'notice-script-template');
    }
    if (!edits.length) return text;
    let output = '';
    let cursor = 0;
    for (const [at, span, next] of edits) {
      output += text.slice(cursor, at) + next;
      cursor = at + span;
    }
    return output + text.slice(cursor);
  };

  const rewriteText = async (text, sourceRelative, extension) => {
    let output = text;
    if (htmlExtensions.has(extension)) {
      const replacements = [];
      for (const tag of scanTags(output)) {
        replacements.push([tag.whole, await rewriteTag(tag.whole, tag.name, tag.body, tag.selfClose, sourceRelative), tag.index]);
      }
      let cursor = 0;
      let rebuilt = '';
      for (const [original, next, index] of replacements) {
        if (next === original) continue;
        rebuilt += output.slice(cursor, index) + next;
        cursor = index + original.length;
      }
      output = rebuilt + output.slice(cursor);
    }

    if (htmlExtensions.has(extension) || extension === '.js') {
      output = await rewriteScriptLiterals(output, sourceRelative);
      for (const match of [...output.matchAll(SCRIPT_IMAGE_PATTERN)]) {
        const [whole, assignment, quote, literal, concatenation] = match;
        if (!literal) continue;
        const outcome = await resolve(literal, sourceRelative);
        if (outcome.kind === 'local' && !concatenation) {
          const next = relativeTo(sourceRelative, outcome.relative) + (outcome.url.search || '');
          if (next !== literal) { output = output.replace(whole, `${assignment}${quote}${next}${quote}`); stats.rewrittenReferences += 1; }
        } else if (outcome.kind === 'missing' || outcome.kind === 'external') {
          // Drop the concatenation too, so nothing is appended to the placeholder.
          output = output.replace(whole, `${assignment}${quote}${placeholderHref(sourceRelative)}${quote}`);
          stats.placeholderImages += 1;
          if (outcome.kind === 'missing') noteUnresolved(outcome.url, 'placeholder-script-image');
          else stats.externalImages += 1;
        }
      }

      const scriptTargets = [...output.matchAll(SCRIPT_URL_PATTERN)];
      for (const match of scriptTargets) {
        const outcome = await resolve(match[3], sourceRelative);
        if (outcome.kind === 'local') {
          const next = relativeTo(sourceRelative, outcome.relative) + (outcome.url.search || '');
          if (next !== match[3]) { output = output.replace(match[0], `${match[1]}${match[2]}${next}${match[2]}`); stats.rewrittenReferences += 1; }
        } else if (outcome.kind === 'missing') {
          const category = classify(outcome.url);
          output = output.replace(match[0], `${match[1]}${match[2]}${noticeHref(sourceRelative, outcome.url, category === 'board' ? 'board' : 'page')}${match[2]}`);
          stats.noticeLinks += 1;
          noteUnresolved(outcome.url, 'notice-script');
        }
      }
    }

    const cssTargets = [...output.matchAll(CSS_URL_PATTERN)];
    for (const match of cssTargets) {
      const outcome = await resolve(match[2], sourceRelative);
      if (outcome.kind === 'local') {
        const next = relativeTo(sourceRelative, outcome.relative);
        if (next !== match[2]) { output = output.replace(match[0], `url(${match[1]}${next}${match[1]})`); stats.rewrittenReferences += 1; }
      } else if (outcome.kind === 'missing') {
        output = output.replace(match[0], `url(${match[1]}${placeholderHref(sourceRelative)}${match[1]})`);
        stats.placeholderImages += 1;
        noteUnresolved(outcome.url, 'placeholder-image');
      }
    }
    return output;
  };

  // Sweep every text file, including ones pulled in during the sweep itself.
  const processed = new Set();
  for (let guard = 0; guard < 12; guard += 1) {
    const pending = [...onDisk.values()].filter(
      (relative) => textExtensions.has(path.extname(relative).toLowerCase()) && !processed.has(relative),
    );
    if (!pending.length) break;
    for (const relative of pending) {
      processed.add(relative);
      const output = path.join(destination, relative);
      const extension = path.extname(relative).toLowerCase();
      const text = decode(await readFile(output));
      const rewritten = await rewriteText(text, relative, extension);
      await writeFile(output, withCharset(rewritten, extension), 'utf8');
    }
  }

  const paletteSource = onDisk.get('index.html') ? decode(await readFile(path.join(destination, 'index.html'))) : '';
  const bodyColour = /<body[^>]*bgcolor\s*=\s*["']?([^"'\s>]+)/i.exec(paletteSource)?.[1];
  const palette = `background: ${bodyColour && /^#?[0-9a-z]+$/i.test(bodyColour) ? (bodyColour.startsWith('#') ? bodyColour : `#${bodyColour}`.replace(/^#(white|black)$/i, '#ffffff')) : '#ffffff'}`;
  await writeFile(path.join(destination, NOTICE_PAGE), noticeDocument({ timestamp, date }, palette), 'utf8');
  await writeFile(path.join(destination, PLACEHOLDER_IMAGE), placeholderDocument, 'utf8');

  return {
    timestamp, date, lineage: lineage.id, cyworldRewrites,
    mergedFrom: contributed,
    originalFiles: records.length,
    publishedFiles: onDisk.size,
    ...stats,
    unresolvedUniquePaths: unresolved.size,
    unresolved: [...unresolved.values()].sort((a, b) => b.count - a.count),
    restored,
  };
};

const reports = [];
await mkdir(destinationRoot, { recursive: true });
// Anything left over from an earlier run that published one folder per capture.
for (const entry of await readdir(destinationRoot, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue;
  if (LINEAGES.some((lineage) => lineage.representative === entry.name)) continue;
  await rm(path.join(destinationRoot, entry.name), { recursive: true, force: true });
}
for (const lineage of LINEAGES) {
  const captures = SNAPSHOTS.filter(([, , id]) => id === lineage.id);
  if (!captures.some(([timestamp]) => timestamp === lineage.representative)) {
    throw new Error(`lineage "${lineage.id}" names a representative that is not one of its captures`);
  }
  reports.push(await publishEdition({ lineage, captures }));
}

// ------------------------------------------------ domain parking capture (L0)
//
// The July 2001 capture is the registrar's parking page. Its onload script
// appends `main.html` to whatever address it is served from and redirects there.
// That page was never archived, so under a static host the redirect produces a
// dead URL. Point the same redirect at the notice instead, and leave every other
// line of the page as the registrar wrote it.
const parkingRoot = path.join(destinationRoot, '20010715123146');
const parkingEntry = path.join(parkingRoot, 'index.html');
const parkingText = await readFile(parkingEntry, 'utf8');
const parkingNotice = `${NOTICE_PAGE}?p=%2Fmain.html&k=page`;
const parkingRewritten = parkingText.replace(
  /window\.location\s*=\s*document\.Login\.winurl\.value\s*\+\s*'\/?main\.html'/g,
  `window.location = '${parkingNotice}'`,
);
if (parkingRewritten === parkingText) {
  throw new Error('domain parking redirect not found — check the 2001-07-15 capture');
}
await writeFile(parkingEntry, parkingRewritten, 'utf8');

// ------------------------------------------------- classic edition (1998–2001.07)
//
// The July 2001 capture is the last surviving state of the pre-service homepage,
// not the September 2001 redesign. Merge its unique content into the curated
// 1998–2001.07 edition so visitors can actually reach it.
const july2001Root = path.join(destinationRoot, '20010723051951');
const july2001UniqueFiles = [
  'gallery/gallery3/Pic3.html',
  'gallery/gallery3/Pic4.html',
  'gallery/gallery3/EndW02_th.jpg',
  'mydoc/novel/short/22cen1.html',
  'mydoc/novel/short/22cen2.html',
  'mydoc/novel/short/b612_1.html',
  'mydoc/novel/short/b612_2.html',
  'notice/not_dat3.html',
];
for (const relative of july2001UniqueFiles) {
  const output = path.join(legacy1998Root, relative);
  await mkdir(path.dirname(output), { recursive: true });
  await cp(path.join(july2001Root, relative), output, { force: true, preserveTimestamps: true });
}
// Two things have to be re-aimed once these pages leave the 2001 tree.
// The full-size EndW images were never archived, so the sweep already swapped
// them for the placeholder — but the surviving thumbnail sits right beside the
// page, and a real picture beats a placeholder. And the gallery index lives one
// level higher in the curated edition than it did in 2001, so the "back to the
// gallery" link has to climb.
for (const page of ['Pic3.html', 'Pic4.html']) {
  const output = path.join(legacy1998Root, 'gallery/gallery3', page);
  const text = await readFile(output, 'utf8');
  const next = text
    .replace(/src="[^"]*_missing-image\.svg"\s*data-unrestored-src="[^"]*"/gi, 'src="EndW02_th.jpg"')
    .replace(/EndW0[12]\.jpg/gi, 'EndW02_th.jpg')
    .replace(/href=(["']?)gallery3\.html\1/gi, 'href="../gallery3.html"');
  if (/_missing-image\.svg/.test(next)) {
    throw new Error(`${page} still points at the placeholder after the merge`);
  }
  await writeFile(output, next, 'utf8');
}

const addBefore = async (relative, marker, addition) => {
  const output = path.join(legacy1998Root, relative);
  const text = await readFile(output, 'utf8');
  if (!text.includes(addition.trim())) {
    await writeFile(output, text.replace(marker, `${addition}\n${marker}`), 'utf8');
  }
};
await addBefore('mydoc/novel/short/short.html', '<tr></table>', `
<td align=center height=40><a href="b612_1.html"><font color="000000" size=2>여행성 B612 (1)</font></a></td>
<td align=center><a href="b612_2.html"><font color="000000" size=2>여행성 B612 (2)</font></a></td>
<td align=center><a href="22cen1.html"><font color="000000" size=2>안녕하세요. 22세기입니다. (1)</font></a></td>
<td align=center bgcolor="00ee00"><a href="22cen2.html"><font color="000000" size=2>안녕하세요. 22세기입니다. (2)</font></a></td><tr>`);
await addBefore('notice/not_tab.html', '</table>', `
<td width=80 height=40 id="tab3" background="../tab.jpg" align=center onmouseover="tab3.background='../tab3.jpg'" onmouseout="tab3.background='../tab.jpg'">
  <a href="not_dat3.html" target="frame4"><font color="000000" size=2><b>공지사항3</b></font></a>
</td>`);
await addBefore('gallery/gallery3.html', '</table> </td><tr>', `
<tr><td colspan=4 align=center bgcolor="eeeeee">
  <font size=2><b>2001년 7월 마지막 캡처에서 복구</b></font><br>
  <a href="gallery3/Pic3.html"><img src="gallery3/EndW02_th.jpg" width=100 border=0 alt="1999년 공포의 대왕 삭제 버전"></a>
  <a href="gallery3/Pic4.html"><img src="gallery3/EndW02_th.jpg" width=100 border=0 alt="1999년 공포의 대왕 무삭제 버전"></a>
</td></tr>`);

// ---------------------------------------------- curated 1997 / 1998 editions
//
// The Atelier opens these two editions on the same desktop as the archived
// captures, so a visitor meets them under the same promise: no dead menu and no
// broken picture. They are hand-kept files rather than archive output, so the
// repair here is deliberately narrow — fix the one path mistake that hides
// pictures the edition already ships, then route whatever genuinely is not
// there to the same notice the captures use. Every original address is kept in
// a data attribute, so nothing is lost.
const curatedEditions = [
  { root: path.join(appRoot, 'public/1997-homepage'), label: '1997' },
  { root: legacy1998Root, label: '1998–2001.07' },
];
const curatedReports = [];

for (const edition of curatedEditions) {
  const onDisk = new Map();
  const indexEdition = async (directory) => {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const file = path.join(directory, entry.name);
      if (entry.isDirectory()) { await indexEdition(file); continue; }
      const relative = path.relative(edition.root, file).replaceAll('\\', '/');
      onDisk.set(relative.toLowerCase(), relative);
    }
  };

  // The gallery pages were written when they sat one directory higher, so they
  // climb one level too far and land outside the edition. Every one of those
  // targets exists inside it.
  let climbFixes = 0;
  const dropExtraClimb = async (directory) => {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const file = path.join(directory, entry.name);
      if (entry.isDirectory()) { await dropExtraClimb(file); continue; }
      if (!htmlExtensions.has(path.extname(entry.name).toLowerCase())) continue;
      const text = await readFile(file, 'utf8');
      const relative = path.relative(edition.root, file).replaceAll('\\', '/');
      const next = text.replace(/(\.\.\/)+main_hall\//g, (match) => {
        const climbed = path.posix.normalize(path.posix.join(path.posix.dirname(relative), match));
        if (!climbed.startsWith('..')) return match;
        const inside = path.posix.relative(path.posix.dirname(relative), 'main_hall');
        return `${inside}/`;
      });
      if (next !== text) { await writeFile(file, next, 'utf8'); climbFixes += 1; }
    }
  };
  await dropExtraClimb(edition.root);
  await indexEdition(edition.root);

  await writeFile(
    path.join(edition.root, NOTICE_PAGE),
    noticeDocument({ date: edition.label }, 'background: #ffffff'),
    'utf8',
  );
  await writeFile(path.join(edition.root, PLACEHOLDER_IMAGE), placeholderDocument, 'utf8');
  onDisk.set(NOTICE_PAGE.toLowerCase(), NOTICE_PAGE);
  onDisk.set(PLACEHOLDER_IMAGE.toLowerCase(), PLACEHOLDER_IMAGE);

  // One place that knows how these pages address a file. They were authored on
  // Windows in a browser that forgave backslash separators, a `..` that climbs
  // past the site root, and any mix of upper and lower case.
  const resolveInEdition = (relative, rawValue) => {
    const bare = rawValue.split('?')[0].split('#')[0];
    let literal;
    try { literal = decodeURIComponent(bare); } catch { literal = bare; }
    literal = literal.replaceAll('\\', '/');
    const joined = path.posix.normalize(path.posix.join(path.posix.dirname(relative), literal));
    const clamped = path.posix.normalize(literal.replace(/^(\.\.\/)+/, '').replace(/^\/+/, ''));
    return {
      literal,
      target: joined,
      actual: onDisk.get(joined.toLowerCase()) ?? onDisk.get(clamped.toLowerCase()) ?? null,
    };
  };

  let noticeLinks = 0;
  let placeholders = 0;
  let caseFixes = 0;
  let recoveredLinks = 0;
  const missing = new Map();
  const repair = async (directory) => {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const file = path.join(directory, entry.name);
      if (entry.isDirectory()) { await repair(file); continue; }
      if (!htmlExtensions.has(path.extname(entry.name).toLowerCase())) continue;
      if (entry.name === NOTICE_PAGE) continue;
      const relative = path.relative(edition.root, file).replaceAll('\\', '/');
      const text = await readFile(file, 'utf8');
      const edits = [];
      for (const tag of scanTags(text)) {
        const name = tag.name.toLowerCase();
        const attributes = ALL_ATTRIBUTES[name];
        if (!attributes) continue;
        for (const match of tag.body.matchAll(ATTRIBUTE_PATTERN)) {
          const [attributeText, key, rawValue] = match;
          const attribute = key.toLowerCase();
          if (!attributes.includes(attribute)) continue;
          const value = attributeValue(rawValue).trim();
          const quote = quoteFor(rawValue);
          if (!value || /^(?:#|javascript:|mailto:|tel:|data:|about:|https?:|\/\/)/i.test(value)) continue;
          const at = tag.index + (tag.whole.length - tag.body.length - 1 - tag.selfClose.length) + match.index;
          // A rerun starts from the already-repaired file. Read what the earlier
          // run recorded instead of re-deriving it, so the report keeps telling
          // the truth about how much was never there.
          if (value.includes(NOTICE_PAGE)) {
            const recorded = /[?&]p=([^&"']*)/.exec(value);
            if (recorded) {
              const original = decodeURIComponent(recorded[1]).replace(/^\/+/, '');
              // A page that was missing on an earlier run may exist now — the
              // 1997 poems, for one, were recovered from later editions. Send
              // the menu back to the real thing.
              const back = resolveInEdition(relative, original).actual;
              if (back) {
                const href = path.posix.relative(path.posix.dirname(relative), back) || path.posix.basename(back);
                edits.push([at, attributeText.length, `${key}=${quote}${href}${quote}`]);
                recoveredLinks += 1;
                continue;
              }
              missing.set(original, (missing.get(original) || 0) + 1);
              noticeLinks += 1;
            }
            continue;
          }
          if (value.endsWith(PLACEHOLDER_IMAGE)) {
            const recorded = new RegExp(`data-unrestored-${attribute}\\s*=\\s*("[^"]*"|'[^']*'|[^\\s>]+)`, 'i').exec(tag.body);
            if (recorded) {
              const original = attributeValue(recorded[1]);
              const back = resolveInEdition(relative, original).actual;
              if (back) {
                const href = path.posix.relative(path.posix.dirname(relative), back) || path.posix.basename(back);
                edits.push([at, attributeText.length, `${key}=${quote}${href}${quote}`]);
                recoveredLinks += 1;
                continue;
              }
              missing.set(original, (missing.get(original) || 0) + 1);
              placeholders += 1;
            }
            continue;
          }
          const suffix = value.slice(value.split('?')[0].split('#')[0].length);
          const { literal, target, actual } = resolveInEdition(relative, value);
          // The 1997 server did not care about case, so pages ask for
          // `space.jpg` while the file is `space.JPG`. On a case-sensitive host
          // that is a 404 for a picture that is right there.
          if (actual) {
            if (actual === target && literal === value.split('?')[0].split('#')[0]) continue;
            const corrected = path.posix.relative(path.posix.dirname(relative), actual) || path.posix.basename(actual);
            edits.push([at, attributeText.length, `${key}=${quote}${corrected}${suffix}${quote}`]);
            caseFixes += 1;
            continue;
          }
          const notice = path.posix.relative(path.posix.dirname(relative), NOTICE_PAGE) || NOTICE_PAGE;
          const placeholder = path.posix.relative(path.posix.dirname(relative), PLACEHOLDER_IMAGE) || PLACEHOLDER_IMAGE;
          missing.set(target, (missing.get(target) || 0) + 1);
          if (name === 'img' || name === 'input') {
            edits.push([at, attributeText.length, `${key}=${quote}${placeholder}${quote} data-unrestored-${attribute}=${quote}${value}${quote}`]);
            placeholders += 1;
          } else if (BACKGROUND_ATTRIBUTES[name]?.includes(attribute)) {
            edits.push([at, attributeText.length, `data-unrestored-background=${quote}${value}${quote}`]);
          } else {
            edits.push([at, attributeText.length, `${key}=${quote}${notice}?p=${encodeURIComponent(`/${target}`)}&k=page${quote}`]);
            noticeLinks += 1;
          }
        }
      }
      if (!edits.length) continue;
      edits.sort((a, b) => a[0] - b[0]);
      let output = '';
      let cursor = 0;
      for (const [at, span, next] of edits) {
        output += text.slice(cursor, at) + next;
        cursor = at + span;
      }
      await writeFile(file, output + text.slice(cursor), 'utf8');
    }
  };
  await repair(edition.root);
  curatedReports.push({
    edition: edition.label, files: onDisk.size, climbFixes, caseFixes, recoveredLinks, noticeLinks, placeholders,
    unresolvedUniquePaths: missing.size,
    unresolved: [...missing.entries()].map(([target, count]) => ({ target, count })).sort((a, b) => b.count - a.count),
  });
}

// ------------------------------------------------------------------------ reports

const versionSummary = JSON.parse(await readFile(path.join(archiveRoot, 'summary.json'), 'utf8'));
const totals = (key) => reports.reduce((sum, item) => sum + item[key], 0);
const cyworldRewrites = totals('cyworldRewrites');

await writeFile(path.join(destinationRoot, 'restoration-report.json'), `${JSON.stringify({
  method: 'Exact canonical fstory.net URL matches recovered from another archived timestamp, plus one archive-corroborated directory rename. No filename-only guesses and no invented artwork.',
  generatedAt: new Date().toISOString(),
  pathAliases: PATH_ALIASES,
  retiredHosts: RETIRED_HOSTS,
  totals: {
    publishedFiles: totals('publishedFiles'),
    restoredFromArchive: totals('restoredFromArchive'),
    aliasResolved: totals('aliasResolved'),
    caseResolved: totals('caseResolved'),
    rewrittenReferences: totals('rewrittenReferences'),
    placeholderImages: totals('placeholderImages'),
    droppedBackgrounds: totals('droppedBackgrounds'),
    disabledDownloads: totals('disabledDownloads'),
    disabledMedia: totals('disabledMedia'),
    disabledForms: totals('disabledForms'),
    noticeLinks: totals('noticeLinks'),
    externalImages: totals('externalImages'),
    externalAssets: totals('externalAssets'),
    externalFrames: totals('externalFrames'),
    externalLinks: totals('externalLinks'),
    staticised: totals('staticised'),
    guestbookMerged: totals('guestbookMerged'),
    cyworldRewrites,
  },
  // The served report stays a summary. The full per-reference detail is large
  // and belongs in the data layer, not in the public folder.
  snapshots: reports.map(({ restored, unresolved, ...summary }) => ({
    ...summary,
    unresolvedTopPaths: unresolved.slice(0, 20),
  })),
  curatedEditions: curatedReports.map(({ unresolved, ...summary }) => ({
    ...summary,
    unresolvedTopPaths: unresolved.slice(0, 20),
  })),
}, null, 2)}\n`);

await writeFile(path.join(archiveRoot, 'restoration-detail.json'), `${JSON.stringify({
  generatedBy: 'scripts/publish-fstory-homepages.mjs',
  snapshots: reports,
  curatedEditions: curatedReports,
}, null, 2)}\n`);

await writeFile(path.join(destinationRoot, 'snapshots.json'), `${JSON.stringify({
  source: 'Internet Archive Wayback Machine captures of fstory.net',
  generatedFrom: '../data/fstory-net-wayback/versions/reconstructed',
  note: 'One entry per design generation, each merged from every capture that belongs to it. The captures are listed under builtFrom as evidence, not as separate restore points.',
  annexes: ANNEXES,
  editions: LINEAGES.map((lineage) => {
    const report = reports.find((item) => item.lineage === lineage.id);
    const captures = SNAPSHOTS.filter(([, , id]) => id === lineage.id);
    return {
      id: lineage.id,
      label: lineage.label,
      period: lineage.period,
      summary: lineage.summary,
      entry: `/fstory-homepage/${lineage.representative}/index.html`,
      representativeCapture: lineage.representative,
      publishedFileCount: report?.publishedFiles ?? 0,
      restoredFileCount: report?.restoredFromArchive ?? 0,
      unresolvedUniquePaths: report?.unresolvedUniquePaths ?? 0,
      builtFrom: captures.map(([timestamp, date, , description]) => ({
        timestamp,
        date,
        description,
        representative: timestamp === lineage.representative,
        archivedFileCount: versionSummary.snapshots?.find((item) => item.timestamp === timestamp)?.files ?? null,
        newFilesContributed: report?.mergedFrom?.find((item) => item.capture === timestamp)?.newFiles ?? 0,
      })),
    };
  }),
}, null, 2)}\n`);

// An annex is only offered if its entry actually landed in the published tree.
for (const annex of ANNEXES) {
  const entry = path.join(destinationRoot, annex.snapshot, annex.entry);
  if (!existsSync(entry)) {
    throw new Error(`annex "${annex.id}" points at a missing page: ${annex.snapshot}/${annex.entry}`);
  }
}

// The Atelier restore-point picker reads this generated module, so the UI can
// never drift from the lineage analysis that produced the snapshots.
const uiEditions = LINEAGES.map((lineage) => {
  const captures = SNAPSHOTS.filter(([, , id]) => id === lineage.id);
  const representative = captures.find(([timestamp]) => timestamp === lineage.representative);
  return {
    id: lineage.id,
    label: lineage.label,
    period: lineage.period,
    summary: lineage.summary,
    directory: lineage.representative,
    date: representative[1],
    // Kept so the picker can say what a merged edition was built from, and so a
    // reader can check the lineage claim against the archive itself.
    builtFrom: captures.map(([timestamp, date]) => ({ timestamp, date })),
  };
});
await writeFile(path.join(appRoot, 'src/data/fstoryArchive.ts'), `// Generated by scripts/publish-fstory-homepages.mjs — do not edit by hand.
// Source of truth: scripts/fstory-lineage.mjs

export type FstoryEditionId = ${LINEAGES.map((item) => `'${item.id}'`).join(' | ')};

export type FstoryCaptureId = ${SNAPSHOTS.map(([timestamp]) => `'${timestamp}'`).join(' | ')};

export type FstoryCapture = {
    timestamp: FstoryCaptureId;
    date: string;
};

// One entry per design generation. Every capture that belongs to a generation is
// merged into it, so these are editions of the site, not crawler visits.
export type FstoryEdition = {
    id: FstoryEditionId;
    label: string;
    period: string;
    summary: string;
    directory: FstoryCaptureId;
    date: string;
    builtFrom: FstoryCapture[];
};

export const FSTORY_EDITIONS: FstoryEdition[] = ${JSON.stringify(uiEditions, null, 4)};

export type FstoryAnnex = {
    id: string;
    label: string;
    period: string;
    snapshot: FstoryCaptureId;
    entry: string;
    summary: string;
};

// Earlier addresses the later editions never link back to. Offered as their own
// restore points so the recovered pages are reachable.
export const FSTORY_ANNEXES: FstoryAnnex[] = ${JSON.stringify(ANNEXES, null, 4)};

export const FSTORY_EDITION_IDS = FSTORY_EDITIONS.map((edition) => edition.id);

export const editionOf = (id: string) => FSTORY_EDITIONS.find((edition) => edition.id === id);
`, 'utf8');

console.log(JSON.stringify({
  editions: LINEAGES.length,
  mergedFromCaptures: SNAPSHOTS.length,
  publishedFiles: totals('publishedFiles'),
  restoredFromArchive: totals('restoredFromArchive'),
  aliasResolved: totals('aliasResolved'),
  caseResolved: totals('caseResolved'),
  rewrittenReferences: totals('rewrittenReferences'),
  placeholderImages: totals('placeholderImages'),
  droppedBackgrounds: totals('droppedBackgrounds'),
  disabledDownloads: totals('disabledDownloads'),
  disabledMedia: totals('disabledMedia'),
  disabledForms: totals('disabledForms'),
  noticeLinks: totals('noticeLinks'),
  externalImages: totals('externalImages'),
  externalAssets: totals('externalAssets'),
  externalFrames: totals('externalFrames'),
  externalLinks: totals('externalLinks'),
  staticised: totals('staticised'),
  guestbookMerged: totals('guestbookMerged'),
  cyworldRewrites,
  destinationRoot,
}, null, 2));
