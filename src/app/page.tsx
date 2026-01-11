import type { Metadata } from 'next';

import IntroPage from '../components/IntroPage';

export const metadata: Metadata = {
    title: '현관',
    description: '계절/시간/날씨에 따라 달라지는 현관에서 카페루아로 입장합니다.',
    alternates: {
        canonical: '/'
    },
    openGraph: {
        url: '/',
        title: '현관 | 카페루아',
        description: '계절/시간/날씨에 따라 달라지는 현관에서 카페루아로 입장합니다.',
        images: ['/og-cover.png']
    },
    twitter: {
        title: '현관 | 카페루아',
        description: '계절/시간/날씨에 따라 달라지는 현관에서 카페루아로 입장합니다.',
        images: ['/og-cover.png']
    }
};

export default function HomePage() {
    return <IntroPage />;
}
