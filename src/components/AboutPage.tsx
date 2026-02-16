'use client';

import React, { useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import AboutModal from './AboutModal';
import './AboutPage.css';

type Season = 'spring' | 'summer' | 'autumn' | 'winter';
type TimeOfDay = 'day' | 'sunset' | 'night' | 'closed';
type Weather = 'sunny' | 'clear' | 'rain' | 'snow' | 'storm' | 'closed';
type AboutTab = 'sitemap' | 'alpha' | 'luke';

interface AboutPageProps {
    activeTab?: AboutTab;
}

const AboutPage: React.FC<AboutPageProps> = ({ activeTab = 'sitemap' }) => {
    const { i18n } = useTranslation();
    const router = useRouter();
    const searchParams = useSearchParams();
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

    return (
        <div className="about-page-container" style={{ backgroundImage: `url('${backgroundImage}')` }}>
            <AboutModal activeTab={activeTab} onClose={handleBackToLounge} />
        </div>
    );
};

export default AboutPage;
