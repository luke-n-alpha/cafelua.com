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
import { ANNEXES, BGM_TRACKS, GALLERY_MATCHES, RECENT_ANIME, CURATED_EDITIONS, LINEAGES, MERGED_EDITION, PATH_ALIASES, RETIRED_HOSTS, SNAPSHOTS, SPAM_PAGES } from './fstory-lineage.mjs';

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
// A pane inside a frameset is furniture, not a destination. Telling a visitor
// there that something is missing puts a notice card in the middle of a page
// they did not ask a question about, so an unrestorable pane gets a quiet one
// instead. What was there is still recorded on the frame and in the report.
const QUIET_PANE = '_quiet.html';
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
// `<meta http-equiv="refresh" content="0; url=...">`. The kept editions use it
// to bridge a case difference — Crack_ftp.html forwards to crack_ftp.html — so
// leaving it unrewritten leaves a redirect pointing at a file nobody copied.
const META_REFRESH_PATTERN = /(<meta[^>]*http-equiv\s*=\s*["']?refresh["']?[^>]*content\s*=\s*["'][^"']*?url\s*=\s*)([^"';\s]+)/gi;
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

// ------------------------------------------------- Luke's own surviving copies
//
// The pictures on this site were Luke's own, and he kept the 1997 and
// 1998–2001.07 editions himself. When Wayback never stored a picture, the same
// file is often still sitting in one of those two folders, because the site
// carried its artwork forward every time it was rebuilt.
//
// Matching by filename is exactly what this restoration refuses to do
// everywhere else, and for good reason: the Zeroboard skins ship the same
// filenames in a dozen colour variants. The exception holds here because both
// source folders are Luke's own hand-kept copies of this same site rather than
// third-party artwork, and because skin trees are excluded outright below.
// Every hit records where it came from, so a wrong one is findable.
const curatedRoots = [
  { label: '1998-homepage', root: path.join(appRoot, 'public/1998-homepage') },
  { label: '1997-homepage', root: path.join(appRoot, 'public/1997-homepage') },
];
const curatedByName = new Map();
// Pages are matched on the whole path, never on the filename alone. A page is
// the site's writing, and two files called `poe_tab.html` in different folders
// are different writing; a picture called `face.jpg` is the same photograph
// wherever the site filed it.
const curatedByPath = new Map();
const indexCurated = async (root, label, directory = root) => {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) { await indexCurated(root, label, file); continue; }
    const relative = path.relative(root, file).replaceAll('\\', '/');
    const extension = path.extname(entry.name).toLowerCase();
    if (htmlExtensions.has(extension)) {
      // Two files can differ only by case — the edition ships `Crack_ftp.html`
      // as a meta-refresh to `crack_ftp.html`, which holds the actual page.
      // Keep both, so a request gets the one it actually named and never a
      // redirect pointing back at a file that was not copied.
      const key = relative.toLowerCase();
      curatedByPath.set(key, [...(curatedByPath.get(key) || []), { label, file, relative }]);
      continue;
    }
    if (!imageExtensions.has(extension)) continue;
    const key = entry.name.toLowerCase();
    curatedByName.set(key, [...(curatedByName.get(key) || []), { label, file, relative }]);
  }
};
for (const { root, label } of curatedRoots) {
  if (existsSync(root)) await indexCurated(root, label);
}

// Rebuilt assets. These are not archive material and not Luke's own files: they
// are reconstructed from what did survive, and they are counted separately in
// every report so the distinction never blurs. See the script named in each
// folder's README for the evidence behind one.
// Keyed by the site path each file belongs to, because the skins deliberately
// reuse one filename across colour variants: `kissofgod_pink/t.gif` and
// `kissofgod_gray/t.gif` are different files and must stay that way.
const reconstructedRoot = path.join(dataRoot, 'manual/rebuilt');
const reconstructedByPath = new Map();
const indexReconstructed = async (directory = reconstructedRoot) => {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) { await indexReconstructed(file); continue; }
    const site = path.relative(reconstructedRoot, file).replaceAll('\\', '/');
    reconstructedByPath.set(site.toLowerCase(), { file, site });
  }
};
if (existsSync(reconstructedRoot)) await indexReconstructed();

// A colour-variant skin folder is the one place filenames genuinely lie, so the
// curated lookup never applies inside one.
const isSkinPath = (relative) => /(^|\/)(skin|skins|icon|images)\//i.test(relative);

