import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import '../app/globals.css';
import Providers from './providers';

const GA_ID = 'G-EDLFFFY25M';
const SITE_DESCRIPTION = '루크와 알파가 함께 운영하는 작은 가상 카페. 계절과 날씨에 따라 달라지는 공간에서 커피챗, 타로, 기록을 만납니다.';

export const metadata: Metadata = {
    metadataBase: new URL('https://cafelua.com'),
    title: {
        default: '카페루아 (Café Luα)',
        template: '%s | 카페루아'
    },
    description: SITE_DESCRIPTION,
    applicationName: 'Cαfé Luα',
    authors: [{ name: 'Luke Yang', url: 'https://cafelua.com' }],
    creator: 'Luke Yang',
    publisher: 'Cαfé Luα',
    category: 'personal website',
    keywords: [
        '카페루아',
        'Cafe Lua',
        'Cαfé Luα',
        'Alpha Yang',
        '알파',
        'Luke Yang',
        'virtual cafe',
        'AI companion',
        'tarot',
        'personal blog'
    ],
    alternates: {
        canonical: '/'
    },
    openGraph: {
        type: 'website',
        url: '/',
        title: '카페루아 (Café Luα)',
        description: SITE_DESCRIPTION,
        siteName: '카페루아',
        locale: 'ko_KR',
        images: [
            {
                url: '/og-cafelua-entrance-v019.png',
                width: 1200,
                height: 630,
                type: 'image/png',
                alt: '카페루아 (Café Luα)'
            }
        ]
    },
    twitter: {
        card: 'summary_large_image',
        title: '카페루아 (Café Luα)',
        description: SITE_DESCRIPTION,
        images: ['/og-cafelua-entrance-v019.png']
    },
    robots: {
        index: true,
        follow: true
    }
};

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    themeColor: '#080a0e'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="ko">
            <head>
                <Script
                    src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
                    strategy="afterInteractive"
                />
                <Script id="gtag-init" strategy="afterInteractive">
                    {`
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('config', '${GA_ID}');
                    `}
                </Script>
            </head>
            <body>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
