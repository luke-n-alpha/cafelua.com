#!/usr/bin/env node
/**
 * Bind three of Luke's early writings into books for the library.
 *
 * The writing itself came back from the Internet Archive and now lives under
 * public/fstory-homepage/ver2-merged/myletter/. It is readable there, but it is
 * readable the way a 2002 website is readable: one piece per page, reached by a
 * number in a table. These are books — a serialised novel, a collection of
 * short stories, and eight years of short pieces — and the library already
 * knows how to hold a book.
 *
 * Nothing here rewrites a sentence. The pages are 2002 markup wrapped around a
 * <pre> block, so the text comes out of the <pre> as it was typed, line breaks
 * and all, and goes into a chapter. What this script adds is order: the reading
 * order the index pages already declare, and the titles Luke gave each piece.
 *
 * The library's snapshot is merged rather than replaced, so the two books that
 * were already there keep their place and a rerun after the archive layer
 * changes shows up as a diff.
 *
 * Usage: node scripts/build-fstory-library-books.mjs [--check]
 */

import { cp, mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const appRoot = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const SOURCE = path.join(appRoot, 'public/fstory-homepage/ver2-merged/myletter');
const SNAPSHOT = path.join(appRoot, 'src/data/library/library-content.generated.json');
const BOOK_ASSETS = path.join(appRoot, 'public/library-books');

const check = process.argv.includes('--check');

const AUTHOR = '양병석 (Luke Yang)';

// ---------------------------------------------------------------- 본문 꺼내기

const ENTITIES = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', middot: '·',
};

