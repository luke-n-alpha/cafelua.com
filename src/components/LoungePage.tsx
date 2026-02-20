'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import UnderConstruction from './UnderConstruction';
import './LoungePage.css';

// Types inherited from IntroPage (could be shared, but redefined here for simplicity)
type Season = 'spring' | 'summer' | 'autumn' | 'winter';
type TimeOfDay = 'day' | 'sunset' | 'night' | 'closed';
type Weather = 'sunny' | 'clear' | 'rain' | 'snow' | 'storm' | 'closed';

const LoungePage: React.FC = () => {
    const { t } = useTranslation();
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const localeFromPath = pathname.split('/')[1];
    const locale = localeFromPath === 'ko' || localeFromPath === 'en' ? localeFromPath : 'ko';
    const [bgImage, setBgImage] = useState<string>('');
    const [loungeVariant, setLoungeVariant] = useState('lounge-sunny');
    const entrySource = searchParams.get('from');
    const [showGreeting, setShowGreeting] = useState(() => entrySource === 'entrance');
    const season = (searchParams.get('season') as Season) || 'spring';
    const time = (searchParams.get('time') as TimeOfDay) || 'day';
    const weather = (searchParams.get('weather') as Weather) || 'sunny';
    const isChristmas = searchParams.get('christmas') === 'true';

    const pushWithParams = (path: string) => {
        const query = searchParams.toString();
        const next = `/${locale}${path}`;
        router.push(query ? `${next}?${query}` : next);
    };

    const handleStairs = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('from', 'lounge');
        router.push(`/${locale}/atelier?${params.toString()}`);
    };

    // Resolve background image based on state
    useEffect(() => {
        let imageName = 'lounge-sunny'; // Default fallback

        // Christmas priority
        if (isChristmas) {
            imageName = 'lounge-christmas';
        } else if (season === 'winter' && weather === 'snow') {
            imageName = 'lounge-snow';
        } else {
            // Weather/Time priority
            if (weather === 'rain' || weather === 'storm') {
                imageName = 'lounge-rain';
            } else if (weather === 'snow') {
                imageName = 'lounge-snow';
            } else {
                // Clear/Sunny conditions
                if (time === 'sunset') {
                    imageName = 'lounge-evening';
                } else if (time === 'night' || time === 'closed') {
                    imageName = 'lounge-night';
                } else {
                    imageName = 'lounge-sunny';
                }
            }
        }

        setLoungeVariant(imageName);
        setBgImage(`/lounge-background-img/${imageName}.webp`);
    }, [season, time, weather, isChristmas]);

    // Preload all lounge images
    useEffect(() => {
        const images = [
            'lounge-christmas.webp',
            'lounge-evening.webp',
            'lounge-night.webp',
            'lounge-rain.webp',
            'lounge-snow.webp',
            'lounge-sunny.webp'
        ];
        images.forEach(img => {
            const i = new Image();
            i.src = `/lounge-background-img/${img}`;
        });
    }, []);

    const handleCloseGreeting = () => {
        setShowGreeting(false);

        const params = new URLSearchParams(searchParams.toString());
        if (!params.has('from')) return;
        params.delete('from');
        const query = params.toString();
        router.replace(query ? `/${locale}/lounge?${query}` : `/${locale}/lounge`);
    };

    const greetingVariant = loungeVariant.replace(/^lounge-/, '');
    const greetingKey = `lounge.greeting.${greetingVariant}`;
    const greetingMessage = t(greetingKey, { defaultValue: t('lounge.alphaGreeting') });

    useEffect(() => {
        const from = searchParams.get('from');
        if (!from) return;
        if (from === 'entrance' && showGreeting) return;

        const params = new URLSearchParams(searchParams.toString());
        params.delete('from');
        const query = params.toString();
        router.replace(query ? `/${locale}/lounge?${query}` : `/${locale}/lounge`);
    }, [locale, router, searchParams, showGreeting]);

    return (
        <div 
            className="lounge-container"
            style={{ backgroundImage: `url('${bgImage}')` }}
        >
            {!showGreeting && (
                <>
                    <div className="game-menu">
                        <div className="menu-title">{t('lounge.title')}</div>
                                      
                        <button className="menu-button ui-button ui-button-ghost" onClick={() => pushWithParams('/about/sitemap')}>
                            {t('lounge.about')}
                        </button>
                        <button className="menu-button ui-button ui-button-ghost" onClick={() => pushWithParams('/counter')}>
                            {t('lounge.counter')}
                        </button>
                        <button className="menu-button ui-button ui-button-ghost" onClick={handleStairs}>
                            {t('lounge.stairs')}
                        </button>
                        <button className="menu-button ui-button ui-button-ghost" onClick={() => pushWithParams('/gallery')}>
                            {t('lounge.gallery')}
                        </button>
                        <button className="menu-button ui-button ui-button-ghost" onClick={() => pushWithParams('/guestbook')}>
                            {t('lounge.guestbook')}
                        </button>

                        <button
                            className="menu-button ui-button ui-button-danger exit"
                            onClick={() => router.push(`/${locale}`)}
                        >
                            {t('lounge.back')}
                        </button>
                    </div>

                    <div className="lounge-footer">
                        {t('lounge.currentMode')}: {t(`season.${season}`)} / {t(`time.${time}`)} / {t(`weather.${weather}`)} {isChristmas ? `(${t('intro.christmasMode')})` : ''}
                    </div>
                </>
            )}

            {showGreeting && (
                <UnderConstruction
                    onClose={handleCloseGreeting}
                    message={greetingMessage}
                    backgroundSrc={bgImage || '/undestruct.webp'}
                    illustrationSrc={bgImage || '/undestruct.webp'}
                    characterSrc="/characters/alpha/alpha-nice-talk.webp"
                    closeLabel={t('lounge.showMenu')}
                />
            )}

        </div>
    );
};

export default LoungePage;
