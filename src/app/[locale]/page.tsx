import type { Metadata } from 'next';

import IntroPage from '@/components/IntroPage';

interface Props {
    params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const isEn = locale === 'en';

    const description = isEn
        ? 'A small virtual cafe run by Luke and Alpha, with coffee chat, tarot stories, and rooms that change with the season and weather.'
        : '루크와 알파가 함께 운영하는 작은 가상 카페. 계절과 날씨에 따라 달라지는 공간에서 커피챗, 타로, 기록을 만납니다.';
    const ogTitle = isEn ? 'Entrance | CafeLua' : '현관 | 카페루아';

    return {
        title: {
            absolute: ogTitle,
        },
        description,
        alternates: {
            canonical: isEn ? '/en' : '/ko',
            languages: {
                ko: '/ko',
                en: '/en',
                'x-default': '/',
            },
        },
        openGraph: {
            url: isEn ? '/en' : '/ko',
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
