import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { DESK_POSTS, getDeskPostBySlug, getAdjacentPosts, getFallbackPosts } from '@/data/desk/deskLoader';
import { buildDeskPostMetadata } from '@/lib/desk-metadata';
import DeskPost from '@/components/DeskPost';

interface Props {
    params: Promise<{ slug: string; locale: string }>;
}

export const revalidate = 3600;
export const dynamicParams = true;

const DESK_PREBUILD_COUNT = (() => {
    const raw = Number(process.env.DESK_PREBUILD_COUNT ?? '50');
    if (!Number.isFinite(raw) || raw < 0) return 50;
    return Math.floor(raw);
})();

export async function generateStaticParams() {
    const locales = ['ko', 'en'];
    const prebuiltPosts = DESK_POSTS.slice(0, DESK_PREBUILD_COUNT);
    return locales.flatMap((locale) => prebuiltPosts.map((post) => ({ locale, slug: post.slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug, locale } = await params;
    const decodedSlug = decodeURIComponent(slug);
    const post = getDeskPostBySlug(decodedSlug);
    if (!post) return {};
    return buildDeskPostMetadata(post, locale);
}

export default async function DeskPostPage({ params }: Props) {
    const { slug } = await params;
    const decodedSlug = decodeURIComponent(slug);
    const post = getDeskPostBySlug(decodedSlug);
    if (!post) notFound();
    const { prev, next } = getAdjacentPosts(decodedSlug);
    const fallbackPosts = getFallbackPosts(decodedSlug, 4);
    return (
        <DeskPost
            post={post}
            prevPost={prev}
            nextPost={next}
            fallbackPosts={fallbackPosts}
        />
    );
}
