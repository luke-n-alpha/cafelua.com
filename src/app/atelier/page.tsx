import type { Metadata } from 'next';

import AtelierPage from '../../components/AtelierPage';

export const metadata: Metadata = {
    title: '2층 아틀리에',
    description: '카페루아 2층 작업 공간. 낡은 PC에서 1997/1998년 루크의 홈페이지를 확인할 수 있습니다.',
    alternates: {
        canonical: '/atelier/'
    },
    openGraph: {
        url: '/atelier/',
        title: '2층 아틀리에 | 카페루아',
        description: '카페루아 2층 작업 공간. 낡은 PC에서 1997/1998년 루크의 홈페이지를 확인할 수 있습니다.',
        images: ['/og-cafelua-entrance-v019.png']
    },
    twitter: {
        title: '2층 아틀리에 | 카페루아',
        description: '카페루아 2층 작업 공간. 낡은 PC에서 1997/1998년 루크의 홈페이지를 확인할 수 있습니다.',
        images: ['/og-cafelua-entrance-v019.png']
    }
};

export default function Atelier() {
    return <AtelierPage />;
}