// When the same filename survives in more than one place, prefer the copy whose
// folders overlap the address being restored.
const closestCurated = (candidates, wanted) => {
  const parts = wanted.toLowerCase().split('/').slice(0, -1);
  return [...candidates].sort((a, b) => {
    const score = (item) => item.relative.toLowerCase().split('/').slice(0, -1)
      .filter((segment) => parts.includes(segment)).length;
    return score(b) - score(a) || a.relative.length - b.relative.length;
  })[0];
};

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
/* This sits inside a 640x450 pane, so it has to fit without scrolling. */
body { margin: 0; background: #f0f9fb; color: #44515b; font: 12px/1.55 돋움, Dotum, 굴림, sans-serif; }
.frame { width: min(520px, calc(100% - 20px)); margin: 10px auto; border: 1px solid #9ab6c4; background: #f7fbfd; box-shadow: 3px 3px 0 #dce8ed; }
.title { padding: 7px 12px; border-bottom: 1px solid #9ab6c4; background: #d9edf5; color: #225577; font-weight: bold; }
.content { padding: 10px 14px 12px; text-align: center; }
.content img { display: block; width: 300px; max-width: 100%; height: auto; margin: 0 auto 10px; border: 1px solid #b7c6cc; }
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

// Scaling a JPEG needs a decoder, and the repository has one in the Python
// imaging library the sibling asset scripts already use. Shelling out keeps this
// script free of a new npm dependency for six files.
const makeThumbnail = async (source, output) => {
  const { execFile } = await import('node:child_process');
  const { promisify } = await import('node:util');
  await promisify(execFile)('python3', ['-c', `
from PIL import Image
import sys
source, output = sys.argv[1], sys.argv[2]
with Image.open(source) as image:
    picture = image.convert('RGB')
    height = 90
    width = max(1, round(picture.width * height / picture.height))
    picture.resize((width, height), Image.LANCZOS).save(output, quality=88)
`, source, output]);
};

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
    staticised: 0, guestbookMerged: 0, curatedRestored: 0, reconstructedAssets: 0, thumbnailsMade: 0,
    unpinnedBlocks: 0, curatedPages: 0, quietPanes: 0, groundedBodies: 0, clearedPlaceholders: 0, closedGalleryCells: 0, galleryFromDesk: 0,
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

    // A page the archive missed may still be in Luke's own copy of the site.
    // Matched on the full path, and on the path with an era prefix removed:
    // `netian/bbs/bbs_tab.html` is the same page as `bbs/bbs_tab.html`, filed
    // under the address the site lived at before the domain.
    if (htmlExtensions.has(path.extname(relative).toLowerCase())) {
      const withoutEra = relative.replace(/^(netian|chollian)\//i, '');
      const candidates = curatedByPath.get(relative.toLowerCase()) || curatedByPath.get(withoutEra.toLowerCase());
      // Prefer the file whose name matches exactly; fall back to the case-
      // insensitive match only when nothing matches outright.
      const kept = candidates?.find((item) => item.relative === relative || item.relative === withoutEra)
        || candidates?.[0];
      if (kept) {
        const output = path.join(destination, relative);
        if (!existsSync(output)) {
          await mkdir(path.dirname(output), { recursive: true });
          await cp(kept.file, output, { force: true, preserveTimestamps: true });
        }
        // Where the edition ships more than one spelling of the same path, take
        // them all. One of them is usually a redirect to the other, and copying
        // only the one that was asked for leaves that redirect pointing at
        // nothing — or, once rewritten case-insensitively, at itself.
        for (const sibling of candidates || []) {
          if (sibling === kept) continue;
          const prefix = relative.slice(0, relative.length - path.basename(relative).length);
          const alias = `${prefix}${path.basename(sibling.relative)}`;
          const aliasOutput = path.join(destination, alias);
          if (existsSync(aliasOutput)) continue;
          await mkdir(path.dirname(aliasOutput), { recursive: true });
          await cp(sibling.file, aliasOutput, { force: true, preserveTimestamps: true });
          onDisk.set(alias.toLowerCase(), alias);
          occupied.add(alias.toLowerCase());
          restored.push({ url: url.href, path: alias, from: `${sibling.label}/${sibling.relative}`, source: 'luke-kept-page' });
          stats.curatedPages += 1;
        }
        onDisk.set(relative.toLowerCase(), relative);
        occupied.add(relative.toLowerCase());
        restored.push({ url: url.href, path: relative, from: `${kept.label}/${kept.relative}`, source: 'luke-kept-page' });
        stats.curatedPages += 1;
        return { kind: 'local', relative, url };
      }
    }

    // Last resort before giving up on a picture: Luke's own kept copies, then
    // anything that has been deliberately rebuilt. A rebuilt file is addressed
    // by full path, so the skin exclusion that guards the filename lookup does
    // not apply to it.
    const extension = path.extname(relative).toLowerCase();
    if (imageExtensions.has(extension)) {
      const candidates = isSkinPath(relative) ? null : curatedByName.get(path.basename(relative).toLowerCase());
      if (candidates?.length) {
        const pick = closestCurated(candidates, relative);
        const output = path.join(destination, relative);
        if (!existsSync(output)) {
          await mkdir(path.dirname(output), { recursive: true });
          await cp(pick.file, output, { force: true, preserveTimestamps: true });
        }
        onDisk.set(relative.toLowerCase(), relative);
        occupied.add(relative.toLowerCase());
        restored.push({ url: url.href, path: relative, from: `${pick.label}/${pick.relative}`, source: 'luke-kept-copy' });
        stats.curatedRestored += 1;
        return { kind: 'local', relative, url, curated: pick };
      }

      // A gallery index asks for `X_th.jpg`, the thumbnail of `X.jpg`. Where the
      // full picture survives and only its thumbnail is gone, the thumbnail is
      // not missing information — it is the same picture, smaller. Every
      // surviving thumbnail in this archive is 90 pixels tall, so that is the
      // size used.
      const thumbnailOf = /^(.*)_th(\.[a-z]+)$/i.exec(path.basename(relative));
      if (thumbnailOf) {
        const fullName = `${thumbnailOf[1]}${thumbnailOf[2]}`.toLowerCase();
        const directory = path.posix.dirname(relative);
        const sameFolder = onDisk.get(path.posix.join(directory, fullName).toLowerCase());
        const kept = curatedByName.get(fullName);
        const origin = sameFolder
          ? path.join(destination, sameFolder)
          : kept?.length ? closestCurated(kept, relative).file : null;
        if (origin) {
          const output = path.join(destination, relative);
          if (!existsSync(output)) {
            await mkdir(path.dirname(output), { recursive: true });
            await makeThumbnail(origin, output);
          }
          onDisk.set(relative.toLowerCase(), relative);
          occupied.add(relative.toLowerCase());
          restored.push({ url: url.href, path: relative, from: sameFolder || 'curated', source: 'thumbnail-of-surviving-original' });
          stats.thumbnailsMade += 1;
          return { kind: 'local', relative, url };
        }
      }

      // A gallery thumbnail whose artwork survives on Luke's desk. Matched by
      // filename and by the drawing's own date; see GALLERY_MATCHES.
      const galleryMatch = GALLERY_MATCHES.find(
        (item) => item.thumb.toLowerCase() === path.basename(relative).toLowerCase(),
      );
      if (galleryMatch) {
        const stored = path.join(reconstructedRoot, 'gallery-thumbs', galleryMatch.thumb);
        if (existsSync(stored)) {
          const output = path.join(destination, relative);
          if (!existsSync(output)) {
            await mkdir(path.dirname(output), { recursive: true });
            await cp(stored, output, { force: true, preserveTimestamps: true });
          }
          onDisk.set(relative.toLowerCase(), relative);
          occupied.add(relative.toLowerCase());
          restored.push({
            url: url.href, path: relative, source: 'desk-artwork',
            from: galleryMatch.from || galleryMatch.title, title: galleryMatch.title, year: galleryMatch.year,
          });
          stats.galleryFromDesk += 1;
          return { kind: 'local', relative, url };
        }
      }

      const rebuilt = reconstructedByPath.get(relative.toLowerCase());
      if (rebuilt) {
        const output = path.join(destination, relative);
        if (!existsSync(output)) {
          await mkdir(path.dirname(output), { recursive: true });
          await cp(rebuilt.file, output, { force: true, preserveTimestamps: true });
        }
        onDisk.set(relative.toLowerCase(), relative);
        occupied.add(relative.toLowerCase());
        restored.push({ url: url.href, path: relative, from: `manual/rebuilt/${rebuilt.site}`, source: 'reconstructed' });
        stats.reconstructedAssets += 1;
        return { kind: 'local', relative, url, reconstructed: rebuilt };
      }
    }

    return { kind: 'missing', url, relative };
  };

  const noticeHref = (sourceRelative, url, kind) => {
    const notice = path.posix.relative(path.posix.dirname(sourceRelative), NOTICE_PAGE) || NOTICE_PAGE;
    const target = isFstory(url.hostname) ? `${url.pathname}${url.search}`.replace(/^\/+/, '/') : url.href;
    return `${notice}?p=${encodeURIComponent(target)}&k=${kind}`;
  };
  // A dead menu item used to take the visitor to a notice page, which meant
  // leaving whatever they were reading to be told that something does not
  // exist. Saying it in place is less disruptive: the click is intercepted, the
  // address and the reason are shown, and the page stays put.
  const alertLink = (url, kind) => {
    const target = isFstory(url.hostname) ? `${url.pathname}${url.search}`.replace(/^\/+/, '/') : url.href;
    const reasons = {
      page: '당시 인터넷 아카이브가 이 페이지를 저장하지 않았습니다.',
      board: '제로보드 게시판의 이 글은 서버가 그때그때 만들어 보여 주던 화면이라 정적 보관본에 남아 있지 않습니다.',
      external: '이 메뉴가 가리키던 바깥 서비스가 문을 닫았습니다.',
    };
    const message = `복원되지 않은 자료입니다.\n\n${target}\n\n${reasons[kind] || reasons.page}`;
    // Escaped for a double-quoted HTML attribute holding a single-quoted JS string.
    const escaped = message.replaceAll('\\', '\\\\').replaceAll("'", "\\'").replaceAll('"', '&quot;');
    return `href="#" onclick="alert('${escaped}');return false;"`;
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
          replace(NAVIGATION_ATTRIBUTES[tag]?.includes(attribute)
            ? `${alertLink(outcome.url, 'external')} data-unrestored-target=${quote}${value}${quote}`
            : `${key}=${quote}${noticeHref(sourceRelative, outcome.url, 'external')}${quote}`);
          stats.externalFrames += 1;
        } else if (BACKGROUND_ATTRIBUTES[tag]?.includes(attribute)) {
          replace(`data-unrestored-background=${quote}${value}${quote}`);
          stats.externalAssets += 1;
        } else if (NAVIGATION_ATTRIBUTES[tag]?.includes(attribute) && isRetiredHost(outcome.url.hostname)) {
          replace(NAVIGATION_ATTRIBUTES[tag]?.includes(attribute)
            ? `${alertLink(outcome.url, 'external')} data-unrestored-target=${quote}${value}${quote}`
            : `${key}=${quote}${noticeHref(sourceRelative, outcome.url, 'external')}${quote}`);
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
          const kind = category === 'board' ? 'board' : 'page';
          replace(`${alertLink(outcome.url, kind)} data-unrestored-target=${quote}${value}${quote}`);
          stats.noticeLinks += 1;
          noteUnresolved(outcome.url, 'alert-link');
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

      for (const match of [...output.matchAll(META_REFRESH_PATTERN)]) {
        const outcome = await resolve(match[2], sourceRelative);
        if (outcome.kind === 'local') {
          // A case-insensitive match can resolve a redirect onto the very file
          // that holds it, which is a loop. Leave it as written; the sibling
          // copy it names is published beside it.
          if (outcome.relative === sourceRelative) continue;
          const next = relativeTo(sourceRelative, outcome.relative) + (outcome.url.search || '');
          if (next !== match[2]) {
            output = output.replace(match[0], `${match[1]}${next}`);
            stats.rewrittenReferences += 1;
          }
        } else if (outcome.kind === 'missing') {
          output = output.replace(match[0], `${match[1]}${noticeHref(sourceRelative, outcome.url, 'page')}`);
          stats.noticeLinks += 1;
          noteUnresolved(outcome.url, 'notice-refresh');
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

  // One more pass over everything. A page pulled in near the end of the sweep —
  // from Luke's kept copies, say — can carry references that were resolvable
  // only once the rest of the tree existed. Rewriting is idempotent, so the
  // second pass changes nothing that was already right.
  processed.clear();
  for (const relative of [...onDisk.values()]) {
    if (!textExtensions.has(path.extname(relative).toLowerCase())) continue;
    const output = path.join(destination, relative);
    if (!existsSync(output)) continue;
    const extension = path.extname(relative).toLowerCase();
    const text = decode(await readFile(output));
    const rewritten = await rewriteText(text, relative, extension);
    await writeFile(output, withCharset(rewritten, extension), 'utf8');
  }

  // A picture the archive never held used to leave a dashed grey card saying
  // "그림 없음". Sixty of those down one page is not information, it is damage —
  // and on the front page they sit in the empty space below the content where
  // nothing was ever meant to be. Take the card out and let the layout close
  // up. The address stays on the element, so nothing is forgotten and dropping
  // a file in still brings the picture back.
  const clearPlaceholders = async (directory) => {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const file = path.join(directory, entry.name);
      if (entry.isDirectory()) { await clearPlaceholders(file); continue; }
      if (!htmlExtensions.has(path.extname(entry.name).toLowerCase())) continue;
      const text = decode(await readFile(file));
      if (!text.includes(PLACEHOLDER_IMAGE)) continue;
      let count = 0;
      const output = text.replace(/<img\b[^>]*>/gi, (tag) => {
        if (!tag.includes(PLACEHOLDER_IMAGE)) return tag;
        const wanted = /data-unrestored-src\s*=\s*("[^"]*"|'[^']*')/i.exec(tag);
        count += 1;
        return `<span data-unrestored-src=${wanted ? wanted[1] : '""'} hidden></span>`;
      });
      if (count) {
        await writeFile(file, output, 'utf8');
        stats.clearedPlaceholders += count;
      }
    }
  };
  await clearPlaceholders(destination);

  // A gallery is a grid of thumbnails and the archive lost a lot of them, so the
  // grid ends up with holes — and because these tables are drawn on black, a
  // hole is a black rectangle. Removing the cell alone does not fix it: the row
  // gets shorter while the table keeps its width, so the gap moves to the end
  // of the row.
  //
  // Rebuild the grid instead. Take the cells that still hold a picture, in the
  // order they were listed, and lay them out four to a row, so the gallery
  // reads as it would if the missing pictures had never been listed.
  const PER_ROW = 4;
  const rebuildGalleryGrid = async (directory) => {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const file = path.join(directory, entry.name);
      if (entry.isDirectory()) { await rebuildGalleryGrid(file); continue; }
      if (!htmlExtensions.has(path.extname(entry.name).toLowerCase())) continue;
      const relative = path.relative(destination, file).replaceAll('\\', '/');
      if (!/(^|\/)gallery/i.test(relative)) continue;
      const text = decode(await readFile(file));
      let changed = 0;
      const output = text.replace(/<table\b([^>]*)>([\s\S]*?)<\/table>/gi, (whole, attributes, inner) => {
        const cells = [...inner.matchAll(/<td\b[^>]*>([\s\S]*?)(?=<td\b|<\/tr>|<tr\b|$)/gi)];
        if (cells.length < 4) return whole;
        const kept = cells.map((cell) => cell[1]).filter((body) => /<img\b/i.test(body));
        const lost = cells.length - kept.length;
        if (!lost || !kept.length) return whole;
        const rows = [];
        for (let at = 0; at < kept.length; at += PER_ROW) {
          rows.push(`<tr>${kept.slice(at, at + PER_ROW)
            .map((body) => `<td align="center" valign="middle">${body.trim()}</td>`)
            .join('')}</tr>`);
        }
        changed += lost;
        return `<table${attributes}>${rows.join('')}</table>`;
      });
      if (changed) {
        await writeFile(file, output, 'utf8');
        stats.closedGalleryCells += changed;
      }
    }
  };
  await rebuildGalleryGrid(destination);

  // Zeroboard opened its member-info card in a popup window. Rewritten, that
  // became a popup carrying the "not restored" notice — a window opening just
  // to say no. Say it in place instead, the way every other dead link does.
  const quietenPopups = async (directory) => {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const file = path.join(directory, entry.name);
      if (entry.isDirectory()) { await quietenPopups(file); continue; }
      if (!htmlExtensions.has(path.extname(entry.name).toLowerCase())) continue;
      const text = decode(await readFile(file));
      if (!/_unrestored/i.test(text)) continue;
      let count = 0;
      const output = text.replace(
        // 답글 / 수정 / 삭제 belonged to the CGI, not to the page. The server
        // that answered them was switched off in 2003, so each one is a button
        // whose only remaining behaviour is to say it cannot do anything. The
        // writing beside them is the part that survived; the buttons go.
        /\s*<input\s+type="button"\s+value="(?:답글|수정|삭제)"[^>]*>/gi,
        () => { count += 1; return ''; },
      ).replace(
        // A plain link to the notice page, left behind by a rewrite path that
        // predates the in-place alert. Same treatment as the rest.
        /href="([^"]*_unrestored[^"]*)"/gi,
        (whole, notice) => {
          const wanted = /[?&]p=([^&"]+)/.exec(notice);
          const address = wanted ? decodeURIComponent(wanted[1]) : '';
          count += 1;
          const message = `복원되지 않은 자료입니다.\\n\\n${address}\\n\\n제로보드가 그때그때 만들어 보여 주던 화면입니다.`;
          return `href="#" onclick="alert('${message.replace(/'/g, "\\'")}');return false;"`;
        },
      ).replace(
        /(?:javascript:void\()?window\.open\('([^']*_unrestored[^']*)'[^)]*\)\)?/gi,
        (whole, notice) => {
          const wanted = /[?&]p=([^&']+)/.exec(notice);
          const address = wanted ? decodeURIComponent(wanted[1]) : '';
          count += 1;
          const message = `복원되지 않은 자료입니다.\\n\\n${address}\\n\\n제로보드가 그때그때 만들어 보여 주던 창입니다.`;
          return `#" onclick="alert('${message.replace(/'/g, "\\'")}');return false;`;
        },
      );
      if (count) {
        await writeFile(file, output, 'utf8');
        stats.quietPanes += count;
      }
    }
  };
  await quietenPopups(destination);

  // The gallery opened every picture in a second browser window, because in
  // 2002 that was the only way to show one at full size. This edition ends up
  // inside the atelier's Win98 screen, where a second window is a window the
  // visitor cannot see, so the picture is laid over the page instead: same
  // click, same full size, no window. The overlay is plain DOM, no library,
  // and it is only written into pages that actually link to a picture.
  const OVERLAY = `<div id="fs-view" style="display:none;position:fixed;left:0;top:0;right:0;bottom:0;background:rgba(0,0,0,.72);z-index:9999;text-align:center" onclick="fsHide()">
<div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);max-width:94%;max-height:94%">
<img id="fs-shot" src="" style="max-width:100%;max-height:88vh;border:3px solid #fff;background:#fff">
<iframe id="fs-page" src="" style="display:none;width:86vw;height:86vh;border:3px solid #fff;background:#fff" onclick="event.stopPropagation()"></iframe>
<div style="margin-top:6px;color:#fff;font-family:돋움,dotum,sans-serif;font-size:9pt">아무 곳이나 누르면 닫힙니다</div>
</div></div>
<script>
function fsShow(src, asPage) {
  var box = document.getElementById('fs-view');
  var shot = document.getElementById('fs-shot');
  var page = document.getElementById('fs-page');
  if (asPage) { page.src = src; page.style.display = ''; shot.style.display = 'none'; }
  else { shot.src = src; shot.style.display = ''; page.style.display = 'none'; }
  box.style.display = '';
  return false;
}
function fsHide() {
  var box = document.getElementById('fs-view');
  box.style.display = 'none';
  document.getElementById('fs-shot').src = '';
  document.getElementById('fs-page').src = '';
}
document.onkeydown = function (event) { if ((event || window.event).keyCode === 27) fsHide(); };
</script>`;

  const PICTURE = /\.(jpe?g|gif|png|bmp)$/i;
  const openInPlace = async (directory) => {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const file = path.join(directory, entry.name);
      if (entry.isDirectory()) { await openInPlace(file); continue; }
      if (!htmlExtensions.has(path.extname(entry.name).toLowerCase())) continue;
      const text = decode(await readFile(file));
      let count = 0;
      // Counted apart from `count`: aiming a link at a frame changes the page
      // but needs no overlay, and the two must not be confused.
      let aimed = 0;
      const framed = /target\s*=\s*"content"/i.test(text);

      let output = text
        // window.open('Ybs10.jpg', 'new', 'width=660,height=500') — the gallery's
        // own way of showing a picture.
        .replace(/window\.open\(\s*'([^']+)'\s*,[^)]*\)/gi, (whole, address) => {
          if (!PICTURE.test(address) || /^https?:/i.test(address)) return whole;
          // Opening a picture that is not there lays an empty sheet over the
          // page. If it is gone, it stays unopened.
          if (!existsSync(path.join(path.dirname(file), address))) return whole;
          count += 1;
          return `fsShow('${address}')`;
        })
        // <a href="sungdo.jpg" target=_blank>, and the two Christmas card pages
        // that open the same way.
        .replace(/<a\b([^>]*)>/gi, (whole, attributes) => {
          if (/onclick=/i.test(attributes)) return whole;
          if (!/target\s*=\s*"?_blank"?/i.test(attributes)) return whole;
          const wanted = /href\s*=\s*"([^"]+)"/i.exec(attributes);
          if (!wanted) return whole;
          const address = wanted[1];
          if (/^(https?:|#|mailto:)/i.test(address)) return whole;
          const asPage = !PICTURE.test(address);
          if (asPage && !/\.html?$/i.test(address)) return whole;
          if (!existsSync(path.join(path.dirname(file), address.split('?')[0]))) return whole;
          // A menu that writes into a named frame keeps writing into it. Only
          // 링크 in the top menu ever carried _blank, and the other twenty-four
          // entries beside it name the frame; that one is an oversight in the
          // 2002 markup, not a picture waiting to be shown.
          if (asPage && framed) {
            aimed += 1;
            return `<a${attributes.replace(/target\s*=\s*"?_blank"?/i, 'target="content"')}>`;
          }
          count += 1;
          const stripped = attributes.replace(/\s*target\s*=\s*"?_blank"?/i, '');
          return `<a${stripped} onclick="return fsShow('${address}'${asPage ? ', true' : ''})">`;
        });

      if (!count) {
        if (aimed) await writeFile(file, output, 'utf8');
        continue;
      }
      // The overlay goes in once per page, at the end, where it cannot disturb
      // a 2002 table that counts on its own row order.
      output = /<\/body>/i.test(output)
        ? output.replace(/<\/body>/i, `${OVERLAY}\n</body>`)
        : `${output}\n${OVERLAY}`;
      await writeFile(file, output, 'utf8');
      stats.inPlacePictures = (stats.inPlacePictures || 0) + count;
    }
  };
  await openInPlace(destination);

  // A picture the archive never kept used to answer a click with a message
  // saying so. Luke's instruction is plainer than that: if it is lost, the link
  // goes. The artwork that did survive — the thumbnail — stays on the page as a
  // picture, and nothing about it invites a click that leads nowhere.
  //
  // One of these was worse than doing nothing. The gallery ran its picture
  // through onClick, so quietening it wrote a second onclick beside the first;
  // browsers obey the first, which by then held only "#". Those cells did not
  // even manage to say no.
  const LOST = /alert\('복원되지 않은 자료입니다[^']*'\)\s*;?\s*return false;?/i;
  let killed = 0;
  const dropLostClicks = async (directory) => {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const file = path.join(directory, entry.name);
      if (entry.isDirectory()) { await dropLostClicks(file); continue; }
      if (!htmlExtensions.has(path.extname(entry.name).toLowerCase())) continue;
      const text = decode(await readFile(file));
      if (!/onClick="#"/i.test(text) && !/data-unrestored-target/i.test(text)) continue;
      let count = 0;

      let output = text
        // The picture cells: onClick="#" plus the message that followed it.
        .replace(/\s*onClick="#"\s*onclick="[^"]*"/gi, () => { count += 1; return ''; })
        .replace(/\s*onClick="#"/gi, () => { count += 1; return ''; });

      // A link wrapping a picture that is gone: keep what is inside it, drop
      // the link. Galleries never nest one anchor inside another.
      output = output.replace(
        /<a\b[^>]*onclick="[^"]*"[^>]*>([\s\S]*?)<\/a>/gi,
        (whole, inner) => {
          if (!LOST.test(whole) || /<a\b/i.test(inner)) return whole;
          const wanted = /data-unrestored-target\s*=\s*"([^"]+)"/i.exec(whole);
          if (!wanted || !PICTURE.test(wanted[1].split('?')[0])) return whole;
          count += 1;
          return inner;
        },
      );

      if (!count) continue;
      await writeFile(file, output, 'utf8');
      killed += count;
    }
  };
  await dropLostClicks(destination);
  if (killed) stats.lostClicksDropped = (stats.lostClicksDropped || 0) + killed;

  // Pages that hard-code a white body sit inside a frame tiled with the site's
  // own strip — #bce2eb blue and #8e7fb0 violet — so plain white reads as a
  // hole punched in the middle of it. Luke set the inner pages against that
  // frame deliberately; where a page names white outright, give it the pale
  // tone from the same palette instead. Table cells keep whatever they say,
  // since white there is usually a panel drawn on purpose.
  const GROUND = '#f0f9fb';
  const groundBodies = async (directory) => {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const file = path.join(directory, entry.name);
      if (entry.isDirectory()) { await groundBodies(file); continue; }
      if (!htmlExtensions.has(path.extname(entry.name).toLowerCase())) continue;
      const text = decode(await readFile(file));
      let touched = 0;
      const output = text.replace(/<body([^>]*)>/gi, (whole, attributes) => {
        if (/background\s*=/i.test(attributes)) return whole;
        const next = attributes.replace(/bgcolor\s*=\s*["']?(?:white|#?ffffff)["']?/i, () => {
          touched += 1;
          return `bgcolor="${GROUND}"`;
        });
        return touched ? `<body${next}>` : whole;
      });
      if (touched) {
        await writeFile(file, output, 'utf8');
        stats.groundedBodies += touched;
      }
    }
  };
  await groundBodies(destination);

  // A block positioned at a fixed offset was placed against a picture that sat
  // beside it. Where that picture is gone, the offset points at nothing and the
  // block lands on top of the rest of the page — on the AI corner, Multi's
  // dialogue ends up over the headings below it.
  //
  // Only blocks inside a table cell whose own table lost a picture are touched.
  // Zeroboard's absolutely positioned layers sit directly under <body> and are
  // left alone, so this reaches the two pages that actually break.
  const unpinFloatingText = async (directory) => {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const file = path.join(directory, entry.name);
      if (entry.isDirectory()) { await unpinFloatingText(file); continue; }
      if (!htmlExtensions.has(path.extname(entry.name).toLowerCase())) continue;
      const text = decode(await readFile(file));
      if (!/position\s*:\s*absolute/i.test(text) || !text.includes(PLACEHOLDER_IMAGE)) continue;

      let changed = false;
      const output = text.replace(
        /<(span|div)([^>]*?)style\s*=\s*"([^"]*position\s*:\s*absolute[^"]*)"([^>]*)>/gi,
        (whole, tag, head, style, tail, at) => {
          const before = text.slice(0, at);
          if (before.lastIndexOf('<td') <= before.lastIndexOf('</table>')) return whole;
          const tableAt = before.lastIndexOf('<table');
          if (tableAt < 0) return whole;
          if (!text.slice(tableAt, at + 1500).includes(PLACEHOLDER_IMAGE)) return whole;
          const relaxed = style
            .replace(/position\s*:\s*absolute\s*;?/gi, '')
            .replace(/(?:left|top|height)\s*:\s*[^;"]*;?/gi, '')
            .replace(/;\s*;/g, ';')
            .trim();
          changed = true;
          return `<${tag}${head}style="${relaxed}" data-unpinned="${style.replace(/"/g, '&quot;')}"${tail}>`;
        },
      );
      if (changed) {
        await writeFile(file, output, 'utf8');
        stats.unpinnedBlocks += 1;
      }
    }
  };
  await unpinFloatingText(destination);

  const paletteSource = onDisk.get('index.html') ? decode(await readFile(path.join(destination, 'index.html'))) : '';
  const bodyColour = /<body[^>]*bgcolor\s*=\s*["']?([^"'\s>]+)/i.exec(paletteSource)?.[1];
  const palette = `background: ${bodyColour && /^#?[0-9a-z]+$/i.test(bodyColour) ? (bodyColour.startsWith('#') ? bodyColour : `#${bodyColour}`.replace(/^#(white|black)$/i, '#ffffff')) : '#ffffff'}`;
  await writeFile(path.join(destination, NOTICE_PAGE), noticeDocument({ timestamp, date }, palette), 'utf8');
  await writeFile(path.join(destination, PLACEHOLDER_IMAGE), placeholderDocument, 'utf8');
  await writeFile(path.join(destination, QUIET_PANE), `<!doctype html>
<html lang="ko">
<head><meta charset="utf-8"><title> </title>
<style>html,body{margin:0;height:100%;${palette};}</style>
</head>
<body></body>
</html>
`, 'utf8');

  // Point every unrestorable pane at it. Frames only — a link still says what
  // it cannot reach, because there the visitor asked.
  const quietenPanes = async (directory) => {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const file = path.join(directory, entry.name);
      if (entry.isDirectory()) { await quietenPanes(file); continue; }
      if (!htmlExtensions.has(path.extname(entry.name).toLowerCase())) continue;
      const text = decode(await readFile(file));
      if (!/<i?frame[^>]*_unrestored/i.test(text)) continue;
      const relative = path.relative(destination, file).replaceAll('\\', '/');
      const quiet = path.posix.relative(path.posix.dirname(relative), QUIET_PANE) || QUIET_PANE;
      let count = 0;
      const output = text.replace(/<(i?frame)([^>]*?)src\s*=\s*"([^"]*_unrestored[^"]*)"/gi, (whole, tag, head, src) => {
        count += 1;
        const wanted = /[?&]p=([^&"]+)/.exec(src);
        const address = wanted ? decodeURIComponent(wanted[1]) : '';
        return `<${tag}${head}src="${quiet}" data-unrestored-pane="${address.replace(/"/g, '&quot;')}"`;
      });
      if (count) {
        await writeFile(file, output, 'utf8');
        stats.quietPanes += count;
      }
    }
  };
  await quietenPanes(destination);

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

// ------------------------------------------------------- merged ver 2.0 edition
//
// The archive caught this era three times and each catch was partial. Offering
// three thin copies of one site serves nobody, so they are published once more
// as a single edition: every file any capture holds, wearing the chrome of the
// capture that still renders.
//
// Two rules, in this order. Content: later wins, because the site only grew.
// Chrome: the 2002-11-20 capture wins outright, because its side menu, its
// background and its character art all survive, while the 5-pane redesign lost
// its backdrop and reads as a black page.
const mergedMenuNotes = [];
{
  const merged = path.join(destinationRoot, MERGED_EDITION.directory);
  await rm(merged, { recursive: true, force: true });
  await mkdir(merged, { recursive: true });
  for (const capture of MERGED_EDITION.contributors) {
    await cp(path.join(destinationRoot, capture), merged, { recursive: true, force: true, preserveTimestamps: true });
  }

  // The frame chrome, put back the way the rendering capture had it. Every other
  // file keeps whatever the newest capture contributed.
  const chrome = path.join(destinationRoot, MERGED_EDITION.chrome);
  const chromeFiles = (await readdir(chrome, { withFileTypes: true }))
    .filter((entry) => entry.isFile() && /\.(html?|gif|jpg|css|js)$/i.test(entry.name))
    .map((entry) => entry.name);
  for (const name of chromeFiles) {
    await cp(path.join(chrome, name), path.join(merged, name), { force: true, preserveTimestamps: true });
  }
  await cp(path.join(chrome, 'img'), path.join(merged, 'img'), { recursive: true, force: true, preserveTimestamps: true });

  // Buttons drawn for corners that never had one in this menu. The rendering
  // capture cannot supply them because its menu never carried those entries.
  const rebuiltButtons = path.join(reconstructedRoot, 'img');
  if (existsSync(rebuiltButtons)) {
    for (const entry of await readdir(rebuiltButtons, { withFileTypes: true })) {
      if (!entry.isFile()) continue;
      const target = path.join(merged, 'img', entry.name);
      if (existsSync(target)) continue;
      await cp(path.join(rebuiltButtons, entry.name), target, { force: true, preserveTimestamps: true });
    }
  }

  // The side menu is rewritten rather than patched. The original hard-codes
  // `rowspan=13` against a twelve-entry list and opens rows with a bare <tr>
  // after each <td>, so adding one entry collapses the whole column. Luke wrote
  // that markup by hand and has said it need not be preserved literally, so the
  // merged edition gets the same menu in markup that holds its shape.
  //
  // Every entry that still leads somewhere is here, gathered from all three
  // captures: the 2001 menu's 인공지능, the 2002 menu's 찻집, and the corners the
  // 5-pane redesign carried in its top bar. Entries whose target is genuinely
  // gone keep their place and say so when clicked, the way they do elsewhere.
  // Where an entry points is chosen per corner, not per capture. The 2002 menu
  // aimed 일기 at diary/diary.html, which by then was a Zeroboard frame and is
  // therefore empty; the 2001 menu aimed it at diary/frame.html, which still
  // holds the actual diary — "2002_02_16 요즘 중고부품들을 모아 제 컴퓨터를 만드느라
  // 좀 바쁩니다" and the memo pane beside it.
  const MENU = [
    ['dia', '일기', 'diary/frame.html'],
    ['pro', '프로필', 'profile/profile.html'],
    ['gal', '겔러리', 'gallery/gallery.html'],
    // 앨범 and 여행기·관람기 are dropped: both open a page whose own links were
    // all handed to Zeroboard or Cyworld, so they arrive somewhere with nothing
    // left to read. The pages stay published.
    ['present', '축전', 'gallery/present/present.html'],
    ['let', '내 글', 'myletter/myletter.html'],
    ['stu', '공부', 'study/study.html'],
    // 신기술 is gone from the list. Three of its five entries — 영화속의AI,
    // AI Techknowledge, My AI Study — are already reached through 인공지능, and
    // the other two were handed to Cyworld, so the button mostly led to a
    // service that closed. The pages themselves stay published.
    ['ai', '인공지능', 'ai/ai.html'],
    ['wince', 'WinCE', 'insidece/wince.html'],
    ['kor', '한국 에니메이션 음악', 'kani/kani.html'],
    ['media', '최신 애니 감상록', 'media/media.html'],
    ['tea', '숲속얘기의 찻집', 'teatime/teatime.html'],
    ['lin', '링크', 'link/index.html'],
    // 방명록 is dropped from the menu at Luke's request. The board it reached
    // was 천리안's, from an address the ver 2.0 menu never carried, and its
    // 91 recovered posts stay published and reachable under chollian/.
    // 크리스챤 and 내 게시판 are dropped too. The first lived at
    // fstory.com.ne.kr, of which the archive holds not one file; the second was
    // a Zeroboard the server drew on request. Neither can be reached, so the
    // menu no longer offers a button that only ever says no.
  ];

  const rows = [];
  for (const [stem, label, target, goneAddress] of MENU) {
    const button = `img/${stem}_n.gif`;
    const hover = `img/${stem}_y.gif`;
    if (!existsSync(path.join(merged, button))) continue;
    const reachable = target && existsSync(path.join(merged, target));
    if (!reachable && !goneAddress) continue;
    const anchor = reachable
      ? `<a href="${target}" target="screen">`
      : `<a href="#" onclick="alert('복원되지 않은 자료입니다.\\n\\n${goneAddress}\\n\\n당시 인터넷 아카이브가 저장하지 않았거나, 서버가 그때그때 만들어 보여 주던 화면입니다.');return false;" data-unrestored-target="${goneAddress}">`;
    rows.push(`      <tr><td height="30" align="center">
        ${anchor}<img src="${button}" width="84" height="28" border="0" alt="${label}"
          onmouseover="this.src='${hover}'" onmouseout="this.src='${button}'"></a>
      </td></tr>`);
    if (reachable) mergedMenuNotes.push(`${label} → ${target}`);
  }

  const characterArt = existsSync(path.join(merged, 'img/charic.gif'))
    ? `      <tr><td height="96" align="center">
        <a href="javascript:mail('webmaster@fstory.net')"><img src="img/charic.gif" border="0" alt="주인장에게 편지"></a>
      </td></tr>`
    : '';

  // Frames that were left showing the "not restored" card, where the corner has
  // a surviving page of the same subject. The AI corner's left pane called
  // ai/movie/movie1.html, which was never archived; tech/movie/movie.html is
  // that very list — "영화/게임/에니 등의 상상속의 AI에 대한 개인적 고찰", with 투하트의
  // 멀티 and AI의 DAVID under it — and the tech menu links it as 영화속의AI.
  const FRAME_STANDINS = [
    ['ai/ai.html', /%2Fai%2Fmovie%2Fmovie1\.html/i, '../tech/movie/movie.html'],
  ];
  for (const [page, wanted, standin] of FRAME_STANDINS) {
    const target = path.join(merged, page);
    if (!existsSync(target)) continue;
    const resolved = path.join(path.dirname(target), standin);
    if (!existsSync(resolved)) continue;
    const text = await readFile(target, 'utf8');
    // By this point the pane may already have been quietened, so match either
    // the original notice link or the blank pane that replaced it.
    const address = decodeURIComponent(wanted.source.replace(/\\/g, ''));
    const next = text
      .replace(new RegExp(`src="[^"]*_unrestored[^"]*${wanted.source}[^"]*"`, 'i'), `src="${standin}"`)
      .replace(
        new RegExp(`src="[^"]*_quiet\\.html"(\\s+data-unrestored-pane="[^"]*${address.replace(/[.*+?^$()|[\]\\]/g, '\\$&')}[^"]*")`, 'i'),
        `src="${standin}"$1`,
      );
    if (next !== text) {
      await writeFile(target, next, 'utf8');
      mergedMenuNotes.push(`${page} 프레임 → ${standin}`);
    }
  }

  // 투하트의 멀티 was written for a 400px column, which is what the review pane
  // was in 2002. It is read through the 640px picture frame now, so the text
  // wrapped early and left a third of the frame empty beside it. Give the
  // table the width the frame actually offers.
  {
    const review = path.join(merged, 'tech/movie/multi/multi.html');
    if (existsSync(review)) {
      const text = await readFile(review, 'utf8');
      const next = text.replace(/<table width=400>/i, '<table width=620>');
      if (next !== text) {
        await writeFile(review, next, 'utf8');
        mergedMenuNotes.push('투하트의 멀티 감상 폭을 화면에 맞췄다');
      }
    }
  }

  // movie.html is read through the AI corner's 300px window, so a link inside
  // it that does not name a frame loads the whole review into that window —
  // 투하트의 멀티 arriving as a column of text three words wide. Its sister pane,
  // tech1.html, carries target="screen" in the 2002 markup itself; this one
  // never did, because in 2002 it was only ever opened full width. Aim it at
  // the same picture frame the rest of the site writes into.
  {
    const list = path.join(merged, 'tech/movie/movie.html');
    if (existsSync(list)) {
      const text = await readFile(list, 'utf8');
      const next = text.replace(/<a href="((?!http|#)[^"]+\.html)"(?![^>]*target=)/gi, '<a href="$1" target="screen"');
      if (next !== text) {
        await writeFile(list, next, 'utf8');
        mergedMenuNotes.push('영화속의 AI 목록이 큰 화면으로 열리게 했다');
      }
    }
  }

  // The AI corner shows its two sub-corners through 300x202 windows against
  // pages a little taller than that, so the scrollbar was the frame coming up
  // short rather than more to read. Give the row the height the pages need and
  // turn scrolling off: nothing is hidden and nothing scrolls.
  {
    const target = path.join(merged, 'ai/ai.html');
    if (existsSync(target)) {
      const text = await readFile(target, 'utf8');
      let count = 0;
      const next = text
        .replace(/(<td[^>]*\s)height=\d+(\s)/gi, '$1height=170$2')
        .replace(/<iframe\b([^>]*)>/gi, (whole, attributes) => {
          if (!/name\s*=\s*(movie|tech)\b/i.test(attributes)) return whole;
          count += 1;
          const sized = attributes
            .replace(/height\s*=\s*'?\d+'?/i, "height='168'")
            .replace(/scrolling\s*=\s*'?\w+'?/i, "scrolling='no'");
          return `<iframe${sized}>`;
        });
      if (count) {
        await writeFile(target, next, 'utf8');
        mergedMenuNotes.push(`ai/ai.html 창 ${count}개를 내용 높이에 맞춰 스크롤을 없앴다`);
      }
    }
  }

  // 최신 애니 감상록 played each opening through a Windows Media Player object.
  // The video it streamed is gone and no browser runs that control any more, so
  // the pages show the opening from YouTube instead — same title, same single
  // purpose. Four of the eight had no page left at all; those are written to
  // match the four that survived.
  for (const anime of RECENT_ANIME) {
    const target = path.join(merged, 'media', anime.page);
    const screen = `<iframe width="320" height="180" src="https://www.youtube.com/embed/${anime.video}"
      title="${anime.title} 오프닝" frameborder="0" allowfullscreen></iframe>`;

    // Where the page survived, keep it — the writing on it is Luke's own review
    // of what he had just watched, and that is the point of the corner. Only
    // the Media Player object is swapped out.
    if (existsSync(target)) {
      const text = decode(await readFile(target));
      if (/<OBJECT\b/i.test(text)) {
        await writeFile(target, text.replace(/<OBJECT\b[\s\S]*?<\/OBJECT>/i, screen), 'utf8');
        continue;
      }
      if (text.includes('youtube.com/embed')) continue;
    }

    // Where it did not survive there is no review to keep, so the page is
    // written to hold the opening and say so.
    await mkdir(path.dirname(target), { recursive: true });
    await writeFile(target, `<html>
<head>
<meta charset="utf-8">
<title>${anime.title}</title>
<style>
  body { margin: 0; background: #f0f9fb; text-align: center;
    font: 12px 돋움, Dotum, 굴림, sans-serif; color: #225577; }
  h1 { margin: 10px 0 8px; font-size: 15px; }
  iframe { border: 1px solid #9ab6c4; }
  p { margin: 8px 12px; color: #4a6b7a; }
</style>
</head>
<body>
<h1>${anime.title}</h1>
${screen}
<p>오프닝 영상. 이 판의 감상기는 보관되지 않았습니다.</p>
</body>
</html>
`, 'utf8');
  }
  mergedMenuNotes.push(`애니 감상록 ${RECENT_ANIME.length}편에 오프닝을 걸었다`);

  // The corner's list points at all eight now, not the four that kept a page,
  // and each thumbnail is a still from the opening it opens.
  const mediaIndex = path.join(merged, 'media/media.html');
  if (existsSync(mediaIndex)) {
    let list = await readFile(mediaIndex, 'utf8');
    for (const anime of RECENT_ANIME) {
      const escaped = anime.thumb.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const cell = new RegExp(`<a[^>]*href="#"[^>]*>((?:(?!</a>)[\\s\\S])*?${escaped}(?:(?!</a>)[\\s\\S])*?)</a>`, 'i');
      list = list.replace(cell, (whole, inner) => `<a href="${anime.page}" target="screen">${inner}</a>`);
    }
    await writeFile(mediaIndex, list, 'utf8');
  }

  // The outermost frame carried a photograph that changed with the season and
  // the weather — Luke swapped it by hand, which is the thing cafelua.com now
  // does automatically. The photographs themselves are gone. Four seasonal
  // landscapes stand in, washed out and blurred so they read as a backdrop and
  // not as a picture, and the page picks the one that matches the month it is
  // opened in.
  const seasonsFrom = path.join(reconstructedRoot, 'seasons');
  if (existsSync(seasonsFrom)) {
    const into = path.join(merged, 'seasons');
    await mkdir(into, { recursive: true });
    for (const entry of await readdir(seasonsFrom, { withFileTypes: true })) {
      if (entry.isFile()) await cp(path.join(seasonsFrom, entry.name), path.join(into, entry.name), { force: true, preserveTimestamps: true });
    }
    // Which season, though? The greeting on the top strip is fixed — "마음까지
    // 시원한 가을입니다" — because Luke wrote it by hand for that season, and he
    // changed the photograph at the same time. So the page reads its own
    // greeting and dresses to match. A greeting that names no season falls back
    // to the month the page is opened in.
    const strip = path.join(merged, 'frame1.html');
    let named = null;
    if (existsSync(strip)) {
      const words = decode(await readFile(strip));
      for (const [season, word] of [['spring', '봄'], ['summer', '여름'], ['autumn', '가을'], ['winter', '겨울']]) {
        if (words.includes(word)) { named = season; break; }
      }
    }
    const frontDoor = path.join(merged, 'index.html');
    if (existsSync(frontDoor)) {
      const text = await readFile(frontDoor, 'utf8');
      if (!text.includes('seasons/back_')) {
        const chooser = named
          ? `  var season = '${named}';   // 위 띠의 인사말이 말하는 계절`
          : `  var month = new Date().getMonth() + 1;
  var season = month <= 2 || month === 12 ? 'winter'
    : month <= 5 ? 'spring'
    : month <= 8 ? 'summer'
    : 'autumn';`;
        const next = text.replace('</body>', `<script>
// 계절 배경. 원래는 루크가 철마다 사진과 인사말을 함께 바꿔 걸었습니다.
(function () {
${chooser}
  document.body.background = 'seasons/back_' + season + '.jpg';
})();
</script>
</body>`);
        if (next !== text) {
          await writeFile(frontDoor, next, 'utf8');
          mergedMenuNotes.push(named ? `첫 화면 배경을 인사말의 계절(${named})에 맞췄다` : '첫 화면 배경을 계절에 맞춰 바꾸게 했다');
        }
      }
    }
  }

  // 찻집 was a community page whose board lived on Zeroboard, so its lower
  // frame now loads a blank pane — a white slab under one paragraph. Luke asked
  // for the picture he kept of the Cyworld screen there instead.
  const teatime = path.join(merged, 'teatime/teatime.html');
  if (existsSync(teatime) && existsSync(path.join(merged, CYWORLD_IMAGE))) {
    const text = await readFile(teatime, 'utf8');
    let count = 0;
    const next = text.replace(/<iframe\b[^>]*>[\s\S]*?<\/iframe>/gi, () => {
      count += 1;
      // Set against the left margin, with the writing beside it, and sized so
      // the picture and the poem below it together clear the 450px pane
      // without scrolling. 260px is the widest it goes before the picture is
      // enlarged past the 400px screen Luke actually kept.
      return `<div style="margin:6px 0">
  <img src="../${CYWORLD_IMAGE}" width="260" border="0" alt="숲속얘기의 싸이월드 미니홈피">
</div>`;
    })
      // [찻집방문] opened the Zeroboard the community actually met on. That
      // board is gone, so the link led to the notice page and nowhere else.
      .replace(/\s*<a href="frame\.html">\s*<font size=3><b>\[찻집방문\]\s*<\/a>/i, '');
    if (count) {
      await writeFile(teatime, next, 'utf8');
      mergedMenuNotes.push('찻집 아래 빈 프레임을 싸이월드 화면 그림으로 바꿨다');
    }
  }

  // The Cyworld notice carries the picture wherever the picture exists. Only
  // the 2003 edition shipped it originally, but the merged edition holds that
  // file too, and the notice is the one place a visitor is told where the
  // writing went — it should show the screen Luke kept of it.
  const cyworldPicture = path.join(merged, CYWORLD_IMAGE);
  if (existsSync(cyworldPicture)) {
    await writeFile(
      path.join(merged, CYWORLD_NOTICE),
      cyworldNoticeDocument("Fstory's Homepage ver 2.0 &gt; Cyworld", true),
      'utf8',
    );
    mergedMenuNotes.push('싸이월드 안내에 당시 화면 그림을 실었다');
  }

  // The top strip is 42px and holds both the BGM player (an iframe 30 tall)
  // and the greeting — "마음까지 시원한 가을입니다. 숲속얘기의 홈에 오신것을
  // 환영합니다." At 9pt in a 2002 browser that fit; here the greeting is cut in
  // half. Give the strip the room the two actually need and let the pane below
  // take the rest.
  const mainPath = path.join(merged, 'main.html');
  if (existsSync(mainPath)) {
    const text = await readFile(mainPath, 'utf8');
    const next = text.replace(/rows\s*=\s*"42,\s*560"/i, 'rows="62,*"');
    if (next !== text) {
      await writeFile(mainPath, next, 'utf8');
      mergedMenuNotes.push('상단 띠 높이를 인사말이 잘리지 않게 늘렸다');
    }
  }

  // Shinobu's BGM Player came back whole — the page, bgm_system.js, the five
  // transport buttons, the copyleft notice from 2000. Only the music is gone:
  // it streamed from Chollian and Netian accounts that closed two decades ago,
  // and the archive kept none of the files.
  //
  // So the player keeps its face and plays from YouTube instead. Same strip,
  // same title field and repeat box, same five buttons in the same order. The
  // tracks are the ones Luke says he kept putting on. Autoplay is not attempted
  // — a browser would refuse it, and a page that silently fails to play is
  // worse than one that waits to be asked.
  // Three copies of the same player: the site's own, the Chollian account it
  // actually streamed from (which is the one the top strip loads), and the
  // bgmp/ variant. All three get the same treatment.
  const bgmPages = ['bgm/bgm.html', 'chollian/bgm/bgm.html', 'bgmp/bgm.html']
    .map((relative) => path.join(merged, relative))
    .filter((file) => existsSync(file));
  for (const bgmPage of bgmPages) {
    if (!BGM_TRACKS.length) break;
    await writeFile(bgmPage, `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<title>숲속얘기의 BGM Player</title>
<style>
  html, body { margin: 0; height: 100%; overflow: hidden;
    background: #ffffcc; font: 12px 돋움, Dotum, 굴림, sans-serif; color: #225577; }
  .bar { display: flex; align-items: center; gap: 8px; padding: 5px 8px; white-space: nowrap; }
  .title { flex: 1 1 auto; min-width: 120px; padding: 2px 6px;
    border: 1px solid #9ab6c4; background: #fbfdfe; color: #225577;
    overflow: hidden; text-overflow: ellipsis; }
  button { border: 1px solid #9ab6c4; background: #eaf6fa; color: #225577;
    font: inherit; padding: 1px 7px; cursor: pointer; }
  button:hover { background: #d9edf5; }
  label { display: inline-flex; align-items: center; gap: 3px; }
  .who { color: #446677; }
  #stage { position: absolute; left: -9999px; width: 1px; height: 1px; }
</style>
</head>
<body>
<!-- Shinobu's BGM Player 1.5 의 자리. 원본은 Windows Media Player 로 스트리밍했고
     그 주소는 모두 닫혔습니다. 생김새와 조작은 그대로 두고 재생만 옮겼습니다. -->
<div class="bar">
  <span class="title" id="now">숲속얘기의 BGM Player</span>
  <label><input type="checkbox" id="loop" checked>반복</label>
  <button id="prev" title="이전 곡">◀◀</button>
  <button id="play" title="재생">▶</button>
  <button id="stop" title="정지">■</button>
  <button id="next" title="다음 곡">▶▶</button>
  <span class="who">숲속얘기의 BGM Player</span>
</div>
<div id="stage"></div>
<script>
  var TRACKS = ${JSON.stringify(BGM_TRACKS)};
  var at = 0, player = null, ready = false;
  var now = document.getElementById('now');
  function label(text) { now.textContent = text; }
  label(TRACKS[0].title);

  // The 2002 player started the moment the page opened. A browser will not do
  // that any more unless someone has already clicked something, so ask for it
  // and, if the browser says no, start on the visitor's first click anywhere
  // in the site. Every frame is same-origin, so a click in any of them counts.
  var started = false;
  function wake() {
    if (started || !ready) return;
    started = true;
    player.playVideo();
    label(TRACKS[at].title);
  }
  function listenEverywhere() {
    var documents = [document];
    try {
      if (parent && parent !== window && parent.document) {
        documents.push(parent.document);
        for (var i = 0; i < parent.frames.length; i += 1) {
          try { documents.push(parent.frames[i].document); } catch (blocked) { /* other origin */ }
        }
      }
    } catch (blocked) { /* other origin */ }
    for (var d = 0; d < documents.length; d += 1) {
      documents[d].addEventListener('click', wake, true);
      documents[d].addEventListener('keydown', wake, true);
    }
  }

  window.onYouTubeIframeAPIReady = function () {
    player = new YT.Player('stage', {
      height: '1', width: '1', videoId: TRACKS[0].id,
      playerVars: { playsinline: 1, autoplay: 1 },
      events: {
        onReady: function () {
          ready = true;
          player.playVideo();
          // Give the browser a moment to refuse, then wait for a click rather
          // than leaving the bar sitting silent with no explanation.
          setTimeout(function () {
            if (player.getPlayerState() === YT.PlayerState.PLAYING) { started = true; return; }
            label(TRACKS[at].title + ' — 화면을 한 번 누르면 재생됩니다');
            listenEverywhere();
          }, 1200);
        },
        onStateChange: function (event) {
          if (event.data === YT.PlayerState.PLAYING) { started = true; label(TRACKS[at].title); }
          if (event.data === YT.PlayerState.ENDED) {
            if (document.getElementById('loop').checked) { go(at + 1); }
          }
        }
      }
    });
  };
  function go(index) {
    if (!ready) return;
    at = (index + TRACKS.length) % TRACKS.length;
    player.loadVideoById(TRACKS[at].id);
    started = true;
    label(TRACKS[at].title);
  }
  document.getElementById('play').onclick = function () {
    if (!ready) return;
    started = true;
    player.playVideo(); label(TRACKS[at].title);
  };
  document.getElementById('stop').onclick = function () { if (ready) player.stopVideo(); };
  document.getElementById('prev').onclick = function () { go(at - 1); };
  document.getElementById('next').onclick = function () { go(at + 1); };

  var tag = document.createElement('script');
  tag.src = 'https://www.youtube.com/iframe_api';
  document.head.appendChild(tag);
</script>
</body>
</html>
`, 'utf8');
  }
  if (bgmPages.length) mergedMenuNotes.push(`BGM 플레이어 ${bgmPages.length}곳에 ${BGM_TRACKS.length}곡을 걸었다`);

  // The diary sat above a memo pane that called a Zeroboard the server drew on
  // request. What is left of memo.html is a stylesheet and nothing else, so the
  // pane renders as a white slab under the writing. Drop it and let the diary
  // have the height.
  const diaryFrame = path.join(merged, 'diary/frame.html');
  if (existsSync(diaryFrame)) {
    const text = await readFile(diaryFrame, 'utf8');
    const next = text
      .replace(/rows\s*=\s*"280,\s*\*"/i, 'rows="*"')
      .replace(/<frame[^>]*name\s*=\s*"?memo"?[^>]*>\s*/i, '');
    if (next !== text) {
      await writeFile(diaryFrame, next, 'utf8');
      mergedMenuNotes.push('일기 아래 빈 메모 칸을 걷어냈다');
    }
    // The rule under the copyright line divided the diary from the memo pane.
    // With the pane gone it divides the writing from nothing.
    const diaryPage = path.join(merged, 'diary/recent.html');
    if (existsSync(diaryPage)) {
      const page = await readFile(diaryPage, 'utf8');
      const trimmed = page.replace(/<hr[^>]*>\s*(?=<\/body>)/i, '');
      if (trimmed !== page) await writeFile(diaryPage, trimmed, 'utf8');
    }
  }

  // The diary's arrows walk from entry to entry, and the newest entry is filed
  // as recent.html rather than under its own date — so 2002-02-10's ▶, which
  // points at 20020216.html, had nowhere to go. It is the same page.
  {
    const diaryDir = path.join(merged, 'diary');
    const newest = path.join(diaryDir, 'recent.html');
    if (existsSync(newest)) {
      const dated = /(\d{4})_(\d{2})_(\d{2})/.exec(await readFile(newest, 'utf8'));
      if (dated) {
        const alias = `${dated[1]}${dated[2]}${dated[3]}.html`;
        for (const entry of await readdir(diaryDir, { withFileTypes: true })) {
          if (!entry.isFile() || !htmlExtensions.has(path.extname(entry.name).toLowerCase())) continue;
          const file = path.join(diaryDir, entry.name);
          const text = await readFile(file, 'utf8');
          if (!text.includes(alias)) continue;
          const next = text.replace(
            new RegExp(`<a href="#" onclick="alert\\([^"]*\\);return false;" data-unrestored-target="([^"]*${alias})"`, 'gi'),
            '<a href="recent.html" data-restored-alias="$1"',
          );
          if (next !== text) {
            await writeFile(file, next, 'utf8');
            mergedMenuNotes.push(`${entry.name} 의 다음 일기를 recent.html 로 이었다`);
          }
        }
      }
    }
  }

  // The link corner's top strip carried "숲속얘기의 링꾸(Link)세상 돌아가기"
  // and a note telling the visitor to hold Shift so a login would not open
  // inside an IE 6.0 frame. Neither still means anything — the browsers it
  // spoke to are gone, and the strip is two lines of instructions for a
  // problem no one has any more. Drop the pane and give the height back.
  const linkFrame = path.join(merged, 'link/index.html');
  if (existsSync(linkFrame)) {
    const text = await readFile(linkFrame, 'utf8');
    const next = text
      .replace(/rows\s*=\s*"(?:13|46),\s*\*"/i, 'rows="*"')
      .replace(/<frame[^>]*name\s*=\s*"?top"?[^>]*>\s*/i, '');
    if (next !== text) {
      await writeFile(linkFrame, next, 'utf8');
      mergedMenuNotes.push('링크 코너 상단 안내 띠를 걷어냈다');
    }
  }

  // The strip along the bottom held a Java applet clock and the words
  // "<-현재시간" beside it, plus a welcome graphic the archive never kept. No
  // browser has run a Java applet in years, so all that reaches a visitor now
  // is the label pointing at nothing and 45px of empty band. Drop the pane and
  // give its height back to the page.
  const contentFrame = path.join(merged, 'frame3.html');
  if (existsSync(contentFrame)) {
    const text = await readFile(contentFrame, 'utf8');
    const next = text
      .replace(/rows\s*=\s*"695,\s*45"/i, 'rows="*"')
      .replace(/<frame[^>]*name\s*=\s*"?bot_info"?[^>]*>\s*/i, '');
    if (next !== text) {
      await writeFile(contentFrame, next, 'utf8');
      mergedMenuNotes.push('하단 시계 띠를 걷어냈다');
    }
  }


  // The opening pane has to follow the same choice the menu made, or the
  // edition greets a visitor with the empty Zeroboard frame.
  const contentPath = path.join(merged, 'content.html');
  if (existsSync(contentPath) && existsSync(path.join(merged, 'diary/frame.html'))) {
    const content = await readFile(contentPath, 'utf8');
    const aimed = content.replace(/src="diary\/diary\.html"/g, 'src="diary/frame.html"');
    if (aimed !== content) {
      await writeFile(contentPath, aimed, 'utf8');
      mergedMenuNotes.push('첫 화면 → diary/frame.html');
    }
  }

  await writeFile(path.join(merged, 'menu.html'), `<html>
<head>
<meta charset="utf-8">
<title>Fstory's Homepage ver 2.0</title>
<script language="JavaScript">
function mail(address) { location.href = 'mailto:' + address; }
</script>
<style type="text/css">
  /* White, as the original had it. The pill buttons carry their own pale blue
     and a tinted column behind them makes the two blues fight; against white
     the buttons read cleanly. Luke checked this against the buttons. */
  body { margin: 0; background: #ffffff; }
  table { border-collapse: collapse; }
</style>
</head>
<body>
  <table width="95" cellspacing="0" cellpadding="0">
    <tbody>
      <tr><td height="10"></td></tr>
${rows.join('\n')}
${characterArt}
    </tbody>
  </table>
</body>
</html>
`, 'utf8');

  const mergedFileCount = await countFiles(merged);
  reports.push({
    timestamp: MERGED_EDITION.directory,
    date: MERGED_EDITION.period,
    lineage: MERGED_EDITION.id,
    publishedFiles: mergedFileCount,
    menuNotes: mergedMenuNotes,
    mergedFrom: MERGED_EDITION.contributors.map((capture) => ({ capture, representative: capture === MERGED_EDITION.chrome })),
    originalFiles: 0, restoredFromArchive: 0, aliasResolved: 0, caseResolved: 0,
    rewrittenReferences: 0, placeholderImages: 0, droppedBackgrounds: 0,
    disabledDownloads: 0, disabledMedia: 0, disabledForms: 0, noticeLinks: 0,
    unresolvedKept: 0, extensionsAdded: 0, staticised: 0, guestbookMerged: 0,
    curatedRestored: 0, curatedPages: 0, reconstructedAssets: 0, thumbnailsMade: 0, unpinnedBlocks: 0,
    quietPanes: 0, groundedBodies: 0, clearedPlaceholders: 0, closedGalleryCells: 0, galleryFromDesk: 0,
    externalImages: 0, externalAssets: 0, externalFrames: 0, externalLinks: 0,
    cyworldRewrites: 0, unresolvedUniquePaths: 0, unresolved: [], restored: [],
  });
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
// The 1998–2001.07 edition Luke kept is the one this era is served from, so the
// July 2001 capture contributes only what that edition does not already have.
// Nothing it already holds is touched.
//
// Three trees are held back. `netian/` and `chollian/` are other addresses of
// other eras and are offered separately; `myletter/` is the later name for the
// same files this edition carries under `mydoc/novel/`, so copying it in would
// duplicate the writing under two names.
const HELD_BACK = /^(netian|chollian|myletter)\//i;
const july2001UniqueFiles = [];
const gatherUnique = async (directory = july2001Root) => {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) { await gatherUnique(file); continue; }
    const relative = path.relative(july2001Root, file).replaceAll('\\', '/');
    // `index__<hash>.html` is a second capture of a page this edition already
    // has under its real name. Copying it in would shelve the same page twice.
    if (HELD_BACK.test(relative) || entry.name.startsWith('_') || /__[0-9a-f]{8}\.html?$/i.test(entry.name)) continue;
    if (existsSync(path.join(legacy1998Root, relative))) continue;
    july2001UniqueFiles.push(relative);
  }
};
await gatherUnique();
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
  if (!existsSync(output)) continue;
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
  // Luke titled his 1993-2002 short pieces in Korean, and the browser that
  // saved them wrote the titles into the filenames as percent-escaped EUC-KR
  // bytes — p%b3%aa%b4%c2_....html. The pages link to them in EUC-KR too,
  // which this publisher decodes to the Korean title, so a lookup by that
  // title finds nothing: the name on disk is still the escaped form. Read the
  // escaped name back the way it was written and index it under both.
  const eucAlias = (relative) => {
    if (!/%[0-9a-f]{2}/i.test(relative)) return null;
    const bytes = [];
    for (let at = 0; at < relative.length; at += 1) {
      const escape = relative[at] === '%' && /^[0-9a-f]{2}$/i.test(relative.slice(at + 1, at + 3));
      if (escape) { bytes.push(parseInt(relative.slice(at + 1, at + 3), 16)); at += 2; continue; }
      const code = relative.charCodeAt(at);
      if (code > 0x7f) return null;
      bytes.push(code);
    }
    try {
      const named = new TextDecoder('euc-kr', { fatal: true }).decode(Uint8Array.from(bytes));
      return named === relative ? null : named;
    } catch { return null; }
  };

  const indexEdition = async (directory) => {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const file = path.join(directory, entry.name);
      if (entry.isDirectory()) { await indexEdition(file); continue; }
      const relative = path.relative(edition.root, file).replaceAll('\\', '/');
      onDisk.set(relative.toLowerCase(), relative);
      const named = eucAlias(relative);
      if (named && !onDisk.has(named.toLowerCase())) onDisk.set(named.toLowerCase(), relative);
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

// ------------------------------------- 바깥으로 나가는 링크와 광고 글

// The pages link to 247 addresses outside the site, written between 1997 and
// 2003. scripts/check-fstory-external-links.mjs asks each one whether it still
// answers and records the verdict; that file is the argument, this is only the
// part that acts on it. A host is treated as closed when every address checked
// on it was lost, so a page in a later edition that links to the same host is
// covered too even though the check only walked the merged edition.
const externalRecord = JSON.parse(
  await readFile(path.join(appRoot, 'scripts/fstory-external-links.json'), 'utf8'),
);
const seenByHost = new Map();
for (const [address, verdict] of Object.entries(externalRecord.links)) {
  let host;
  try { host = new URL(address).hostname.toLowerCase(); } catch { continue; }
  const tally = seenByHost.get(host) ?? { lost: 0, answers: 0 };
  tally[verdict.verdict === 'lost' ? 'lost' : 'answers'] += 1;
  seenByHost.set(host, tally);
}
const closedHosts = new Set(
  [...seenByHost].filter(([, tally]) => tally.lost > 0 && tally.answers === 0).map(([host]) => host),
);

let closedOutside = 0;
const quietenOutside = async (directory) => {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) { await quietenOutside(file); continue; }
    if (!htmlExtensions.has(path.extname(entry.name).toLowerCase())) continue;
    const text = await readFile(file, 'utf8');
    if (!/href\s*=\s*"https?:/i.test(text)) continue;
    let count = 0;
    // <area> as well as <a>: the link corner drew its outside links on an image
    // map, so half of them are not anchors at all.
    const output = text.replace(/<(?:a|area)\b[^>]*>/gi, (whole) => {
      const wanted = /href\s*=\s*"(https?:\/\/[^"]+)"/i.exec(whole);
      if (!wanted || /onclick=/i.test(whole)) return whole;
      let host;
      try { host = new URL(wanted[1]).hostname.toLowerCase(); } catch { host = null; }
      // Some guestbook entries put a name where the browser asked for a home
      // page — http://★민지의 홈★ — so the link never went anywhere, not even
      // in 2002. It is treated like any other address that leads nowhere.
      const unreadable = !host || !/^[a-z0-9.-]+\.[a-z]{2,}$/i.test(host);
      if (!unreadable && !closedHosts.has(host)) return whole;
      count += 1;
      // The address stays visible on the page, because it is part of what Luke
      // wrote. Only the going-there stops, and the click says why.
      const said = unreadable
        ? `주소가 아닙니다.\\n\\n${wanted[1].replace(/'/g, "\\\\'")}\\n\\n방명록에 홈페이지 자리를 이름으로 채운 글입니다.`
        : `이 주소는 지금 닫혀 있습니다.\\n\\n${wanted[1].replace(/'/g, "\\\\'")}\\n\\n${externalRecord.checked} 확인.`;
      // The address is kept on the tag as well as in the message, so the check
      // that decided this can read its own earlier work on the next run instead
      // of seeing a page with no outside links left and concluding there were
      // none. Without it the judgement would undo itself every rebuild.
      return whole
        .replace(/href\s*=\s*"[^"]*"/i, `href="#" data-closed-outside="${wanted[1]}" onclick="alert('${said}');return false;"`)
        .replace(/\s*target\s*=\s*"?_blank"?/i, '');
    });
    if (count) { await writeFile(file, output, 'utf8'); closedOutside += count; }
  }
};
await quietenOutside(destinationRoot);
if (closedOutside) console.log(`닫힌 바깥 주소 ${closedOutside}곳의 링크를 안내로 바꿨다`);

