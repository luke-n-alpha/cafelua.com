'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import './IntroPage.css';
import {
    Sun, Moon, CloudRain, CloudSnow, CloudLightning,
    Flower2, Leaf, Snowflake, Sunset, DoorClosed, RefreshCw, Github
} from 'lucide-react';
import BackgroundMusic from './BackgroundMusic';
import VisitorCounter from './VisitorCounter';
import IntroTimeline from './IntroTimeline';
import { getWeatherByCoords } from '../services/WeatherService';
import type { AppWeather, AppTimeOfDay } from '../services/WeatherService';

// Types
type Season = 'spring' | 'summer' | 'autumn' | 'winter';
type TimeOfDay = AppTimeOfDay;
type Weather = AppWeather;

// Known asset filenames (without extension)
const AVAILABLE_BACKGROUNDS = new Set([
    'intro_bg_autumn_day_rain',
    'intro_bg_autumn_day_storm',
    'intro_bg_autumn_day_sunny',
    'intro_bg_autumn_night_clear',
    'intro_bg_autumn_night_closed',
    'intro_bg_autumn_sunset_clear',
    'intro_bg_reference_master',
    'intro_bg_spring_day_rain',
    'intro_bg_spring_day_sunny',
    'intro_bg_spring_night_clear',
    'intro_bg_spring_night_closed',
    'intro_bg_spring_sunset_clear',
    'intro_bg_summer_day_rain',
    'intro_bg_summer_day_sunny',
    'intro_bg_summer_night_clear',
    'intro_bg_summer_night_closed',
    'intro_bg_summer_sunset_clear',
    'intro_bg_winter_day_snow',
    'intro_bg_winter_day_snow_xmas',
    'intro_bg_winter_day_sunny',
    'intro_bg_winter_day_sunny_xmas',
    'intro_bg_winter_night_clear',
    'intro_bg_winter_night_clear_xmas',
    'intro_bg_winter_night_closed',
    'intro_bg_winter_night_closed_snow_xmas',
    'intro_bg_winter_night_closed_xmas',
    'intro_bg_winter_night_snow',
    'intro_bg_winter_night_snow_xmas',
    'intro_bg_winter_sunset_clear',
    'intro_bg_winter_sunset_clear_xmas',
    'intro_bg_winter_sunset_xmas',
]);
const FALLBACK_BACKGROUND = 'intro_bg_reference_master';

// Helper functions (restored)
const getSeason = (month: number): Season => {
    if (month >= 2 && month <= 4) return 'spring';
    if (month >= 5 && month <= 7) return 'summer';
    if (month >= 8 && month <= 10) return 'autumn';
    return 'winter';
};

const getTimeOfDay = (hour: number): TimeOfDay => {
    // Closed: 11pm - 8am (23:00 - 08:00)
    if (hour >= 23 || hour < 8) return 'closed';
    // Day: 8am - 5pm (08:00 - 17:00)
    if (hour >= 8 && hour < 17) return 'day';
    // Sunset: 5pm - 7pm (17:00 - 19:00)
    if (hour >= 17 && hour < 19) return 'sunset';
    // Night: 7pm - 11pm (19:00 - 23:00)
    return 'night';
};

// Icon mapping helper
const getSeasonIcon = (s: Season) => {
    switch (s) {
        case 'spring': return <Flower2 size={20} />;
        case 'summer': return <Sun size={20} />;
        case 'autumn': return <Leaf size={20} />;
        case 'winter': return <Snowflake size={20} />;
    }
};

const getTimeIcon = (t: TimeOfDay) => {
    switch (t) {
        case 'day': return <Sun size={20} />;
        case 'sunset': return <Sunset size={20} />;
        case 'night': return <Moon size={20} />;
        case 'closed': return <DoorClosed size={20} />;
    }
};

const getWeatherIcon = (w: Weather) => {
    switch (w) {
        case 'sunny': return <Sun size={20} />;
        case 'clear': return <Sun size={20} />;
        case 'rain': return <CloudRain size={20} />;
        case 'snow': return <CloudSnow size={20} />;
        case 'storm': return <CloudLightning size={20} />;
        case 'closed': return <Sun size={20} />; // Default to sunny icon
    }
};

const isSeason = (value: string | null): value is Season =>
    value === 'spring' || value === 'summer' || value === 'autumn' || value === 'winter';

