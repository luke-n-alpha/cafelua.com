'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Sun, Moon, Volume2, VolumeX } from 'lucide-react';
import cafeDay from '../assets/cafe_day.png';
import './CafeLayout.css';

const CafeLayout = ({ children }: { children?: React.ReactNode }) => {
    const { t } = useTranslation();
    const [isNight, setIsNight] = useState(false);
    const [isMuted, setIsMuted] = useState(false);

    // Check time for Day/Night cycle
    useEffect(() => {
        const checkTime = () => {
            const hour = new Date().getHours();
            setIsNight(hour >= 18 || hour < 6);
        };
        checkTime();
        const interval = setInterval(checkTime, 60000); // Check every minute
        return () => clearInterval(interval);
    }, []);

    // Audio Placeholder
    const playClickSound = () => {
        if (!isMuted) {
            console.log("Play Click Sound");
            // TODO: Implement actual sound playing
        }
    };

    return (
        <div className={`cafe-layout ${isNight ? 'night' : 'day'}`}>
            {/* Background Layer */}
            <div
                className="background-layer"
                style={{
                    backgroundImage: `url(${cafeDay})`,
                    filter: isNight ? 'brightness(0.6) contrast(1.2) hue-rotate(240deg)' : 'none',
                    transition: 'filter 2s ease-in-out'
                }}
            />

            {/* Overlay for Night Atmosphere */}
            {isNight && <div className="night-overlay" />}

            {/* Main Content Layer */}
            <div className="content-layer">
                <header className="cafe-header ui-glass">
                    <div className="logo-area">
                        <h1>Café Luα</h1>
                    </div>
                    <nav className="cafe-nav">
                        <Link href="/" onClick={playClickSound}>{t('nav.home') || 'Home'}</Link>
                        <Link href="/profile" onClick={playClickSound}>{t('nav.profile') || 'Profile'}</Link>
                        <Link href="/cafe-life" onClick={playClickSound}>{t('nav.cafe_life') || 'Cafe Life'}</Link>
                        <Link href="/library" onClick={playClickSound}>{t('nav.library') || 'Library'}</Link>
                        <Link href="/lab" onClick={playClickSound}>{t('nav.lab') || 'Lab'}</Link>
                    </nav>
                    <div className="controls">
                        <button onClick={() => setIsMuted(!isMuted)} className="icon-btn ui-icon-button">
                            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                        </button>
                        <div className="time-indicator ui-chip">
                            {isNight ? <Moon size={20} /> : <Sun size={20} />}
                        </div>
                    </div>
                </header>

                <main className="cafe-main">{children}</main>

                <footer className="cafe-footer">
                    <p>© 2025 Café Luα. All rights reserved.</p>
                </footer>
            </div>
        </div>
    );
};

export default CafeLayout;