// Advertising strangers left on the 2002 board. Nothing links to it.
let spamRemoved = 0;
for (const page of SPAM_PAGES) {
  for (const edition of await readdir(destinationRoot, { withFileTypes: true })) {
    if (!edition.isDirectory()) continue;
    const file = path.join(destinationRoot, edition.name, page.path);
    if (!existsSync(file)) continue;
    await rm(file);
    spamRemoved += 1;
  }
}
if (spamRemoved) console.log(`광고 글 페이지 ${spamRemoved}개를 지웠다 (${SPAM_PAGES.map((page) => page.why).join(', ')})`);

// ------------------------------------- 짧은글: EUC-KR 로 저장된 파일명 되찾기

// Luke titled his 1993-2002 short pieces in Korean, and the browser that saved
// them wrote the title into the filename as percent-escaped EUC-KR bytes:
// p%bc%bc%bb%f3%c0%ba.html is p세상은.html. The pages link to them in EUC-KR
// too, which this publisher decodes to the Korean title — so the lookup asked
// for p세상은.html while the file on disk still wore the escaped name, and 147
// of Luke's own pieces were marked "never archived" while sitting in the very
// folder being searched. Read the escaped name back the way it was written.
const eucName = (name) => {
  if (!/%[0-9a-f]{2}/i.test(name)) return null;
  const bytes = [];
  for (let at = 0; at < name.length; at += 1) {
    const escaped = name[at] === '%' && /^[0-9a-f]{2}$/i.test(name.slice(at + 1, at + 3));
    if (escaped) { bytes.push(parseInt(name.slice(at + 1, at + 3), 16)); at += 2; continue; }
    const code = name.charCodeAt(at);
    if (code > 0x7f) return null;
    bytes.push(code);
  }
  try {
    const named = new TextDecoder('euc-kr', { fatal: true }).decode(Uint8Array.from(bytes));
    return named === name ? null : named;
  } catch { return null; }
};

