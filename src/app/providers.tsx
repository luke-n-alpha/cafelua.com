'use client';

import { Suspense } from 'react';
import '../i18n';

export default function Providers({ children }: { children: React.ReactNode }) {
    return <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>;
}
