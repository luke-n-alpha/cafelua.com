'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import BackgroundMusic from '../../components/BackgroundMusic';

const normalizePathname = (pathname: string) => {
    if (pathname.length > 1 && pathname.endsWith('/')) return pathname.slice(0, -1);
    return pathname;
};

export default function LoungeBgm() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const normalizedPath = normalizePathname(pathname);
    
    // UI 숨김 조건
    const hideUi = normalizedPath === '/about' || normalizedPath === '/counter';

    // BGM 일시 중지 조건: /counter 경로에서 chat=open 파라미터가 있을 때
    const isChatOpen = normalizedPath === '/counter' && searchParams.get('chat') === 'open';

    return <BackgroundMusic src="/sounds/lounge.mp3" hideUi={hideUi} suspended={isChatOpen} />;
}
