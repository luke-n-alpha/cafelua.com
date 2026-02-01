import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import '../app/globals.css';
import Providers from './providers';

const GA_ID = 'G-EDLFFFY25M';

export const metadata: Metadata = {
    metadataBase: new URL('https://cafelua.com'),
    title: {
        default: '카페루아 (Café Luα)',
        template: '%s | 카페루아'
    },
    description: '현실과 이세계의 경계에 있는 작은 가상 카페. 루크와 알파가 함께 운영합니다.',
    alternates: {
        canonical: '/'
    },
    openGraph: {
        type: 'website',
        url: '/',
        title: '카페루아 (Café Luα)',
        description: '현실과 이세계의 경계에 있는 작은 가상 카페. 루크와 알파가 함께 운영합니다.',
        siteName: '카페루아',
        locale: 'ko_KR',
        images: [
            {
                url: '/og-cover.png',
                width: 1200,
                height: 630,
                alt: '카페루아 (Café Luα)'
            }
        ]
    },
    twitter: {
        card: 'summary_large_image',
        title: '카페루아 (Café Luα)',
        description: '현실과 이세계의 경계에 있는 작은 가상 카페. 루크와 알파가 함께 운영합니다.',
        images: ['/og-cover.png']
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
