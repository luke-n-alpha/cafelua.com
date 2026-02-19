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
    const { slug } = await params;
    const entry = getDiaryBySlug(slug);
    if (!entry) return {};

    const title = `${entry.titleKo} | 카페루아 다이어리`;
    const cleanContent = entry.contentKo?.replace(/\{\{IMG:\d+\}\}/g, '').trim();
    const description = cleanContent
        ? cleanContent.slice(0, 120) + (cleanContent.length > 120 ? '...' : '')
        : `카페루아 다이어리 — ${entry.titleKo}`;
    const ogImage = entry.images.length > 0 ? entry.images[0] : '/og-cover.png';

    return {
        title: entry.titleKo,
        description,
        alternates: { canonical: `/gallery/diary/${slug}` },
        openGraph: {
            url: `/gallery/diary/${slug}`,
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

export default async function DiaryPage({ params }: Props) {
    const { slug } = await params;
    const entry = getDiaryBySlug(slug);
    if (!entry) notFound();
    return <DiaryPost entry={entry} />;
}
