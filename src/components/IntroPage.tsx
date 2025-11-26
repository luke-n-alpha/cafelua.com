import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './IntroPage.css';
import logoImg from '../assets/logo.png';
import {
    Sun, Moon, CloudRain, CloudSnow, CloudLightning,
    Flower2, Leaf, Snowflake, Sunset, DoorClosed, RefreshCw
} from 'lucide-react';

// Types
type Season = 'spring' | 'summer' | 'autumn' | 'winter';
type TimeOfDay = 'day' | 'sunset' | 'night' | 'closed';
type Weather = 'sunny' | 'clear' | 'rain' | 'snow' | 'storm' | 'closed';

// Known asset filenames (without extension)
const AVAILABLE_BACKGROUNDS = new Set([
    // Spring
    'intro_bg_spring_day_rain',
    'intro_bg_spring_day_sunny',
    'intro_bg_spring_night_clear',
    'intro_bg_spring_night_closed',
    'intro_bg_spring_sunset_clear',
    // Summer
    'intro_bg_summer_day_rain',
    'intro_bg_summer_day_sunny',
    'intro_bg_summer_night_clear',
    'intro_bg_summer_night_closed',
    'intro_bg_summer_sunset_clear',
    // Autumn
    'intro_bg_autumn_day_rain',
    'intro_bg_autumn_day_storm',
    'intro_bg_autumn_day_sunny',
    'intro_bg_autumn_night_clear',
    'intro_bg_autumn_night_closed',
    'intro_bg_autumn_sunset_clear',
    // Winter (base)
    'intro_bg_winter_day_snow',
    'intro_bg_winter_day_sunny',
    'intro_bg_winter_night_clear',
    'intro_bg_winter_night_closed',
    'intro_bg_winter_night_snow',
    'intro_bg_winter_sunset_clear',
    // Winter (xmas)
    'intro_bg_winter_day_snow_xmas',
    'intro_bg_winter_day_sunny_xmas',
    'intro_bg_winter_night_clear_xmas',
    'intro_bg_winter_night_closed_xmas',
    'intro_bg_winter_night_closed_snow_xmas',
    'intro_bg_winter_night_snow_xmas',
    'intro_bg_winter_sunset_clear_xmas',
    'intro_bg_winter_sunset_xmas',
]);

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

// Custom Icon Select Component
const IconSelect = ({
    value,
    options,
    onChange,
    getIcon,
    label
}: {
    value: string,
    options: string[],
    onChange: (val: string) => void,
    getIcon: (val: any) => React.ReactNode,
    label: string
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
    const navigate = useNavigate();
    const assetBase = (import.meta.env.BASE_URL || '/');

    // State
    const [season, setSeason] = useState<Season>('spring');
    const [time, setTime] = useState<TimeOfDay>('day');
    const [weather, setWeather] = useState<Weather>('sunny');
    const [isChristmas, setIsChristmas] = useState(false);
    const [bgImage, setBgImage] = useState<string>('');

    // Auto-detect on mount
    useEffect(() => {
        handleRefresh();
    }, []);

    // Check if current date is in Christmas period (Dec 1-25)
    const isChristmasPeriod = (): boolean => {
        const now = new Date();
        const month = now.getMonth(); // 0-indexed, so 11 = December
        const day = now.getDate();
        return month === 11 && day >= 1 && day <= 25;
    };

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
    }, [season]);

    // Update background whenever state changes
    useEffect(() => {
        // Normalize time/weather for filename generation
        let displayTime: TimeOfDay = time;
        let displayWeather: Weather | 'closed' = weather;

        // Closed time uses night slot in filenames
        if (displayTime === 'closed') {
            displayTime = 'night';
            displayWeather = 'closed';
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

        const chosen = candidates.find((name) => AVAILABLE_BACKGROUNDS.has(name)) ?? candidates[candidates.length - 1];
        setBgImage(`${assetBase}intro-background-img/${chosen}.png`);
    }, [season, time, weather, isChristmas, assetBase]);

    const handleRefresh = async () => {
        const now = new Date();
        const s = getSeason(now.getMonth());
        const t = getTimeOfDay(now.getHours());
        setSeason(s);
        setTime(t);

        // Auto-enable Christmas during Dec 1-25 if winter
        if (s === 'winter' && isChristmasPeriod()) {
            setIsChristmas(true);
        } else {
            setIsChristmas(false);
        }
    };

    const handleEnter = () => {
        setTimeout(() => {
            navigate('/main');
        }, 800);
    };

    return (
        <div
            className="intro-container"
            style={{ backgroundImage: `url('${bgImage}')` }}
            onClick={handleEnter}
        >
            <div className="control-bar glass" onClick={(e) => e.stopPropagation()}>
                <IconSelect
                    label="Season"
                    value={season}
                    options={['spring', 'summer', 'autumn', 'winter']}
                    onChange={(v) => setSeason(v as Season)}
                    getIcon={getSeasonIcon}
                />
                <IconSelect
                    label="Time"
                    value={time}
                    options={['day', 'sunset', 'night', 'closed']}
                    onChange={(v) => setTime(v as TimeOfDay)}
                    getIcon={getTimeIcon}
                />
                <IconSelect
                    label="Weather"
                    value={weather}
                    options={availableWeathers}
                    onChange={(v) => setWeather(v as Weather)}
                    getIcon={getWeatherIcon}
                />

                {season === 'winter' && (
                    <>
                        <div className="divider" />
                        <button
                            className={`xmas-toggle ${isChristmas ? 'active' : ''}`}
                            onClick={() => setIsChristmas(!isChristmas)}
                            title="Christmas Mode"
                        >
                            🎄
                        </button>
                    </>
                )}

                <div className="divider" />

                <button className="refresh-btn-icon" onClick={handleRefresh} title="Auto Detect">
                    <RefreshCw size={20} />
                </button>
            </div>

            <div className="center-content">
                <img src={logoImg} alt="Cafelua Logo" className="intro-logo" />
                <div className="enter-text">Click to Enter</div>
            </div>

            <div className="intro-footer glass" onClick={(e) => e.stopPropagation()}>
                <span>v0.1.0</span>
                <a href="https://github.com/luke-n-alpha/cafelua.com" target="_blank" rel="noopener noreferrer">
                    GitHub
                </a>
            </div>
        </div>
    );
};

export default IntroPage;
