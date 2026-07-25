import type { Metadata } from 'next';

import BackgroundMusic from '@/components/BackgroundMusic';
import LibraryPage from '@/components/LibraryPage';

type Params = { locale: string };

const LIBRARY_DESCRIPTION = '하네스 엔지니어링과 화성침공을 읽을 수 있는 Cafe Lua의 서재입니다.';
// 서재(책꽂이) 배경을 OG/트위터 카드 이미지로 사용.
const LIBRARY_OG_IMAGE = '/library-background-img/library_bg_autumn_sunset_clear.webp';

export const metadata: Metadata = {
    title: 'Cafe Lua Library',
    description: LIBRARY_DESCRIPTION,
    alternates: { canonical: '/library' },
    openGraph: {
        type: 'website',
        url: '/library',
        title: 'Cafe Lua Library',
        description: LIBRARY_DESCRIPTION,
        images: [LIBRARY_OG_IMAGE],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Cafe Lua Library',
        description: LIBRARY_DESCRIPTION,
        images: [LIBRARY_OG_IMAGE],
    },
};

export default async function Library({ params }: { params: Promise<Params> }) {
    const { locale: rawLocale } = await params;
    return (
        <>
            <BackgroundMusic src="/sounds/library.mp3" />
            <LibraryPage locale={rawLocale === 'en' ? 'en' : 'ko'} />
        </>
    );
}