const unescapeText = (text) => text
  .replace(/&#(\d+);/g, (whole, code) => String.fromCodePoint(Number(code)))
  .replace(/&#x([0-9a-f]+);/gi, (whole, code) => String.fromCodePoint(Number.parseInt(code, 16)))
  .replace(/&([a-z]+);/gi, (whole, name) => ENTITIES[name.toLowerCase()] ?? whole);

/**
 * The writing of one page. Every one of these pages is a <pre> block inside
 * 2002 table furniture, so the <pre> is the piece and everything around it is
 * the website. Where a page has no <pre> — a couple of the later ones — the
 * body is taken instead and its <br> tags become line breaks.
 */
const writingOf = (html) => {
  const withoutCode = html.replace(/<(script|style)\b[\s\S]*?<\/\1>/gi, ' ');
  const pre = /<pre\b[^>]*>([\s\S]*?)<\/pre>/i.exec(withoutCode);
  let inner;
  if (pre) {
    inner = pre[1];
  } else {
    const body = /<body\b[^>]*>([\s\S]*?)(?:<\/body>|$)/i.exec(withoutCode);
    inner = (body ? body[1] : withoutCode).replace(/<br\s*\/?>/gi, '\n').replace(/<\/(p|div|tr)>/gi, '\n');
  }
  return unescapeText(inner.replace(/<[^>]*>/g, ''))
    .replace(/\r\n?/g, '\n')
    .replace(/[ \t]+$/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
};

/**
 * These pages carry their own byline — "제목 : 작은마녀 윈디  끄적인놈 : 양병석"
 * — which belonged at the top of a web page and does not belong at the top of
 * every chapter of a book. It is read for the title, then removed.
 */
const splitHeading = (writing) => {
  const lines = writing.split('\n');
  let title = null;
  let at = 0;
  while (at < lines.length && at < 3) {
    const line = lines[at];
    // The byline sits on the same line as the title and Luke signed it a
    // different way almost every time — 끄적인놈, 끄적인이, 지은이, 글쓴이 — so
    // the title is whatever comes before whichever one he used that day.
    const named = /제목\s*[:：]\s*([^\s].*?)(?:\s*(?:끄적인놈|끄적인이|지은이|글쓴이|쓴이|글)\s*[:：].*)?$/.exec(line);
    if (named) {
      title = named[1].trim();
      at += 1;
      continue;
    }
    if (title !== null && /^\s*$/.test(line)) { at += 1; continue; }
    break;
  }
  return { title, body: lines.slice(at).join('\n').trim() };
};

const readPage = async (relative) => {
  const file = path.join(SOURCE, relative);
  if (!existsSync(file)) return null;
  return writingOf(await readFile(file, 'utf8'));
};

// ------------------------------------------------------------------- 목차 읽기

/** The links of an index page, in the order the page lists them. */
const indexLinks = async (relative) => {
  const file = path.join(SOURCE, relative);
  const here = path.posix.dirname(relative);
  const html = await readFile(file, 'utf8');
  const found = [];
  for (const match of html.matchAll(/<a\b[^>]*href\s*=\s*"([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi)) {
    const href = match[1].split('#')[0];
    if (!/\.html?$/i.test(href) || /^https?:/i.test(href)) continue;
    const label = unescapeText(match[2].replace(/<[^>]*>/g, '')).replace(/\s+/g, ' ').trim();
    // The address is written from where the index page sits, and the escapes in
    // it are part of the filename rather than an encoding — the 1994 pieces are
    // saved under their Korean titles as EUC-KR bytes, so %25bc is a file whose
    // name really does contain %bc.
    const at = path.posix.normalize(path.posix.join(here, href)).replace(/^\.\//, '');
    found.push({ href, at: at.replace(/%25/gi, '%'), label });
  }
  return { html, links: found };
};

// -------------------------------------------------------------------- 책 세 권

const chapterOf = (title, body, source) => ({
  title,
  path: `${source.replace(/[/.]/g, '-')}.md`,
  markdown: `# ${title}\n\n${body}\n`,
});

/** 작은 마녀 윈디 — 23화가 순서대로 남아 있다. */
const buildWindy = async () => {
  const chapters = [];
  for (let number = 1; ; number += 1) {
    const relative = `windy/witch${number}.html`;
    const writing = await readPage(relative);
    if (writing === null) break;
    const { title, body } = splitHeading(writing);
    if (!body) continue;
    // Every page calls itself 작은마녀 윈디, which would make 23 chapters of the
    // same name. The number is what tells them apart.
    // Each instalment is titled "작은마녀 윈디 (7)" — the book's own name and
    // the number, which the chapter already carries. Anything left after
    // removing both is a real subtitle and is kept.
    const subtitle = (title ?? '')
      .replace(/작은\s*마녀\s*윈디/g, '')
      .replace(/[(（]\s*\d+\s*[)）]/g, '')
      .replace(/^[\s·:\-—]+|[\s·:\-—]+$/g, '')
      .trim();
    const named = subtitle ? `${number}화 — ${subtitle}` : `${number}화`;
    chapters.push(chapterOf(named, body, relative));
  }
  return chapters;
};

/**
 * 숲속얘기의 단편소설집.
 *
 * The stories come from two places and neither one holds them all. Most of them
 * Luke posted again to his blog years later, whole and dated, and those are
 * recovered into scripts/fstory-short-stories.json — see
 * scripts/recover-naver-short-stories.mjs for where that file comes from. A few
 * exist only on the 2002 website, where a page could hold just so much and a
 * long story was split across two of them.
 *
 * The blog copy is preferred wherever there is one: it is whole, it carries the
 * year Luke wrote the story, and it is the version he chose to publish again.
 * The website fills in what the blog does not have.
 */
const SHORT_STORY_FILE = path.join(appRoot, 'scripts/fstory-short-stories.json');

// Matching the two sources by title, allowing for the punctuation and spacing
// that drifted between a 1996 web page and a 2006 blog post.
const looseTitle = (title) => title
  .replace(/[[\]()（）?？!！.,·:：\s]/g, '')
  .replace(/fantasy/i, '판타지')
  .toLowerCase();

const buildShortStories = async () => {
  const recovered = existsSync(SHORT_STORY_FILE)
    ? JSON.parse(await readFile(SHORT_STORY_FILE, 'utf8')).stories
    : [];
  const byTitle = new Map(recovered.map((story) => [looseTitle(story.title), story]));

  // What the 2002 website has, in the order its index lists it, with the pages
  // numbered (1) and (2) put back together as one story.
  const { links } = await indexLinks('short/short.html');
  const fromSite = [];
  const grouped = new Map();
  const seen = new Set();
  for (const { href, at, label } of links) {
    if (href === 'short.html' || seen.has(at)) continue;
    seen.add(at);
    const named = (label || href).replace(/\s*[(（]\s*\d+\s*[)）]\s*$/, '').trim();
    let story = grouped.get(named);
    if (!story) {
      story = { title: named, parts: [], source: at };
      grouped.set(named, story);
      fromSite.push(story);
    }
    story.parts.push(at);
  }

  // 메리크리스마스 sits in the same folder but no link points at it, so reading
  // the index alone would miss it. The blog has it too, and this is where the
  // two lists meet.
  for (const orphan of ['short/mrch.html']) {
    if (!seen.has(orphan) && existsSync(path.join(SOURCE, orphan))) {
      const writing = await readPage(orphan);
      const heading = splitHeading(writing ?? '');
      if (heading.title) fromSite.push({ title: heading.title, parts: [orphan], source: orphan });
    }
  }

  const siteWriting = async (story) => {
    const pieces = [];
    for (const at of story.parts) {
      const writing = await readPage(at);
      if (writing === null) continue;
      const split = splitHeading(writing);
      if (split.body) pieces.push(split.body);
    }
    return pieces.join('\n\n').trim();
  };

  const chapters = [];
  const used = new Set();

  // The recovered stories first, in the order they were written.
  for (const story of recovered) {
    used.add(looseTitle(story.title));
    const where = story.note ? ` · ${story.note}` : '';
    const heading = story.year ? `${story.title} (${story.year}${where})` : story.title;
    chapters.push(chapterOf(heading, story.text, story.slug));
  }

  // Then anything the website has that the blog does not.
  for (const story of fromSite) {
    if (used.has(looseTitle(story.title))) continue;
    const body = await siteWriting(story);
    if (!body) continue;
    used.add(looseTitle(story.title));
    chapters.push(chapterOf(`${story.title} (연도 미상)`, body, story.source));
  }
  return chapters;
};

/**
 * 나의 생각의 노트 — poem.html groups the pieces by the years Luke wrote them
 * and says what he was doing at the time: 중3, 고1, 대학생활, 군생활기간. Those
 * groups are the chapters, and the order inside each is the order on the page.
 */
const buildThoughtNotes = async () => {
  const { html, links } = await indexLinks('poem.html');
  const headings = [...html.matchAll(/<b>([^<]*?)<\/b>\s*(?:<\/font>\s*)?[:：]\s*([^<\n]{0,40})/gi)]
    .map((match) => ({
      at: match.index,
      title: unescapeText(match[1]).replace(/\s+/g, ' ').trim(),
      note: unescapeText(match[2]).replace(/\s+/g, ' ').replace(/\.{2,}.*$/, '').trim(),
    }))
    .filter((heading) => heading.title);

  const positions = [...html.matchAll(/<a\b[^>]*href\s*=\s*"([^"]+)"/gi)]
    .filter((match) => /\.html?$/i.test(match[1]) && !/^https?:/i.test(match[1]))
    .map((match) => match.index);

  const sections = headings.map((heading, index) => ({
    ...heading,
    until: index + 1 < headings.length ? headings[index + 1].at : Number.MAX_SAFE_INTEGER,
    pieces: [],
  }));

  links.forEach((link, index) => {
    const where = positions[index] ?? 0;
    const section = sections.find((item) => where > item.at && where < item.until);
    (section ?? sections[0])?.pieces.push(link);
  });

  const chapters = [];
  for (const section of sections) {
    const parts = [];
    for (const { href, at } of section.pieces) {
      const writing = await readPage(at);
      if (writing === null) continue;
      const { title, body } = splitHeading(writing);
      // The filename is the title Luke gave it — p세상은.html is 세상은 — and it
      // is the only place the title survives for most of these.
      const named = title
        ?? decodeURIComponent(path.basename(href, path.extname(href))).replace(/^p/, '').replace(/_/g, ' ').trim();
      const writingBody = body || writing;
      if (!writingBody) continue;
      parts.push(`## ${named}\n\n${writingBody}`);
    }
    if (!parts.length) continue;
    const title = section.note ? `${section.title} — ${section.note}` : section.title;
    chapters.push({
      title,
      path: `poem-${section.title.replace(/[^0-9A-Za-z가-힣]+/g, '-')}.md`,
      markdown: `# ${title}\n\n${parts.join('\n\n***\n\n')}\n`,
    });
  }
  return chapters;
};

// ------------------------------------------------------------------------ 표지

/**
 * A cover is picked up from the first image in the first chapter, so the cover
 * chapter carries it. Luke is drawing two of these three; until a file lands in
 * the book's assets folder the chapter simply has no picture, and the library
 * falls back to its plain coloured cover.
 */
const COVER_SOURCES = {
  'fstory-thought-notes': '/var/home/luke/다운로드/ChatGPT Image 2026년 8월 31일 오후 07_36_37.png',
  'fstory-windy': '/var/home/luke/다운로드/ChatGPT Image 2026년 8월 31일 오후 08_37_46.png',
  'fstory-windy-en': '/var/home/luke/다운로드/ChatGPT Image 2026년 8월 31일 오후 08_39_49.png',
};

const placeCover = async (slug) => {
  const target = path.join(BOOK_ASSETS, slug, 'assets');
  const webp = path.join(target, 'cover.webp');
  if (existsSync(webp)) return 'assets/cover.webp';
  const source = COVER_SOURCES[slug];
  if (!source || !existsSync(source)) return null;
  if (check) return 'assets/cover.webp';
  await mkdir(target, { recursive: true });
  const { default: sharp } = await import('sharp');
  await sharp(source).webp({ quality: 86, effort: 6 }).toFile(webp);
  return 'assets/cover.webp';
};

// ------------------------------------------------------------------------ 조립

const BOOKS = [
  {
    id: 'fstory-windy',
    slug: 'fstory-windy',
    coverTone: 'moss',
    title: '작은 마녀 윈디',
    subtitle: '1998 ~ 2002 · 연재 판타지',
    summary: '평범한 새벽의 골목에서 시작하는 연재 판타지입니다. 나우누리와 개인 홈페이지에 한 화씩 올리던 것을 인터넷 아카이브에서 되찾아 23화를 순서대로 묶었습니다.',
    build: buildWindy,
    // The English cover exists; the English text does not. Rather than invent a
    // translation, the English edition is listed with its cover and marked as
    // not yet published, which is what the shelf already knows how to show. An
    // English reader sees the cover and "준비 중"; a Korean reader sees no
    // change at all.
    english: {
      slug: 'fstory-windy-en',
      title: 'Windy the Little Witch',
      subtitle: '1998 – 2002 · Serialised fantasy',
      summary: 'A serialised fantasy that begins in an ordinary alley before dawn. Recovered from the Internet Archive; the English edition is not written yet.',
    },
  },
  {
    id: 'fstory-short-stories',
    slug: 'fstory-short-stories',
    coverTone: 'plum',
    title: '숲속얘기의 단편소설집',
    subtitle: '1993 ~ 2015 · 단편소설',
    summary: '숲속얘기는 루크가 나우누리와 천리안 시절에 쓰던 필명입니다. 중학교 3학년에 쓴 첫 이야기부터 스무 해 뒤의 것까지, 그 이름으로 남긴 단편들을 한 권으로 모았습니다. 유리구슬 하나에 담긴 이야기, 소행성 B612, 22세기에서 걸려온 인사, 그리고 2030년의 재귀적 접촉. 쓴 순서대로 실었고, 웹페이지가 한 편을 두 쪽으로 나눠 싣던 것은 다시 한 편으로 붙였습니다.',
    build: buildShortStories,
  },
  {
    id: 'fstory-thought-notes',
    slug: 'fstory-thought-notes',
    coverTone: 'dusk',
    title: '나의 생각의 노트',
    subtitle: '1993 ~ 2002 · 짧은 글',
    summary: '중학교 3학년부터 군 생활까지, 그때그때 적어 둔 짧은 글들입니다. 쓰던 시기를 따라 다섯 묶음으로 나뉘어 있고, 각 묶음의 제목 옆에 그 시절 자신이 무엇을 하고 있었는지가 적혀 있습니다.',
    build: buildThoughtNotes,
  },
];

const snapshot = JSON.parse(await readFile(SNAPSHOT, 'utf8'));
const kept = snapshot.books.filter((book) => !BOOKS.some((item) => item.id === book.id));

const made = [];
for (const definition of BOOKS) {
  const chapters = await definition.build();
  if (!chapters.length) {
    console.warn(`  ${definition.title}: 본문을 찾지 못했다`);
    continue;
  }
  const cover = await placeCover(definition.slug);
  const front = [
    `# ${definition.title}`,
    cover ? `\n![${definition.title} 표지](${cover})` : null,
    `\n${definition.summary}`,
    `\n지은이 ${AUTHOR}. ${definition.subtitle}.`,
    '\n인터넷 아카이브에 남아 있던 fstory.net 의 글을 옮긴 것입니다. 맞춤법과 문장은 그때 쓴 그대로 두었습니다.',
  ].filter(Boolean).join('\n');

  const editions = [];
  if (definition.english) {
    const englishCover = await placeCover(definition.english.slug);
    editions.push({
      lang: 'en',
      sourceSlug: definition.english.slug,
      title: definition.english.title,
      subtitle: definition.english.subtitle,
      summary: definition.english.summary,
      status: 'draft',
      biblio: { author: AUTHOR, date: definition.subtitle.split(' · ')[0], license: 'CC BY-NC-SA 4.0' },
      links: { wikidocs: null, leanpub: null },
      chapters: englishCover
        ? [{ title: 'Cover', path: 'cover.md', markdown: `# ${definition.english.title}\n\n![${definition.english.title}](${englishCover})\n` }]
        : [],
    });
  }

  made.push({
    id: definition.id,
    coverTone: definition.coverTone,
    editions: [{
      lang: 'ko',
      sourceSlug: definition.slug,
      title: definition.title,
      subtitle: definition.subtitle,
      summary: definition.summary,
      status: 'published',
      biblio: { author: AUTHOR, date: definition.subtitle.split(' · ')[0], edition: '복원판', license: 'CC BY-NC-SA 4.0' },
      links: { wikidocs: null, leanpub: null },
      chapters: [{ title: '표지와 서지 정보', path: 'cover.md', markdown: `${front}\n` }, ...chapters],
    }, ...editions],
  });
  const letters = chapters.reduce((sum, chapter) => sum + chapter.markdown.length, 0);
  console.log(`  ${definition.title}: ${chapters.length}장, ${letters.toLocaleString('ko-KR')}자${cover ? '' : ' (표지 없음)'}`);
}

if (check) {
  console.log('확인만 했다. 파일은 쓰지 않았다.');
} else {
  await writeFile(SNAPSHOT, `${JSON.stringify({ ...snapshot, books: [...kept, ...made] }, null, 2)}\n`, 'utf8');
  console.log(`서재에 ${made.length}권을 넣었다 → ${path.relative(appRoot, SNAPSHOT)}`);
}
