import type { Season, TimeOfDay, Weather } from './environmentBackgrounds';

const COFFEE_CHAT_ILLUSTRATIONS = {
    springDaySunny: '/characters/alpha/coffee-chat/coffee_chat_spring_day_sunny_a.webp',
    summerDayRain: '/characters/alpha/coffee-chat/coffee_chat_summer_day_rain_a.webp',
    autumnSunsetClear: '/characters/alpha/coffee-chat/coffee_chat_autumn_sunset_clear_a.webp',
    winterNightSnow: '/characters/alpha/coffee-chat/coffee_chat_winter_night_snow_a.webp',
    nightClear: '/characters/alpha/coffee-chat/coffee_chat_night_clear_a.webp',
} as const;

const pick = (candidates: string[]) => {
    const index = Math.floor(Math.random() * candidates.length);
    return candidates[index] ?? COFFEE_CHAT_ILLUSTRATIONS.springDaySunny;
};

export const resolveCoffeeChatIllustrationSrc = (
    season: Season,
    time: TimeOfDay,
    weather: Weather,
    isChristmas: boolean
) => {
    if (isChristmas || weather === 'snow') {
        return COFFEE_CHAT_ILLUSTRATIONS.winterNightSnow;
    }

    if (weather === 'rain' || weather === 'storm') {
        return COFFEE_CHAT_ILLUSTRATIONS.summerDayRain;
    }

    if (time === 'night' || time === 'closed') {
        return pick([
            COFFEE_CHAT_ILLUSTRATIONS.nightClear,
            ...(season === 'winter' ? [COFFEE_CHAT_ILLUSTRATIONS.winterNightSnow] : []),
        ]);
    }

    if (time === 'sunset') {
        return pick([
            COFFEE_CHAT_ILLUSTRATIONS.autumnSunsetClear,
            ...(season === 'spring' ? [COFFEE_CHAT_ILLUSTRATIONS.springDaySunny] : []),
        ]);
    }

    if (season === 'autumn') {
        return COFFEE_CHAT_ILLUSTRATIONS.autumnSunsetClear;
    }

    if (season === 'winter') {
        return pick([
            COFFEE_CHAT_ILLUSTRATIONS.winterNightSnow,
            COFFEE_CHAT_ILLUSTRATIONS.nightClear,
        ]);
    }

    if (season === 'summer') {
        return pick([
            COFFEE_CHAT_ILLUSTRATIONS.springDaySunny,
            COFFEE_CHAT_ILLUSTRATIONS.summerDayRain,
        ]);
    }

    return COFFEE_CHAT_ILLUSTRATIONS.springDaySunny;
};
