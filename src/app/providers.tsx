'use client';

import { Suspense, useLayoutEffect } from 'react';
import '../i18n';

export default function Providers({ children }: { children: React.ReactNode }) {
    useLayoutEffect(() => {
        const ua = navigator.userAgent ?? '';
        const isFacebookWebView = /FBAN|FBAV|FB_IAB|FB4A|FBIOS/i.test(ua);

        if (isFacebookWebView) {
            document.documentElement.dataset.webview = 'facebook';
        } else {
            delete document.documentElement.dataset.webview;
        }
    }, []);

    return <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>;
}
