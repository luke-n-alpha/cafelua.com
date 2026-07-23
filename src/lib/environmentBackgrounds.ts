export type Season = 'spring' | 'summer' | 'autumn' | 'winter';
export type TimeOfDay = 'day' | 'sunset' | 'night' | 'closed';
export type Weather = 'sunny' | 'clear' | 'rain' | 'snow' | 'storm' | 'closed';

type Space = 'lounge' | 'coffeeChat' | 'atelier' | 'guestbook' | 'masterDesk' | 'gallery' | 'about' | 'library';

const AVAILABLE_LOUNGE_BACKGROUNDS = new Set([
    'lounge_bg_autumn_day_rain',
    'lounge_bg_autumn_day_storm',
    'lounge_bg_autumn_day_sunny',
    'lounge_bg_autumn_night_clear',
    'lounge_bg_autumn_night_closed',
    'lounge_bg_autumn_sunset_clear',
    'lounge_bg_spring_day_rain',
    'lounge_bg_spring_day_sunny',
    'lounge_bg_spring_night_clear',
    'lounge_bg_spring_night_closed',
    'lounge_bg_spring_sunset_clear',
    'lounge_bg_summer_day_rain',
    'lounge_bg_summer_day_sunny',
    'lounge_bg_summer_night_clear',
    'lounge_bg_summer_night_closed',
    'lounge_bg_summer_sunset_clear',
    'lounge_bg_winter_day_snow',
    'lounge_bg_winter_day_snow_xmas',
    'lounge_bg_winter_day_sunny',
    'lounge_bg_winter_day_sunny_xmas',
    'lounge_bg_winter_night_clear',
    'lounge_bg_winter_night_clear_xmas',
    'lounge_bg_winter_night_closed',
    'lounge_bg_winter_night_closed_snow_xmas',
    'lounge_bg_winter_night_closed_xmas',
    'lounge_bg_winter_night_snow',
    'lounge_bg_winter_night_snow_xmas',
    'lounge_bg_winter_sunset_clear',
    'lounge_bg_winter_sunset_clear_xmas',
    'lounge_bg_winter_sunset_xmas',
]);

const AVAILABLE_ATELIER_BACKGROUNDS = new Set([
    'atelier_bg_autumn_day_rain',
    'atelier_bg_autumn_day_storm',
    'atelier_bg_autumn_day_sunny',
    'atelier_bg_autumn_night_clear',
    'atelier_bg_autumn_night_closed',
    'atelier_bg_autumn_sunset_clear',
    'atelier_bg_spring_day_rain',
    'atelier_bg_spring_day_sunny',
    'atelier_bg_spring_night_clear',
    'atelier_bg_spring_night_closed',
    'atelier_bg_spring_sunset_clear',
    'atelier_bg_summer_day_rain',
    'atelier_bg_summer_day_sunny',
    'atelier_bg_summer_night_clear',
    'atelier_bg_summer_night_closed',
    'atelier_bg_summer_sunset_clear',
    'atelier_bg_winter_day_snow',
    'atelier_bg_winter_day_snow_xmas',
    'atelier_bg_winter_day_sunny',
    'atelier_bg_winter_day_sunny_xmas',
    'atelier_bg_winter_night_clear',
    'atelier_bg_winter_night_clear_xmas',
    'atelier_bg_winter_night_closed',
    'atelier_bg_winter_night_closed_snow_xmas',
    'atelier_bg_winter_night_closed_xmas',
    'atelier_bg_winter_night_snow',
    'atelier_bg_winter_night_snow_xmas',
    'atelier_bg_winter_sunset_clear',
    'atelier_bg_winter_sunset_clear_xmas',
    'atelier_bg_winter_sunset_xmas',
    '2f-christmas',
    '2f-night',
    '2f-rain',
    '2f-snow',
    '2f-sunny',
    '2f-sunset',
]);

