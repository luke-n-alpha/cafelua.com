import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { DIARY_ENTRIES, getDiaryBySlug } from '@/data/gallery/diaryData';
import DiaryPost from '@/components/DiaryPost';

interface Props {
    params: Promise<{ slug: string; locale: string }>;
}

export async function generateStaticParams() {
    return DIARY_ENTRIES.map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug, locale } = await params;
    const entry = getDiaryBySlug(slug);
    if (!entry) return {};

    const isEn = locale === 'en';
    const entryTitle = isEn ? (entry.titleEn || entry.titleKo) : entry.titleKo;
    const suffix = isEn ? 'CafeLua Diary' : '카페루아 다이어리';
    const ogTitle = `${entryTitle} | ${suffix}`;

    const rawContent = isEn ? (entry.contentEn || entry.contentKo) : entry.contentKo;
    const cleanContent = rawContent?.replace(/\{\{IMG:\d+\}\}/g, '').trim();
    const fallbackDesc = isEn ? `CafeLua Diary — ${entryTitle}` : `카페루아 다이어리 — ${entryTitle}`;
    const description = cleanContent
        ? cleanContent.slice(0, 120) + (cleanContent.length > 120 ? '...' : '')
        : fallbackDesc;
    const ogImage = entry.images.length > 0 ? entry.images[0] : '/og-cafelua-entrance-v019.png';

    return {
        title: entryTitle,
        description,
        alternates: { canonical: `/gallery/diary/${slug}` },
        openGraph: {
            url: `/gallery/diary/${slug}`,
            title: ogTitle,
            description,
            images: [ogImage],
        },
        twitter: {
            title: ogTitle,
            description,
            images: [ogImage],
        },
    };
}

export default async function DiaryPage({ params }: Props) {
    const { slug } = await params;
    const entry = getDiaryBySlug(slug);
    if (!entry) notFound();
    return <DiaryPost entry={entry} />;
}
