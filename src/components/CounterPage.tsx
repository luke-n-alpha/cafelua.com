'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import UnderConstruction from './UnderConstruction';
import CoffeeChatDialog from './CoffeeChatDialog';
import { resolveEnvironmentBackgroundSrc, type Season, type TimeOfDay, type Weather } from '../lib/environmentBackgrounds';
import { parseRuntimeEnvironmentFromSearchParams } from '../lib/environmentContext';

const CounterPage: React.FC = () => {
    const { t } = useTranslation();
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const localeFromPath = pathname.split('/')[1];
    const locale = localeFromPath === 'ko' || localeFromPath === 'en' ? localeFromPath : 'ko';
    const [isChatOpen, setIsChatOpen] = useState(false);

    const season = (searchParams.get('season') as Season) || 'spring';
    const time = (searchParams.get('time') as TimeOfDay) || 'day';
    const weather = (searchParams.get('weather') as Weather) || 'sunny';
    const isChristmas = searchParams.get('christmas') === 'true';

    const backgroundImage = useMemo(() => {
        return resolveEnvironmentBackgroundSrc('coffeeChat', season, time, weather, isChristmas);
    }, [isChristmas, season, time, weather]);

    const environmentContext = useMemo(() => {
        return parseRuntimeEnvironmentFromSearchParams(searchParams, {
            space: '1층 카운터 커피챗',
            backgroundSrc: backgroundImage,
        });
    }, [backgroundImage, searchParams]);

    useEffect(() => {
        setIsChatOpen(searchParams.get('chat') === 'open');
    }, [searchParams]);

    const handleBackToLounge = () => {
        const query = searchParams.toString();
        router.push(query ? `/${locale}/lounge?${query}` : `/${locale}/lounge`);
    };

    const handleCloseCoffeeChat = () => {
        setIsChatOpen(false);
        // URL에서 chat 파라미터 제거
        const params = new URLSearchParams(searchParams.toString());
        params.delete('chat');
        const query = params.toString();
        router.replace(query ? `/${locale}/counter?${query}` : `/${locale}/counter`);
    };

    const handleOpenCoffeeChat = () => {
        setIsChatOpen(true);
        // URL에 chat=open 파라미터 추가 (LoungeBgm 일시 중지용)
        const params = new URLSearchParams(searchParams.toString());
        params.set('chat', 'open');
        router.replace(`/${locale}/counter?${params.toString()}`);
    };

    const buttons = [
        {
            label: t('counter.loungeButton', '라운지로'),
            onClick: handleBackToLounge,
        },
        {
            label: t('counter.coffeeChatButton', '커피챗'),
            onClick: handleOpenCoffeeChat,
        },
        {
            label: t('counter.tarotButton', '타로'),
            onClick: () => {
                const query = searchParams.toString();
                router.push(query ? `/${locale}/tarot?${query}` : `/${locale}/tarot`);
            },
        },
    ];

    // 커피챗이 열려있으면 CoffeeChatDialog 표시
    if (isChatOpen) {
        return (
            <CoffeeChatDialog
                backgroundSrc={backgroundImage}
                environmentContext={environmentContext}
                onClose={handleCloseCoffeeChat}
            />
        );
    }

    // 기본: 카운터 화면 (대사 + 버튼 3개)
    return (
        <UnderConstruction
            onClose={handleBackToLounge}
            message={t('counter.dialogue', '어서오세요, 손님! 무엇을 도와드릴까요?')}
            backgroundSrc={backgroundImage}
            characterSrc="/characters/alpha/alpha-nice-talk.webp"
            spriteSrc="/characters/alpha/alpha-serving.webp"
            spriteAlt="Alpha"
            speakerName="Alpha"
            buttons={buttons}
            overlayClassName="counter-overlay"
        />
    );
};

export default CounterPage;
