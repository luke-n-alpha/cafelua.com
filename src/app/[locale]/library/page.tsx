import type { Metadata } from 'next';

import BackgroundMusic from '@/components/BackgroundMusic';
import LibraryShelfPage from '@/components/LibraryShelfPage';

type Params = { locale: string };

export const metadata: Metadata = {
    title: 'Cafe Lua Library',
    description: '하네스 엔지니어링과 화성침공을 읽을 수 있는 Cafe Lua의 서재입니다.',
};

export default async function Library({ params }: { params: Promise<Params> }) {
    const { locale: rawLocale } = await params;
    return (
        <>
            <BackgroundMusic src="/sounds/library.mp3" />
            <LibraryShelfPage locale={rawLocale === 'en' ? 'en' : 'ko'} />
        </>
    );
}
