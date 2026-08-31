// Rebuild one guestbook from every archived page of it.
//
// The Chollian guestbook (PURY BBS) printed its posts straight into the list
// page, so the words survived — but each capture only holds the page the
// crawler happened to fetch. Post 15 exists in one capture, post 197 in
// another, and no single capture holds them all. Publishing one capture would
// throw the rest away, so this collects every post across every capture, keys
// them by their own article number, and writes a single page in the board's own
// markup.
//
// Nothing is invented: each post is copied as the board rendered it, and the
// page says plainly how many of the numbered posts were never captured.
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const archiveRoot = path.resolve(appRoot, '../data/fstory-net-wayback/versions');
const objectsRoot = path.join(archiveRoot, 'objects');
const outputPath = path.join(archiveRoot, 'merged/chollian-guestbook.html');

const utf8 = new TextDecoder('utf-8', { fatal: true });
const cp949 = new TextDecoder('euc-kr');
const decode = (bytes) => { try { return utf8.decode(bytes); } catch { return cp949.decode(bytes); } };

const manifest = JSON.parse(await readFile(path.join(archiveRoot, 'manifest.json'), 'utf8'));
const pages = manifest.filter((item) =>
  item.recovered && /chollian\/cgi\/pury\/purybbs/i.test(item.sitePath || ''));

// A post is a bordered table that opens with its own number. The board's skin
// changed over the years (border=1 became border=2, the colours moved), so the
// block is found by counting table tags rather than by matching one skin.
const POST_OPEN = /<table\s+border=\d[^>]*>/gi;
const POST_NUMBER = /\[No\.\s*(\d+)\]/;

const extractPosts = (text) => {
  const found = [];
  for (const open of [...text.matchAll(POST_OPEN)]) {
    let depth = 0;
    let cursor = open.index;
    const tag = /<\s*(\/?)table\b/gi;
    tag.lastIndex = open.index;
    let end = -1;
    for (let match = tag.exec(text); match; match = tag.exec(text)) {
      depth += match[1] ? -1 : 1;
      if (depth === 0) { end = tag.lastIndex; break; }
    }
    if (end < 0) continue;
    const closing = /\s*<\/table>\s*/y;
    closing.lastIndex = text.indexOf('>', end - 1) + 1;
    const html = text.slice(open.index, text.indexOf('>', end - 1) + 1);
    const number = POST_NUMBER.exec(html);
    if (!number) continue;
    found.push([Number(number[1]), html]);
    cursor = end;
  }
  return found;
};
const DATE = /(\d{4})\/(\d{2})\/(\d{2})\([^)]*\)\s*(\d{2}:\d{2}:\d{2})/;

const posts = new Map();
let scanned = 0;
for (const page of pages) {
  let text;
  try { text = decode(await readFile(path.join(objectsRoot, page.objectPath))); } catch { continue; }
  scanned += 1;
  for (const [number, html] of extractPosts(text)) {
    const stamp = DATE.exec(html);
    const existing = posts.get(number);
    // Prefer the longest rendering: a later capture may carry replies the
    // earlier one had not received yet.
    if (!existing || html.length > existing.html.length) {
      posts.set(number, { html, stamp: stamp ? `${stamp[1]}-${stamp[2]}-${stamp[3]} ${stamp[4]}` : null, from: page.timestamp });
    }
  }
}

const numbers = [...posts.keys()].sort((a, b) => b - a);
const highest = numbers[0] ?? 0;
const lowest = numbers[numbers.length - 1] ?? 0;
const uncaptured = highest && lowest
  ? Array.from({ length: highest - lowest + 1 }, (_, index) => lowest + index).filter((n) => !posts.has(n))
  : [];

const body = numbers.map((number) => posts.get(number).html).join('\n<br>\n');
const document = `<html>
<head>
<meta charset="utf-8">
<title>Fstory의 방명록 · 남아 있는 글 모음</title>
</head>
<body bgcolor="ffffff" text="333333" link="006644" vlink="006644">
<center>
<table width=600><tr><td align=center>
<font size=4 color=006644 face="verdana"><b>Fstory의 방명록</b></font><br>
<font size=2 color=666666>
인터넷 아카이브에 남은 ${scanned}개 캡처에서 글 ${numbers.length}편을 모았습니다.
번호 ${lowest}번부터 ${highest}번 사이에서 ${uncaptured.length}편은 캡처되지 않아 회수하지 못했습니다.<br>
글쓰기와 답글은 서버가 처리하던 것이라 지금은 동작하지 않습니다.
</font>
</td></tr></table>
<br>
${body}
</center>
</body>
</html>
`;

await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(outputPath, document, 'utf8');
await writeFile(path.join(path.dirname(outputPath), 'chollian-guestbook.json'), `${JSON.stringify({
  source: 'cgi.chollian.net/~foreststory/pury/purybbs.cgi',
  capturesScanned: scanned,
  postsRecovered: numbers.length,
  numberRange: [lowest, highest],
  uncapturedNumbers: uncaptured,
  posts: numbers.map((number) => ({ number, postedAt: posts.get(number).stamp, foundIn: posts.get(number).from })),
}, null, 2)}\n`, 'utf8');

console.log(JSON.stringify({
  capturesScanned: scanned, postsRecovered: numbers.length,
  numberRange: [lowest, highest], uncaptured: uncaptured.length, outputPath,
}, null, 2));
