'use client';

import React, { useState, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import UnderConstruction from './UnderConstruction';
import CoffeeChatDialog from './CoffeeChatDialog';

type Season = 'spring' | 'summer' | 'autumn' | 'winter';
type TimeOfDay = 'day' | 'sunset' | 'night' | 'closed';
type Weather = 'sunny' | 'clear' | 'rain' | 'snow' | 'storm' | 'closed';

const CounterPage: React.FC = () => {
    const { t } = useTranslation();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isChatOpen, setIsChatOpen] = useState(false);

    const season = (searchParams.get('season') as Season) || 'spring';
    const time = (searchParams.get('time') as TimeOfDay) || 'day';
    const weather = (searchParams.get('weather') as Weather) || 'sunny';
    const isChristmas = searchParams.get('christmas') === 'true';

    const backgroundImage = useMemo(() => {
        let imageName = 'lounge-sunny';

        if (isChristmas) {
            imageName = 'lounge-christmas';
        } else if (season === 'winter' && weather === 'snow') {
            imageName = 'lounge-snow';
        } else if (weather === 'rain' || weather === 'storm') {
            imageName = 'lounge-rain';
        } else if (weather === 'snow') {
            imageName = 'lounge-snow';
        } else if (time === 'sunset') {
            imageName = 'lounge-evening';
        } else if (time === 'night' || time === 'closed') {
            imageName = 'lounge-night';
        }

        return `/lounge-background-img/${imageName}.webp`;
    }, [isChristmas, season, time, weather]);

    const handleBackToLounge = () => {
        const query = searchParams.toString();
        router.push(query ? `/lounge?${query}` : '/lounge');
    };

    const handleCloseCoffeeChat = () => {
        setIsChatOpen(false);
        // URL에서 chat 파라미터 제거
        const params = new URLSearchParams(searchParams.toString());
        params.delete('chat');
        const query = params.toString();
        router.replace(query ? `/counter?${query}` : '/counter');
    };

    const handleOpenCoffeeChat = () => {
        setIsChatOpen(true);
        // URL에 chat=open 파라미터 추가 (LoungeBgm 일시 중지용)
        const params = new URLSearchParams(searchParams.toString());
        params.set('chat', 'open');
        router.replace(`/counter?${params.toString()}`);
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
                router.push(query ? `/tarot?${query}` : '/tarot');
            },
        },
    ];

    // 커피챗이 열려있으면 CoffeeChatDialog 표시
    if (isChatOpen) {
        return (
            <CoffeeChatDialog
                backgroundSrc={backgroundImage}
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
        />
    );
};

export default CounterPage;