const AVAILABLE_GUESTBOOK_BACKGROUNDS = new Set([
    'guestbook_bg_autumn_day_rain',
    'guestbook_bg_autumn_day_storm',
    'guestbook_bg_autumn_day_sunny',
    'guestbook_bg_autumn_night_clear',
    'guestbook_bg_autumn_night_closed',
    'guestbook_bg_autumn_sunset_clear',
    'guestbook_bg_spring_day_rain',
    'guestbook_bg_spring_day_sunny',
    'guestbook_bg_spring_night_clear',
    'guestbook_bg_spring_night_closed',
    'guestbook_bg_spring_sunset_clear',
    'guestbook_bg_summer_day_rain',
    'guestbook_bg_summer_day_sunny',
    'guestbook_bg_summer_night_clear',
    'guestbook_bg_summer_night_closed',
    'guestbook_bg_summer_sunset_clear',
    'guestbook_bg_winter_day_snow',
    'guestbook_bg_winter_day_snow_xmas',
    'guestbook_bg_winter_day_sunny',
    'guestbook_bg_winter_day_sunny_xmas',
    'guestbook_bg_winter_night_clear',
    'guestbook_bg_winter_night_clear_xmas',
    'guestbook_bg_winter_night_closed',
    'guestbook_bg_winter_night_closed_snow_xmas',
    'guestbook_bg_winter_night_closed_xmas',
    'guestbook_bg_winter_night_snow',
    'guestbook_bg_winter_night_snow_xmas',
    'guestbook_bg_winter_sunset_clear',
    'guestbook_bg_winter_sunset_clear_xmas',
    'guestbook_bg_winter_sunset_xmas',
]);

const AVAILABLE_MASTER_DESK_BACKGROUNDS = new Set([
    'master_desk_bg_autumn_sunset_clear',
    'master_desk_bg_spring_day_sunny',
    'master_desk_bg_summer_day_rain',
    'master_desk_bg_summer_night_closed',
    'master_desk_bg_winter_day_snow',
    'master_desk_bg_winter_night_snow_xmas',
]);

const AVAILABLE_GALLERY_BACKGROUNDS = new Set([
    'gallery_bg_autumn_sunset_clear',
    'gallery_bg_spring_day_sunny',
    'gallery_bg_summer_day_rain',
    'gallery_bg_summer_night_closed',
    'gallery_bg_winter_day_snow',
    'gallery_bg_winter_night_snow_xmas',
]);

const AVAILABLE_ABOUT_BACKGROUNDS = new Set([
    'about_bg_autumn_sunset_clear',
    'about_bg_spring_day_sunny',
    'about_bg_summer_day_rain',
    'about_bg_summer_night_closed',
    'about_bg_winter_day_snow',
    'about_bg_winter_night_snow_xmas',
]);

const AVAILABLE_LIBRARY_BACKGROUNDS = new Set([
    'library_bg_autumn_sunset_clear',
    'library_bg_spring_day_sunny',
    'library_bg_summer_day_rain',
    'library_bg_summer_night_closed',
    'library_bg_winter_day_snow',
    'library_bg_winter_night_snow_xmas',
]);

const getAvailableSet = (space: Space) => {
    if (space === 'lounge' || space === 'coffeeChat') return AVAILABLE_LOUNGE_BACKGROUNDS;
    if (space === 'guestbook') return AVAILABLE_GUESTBOOK_BACKGROUNDS;
    if (space === 'masterDesk') return AVAILABLE_MASTER_DESK_BACKGROUNDS;
    if (space === 'gallery') return AVAILABLE_GALLERY_BACKGROUNDS;
    if (space === 'about') return AVAILABLE_ABOUT_BACKGROUNDS;
    if (space === 'library') return AVAILABLE_LIBRARY_BACKGROUNDS;
    return AVAILABLE_ATELIER_BACKGROUNDS;
};

const getPrefix = (space: Space) => {
    if (space === 'atelier') return 'atelier_bg';
    if (space === 'guestbook') return 'guestbook_bg';
    if (space === 'masterDesk') return 'master_desk_bg';
    if (space === 'gallery') return 'gallery_bg';
    if (space === 'about') return 'about_bg';
    if (space === 'library') return 'library_bg';
    return 'lounge_bg';
};

