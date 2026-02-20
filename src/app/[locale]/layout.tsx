import type { Metadata } from 'next';
import LocaleProvider from './LocaleProvider';

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
        openGraph: {
            locale: isEn ? 'en_US' : 'ko_KR',
            siteName: isEn ? 'CafeLua' : '카페루아',
        },
    };
}

export default async function LocaleLayout({ children }: Props) {
    return <LocaleProvider>{children}</LocaleProvider>;
}
