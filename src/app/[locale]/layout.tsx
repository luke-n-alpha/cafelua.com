'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import i18n from '@/i18n';

export default function LocaleLayout({ children }: { children: React.ReactNode }) {
    const params = useParams();
    const locale = params.locale as string;

    useEffect(() => {
        if (locale && i18n.language !== locale) {
            i18n.changeLanguage(locale);
        }
    }, [locale]);

    return <>{children}</>;
}
