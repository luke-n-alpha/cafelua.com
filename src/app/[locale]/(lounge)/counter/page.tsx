import type { Metadata } from 'next';

import CounterPage from '@/components/CounterPage';

interface Props {
    params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const isEn = locale === 'en';

    const title = isEn ? 'Counter' : '카운터';
    const description = isEn
        ? 'Cafe Lua counter where Alpha greets you with coffee chat and tarot reading.'
        : '알파가 맞이하는 카페루아 카운터.';
    const ogTitle = isEn ? 'Counter | CafeLua' : '카운터 | 카페루아';

    return {
        title,
        description,
        alternates: { canonical: '/counter/' },
        openGraph: {
            url: '/counter/',
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

export default function Counter() {
    return <CounterPage />;
}
