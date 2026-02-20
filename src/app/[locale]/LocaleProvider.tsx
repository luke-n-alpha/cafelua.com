'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import i18n from '@/i18n';

export default function LocaleProvider({ children }: { children: React.ReactNode }) {
    const params = useParams();
    const locale = params.locale as string;

    // Synchronously set language before first render to avoid hydration mismatch
    if (locale && i18n.language !== locale) {
        i18n.changeLanguage(locale);
    }

    useEffect(() => {
        if (locale && i18n.language !== locale) {
            i18n.changeLanguage(locale);
        }
        // Set html lang attribute dynamically
        if (locale) {
            document.documentElement.lang = locale;
        }
    }, [locale]);

    return <>{children}</>;
}
