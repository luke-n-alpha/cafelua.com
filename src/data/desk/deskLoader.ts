/**
 * Server-only desk post loader.
 * Reads markdown files from public/desk-posts/ at build/request time.
 *
 * DO NOT import this file from 'use client' components.
 */

import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';
import { manualPosts, toPostCard, type DeskPost, type DeskPostCard, type DeskPostListItem, type DeskCategory } from './deskData';

const POST_ROOT = path.join(process.cwd(), 'public', 'desk-posts');

/* ─── MD parser ─── */

function parseMdPost(filePath: string, slug: string): DeskPost | null {
    let source: string;
    try {
        source = fs.readFileSync(filePath, 'utf8');
    } catch {
        return null;
    }

    if (!source.startsWith('---')) return null;
    const endIdx = source.indexOf('\n---', 3);
    if (endIdx === -1) return null;

    const rawYaml = source.slice(3, endIdx).trim();
    const body = source.slice(endIdx + 4).trimStart();

    let meta: Record<string, unknown>;
    try {
        meta = (yaml.load(rawYaml) as Record<string, unknown>) ?? {};
    } catch {
        return null;
    }

    const koMarker = '<!-- ko -->';
    const enMarker = '<!-- en -->';
    const koIdx = body.indexOf(koMarker);
    const enIdx = body.indexOf(enMarker);

    let contentKo = '';
    let contentEn = '';
    if (koIdx !== -1 && enIdx !== -1) {
        contentKo = body.slice(koIdx + koMarker.length, enIdx).trim();
        contentEn = body.slice(enIdx + enMarker.length).trim();
    } else if (koIdx !== -1) {
        contentKo = body.slice(koIdx + koMarker.length).trim();
    } else {
        contentKo = body.trim();
    }

    return {
        slug,
        date: String(meta.date ?? ''),
        titleKo: String(meta.titleKo ?? ''),
        titleEn: String(meta.titleEn ?? ''),
        contentKo,
        contentEn,
        category: String(meta.category ?? 'it') as DeskCategory,
        tags: Array.isArray(meta.tags) ? meta.tags.map(String) : [],
        thumbnail: meta.thumbnail ? String(meta.thumbnail) : undefined,
        thumbnailEn: meta.thumbnailEn ? String(meta.thumbnailEn) : undefined,
        images: Array.isArray(meta.images) ? meta.images.map(String) : [],
        sourceCategoryNo: meta.sourceCategoryNo ? String(meta.sourceCategoryNo) : undefined,
        sourceCategory: meta.sourceCategory ? String(meta.sourceCategory) : undefined,
        externalUrl: meta.externalUrl ? String(meta.externalUrl) : undefined,
        canonicalUrl: meta.canonicalUrl ? String(meta.canonicalUrl) : undefined,
    };
}

/* ─── Load all MD posts ─── */

function loadMdPosts(): DeskPost[] {
    if (!fs.existsSync(POST_ROOT)) return [];
    try {
        return fs
            .readdirSync(POST_ROOT)
            .filter((f) => f.endsWith('.md'))
            .map((f) => {
                const slug = f.replace(/\.md$/, '');
                return parseMdPost(path.join(POST_ROOT, f), slug);
            })
            .filter((p): p is DeskPost => p !== null && p.titleKo.length > 0);
    } catch {
        return [];
    }
}

/* ─── Build final DESK_POSTS (manual + md, deduped, date-sorted) ─── */

function buildDeskPosts(): DeskPost[] {
    const mdPosts = loadMdPosts();
    const seen = new Set<string>();
    const out: DeskPost[] = [];

    for (const post of [...manualPosts, ...mdPosts]) {
        if (seen.has(post.slug)) continue;
        seen.add(post.slug);
        out.push(post);
    }

    const toEpoch = (d: string) => {
        const t = Date.parse(`${d}T00:00:00Z`);
        return Number.isNaN(t) ? 0 : t;
    };

    return out.sort((a, b) => {
        const byDate = toEpoch(b.date) - toEpoch(a.date);
        return byDate !== 0 ? byDate : b.slug.localeCompare(a.slug, 'ko');
    });
}

export const DESK_POSTS: DeskPost[] = buildDeskPosts();

/* ─── Public API ─── */

export function getDeskPostBySlug(slug: string): DeskPost | undefined {
    return DESK_POSTS.find((p) => p.slug === slug);
}

export function getAdjacentPosts(slug: string): { prev: DeskPostCard | null; next: DeskPostCard | null } {
    const idx = DESK_POSTS.findIndex((p) => p.slug === slug);
    if (idx < 0) return { prev: null, next: null };
    const prev = idx < DESK_POSTS.length - 1 ? toPostCard(DESK_POSTS[idx + 1]) : null;
    const next = idx > 0 ? toPostCard(DESK_POSTS[idx - 1]) : null;
    return { prev, next };
}

export function getFallbackPosts(slug: string, count: number): DeskPostCard[] {
    const current = DESK_POSTS.find((p) => p.slug === slug);
    if (!current) return [];
    const sameCat = DESK_POSTS.filter((p) => p.slug !== slug && p.category === current.category);
    const tagSet = new Set((current.tags || []).map((t) => t.toLowerCase()));
    const scored = sameCat.map((p) => ({
        post: p,
        overlap: (p.tags || []).filter((t) => tagSet.has(t.toLowerCase())).length,
    }));
    scored.sort((a, b) => b.overlap - a.overlap);
    return scored.slice(0, count).map((s) => toPostCard(s.post));
}

export function getPostsBySlugs(slugs: string[]): DeskPostCard[] {
    const set = new Set(slugs);
    return DESK_POSTS.filter((p) => set.has(p.slug)).map(toPostCard);
}

export function getDeskPostListItems(): DeskPostListItem[] {
    return DESK_POSTS.map((p) => ({
        slug: p.slug,
        titleKo: p.titleKo,
        titleEn: p.titleEn,
        date: p.date,
        thumbnail: p.thumbnail ?? p.images?.[0],
        category: p.category,
        tags: p.tags ?? [],
    }));
}
