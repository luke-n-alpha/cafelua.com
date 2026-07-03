import type { Metadata } from 'next';

import GalleryPage from '@/components/GalleryPage';

interface Props {
    params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const isEn = locale === 'en';

    const title = isEn ? 'Gallery' : '갤러리';
    const description = isEn
        ? 'Cafe Lua gallery: browse spaces, diary, tarot cards, and BGM.'
        : '카페루아 갤러리: 공간 이미지, 타로 카드, BGM을 둘러보세요.';
    const ogTitle = isEn ? 'Gallery | CafeLua' : '갤러리 | 카페루아';

    return {
        title,
        description,
        alternates: { canonical: '/gallery/' },
        openGraph: {
            url: '/gallery/',
            title: ogTitle,
            description,
            images: ['/og-cafelua-entrance-v019.png'],
        },
        twitter: {
            title: ogTitle,
            description,
            images: ['/og-cafelua-entrance-v019.png'],
        },
    };
}

export default function Gallery() {
    return <GalleryPage />;
}
