import type { Metadata } from 'next';

import LibraryPage from '@/components/LibraryPage';

interface Props {
    params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const isEn = locale === 'en';

    const title = isEn ? '2F Atelier' : '2층 아틀리에';
    const description = isEn
        ? "Cafe Lua's 2F workspace. Browse Luke's 1997/1998 homepage memories on the old PC."
        : '카페루아 2층 작업 공간. 낡은 PC에서 1997/1998년 루크의 홈페이지를 확인할 수 있습니다.';
    const ogTitle = isEn ? '2F Atelier | CafeLua' : '2층 아틀리에 | 카페루아';

    return {
        title,
        description,
        alternates: { canonical: '/atelier/' },
        openGraph: {
            url: '/atelier/',
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

export default function Atelier() {
    return <LibraryPage />;
}
