import type { Metadata } from 'next';
import MasterDeskPage from '@/components/MasterDeskPage';
import { getDeskPostListItems } from '@/data/desk/deskLoader';

interface Props {
    params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const isEn = locale === 'en';

    const title = isEn ? "Master's Desk" : "마스터의 데스크";
    const description = isEn
        ? "Master's Desk at Cafe Lua: essays, tech notes, reviews, and more."
        : '카페루아 마스터의 데스크: 에세이, 기술 메모, 리뷰 등.';
    const ogTitle = isEn ? "Master's Desk | CafeLua" : "마스터의 데스크 | 카페루아";

    return {
        title,
        description,
        alternates: { canonical: '/desk/' },
        openGraph: {
            url: '/desk/',
            title: ogTitle,
            description,
            images: ['/og-cover.png'],
        },
        twitter: {
            title: ogTitle,
            description,
            images: ['/og-cover.png'],
        },
    };
}

export default function Desk() {
    const posts = getDeskPostListItems();
    return <MasterDeskPage posts={posts} />;
}
