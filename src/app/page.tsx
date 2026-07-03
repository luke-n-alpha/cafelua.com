import type { Metadata } from 'next';

import IntroPage from '../components/IntroPage';

export const metadata: Metadata = {
    title: '현관',
    description: '루크와 알파가 함께 운영하는 작은 가상 카페. 계절과 날씨에 따라 달라지는 공간에서 커피챗, 타로, 기록을 만납니다.',
    alternates: {
        canonical: '/',
        languages: {
            ko: '/ko',
            en: '/en',
            'x-default': '/'
        }
    },
    openGraph: {
        url: '/',
        title: '현관 | 카페루아',
        description: '루크와 알파가 함께 운영하는 작은 가상 카페. 계절과 날씨에 따라 달라지는 공간에서 커피챗, 타로, 기록을 만납니다.',
        images: ['/og-cafelua-entrance-v019.png']
    },
    twitter: {
        title: '현관 | 카페루아',
        description: '루크와 알파가 함께 운영하는 작은 가상 카페. 계절과 날씨에 따라 달라지는 공간에서 커피챗, 타로, 기록을 만납니다.',
        images: ['/og-cafelua-entrance-v019.png']
    }
};

export default function HomePage() {
    return <IntroPage />;
}
