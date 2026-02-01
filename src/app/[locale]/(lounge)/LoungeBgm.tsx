'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import BackgroundMusic from '@/components/BackgroundMusic';

export default function LoungeBgm() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // locale prefix 제거하고 경로만 추출 (/ko/counter -> /counter)
    const pathWithoutLocale = pathname.replace(/^\/(ko|en)/, '') || '/';

    // UI 숨김 조건
    const hideUi = pathWithoutLocale === '/about' || pathWithoutLocale === '/counter';

    // BGM 일시 중지 조건: /counter 경로에서 chat=open 파라미터가 있을 때
    const isChatOpen = pathWithoutLocale === '/counter' && searchParams.get('chat') === 'open';

    return <BackgroundMusic src="/sounds/lounge.mp3" hideUi={hideUi} suspended={isChatOpen} />;
}
