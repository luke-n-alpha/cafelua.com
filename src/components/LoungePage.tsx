import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import BackgroundMusic from './BackgroundMusic';
import UnderConstruction from './UnderConstruction';
import './LoungePage.css';

// Types inherited from IntroPage (could be shared, but redefined here for simplicity)
type Season = 'spring' | 'summer' | 'autumn' | 'winter';
type TimeOfDay = 'day' | 'sunset' | 'night' | 'closed';
type Weather = 'sunny' | 'clear' | 'rain' | 'snow' | 'storm' | 'closed';

interface LocationState {
    season: Season;
    time: TimeOfDay;
    weather: Weather;
    isChristmas: boolean;
}

const LoungePage: React.FC = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();
    const [bgImage, setBgImage] = useState<string>('');
    const [showConstruction, setShowConstruction] = useState(false);
    const state = location.state as LocationState;

    // Default state if accessed directly without intro
    const season = state?.season || 'spring';
    const time = state?.time || 'day';
    const weather = state?.weather || 'sunny';
    const isChristmas = state?.isChristmas || false;

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

    return (
        <div 
            className="lounge-container"
            style={{ backgroundImage: `url('${bgImage}')` }}
        >
            <BackgroundMusic src="/sounds/lounge.mp3" />
            
            <div className="game-menu">
                <div className="menu-title">{t('lounge.title')}</div>
                              
                <button className="menu-button" onClick={() => setShowConstruction(true)}>
                    {t('lounge.about')}
                </button>
                <button className="menu-button" onClick={() => setShowConstruction(true)}>
                    {t('lounge.counter')}
                </button>
                <button className="menu-button" onClick={() => setShowConstruction(true)}>
                    {t('lounge.lab')}
                </button>
                <button className="menu-button" onClick={() => setShowConstruction(true)}>
                    {t('lounge.library')}
                </button>
                <button className="menu-button" onClick={() => setShowConstruction(true)}>
                    {t('lounge.gallery')}
                </button>
                <button className="menu-button" onClick={() => setShowConstruction(true)}>
                    {t('lounge.guestbook')}
                </button>

                <button 
                    className="menu-button exit" 
                    onClick={() => navigate('/')}
                >
                    {t('lounge.back')}
                </button>
            </div>

            <div className="lounge-footer">
                {t('lounge.currentMode')}: {t(`season.${season}`)} / {t(`time.${time}`)} / {t(`weather.${weather}`)} {isChristmas ? `(${t('intro.christmasMode')})` : ''}
            </div>

            {showConstruction && <UnderConstruction onClose={() => setShowConstruction(false)} />}
        </div>
    );
};

export default LoungePage;