const getFolder = (space: Space) => {
    if (space === 'atelier') return 'atelier-background-img';
    if (space === 'guestbook') return 'guestbook-background-img';
    if (space === 'masterDesk') return 'master-desk-background-img';
    if (space === 'gallery') return 'gallery-background-img';
    if (space === 'about') return 'about-background-img';
    if (space === 'library') return 'library-background-img';
    return 'lounge-background-img';
};

const getLegacyFallbackName = (
    space: Space,
    season: Season,
    time: TimeOfDay,
    weather: Weather,
    isChristmas: boolean
) => {
    if (space === 'about') {
        if (isChristmas && season === 'winter') return 'about_bg_winter_night_snow_xmas';
        if (season === 'winter' && weather === 'snow') return 'about_bg_winter_day_snow';
        if (weather === 'rain' || weather === 'storm') return 'about_bg_summer_day_rain';
        if (time === 'sunset') return 'about_bg_autumn_sunset_clear';
        if (time === 'night' || time === 'closed') return 'about_bg_summer_night_closed';
        return 'about_bg_spring_day_sunny';
    }

    if (space === 'library') {
        if (isChristmas && season === 'winter') return 'library_bg_winter_night_snow_xmas';
        if (season === 'winter' && weather === 'snow') return 'library_bg_winter_day_snow';
        if (weather === 'rain' || weather === 'storm') return 'library_bg_summer_day_rain';
        if (time === 'sunset') return 'library_bg_autumn_sunset_clear';
        if (time === 'night' || time === 'closed') return 'library_bg_summer_night_closed';
        return 'library_bg_spring_day_sunny';
    }

    if (space === 'gallery') {
        if (isChristmas && season === 'winter') return 'gallery_bg_winter_night_snow_xmas';
        if (season === 'winter' && weather === 'snow') return 'gallery_bg_winter_day_snow';
        if (weather === 'rain' || weather === 'storm') return 'gallery_bg_summer_day_rain';
        if (time === 'sunset') return 'gallery_bg_autumn_sunset_clear';
        if (time === 'night' || time === 'closed') return 'gallery_bg_summer_night_closed';
        return 'gallery_bg_spring_day_sunny';
    }

    if (space === 'masterDesk') {
        if (isChristmas && season === 'winter') return 'master_desk_bg_winter_night_snow_xmas';
        if (season === 'winter' && weather === 'snow') return 'master_desk_bg_winter_day_snow';
        if (weather === 'rain' || weather === 'storm') return 'master_desk_bg_summer_day_rain';
        if (time === 'sunset') return 'master_desk_bg_autumn_sunset_clear';
        if (time === 'night' || time === 'closed') return 'master_desk_bg_summer_night_closed';
        return 'master_desk_bg_spring_day_sunny';
    }

    if (space === 'guestbook') {
        if (isChristmas && season === 'winter') return 'guestbook_bg_winter_night_snow_xmas';
        if (season === 'winter' && weather === 'snow') return 'guestbook_bg_winter_day_snow';
        if (weather === 'rain' || weather === 'storm') return 'guestbook_bg_summer_day_rain';
        if (time === 'sunset') return 'guestbook_bg_autumn_sunset_clear';
        if (time === 'night' || time === 'closed') return 'guestbook_bg_summer_night_closed';
        return 'guestbook_bg_spring_day_sunny';
    }

    if (space === 'atelier') {
        if (isChristmas) return '2f-christmas';
        if (season === 'winter' && weather === 'snow') return '2f-snow';
        if (weather === 'rain' || weather === 'storm') return '2f-rain';
        if (weather === 'snow') return '2f-snow';
        if (time === 'sunset') return '2f-sunset';
        if (time === 'night' || time === 'closed') return '2f-night';
        return '2f-sunny';
    }

    if (isChristmas) return 'lounge-christmas';
    if (season === 'winter' && weather === 'snow') return 'lounge-snow';
    if (weather === 'rain' || weather === 'storm') return 'lounge-rain';
    if (weather === 'snow') return 'lounge-snow';
    if (time === 'sunset') return 'lounge-evening';
    if (time === 'night' || time === 'closed') return 'lounge-night';
    return 'lounge-sunny';
};

