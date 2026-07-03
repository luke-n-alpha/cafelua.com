import type { Season, TimeOfDay, Weather } from './environmentBackgrounds';

const PREFIX = '/characters/alpha/coffee-chat/';

const variants = {
    spring_day_sunny: [`${PREFIX}coffee_chat_spring_day_sunny_a.webp`],
    summer_day_sunny: [`${PREFIX}coffee_chat_summer_day_sunny_a.webp`],
    summer_day_rain: [`${PREFIX}coffee_chat_summer_day_rain_a.webp`],
    autumn_sunset_clear: [`${PREFIX}coffee_chat_autumn_sunset_clear_a.webp`],
    autumn_night_clear: [`${PREFIX}coffee_chat_autumn_night_clear_a.webp`],
    winter_night_snow: [`${PREFIX}coffee_chat_winter_night_snow_a.webp`],
    night_clear: [`${PREFIX}coffee_chat_night_clear_a.webp`],
} as const;

type VariantKey = keyof typeof variants;

const hasVariant = (key: string): key is VariantKey => key in variants;

const chooseVariant = (key: VariantKey, seed: string) => {
    const candidates = variants[key];
    if (candidates.length === 1) return candidates[0];

    const hash = Array.from(seed).reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return candidates[hash % candidates.length] ?? candidates[0];
};

const normalizeWeather = (weather: Weather, time: TimeOfDay) => {
    if (time === 'closed') return 'closed';
    if (weather === 'storm') return 'rain';
    if (weather === 'clear') return time === 'day' ? 'sunny' : 'clear';
    if (weather === 'closed') return 'sunny';
    return weather;
};

const normalizeTime = (time: TimeOfDay) => (time === 'closed' ? 'night' : time);

const resolveVariantKey = (
    season: Season,
    time: TimeOfDay,
    weather: Weather,
    isChristmas: boolean
): VariantKey => {
    const normalizedTime = normalizeTime(time);
    const normalizedWeather = normalizeWeather(weather, time);

    const exactKey = `${season}_${normalizedTime}_${normalizedWeather}`;
    if (hasVariant(exactKey)) return exactKey;

    if (isChristmas || normalizedWeather === 'snow') return 'winter_night_snow';
    if (normalizedWeather === 'rain') return 'summer_day_rain';

    if (season === 'autumn' && normalizedTime === 'night') return 'autumn_night_clear';
    if (season === 'autumn') return 'autumn_sunset_clear';
    if (season === 'winter') return 'winter_night_snow';
    if (season === 'summer' && normalizedTime === 'day') return 'summer_day_sunny';
    if (normalizedTime === 'night') return 'night_clear';
    if (normalizedTime === 'sunset') return 'autumn_sunset_clear';

    return 'spring_day_sunny';
};

export const resolveCoffeeChatIllustrationSrc = (
    season: Season,
    time: TimeOfDay,
    weather: Weather,
    isChristmas: boolean
) => {
    const key = resolveVariantKey(season, time, weather, isChristmas);
    return chooseVariant(key, `${season}:${time}:${weather}:${isChristmas}`);
};
