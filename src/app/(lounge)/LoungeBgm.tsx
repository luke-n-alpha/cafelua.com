'use client';

import { usePathname } from 'next/navigation';
import BackgroundMusic from '../../components/BackgroundMusic';

const normalizePathname = (pathname: string) => {
    if (pathname.length > 1 && pathname.endsWith('/')) return pathname.slice(0, -1);
    return pathname;
};

export default function LoungeBgm() {
    const pathname = usePathname();
    const normalizedPath = normalizePathname(pathname);
    const hideUi = normalizedPath === '/about' || normalizedPath === '/counter';

    return <BackgroundMusic src="/sounds/lounge.mp3" hideUi={hideUi} />;
}

