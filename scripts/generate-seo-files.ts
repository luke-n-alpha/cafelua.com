import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { DESK_POSTS } from '../src/data/desk/deskLoader';
import { DIARY_ENTRIES } from '../src/data/gallery/diaryData';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const SITEMAP_PATH = path.join(PUBLIC_DIR, 'sitemap.xml');
const LLMS_PATH = path.join(PUBLIC_DIR, 'llms.txt');

const BASE = 'https://cafelua.com';
const LOCALES = ['ko', 'en'] as const;

type Item = {
    loc: string;
    altKo?: string;
    altEn?: string;
    lastmod?: string;
    changefreq?: string;
    priority?: string;
};

function escXml(s: string) {
    return s
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

function bilingualItems(route: string, opts: Omit<Item, 'loc' | 'altKo' | 'altEn'>): Item[] {
    const altKo = `${BASE}/ko${route}`;
    const altEn = `${BASE}/en${route}`;
    return [
        { loc: altKo, altKo, altEn, ...opts },
        { loc: altEn, altKo, altEn, ...opts },
    ];
}

function coreRoutes(): Item[] {
    const routes = ['', '/lounge', '/counter', '/tarot', '/gallery', '/guestbook', '/atelier', '/about', '/desk'];
    return routes.flatMap((route) =>
        bilingualItems(route, { changefreq: 'weekly', priority: route === '' ? '1.0' : '0.8' })
    );
}

function deskRoutes(): Item[] {
    return DESK_POSTS.flatMap((post) =>
        bilingualItems(`/desk/${post.slug}`, { lastmod: post.date, changefreq: 'monthly', priority: '0.7' })
    );
}

function diaryRoutes(): Item[] {
    return DIARY_ENTRIES.flatMap((entry) =>
        bilingualItems(`/gallery/diary/${entry.slug}`, { lastmod: entry.date, changefreq: 'monthly', priority: '0.6' })
    );
}

function makeSitemap() {
    const today = new Date().toISOString().slice(0, 10);
    const items = [...coreRoutes(), ...deskRoutes(), ...diaryRoutes()];
    const lines: string[] = [];
    lines.push('<?xml version="1.0" encoding="UTF-8"?>');
    lines.push('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">');
    for (const item of items) {
        lines.push('  <url>');
        lines.push(`    <loc>${escXml(item.loc)}</loc>`);
        if (item.altKo) lines.push(`    <xhtml:link rel="alternate" hreflang="ko" href="${escXml(item.altKo)}"/>`);
        if (item.altEn) lines.push(`    <xhtml:link rel="alternate" hreflang="en" href="${escXml(item.altEn)}"/>`);
        lines.push(`    <lastmod>${item.lastmod || today}</lastmod>`);
        lines.push(`    <changefreq>${item.changefreq || 'monthly'}</changefreq>`);
        lines.push(`    <priority>${item.priority || '0.5'}</priority>`);
        lines.push('  </url>');
    }
    lines.push('</urlset>');
    return `${lines.join('\n')}\n`;
}

function makeLlmsTxt() {
    const dates = DESK_POSTS.map(p => p.date).filter(Boolean).sort();
    const oldest = dates[0] || 'N/A';
    const newest = dates[dates.length - 1] || 'N/A';
    const catCounts = new Map<string, number>();
    for (const p of DESK_POSTS) catCounts.set(p.category, (catCounts.get(p.category) || 0) + 1);

    const lines: string[] = [];
    lines.push('# Cafe Lua (cafelua.com)');
    lines.push('');
    lines.push('> A virtual cafe between reality and a small fantasy, run by Luke and Alpha.');
    lines.push('');

    lines.push('## About');
    lines.push('Cafe Lua is a personal website by Luke (Yang), a software engineer and creator.');
    lines.push('The site is themed as a two-story virtual cafe:');
    lines.push('- **1F Lounge**: A relaxing space with background music, a counter for AI coffee chat and tarot, a gallery, and a guestbook.');
    lines.push('- **2F Atelier**: A private workspace with the Master\'s Desk (blog), Alpha\'s Station (AI dev), a library, and an old PC running Luke\'s 1997/1998 homepages.');
    lines.push('');
    lines.push('Alpha (Alpha Yang) is the AI maid character who resides in Cafe Lua.');
    lines.push('She is named after Hatsuse No Alpha from the manga *Cafe Alpha*.');
    lines.push('');

    lines.push('## Languages');
    lines.push('- Korean (ko): primary language');
    lines.push('- English (en): full bilingual support');
    lines.push('- All pages are available in both languages via /ko/ and /en/ path prefixes.');
    lines.push('');

    lines.push('## Site Structure');
    lines.push('');
    lines.push('### Entrance');
    lines.push(`- ${BASE}/ko/ — Korean homepage (season/time/weather selector)`);
    lines.push(`- ${BASE}/en/ — English homepage`);
    lines.push('');
    lines.push('### 1F Lounge');
    lines.push(`- ${BASE}/ko/lounge — Main lounge with navigation menu`);
    lines.push(`- ${BASE}/ko/about — About Cafe Lua (sitemap, Alpha & Luke introductions)`);
    lines.push(`- ${BASE}/ko/counter — Counter: AI coffee chat & tarot reading with Alpha`);
    lines.push(`- ${BASE}/ko/gallery — Gallery: diary, spaces, tarot cards, BGM`);
    lines.push(`- ${BASE}/ko/guestbook — Guestbook: leave messages for Alpha and Luke`);
    lines.push('');
    lines.push('### 2F Atelier');
    lines.push(`- ${BASE}/ko/atelier — Atelier menu (Master\'s Desk, Old PC, etc.)`);
    lines.push(`- ${BASE}/ko/desk — Master\'s Desk: Luke\'s blog posts and writings`);
    lines.push(`- ${BASE}/ko/desk/{slug} — Individual desk post`);
    lines.push(`- ${BASE}/ko/atelier?oldpc=true — Old PC: browse 1997/1998 homepages in a simulated Windows 98 desktop`);
    lines.push('');

    lines.push('## Content: Master\'s Desk');
    lines.push(`- Total posts: ${DESK_POSTS.length}`);
    lines.push(`- Date range: ${oldest} to ${newest}`);
    lines.push(`- Migrated from Naver Blog (https://blog.naver.com/fstory97), active since 2006`);
    lines.push('- Categories:');
    for (const cat of [
        { key: 'it', en: 'IT' },
        { key: 'review', en: 'Media Review (films, books, etc.)' },
        { key: 'art', en: 'Artwork (illustrations, pixel art)' },
        { key: 'private', en: 'Private Notes (personal essays)' },
        { key: 'ai', en: 'AI (artificial intelligence, LLMs, agents)' },
        { key: 'xrcloud', en: 'XRCLOUD (XR/metaverse platform)' },
        { key: 'believer', en: 'Believer (faith & reflections)' },
        { key: 'cafelua', en: 'Cafe Lua (site updates)' },
    ]) {
        const count = catCounts.get(cat.key) || 0;
        if (count > 0) lines.push(`  - ${cat.en}: ${count} posts`);
    }
    lines.push('');

    lines.push('## Content: Gallery');
    lines.push(`- Diary entries: ${DIARY_ENTRIES.length}`);
    lines.push('- Spaces: visual tour of Cafe Lua rooms');
    lines.push('- Tarot cards: custom tarot deck illustrations');
    lines.push('- BGM: background music tracks used throughout the site');
    lines.push('');

    lines.push('## Interactive Features');
    lines.push('- Coffee Chat: real-time conversation with Alpha (powered by Gemini)');
    lines.push('- Tarot Reading: Celtic Cross (10-card) tarot session with AI interpretation');
    lines.push('- Old PC: fully interactive Windows 98 simulation with IE browser');
    lines.push('- Guestbook: public/secret message board');
    lines.push('');

    lines.push('## Technical');
    lines.push('- Built with Next.js, React, TypeScript');
    lines.push('- Deployed on Vercel');
    lines.push('- AI: Gemini 2.5 (chat, tarot, translation)');
    lines.push(`- Total pages: ${DESK_POSTS.length * 2 + DIARY_ENTRIES.length * 2 + 18} (ko + en)`);
    lines.push(`- Sitemap: ${BASE}/sitemap.xml`);
    lines.push('');

    lines.push('## Policy');
    lines.push('- Crawling: allowed');
    lines.push('- robots.txt: standard allow-all');
    lines.push(`- Canonical Sitemap: ${BASE}/sitemap.xml`);
    lines.push(`- llms.txt: ${BASE}/llms.txt`);

    return `${lines.join('\n')}\n`;
}

function main() {
    if (!fs.existsSync(PUBLIC_DIR)) fs.mkdirSync(PUBLIC_DIR, { recursive: true });
    fs.writeFileSync(SITEMAP_PATH, makeSitemap(), 'utf-8');
    fs.writeFileSync(LLMS_PATH, makeLlmsTxt(), 'utf-8');
    console.log(`✅ sitemap.xml 업데이트: ${SITEMAP_PATH}`);
    console.log(`✅ llms.txt 업데이트: ${LLMS_PATH}`);
}

main();
