import type { Metadata } from 'next';
import LocaleProvider from './LocaleProvider';

const DESCRIPTION = {
    ko: '루크와 알파가 함께 운영하는 작은 가상 카페. 계절과 날씨에 따라 달라지는 공간에서 커피챗, 타로, 기록을 만납니다.',
    en: 'A small virtual cafe run by Luke and Alpha, with coffee chat, tarot stories, and rooms that change with the season and weather.',
} as const;

interface Props {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const isEn = locale === 'en';

    return {
        title: {
            template: isEn ? '%s | CafeLua' : '%s | 카페루아',
            default: isEn ? 'CafeLua' : '카페루아',
        },
        description: isEn ? DESCRIPTION.en : DESCRIPTION.ko,
        alternates: {
            languages: {
                ko: '/ko',
                en: '/en',
                'x-default': '/',
            },
        },
        openGraph: {
            locale: isEn ? 'en_US' : 'ko_KR',
            siteName: isEn ? 'CafeLua' : '카페루아',
            description: isEn ? DESCRIPTION.en : DESCRIPTION.ko,
        },
        twitter: {
            description: isEn ? DESCRIPTION.en : DESCRIPTION.ko,
        },
    };
}

export default async function LocaleLayout({ children }: Props) {
    return <LocaleProvider>{children}</LocaleProvider>;
}
