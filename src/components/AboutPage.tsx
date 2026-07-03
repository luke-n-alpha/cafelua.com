'use client';

import React, { useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import AboutModal from './AboutModal';
import './AboutPage.css';
import { resolveEnvironmentBackgroundSrc, type Season, type TimeOfDay, type Weather } from '../lib/environmentBackgrounds';
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
        return resolveEnvironmentBackgroundSrc('about', season, time, weather, isChristmas);
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
