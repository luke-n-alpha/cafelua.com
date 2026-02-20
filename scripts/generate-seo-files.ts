import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { DESK_POSTS } from '../src/data/desk/deskData';
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
    const lines: string[] = [];
    lines.push('# CafeLua (cafelua.com)');
    lines.push('');
    lines.push('## URLs');
    lines.push(`- ${BASE}/ko/`);
    lines.push(`- ${BASE}/en/`);
    lines.push(`- ${BASE}/ko/desk`);
    lines.push(`- ${BASE}/ko/gallery?tab=diary`);
    lines.push(`- ${BASE}/sitemap.xml`);
    lines.push('');
    lines.push('## Dynamic Content');
    lines.push(`- Desk posts: ${DESK_POSTS.length}`);
    lines.push(`- Diary entries: ${DIARY_ENTRIES.length}`);
    lines.push('');
    lines.push('## Policy');
    lines.push('- Crawling: allowed');
    lines.push(`- Canonical Sitemap: ${BASE}/sitemap.xml`);
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
