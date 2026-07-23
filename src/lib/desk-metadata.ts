import type { Metadata } from 'next';
import type { DeskPost } from '@/data/desk/deskData';

function cleanOgText(input: string): string {
    return input
        .replace(/\{\{IMG:\d+\}\}/g, '')
        .replace(/^>.*$/gm, '')
        .replace(/!\[.*?\]\(.*?\)/g, '')
        .replace(/^#{1,6}\s+/gm, '')
        .replace(/^---+$/gm, '')
        .replace(/\*\*/g, '')
        .replace(/\[(.*?)\]\((.*?)\)/g, '$1')
        .replace(/`([^`]*)`/g, '$1')
        .replace(/https?:\/\/\S+/g, '')
        .replace(/\u200b/g, '')
        .replace(/\s+/g, ' ')
        .trim();
}

function buildOgTitle(rawTitle: string, locale: string): string {
    const postTitle = cleanOgText(rawTitle) || (locale === 'en' ? 'Post' : '포스팅');
    const clipped = postTitle.length > 110 ? `${postTitle.slice(0, 109)}…` : postTitle;
    const suffix = locale === 'en' ? ' | Master Desk · CafeLua' : ' | 마스터의 데스크 · 카페루아';
    return `${clipped}${suffix}`;
}

function buildOgDescription(rawContent: string, locale: string): string {
    const prefix = locale === 'en' ? 'Master Desk | CafeLua - ' : '마스터의 데스크 | 카페루아 - ';
    const fallback = locale === 'en' ? 'Posts and notes from Luke and Alpha.' : '루크와 알파의 글과 기록.';
    const body = cleanOgText(rawContent) || fallback;
    const available = Math.max(24, 160 - prefix.length);
    const clipped = body.length > available ? `${body.slice(0, available - 1)}…` : body;
    return `${prefix}${clipped}`;
}

export function buildDeskPostMetadata(post: DeskPost, locale: string): Metadata {
    const sourceTitle = locale === 'en' ? (post.titleEn || post.titleKo) : post.titleKo;
    const sourceContent = locale === 'en' ? (post.contentEn || post.contentKo) : post.contentKo;
    const cleanTitle = cleanOgText(sourceTitle) || (locale === 'en' ? 'Post' : '포스팅');
    const description = buildOgDescription(sourceContent, locale);
    const ogImage = post.thumbnail || post.images?.[0] || '/og-cafelua-entrance-v019.png';
    const encodedSlug = encodeURIComponent(post.slug);
    const postUrl = `/${locale}/desk/${encodedSlug}/`;
    const publishedAt = /^\d{4}-\d{2}-\d{2}$/.test(post.date)
        ? `${post.date}T00:00:00.000Z`
        : undefined;

    return {
        title: cleanTitle,
        description,
        authors: [{ name: 'Luke Yang', url: 'https://www.cafelua.com/ko/about/luke/' }],
        alternates: {
            canonical: postUrl,
            languages: {
                ko: `/ko/desk/${encodedSlug}/`,
                en: `/en/desk/${encodedSlug}/`,
            },
        },
        openGraph: {
            type: 'article',
            url: postUrl,
            title: buildOgTitle(sourceTitle, locale),
            description,
            siteName: locale === 'en' ? 'CafeLua' : '카페루아',
            locale: locale === 'en' ? 'en_US' : 'ko_KR',
            publishedTime: publishedAt,
            authors: ['Luke Yang'],
            images: [{ url: ogImage, alt: cleanTitle }],
        },
        twitter: {
            card: 'summary_large_image',
            title: buildOgTitle(sourceTitle, locale),
            description,
            images: [ogImage],
        },
    };
}
