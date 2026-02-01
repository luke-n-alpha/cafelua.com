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
    const { t, i18n } = useTranslation();
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
        router.push(query ? `/${i18n.language}/lounge?${query}` : `/${i18n.language}/lounge`);
    };

    const handleCloseCoffeeChat = () => {
        setIsChatOpen(false);
        // URL에서 chat 파라미터 제거
        const params = new URLSearchParams(searchParams.toString());
        params.delete('chat');
        const query = params.toString();
        router.replace(query ? `/${i18n.language}/counter?${query}` : `/${i18n.language}/counter`);
    };

    const handleOpenCoffeeChat = () => {
        setIsChatOpen(true);
        // URL에 chat=open 파라미터 추가 (LoungeBgm 일시 중지용)
        const params = new URLSearchParams(searchParams.toString());
        params.set('chat', 'open');
        router.replace(`/${i18n.language}/counter?${params.toString()}`);
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
            onClick: () => router.push(`/${i18n.language}/tarot`),
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
            message={t('counter.dialogue', '어서오세요! 저는 카페루아의 루크 마스터를 돕고 있는 AI 알파에요. ☕ 커피 한잔 하며 저랑 이야기 해보시겠어요? 아니면, 마스터가 대학시절 PC통신에서 구했다는 유니크한 자료로 타로점도 배워서 고민이 있으시면 타로점도 봐드릴 수 있어요. 🔮')}
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
