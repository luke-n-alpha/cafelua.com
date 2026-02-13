import type { Metadata } from 'next';

import GalleryPage from '@/components/GalleryPage';

export const metadata: Metadata = {
    title: '갤러리',
    description: '카페루아 갤러리: 공간 이미지, 타로 카드, BGM을 둘러보세요.',
    alternates: {
        canonical: '/gallery/'
    },
    openGraph: {
        url: '/gallery/',
        title: '갤러리 | 카페루아',
        description: '카페루아 갤러리: 공간 이미지, 타로 카드, BGM을 둘러보세요.',
        images: ['/og-cover.png']
    },
    twitter: {
        title: '갤러리 | 카페루아',
        description: '카페루아 갤러리: 공간 이미지, 타로 카드, BGM을 둘러보세요.',
        images: ['/og-cover.png']
    }
};

export default function Gallery() {
    return <GalleryPage />;
}