const normalizeWeather = (weather: Weather, time: TimeOfDay): Weather | 'closed' => {
    if (time === 'closed') return 'closed';
    if ((time === 'sunset' || time === 'night') && weather === 'sunny') return 'clear';
    if (weather === 'clear') return time === 'sunset' || time === 'night' ? 'clear' : 'sunny';
    if (weather === 'closed') return 'sunny';
    return weather;
};

export const resolveEnvironmentBackgroundName = (
    space: Space,
    season: Season,
    time: TimeOfDay,
    weather: Weather,
    isChristmas: boolean
) => {
    const prefix = getPrefix(space);
    const available = getAvailableSet(space);
    const normalizedWeather = normalizeWeather(weather, time);
    const xmas = isChristmas && season === 'winter';
    const hasClosedWeather = time === 'closed' && weather !== 'sunny' && weather !== 'clear' && weather !== 'closed';
    const weatherSpecificClosedCandidates = hasClosedWeather
        ? [
            `${prefix}_${season}_night_${weather}${xmas ? '_xmas' : ''}`,
            `${prefix}_${season}_night_${weather}`,
            `${prefix}_${season}_day_${weather}${xmas ? '_xmas' : ''}`,
            `${prefix}_${season}_day_${weather}`,
        ]
        : [];

    const candidates = [
        ...(time === 'closed' && weather === 'snow' && xmas ? [
            `${prefix}_winter_night_closed_snow_xmas`,
            `${prefix}_winter_night_snow_xmas`,
            `${prefix}_winter_day_snow_xmas`,
        ] : []),
        ...weatherSpecificClosedCandidates,
        ...(time === 'closed' && !hasClosedWeather ? [
            `${prefix}_${season}_night_closed${weather === 'snow' && xmas ? '_snow_xmas' : ''}`,
            `${prefix}_${season}_night_closed${xmas ? '_xmas' : ''}`,
            `${prefix}_${season}_night_closed`,
            ...(xmas ? [`${prefix}_winter_night_closed_snow_xmas`] : []),
        ] : []),
        `${prefix}_${season}_${time}_${normalizedWeather}${xmas ? '_xmas' : ''}`,
        `${prefix}_${season}_${time}_${normalizedWeather}`,
        `${prefix}_${season}_${time}_${xmas ? 'sunny_xmas' : 'sunny'}`,
        `${prefix}_${season}_${time}_sunny`,
        `${prefix}_${season}_day_${normalizedWeather}${xmas ? '_xmas' : ''}`,
        `${prefix}_${season}_day_${normalizedWeather}`,
        `${prefix}_${season}_day_${xmas ? 'sunny_xmas' : 'sunny'}`,
        `${prefix}_${season}_day_sunny`,
        ...(xmas ? [`${prefix}_winter_night_snow_xmas`] : []),
        getLegacyFallbackName(space, season, time, weather, isChristmas),
    ];

    return candidates.find((name) => available.has(name)) ?? getLegacyFallbackName(space, season, time, weather, isChristmas);
};

export const resolveEnvironmentBackgroundSrc = (
    space: Space,
    season: Season,
    time: TimeOfDay,
    weather: Weather,
    isChristmas: boolean
) => {
    const folder = getFolder(space);
    const name = resolveEnvironmentBackgroundName(space, season, time, weather, isChristmas);
    return `/${folder}/${name}.webp`;
};

export const resolveEnvironmentMood = (
    space: Space,
    season: Season,
    time: TimeOfDay,
    weather: Weather,
    isChristmas: boolean
) => {
    const legacyName = getLegacyFallbackName(space, season, time, weather, isChristmas);
    return space === 'atelier'
        ? legacyName.replace(/^2f-/, '')
        : space === 'guestbook'
            ? legacyName.replace(/^guestbook_bg_/, '')
            : space === 'masterDesk'
                ? legacyName.replace(/^master_desk_bg_/, '')
                : space === 'gallery'
                    ? legacyName.replace(/^gallery_bg_/, '')
                    : space === 'about'
                        ? legacyName.replace(/^about_bg_/, '')
        : legacyName.replace(/^lounge-/, '');
};

export const getPreloadBackgrounds = (space: Space) => {
    const folder = getFolder(space);
    return Array.from(getAvailableSet(space), (name) => `/${folder}/${name}.webp`);
};
