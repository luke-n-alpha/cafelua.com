'use client';

import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import BackgroundMusic from '@/components/BackgroundMusic';

export default function LoungeBgm() {
    const pathname = usePathname();
    const [isChatOpen, setIsChatOpen] = useState(false);

    // locale prefix 제거하고 경로만 추출 (/ko/counter -> /counter)
    const pathWithoutLocale = pathname.replace(/^\/(ko|en)/, '') || '/';

    // UI 숨김 조건
    const hideUi = pathWithoutLocale === '/about' || pathWithoutLocale === '/counter';

    // URL 변화 감지 (chat=open 파라미터)
    useEffect(() => {
        const checkChatOpen = () => {
            const params = new URLSearchParams(window.location.search);
            setIsChatOpen(pathWithoutLocale === '/counter' && params.get('chat') === 'open');
        };

        checkChatOpen();

        // popstate 이벤트로 URL 변화 감지
        window.addEventListener('popstate', checkChatOpen);

        // MutationObserver 대신 interval로 URL 변화 감지 (router.replace용)
        const interval = setInterval(checkChatOpen, 200);

        return () => {
            window.removeEventListener('popstate', checkChatOpen);
            clearInterval(interval);
        };
    }, [pathWithoutLocale]);

    return <BackgroundMusic src="/sounds/lounge.mp3" hideUi={hideUi} suspended={isChatOpen} />;
}
