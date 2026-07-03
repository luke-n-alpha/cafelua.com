import type { Metadata } from 'next';

import LoungePage from '@/components/LoungePage';

interface Props {
    params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const isEn = locale === 'en';

    const title = isEn ? 'Lounge' : '라운지';
    const description = isEn
        ? "Cafe Lua's 1F lounge — relax with ambient music."
        : '음악과 함께 쉬어가는 카페루아 1층 라운지.';
    const ogTitle = isEn ? 'Lounge | CafeLua' : '라운지 | 카페루아';

    return {
        title,
        description,
        alternates: { canonical: '/lounge/' },
        openGraph: {
            url: '/lounge/',
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

export default function Lounge() {
    return <LoungePage />;
}
