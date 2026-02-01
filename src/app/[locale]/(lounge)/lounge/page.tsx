import type { Metadata } from 'next';

import LoungePage from '@/components/LoungePage';

export const metadata: Metadata = {
    title: '라운지',
    description: '음악과 함께 쉬어가는 카페루아 1층 라운지.',
    alternates: {
        canonical: '/lounge/'
    },
    openGraph: {
        url: '/lounge/',
        title: '라운지 | 카페루아',
        description: '음악과 함께 쉬어가는 카페루아 1층 라운지.',
        images: ['/og-cover.png']
    },
    twitter: {
        title: '라운지 | 카페루아',
        description: '음악과 함께 쉬어가는 카페루아 1층 라운지.',
        images: ['/og-cover.png']
    }
};

export default function Lounge() {
    return <LoungePage />;
}
