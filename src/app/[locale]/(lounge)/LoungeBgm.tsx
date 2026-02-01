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

    // 커스텀 이벤트로 커피챗 열림/닫힘 감지
    useEffect(() => {
        const handleChatOpen = () => setIsChatOpen(true);
        const handleChatClose = () => setIsChatOpen(false);

        window.addEventListener('coffeechat:open', handleChatOpen);
        window.addEventListener('coffeechat:close', handleChatClose);

        return () => {
            window.removeEventListener('coffeechat:open', handleChatOpen);
            window.removeEventListener('coffeechat:close', handleChatClose);
        };
    }, []);

    return <BackgroundMusic src="/sounds/lounge.mp3" hideUi={hideUi} suspended={isChatOpen} />;
}