const eucIndexes = new Map();
const eucLookup = async (directory) => {
  if (eucIndexes.has(directory)) return eucIndexes.get(directory);
  const index = new Map();
  try {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      if (entry.isDirectory()) continue;
      const named = eucName(entry.name);
      if (named) index.set(named.toLowerCase(), entry.name);
    }
  } catch { /* directory gone */ }
  eucIndexes.set(directory, index);
  return index;
};

let reopened = 0;
const reopenEucNames = async (directory) => {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) { await reopenEucNames(file); continue; }
    if (!htmlExtensions.has(path.extname(entry.name).toLowerCase())) continue;
    const text = await readFile(file, 'utf8');
    if (!text.includes('data-unrestored-target')) continue;
    let count = 0;
    const output = await replaceAsync(text, /<a\b[^>]*data-unrestored-target\s*=\s*"([^"]+)"[^>]*>/gi, async (whole, recorded) => {
      const wanted = recorded.split('?')[0].split('#')[0];
      const folder = path.join(path.dirname(file), path.dirname(wanted));
      const index = await eucLookup(folder);
      const found = index.get(path.basename(wanted).toLowerCase());
      if (!found) return whole;
      // The percent signs are part of the name on disk, not an escape. Written
      // into a link as they are, the browser decodes them before asking for the
      // file and the server answers 500 on the malformed address. Escape them.
      const href = path.posix.join(path.dirname(wanted).replaceAll('\\', '/'), found.replaceAll('%', '%25'));
      count += 1;
      // The tag was rewritten to say no: href="#", an alert, and the address it
      // could not reach. All three go, and the link points at the piece again.
      return whole
        .replace(/href\s*=\s*"[^"]*"/i, `href="${href}"`)
        .replace(/\s*onclick\s*=\s*"[^"]*"/i, '')
        .replace(/\s*data-unrestored-target\s*=\s*"[^"]*"/i, '');
    });
    if (count) { await writeFile(file, output, 'utf8'); reopened += count; }
  }
};

