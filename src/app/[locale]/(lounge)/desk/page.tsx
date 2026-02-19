import type { Metadata } from 'next';
import MasterDeskPage from '@/components/MasterDeskPage';

export const metadata: Metadata = {
    title: "마스터의 데스크",
    description: '카페루아 마스터의 데스크: 에세이, 기술 메모, 리뷰 등.',
    alternates: {
        canonical: '/desk/',
    },
    openGraph: {
        url: '/desk/',
        title: "마스터의 데스크 | 카페루아",
        description: '카페루아 마스터의 데스크: 에세이, 기술 메모, 리뷰 등.',
        images: ['/og-cover.png'],
    },
    twitter: {
        title: "마스터의 데스크 | 카페루아",
        description: '카페루아 마스터의 데스크: 에세이, 기술 메모, 리뷰 등.',
        images: ['/og-cover.png'],
    },
};

export default function Desk() {
    return <MasterDeskPage />;
}
