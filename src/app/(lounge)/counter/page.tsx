import type { Metadata } from 'next';

import CounterPage from '../../../components/CounterPage';

export const metadata: Metadata = {
    title: '카운터',
    description: '알파가 맞이하는 카페루아 카운터.',
    alternates: {
        canonical: '/counter/'
    },
    openGraph: {
        url: '/counter/',
        title: '카운터 | 카페루아',
        description: '알파가 맞이하는 카페루아 카운터.',
        images: ['/og-cafelua-entrance-v019.png']
    },
    twitter: {
        title: '카운터 | 카페루아',
        description: '알파가 맞이하는 카페루아 카운터.',
        images: ['/og-cafelua-entrance-v019.png']
    }
};

export default function Counter() {
    return <CounterPage />;
}