const isTimeOfDay = (value: string | null): value is TimeOfDay =>
    value === 'day' || value === 'sunset' || value === 'night' || value === 'closed';

const isWeather = (value: string | null): value is Weather =>
    value === 'sunny' || value === 'clear' || value === 'rain' || value === 'snow' || value === 'storm' || value === 'closed';

// Custom Icon Select Component
const IconSelect = ({
    value,
    options,
    onChange,
    getIcon,
    label
}: {
    value: string;
    options: string[];
    onChange: (val: string) => void;
    getIcon: (val: string) => React.ReactNode;
    label: string;
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    return (
        <div className="icon-select-container" ref={containerRef}>
            <div
                className="icon-select-trigger"
                onClick={() => setIsOpen(!isOpen)}
                title={label}
            >
                {getIcon(value)}
            </div>
            {isOpen && (
                <div className="icon-select-dropdown glass">
                    {options.map(opt => (
                        <div
                            key={opt}
                            className={`icon-select-option ${value === opt ? 'active' : ''}`}
                            onClick={() => {
                                onChange(opt);
                                setIsOpen(false);
                            }}
                            title={opt}
                        >
                            {getIcon(opt)}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const IntroPage: React.FC = () => {
    const { i18n } = useTranslation();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const localeFromPath = pathname.split('/')[1];
    const preferredLanguage = localeFromPath === 'en' ? 'en' : 'ko';
    const fixedT = i18n.getFixedT(preferredLanguage);
    const [season, setSeason] = useState<Season>('spring');
    const [time, setTime] = useState<TimeOfDay>('day');
    const [weather, setWeather] = useState<Weather>('sunny');
    const [isChristmas, setIsChristmas] = useState(false);
    // Start empty so the neutral base color shows first and the real background
    // fades in once season/time are detected — avoids the spring→night flash.
    const [bgImage, setBgImage] = useState<string>('');

    useEffect(() => {
        if (i18n.language !== preferredLanguage) {
            i18n.changeLanguage(preferredLanguage);
        }
    }, [i18n, preferredLanguage]);

    // Auto-detect on mount
    const fetchRealWeather = useCallback(async () => {
        if (!navigator.geolocation) return;

        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            const data = await getWeatherByCoords(latitude, longitude);
            
            if (data) {
                setTime(data.time);
                setWeather(data.weather);
            }
        }, (error) => {
            console.log("Geolocation blocked or failed:", error);
            // Fallback to default time-based logic is already handled by handleRefresh initial call
        });
    }, []);

    // Check if current date is in Christmas period (Dec 1-25)
    const isChristmasPeriod = useCallback((): boolean => {
        const now = new Date();
        const month = now.getMonth(); // 0-indexed, so 11 = December
        const day = now.getDate();
        return month === 11 && day >= 1 && day <= 25;
    }, []);

    // Valid weather options based on season (no "closed" in weather)
    const getValidWeathers = (s: Season): Weather[] => {
        switch (s) {
            case 'spring':
            case 'summer':
            case 'autumn':
                return ['sunny', 'rain'];
            case 'winter':
                return ['sunny', 'snow'];
        }
    };

    const availableWeathers = getValidWeathers(season);

    // Keep user-selected time/weather; fallbacks handled during filename resolution

    // Auto-correct weather when season changes
    useEffect(() => {
        const valid = getValidWeathers(season);
        if (!valid.includes(weather)) {
            setWeather(valid[0]);
        }
        // Reset Christmas if not winter
        if (season !== 'winter') {
            setIsChristmas(false);
        }
    }, [season, weather]);

    // Update background whenever state changes
    useEffect(() => {
        // Normalize time/weather for filename generation
        let displayTime: TimeOfDay = time;
        let displayWeather: Weather | 'closed' = weather;

        // Closed time uses the night slot; keep explicit weather when selected.
        if (displayTime === 'closed') {
            displayTime = 'night';
            displayWeather = weather === 'sunny' || weather === 'clear' || weather === 'closed'
                ? 'closed'
                : weather;
        }

        // Sunny at sunset/night uses clear art; day/clear maps to sunny
        if ((displayTime === 'sunset' || displayTime === 'night') && displayWeather === 'sunny') {
            displayWeather = 'clear';
        } else if (displayTime === 'day' && displayWeather === 'clear') {
            displayWeather = 'sunny';
        }

        // Build candidate list with fallbacks
        const candidates: string[] = [];

        const baseName = (s: Season, t: string, w: string, xmas: boolean) =>
            `intro_bg_${s}_${t}_${w}${xmas ? '_xmas' : ''}`;

        // Prefer closed snow xmas variant when explicitly selected
        if (time === 'closed' && season === 'winter' && weather === 'snow' && isChristmas) {
            candidates.push(baseName('winter', 'night', 'closed_snow', true));
        }

        const primary = baseName(season, displayTime, displayWeather, isChristmas && season === 'winter');
        const primaryNonXmas = baseName(season, displayTime, displayWeather, false);

        candidates.push(primary);
        if (primary !== primaryNonXmas) {
            candidates.push(primaryNonXmas);
        }

        // Sunset fallback -> day
        if (displayTime === 'sunset') {
            candidates.push(baseName(season, 'day', displayWeather, isChristmas && season === 'winter'));
            candidates.push(baseName(season, 'day', displayWeather, false));
        }

        // Rain night/closed fallback -> day rain (only spring/summer/autumn)
        if (displayWeather === 'rain' && displayTime !== 'day') {
            candidates.push(baseName(season, 'day', 'rain', false));
        }

        // Snow sunset/closed fallback -> day or night snow (winter)
        if (displayWeather === 'snow' && season === 'winter') {
            if (displayTime === 'sunset') {
                candidates.push(baseName('winter', 'day', 'snow', isChristmas));
                candidates.push(baseName('winter', 'day', 'snow', false));
            }
            if (displayTime === 'night' && isChristmas) {
                // allow closed snow xmas variant
                candidates.push(baseName('winter', 'night', 'closed_snow', true));
            }
        }

        // Closed fallback (always night_closed)
        candidates.push(baseName(season, 'night', 'closed', isChristmas && season === 'winter'));
        candidates.push(baseName(season, 'night', 'closed', false));

        // Last-resort sunny day
        candidates.push(baseName(season, 'day', 'sunny', isChristmas && season === 'winter'));
        candidates.push(baseName(season, 'day', 'sunny', false));

        const chosen = candidates.find((name) => AVAILABLE_BACKGROUNDS.has(name)) ?? FALLBACK_BACKGROUND;
        setBgImage(`/intro-background-img/${chosen}.webp`);
    }, [season, time, weather, isChristmas]);

    // Preload all available backgrounds (Intro & Lounge)
    useEffect(() => {
        const preloadImage = (path: string) => {
            const img = new Image();
            img.src = path;
        };

        // 1. Intro backgrounds (prioritize current season)
        Array.from(AVAILABLE_BACKGROUNDS)
            .sort((a, b) => {
                const aIsCurrent = a.includes(season);
                const bIsCurrent = b.includes(season);
                if (aIsCurrent && !bIsCurrent) return -1;
                if (!aIsCurrent && bIsCurrent) return 1;
                return 0;
            })
            .forEach(name => preloadImage(`/intro-background-img/${name}.webp`));

        // 2. Lounge backgrounds
        const loungeImages = [
            'lounge-christmas.webp',
            'lounge-evening.webp',
            'lounge-night.webp',
            'lounge-rain.webp',
            'lounge-snow.webp',
            'lounge-sunny.webp'
        ];
        loungeImages.forEach(img => preloadImage(`/lounge-background-img/${img}`));
        
    }, [season]); // Re-sort priority when season changes

    const applyQueryEnvironment = useCallback(() => {
        const querySeason = searchParams.get('season');
        const queryTime = searchParams.get('time');
        const queryWeather = searchParams.get('weather');
        const queryChristmas = searchParams.get('christmas');

        if (isSeason(querySeason) || isTimeOfDay(queryTime) || isWeather(queryWeather) || queryChristmas !== null) {
            const nextSeason = isSeason(querySeason) ? querySeason : undefined;
            if (nextSeason) {
                setSeason(nextSeason);
            }
            if (isTimeOfDay(queryTime)) {
                setTime(queryTime);
            }
            if (isWeather(queryWeather)) {
                setWeather(queryWeather);
            }
            setIsChristmas(nextSeason === 'winter' && (queryChristmas === 'true' || queryChristmas === '1'));
            return true;
        }

        return false;
    }, [searchParams]);

    const handleRefresh = useCallback(async () => {
        const now = new Date();
        const s = getSeason(now.getMonth());
        
        // 1. Basic time/season setting
        const t = getTimeOfDay(now.getHours());
        setSeason(s);
        setTime(t);

        // 2. Try to get real weather/sunset time
        await fetchRealWeather();

        // Auto-enable Christmas during Dec 1-25 if winter
        if (s === 'winter' && isChristmasPeriod()) {
            setIsChristmas(true);
        } else {
            setIsChristmas(false);
        }
    }, [fetchRealWeather, isChristmasPeriod]);

    useEffect(() => {
        if (!applyQueryEnvironment()) {
            void handleRefresh();
        }
    }, [applyQueryEnvironment, handleRefresh]);

    /** Enter the cafe at a given corner, carrying the chosen environment in. */
    const enterAt = useCallback((path: string) => {
        const params = new URLSearchParams({
            season,
            time,
            weather,
            christmas: String(isChristmas),
            from: 'entrance'
        });
        router.push(`/${preferredLanguage}${path}?${params.toString()}`);
    }, [season, time, weather, isChristmas, preferredLanguage, router]);

    const handleEnter = () => enterAt('/lounge');

    return (
        <div className="intro-container">
            {/* Background as its own layer so it can cross-fade via opacity
                (background-image itself is not transitionable). */}
            <div
                className="intro-bg-layer"
                style={{
                    backgroundImage: bgImage ? `url('${bgImage}')` : 'none',
                    opacity: bgImage ? 1 : 0,
                }}
                aria-hidden="true"
            />
            <BackgroundMusic src="/sounds/intro.mp3" />

            <IntroTimeline
                isKo={preferredLanguage === 'ko'}
                onNavigate={enterAt}
            />
            
            <div className="control-bar glass">
                <IconSelect
                    label={fixedT('season.spring')} // Just label, not translated yet in IconSelect
                    value={season}
                    options={['spring', 'summer', 'autumn', 'winter']}
                    onChange={(v) => setSeason(v as Season)}
                    getIcon={(v) => getSeasonIcon(v as Season)}
                />
                <IconSelect
                    label="Time"
                    value={time}
                    options={['day', 'sunset', 'night', 'closed']}
                    onChange={(v) => setTime(v as TimeOfDay)}
                    getIcon={(v) => getTimeIcon(v as TimeOfDay)}
                />
                <IconSelect
                    label="Weather"
                    value={weather}
                    options={availableWeathers}
                    onChange={(v) => setWeather(v as Weather)}
                    getIcon={(v) => getWeatherIcon(v as Weather)}
                />

                {season === 'winter' && (
                    <>
                        <div className="divider" />
                        <button
                            className={`xmas-toggle ui-icon-button ${isChristmas ? 'active' : ''}`}
                            onClick={() => setIsChristmas(!isChristmas)}
                            title={fixedT('intro.christmasMode')}
                        >
                            🎄
                        </button>
                    </>
                )}

                <div className="divider" />

                <button className="refresh-btn-icon ui-icon-button" onClick={handleRefresh} title={fixedT('intro.autoDetect')}>
                    <RefreshCw size={20} />
                </button>
            </div>

            <div className="center-content">
                <img
                    src="/intro-logo.webp"
                    alt="Cαfé Luα"
                    className="intro-logo"
                    onClick={handleEnter}
                />
                <button className="enter-text" onClick={handleEnter}>
                    {fixedT('intro.clickToEnter')}
                </button>
                <VisitorCounter />
            </div>

            <div className="intro-footer glass" onClick={(e) => e.stopPropagation()}>
                <span>v0.2.1</span>
                <a href="https://github.com/luke-n-alpha/cafelua.com" target="_blank" rel="noopener noreferrer" title="Open Source on GitHub">
                    <Github size={16} />
                </a>
                <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank" rel="noopener noreferrer" title="CC BY-NC-SA 4.0">
                    <img src="https://licensebuttons.net/l/by-nc-sa/4.0/88x31.png" alt="CC BY-NC-SA 4.0" className="intro-cc-badge" />
                </a>
            </div>
        </div>
    );
};

export default IntroPage;
