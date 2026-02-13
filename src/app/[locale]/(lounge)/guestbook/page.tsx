import type { Metadata } from 'next';

import GuestbookPage from '@/components/GuestbookPage';

export const metadata: Metadata = {
    title: '방명록',
    description: '카페루아 방명록: 편하게 한 마디 남겨주세요.',
    alternates: {
        canonical: '/guestbook/'
    },
    openGraph: {
        url: '/guestbook/',
        title: '방명록 | 카페루아',
        description: '카페루아 방명록: 편하게 한 마디 남겨주세요.',
        images: ['/og-cover.png']
    },
    twitter: {
        title: '방명록 | 카페루아',
        description: '카페루아 방명록: 편하게 한 마디 남겨주세요.',
        images: ['/og-cover.png']
    }
};

export default function Guestbook() {
    return <GuestbookPage />;
}
