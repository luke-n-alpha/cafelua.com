import type { Metadata } from 'next';

import AboutPage from '@/components/AboutPage';

export const metadata: Metadata = {
    title: '카페 소개',
    description: '카페루아 소개: 알파의 인사와 루크의 인사.',
    alternates: {
        canonical: '/about/'
    },
    openGraph: {
        url: '/about/',
        title: '카페 소개 | 카페루아',
        description: '카페루아 소개: 알파의 인사와 루크의 인사.',
        images: ['/og-cover.png']
    },
    twitter: {
        title: '카페 소개 | 카페루아',
        description: '카페루아 소개: 알파의 인사와 루크의 인사.',
        images: ['/og-cover.png']
    }
};

export default function About() {
    return <AboutPage />;
}
