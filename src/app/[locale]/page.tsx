import type { Metadata } from 'next';

import IntroPage from '@/components/IntroPage';

interface Props {
    params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const isEn = locale === 'en';

    const title = isEn ? 'Entrance' : '현관';
    const description = isEn
        ? 'Enter Cafe Lua through the entrance that changes with season, time, and weather.'
        : '계절/시간/날씨에 따라 달라지는 현관에서 카페루아로 입장합니다.';
    const ogTitle = isEn ? 'Entrance | CafeLua' : '현관 | 카페루아';

    return {
        title,
        description,
        alternates: { canonical: '/' },
        openGraph: {
            url: '/',
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

export default function HomePage() {
    return <IntroPage />;
}
