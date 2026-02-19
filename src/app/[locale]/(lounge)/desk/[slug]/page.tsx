import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { DESK_POSTS, getDeskPostBySlug } from '@/data/desk/deskData';
import DeskPost from '@/components/DeskPost';

interface Props {
    params: Promise<{ slug: string; locale: string }>;
}

function cleanOgText(input: string): string {
    return input
        .replace(/\{\{IMG:\d+\}\}/g, '')
        .replace(/\*\*/g, '')
        .replace(/\[(.*?)\]\((.*?)\)/g, '$1')
        .replace(/\u200b/g, '')
        .replace(/\s+/g, ' ')
        .trim();
}

function buildOgTitle(rawTitle: string, locale: string): string {
    const base = cleanOgText(rawTitle);
    const fallback = locale === 'en' ? 'Post' : '포스팅';
    const postTitle = base || fallback;
    const maxLen = 110;
    const clipped = postTitle.length > maxLen ? `${postTitle.slice(0, maxLen - 1)}…` : postTitle;
    const suffix = locale === 'en' ? ' | Master Desk · CafeLua' : ' | 마스터의 데스크 · 카페루아';
    return `${clipped}${suffix}`;
}

function buildOgDescription(rawContent: string, locale: string): string {
    const prefix = locale === 'en' ? 'Master Desk | CafeLua - ' : '마스터의 데스크 | 카페루아 - ';
    const cleaned = cleanOgText(rawContent);
    const fallback = locale === 'en' ? 'Posts and notes from Luke and Alpha.' : '루크와 알파의 글과 기록.';
    const body = cleaned || fallback;
    const maxLen = 160;
    const available = Math.max(24, maxLen - prefix.length);
    const clipped = body.length > available ? `${body.slice(0, available - 1)}…` : body;
    return `${prefix}${clipped}`;
}

export async function generateStaticParams() {
    const locales = ['ko', 'en'];
    return locales.flatMap((locale) => DESK_POSTS.map((post) => ({ locale, slug: post.slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug, locale } = await params;
    const decodedSlug = decodeURIComponent(slug);
    const post = getDeskPostBySlug(decodedSlug);
    if (!post) return {};

    const sourceTitle = locale === 'en' ? (post.titleEn || post.titleKo) : post.titleKo;
    const title = buildOgTitle(sourceTitle, locale);
    const sourceContent = locale === 'en' ? (post.contentEn || post.contentKo) : post.contentKo;
    const description = buildOgDescription(sourceContent, locale);
    const ogImage = post.thumbnail || '/og-cover.png';

    return {
        title: post.titleKo,
        description,
        alternates: { canonical: `/desk/${slug}` },
        openGraph: {
            url: `/desk/${slug}`,
            title,
            description,
            images: [ogImage],
        },
        twitter: {
            title,
            description,
            images: [ogImage],
        },
    };
}

export default async function DeskPostPage({ params }: Props) {
    const { slug } = await params;
    const decodedSlug = decodeURIComponent(slug);
    const post = getDeskPostBySlug(decodedSlug);
    if (!post) notFound();
    return <DeskPost post={post} />;
}
