import type { Metadata } from 'next';

import GuestbookPage from '@/components/GuestbookPage';

interface Props {
    params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const isEn = locale === 'en';

    const title = isEn ? 'Guestbook' : '방명록';
    const description = isEn
        ? 'Cafe Lua guestbook: feel free to leave a message for Alpha and Luke.'
        : '카페루아 방명록: 편하게 한 마디 남겨주세요.';
    const ogTitle = isEn ? 'Guestbook | CafeLua' : '방명록 | 카페루아';

    return {
        title,
        description,
        alternates: { canonical: '/guestbook/' },
        openGraph: {
            url: '/guestbook/',
            title: ogTitle,
            description,
            images: ['/og-cover.png'],
        },
        twitter: {
            title: ogTitle,
            description,
            images: ['/og-cover.png'],
        },
    };
}

export default function Guestbook() {
    return <GuestbookPage />;
}