// String.replace has no asynchronous form, and the folder listings this needs
// are read from disk. Collect the replacements first, then apply them.
async function replaceAsync(text, pattern, make) {
  const found = [];
  for (const match of text.matchAll(pattern)) found.push(match);
  let output = '';
  let read = 0;
  for (const match of found) {
    output += text.slice(read, match.index) + await make(match[0], match[1]);
    read = match.index + match[0].length;
  }
  return output + text.slice(read);
}

await reopenEucNames(destinationRoot);
if (reopened) console.log(`EUC-KR 이름으로 저장된 글 ${reopened}편의 링크를 되살렸다`);

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
    curatedRestored: totals('curatedRestored'),
    curatedPages: totals('curatedPages'),
    quietPanes: totals('quietPanes'),
    groundedBodies: totals('groundedBodies'),
    clearedPlaceholders: totals('clearedPlaceholders'),
    closedGalleryCells: totals('closedGalleryCells'),
    galleryFromDesk: totals('galleryFromDesk'),
    reconstructedAssets: totals('reconstructedAssets'),
    thumbnailsMade: totals('thumbnailsMade'),
    unpinnedBlocks: totals('unpinnedBlocks'),
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
  note: 'One entry per design generation, each merged from every capture that belongs to it. The captures are listed under builtFrom as evidence, not as separate restore points. An edition whose offeredAs names another edition is published as the source of that merge rather than offered on its own.',
  annexes: ANNEXES,
  mergedEdition: {
    id: MERGED_EDITION.id,
    label: MERGED_EDITION.label,
    period: MERGED_EDITION.period,
    directory: MERGED_EDITION.directory,
    chrome: MERGED_EDITION.chrome,
    builtFrom: MERGED_EDITION.contributors,
    summary: MERGED_EDITION.summary,
  },
  curatedEditions: CURATED_EDITIONS,
  editions: LINEAGES.map((lineage) => {
    const report = reports.find((item) => item.lineage === lineage.id);
    const captures = SNAPSHOTS.filter(([, , id]) => id === lineage.id);
    return {
      id: lineage.id,
      label: lineage.label,
      period: lineage.period,
      summary: lineage.summary,
      // Published so the merge has a source and the archive keeps its record,
      // but offered to visitors through the curated edition named here.
      // Where a visitor actually meets this material. `null` means it is
      // published as evidence but not offered; a string names the edition that
      // carries it.
      offeredAs: lineage.offeredAs === undefined ? lineage.id : lineage.offeredAs,
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
// Only editions offered in their own right. A capture folded into the merged
// or curated edition is still published, but the picker names the edition it
// was folded into instead.
const uiEditions = LINEAGES.filter((lineage) => lineage.offeredAs === undefined).map((lineage) => {
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

// Editions restored from Luke's own kept files rather than from the archive.
// They open the same timeline and belong in the same list.
export type FstoryCuratedEdition = {
    id: string;
    label: string;
    period: string;
    summary: string;
    base: string;
    entry: string;
};

// The ver 2.0 era, published once from every capture that caught it.
export const FSTORY_MERGED_EDITION = ${JSON.stringify({
  id: MERGED_EDITION.id,
  label: MERGED_EDITION.label,
  period: MERGED_EDITION.period,
  directory: MERGED_EDITION.directory,
  summary: MERGED_EDITION.summary,
  builtFrom: MERGED_EDITION.contributors,
}, null, 4)};

export const FSTORY_CURATED_EDITIONS: FstoryCuratedEdition[] = ${JSON.stringify(
  CURATED_EDITIONS.map(({ id, label, period, summary, base, entry }) => ({ id, label, period, summary, base, entry })),
  null, 4)};

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
  curatedRestored: totals('curatedRestored'),
  curatedPages: totals('curatedPages'),
  quietPanes: totals('quietPanes'),
  groundedBodies: totals('groundedBodies'),
  clearedPlaceholders: totals('clearedPlaceholders'),
  closedGalleryCells: totals('closedGalleryCells'),
  galleryFromDesk: totals('galleryFromDesk'),
  reconstructedAssets: totals('reconstructedAssets'),
  thumbnailsMade: totals('thumbnailsMade'),
  unpinnedBlocks: totals('unpinnedBlocks'),
  cyworldRewrites,
  destinationRoot,
}, null, 2));
