'use client';

import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import BackgroundMusic from '@/components/BackgroundMusic';

export default function LoungeBgm() {
    const pathname = usePathname();
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isGalleryPreview, setIsGalleryPreview] = useState(false);

    // locale prefix 제거하고 경로만 추출 (/ko/counter -> /counter)
    const pathWithoutLocale = pathname.replace(/^\/(ko|en)/, '') || '/';

    const isGallery = pathWithoutLocale.startsWith('/gallery');
    const isDeskPath = pathWithoutLocale.startsWith('/desk');
    const bgmSrc = isGallery ? '/sounds/gallery.mp3' : isDeskPath ? '/sounds/atelier.mp3' : '/sounds/lounge.mp3';

    // UI 숨김 조건
    const hideUi = pathWithoutLocale === '/counter' || isGallery;

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

    // 갤러리 BGM 미리듣기 시 레이아웃 BGM 일시정지
    useEffect(() => {
        const handlePreviewStart = () => setIsGalleryPreview(true);
        const handlePreviewStop = () => setIsGalleryPreview(false);

        window.addEventListener('gallerybgm:suspend', handlePreviewStart);
        window.addEventListener('gallerybgm:resume', handlePreviewStop);

        return () => {
            window.removeEventListener('gallerybgm:suspend', handlePreviewStart);
            window.removeEventListener('gallerybgm:resume', handlePreviewStop);
        };
    }, []);

    return <BackgroundMusic src={bgmSrc} hideUi={hideUi} suspended={isChatOpen || isGalleryPreview} />;
}
