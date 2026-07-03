import type { Season, TimeOfDay, Weather } from './environmentBackgrounds';

export interface RuntimeEnvironmentContext {
    world: 'Cαfé Luα';
    character: 'Alpha';
    space: string;
    surface: 'web' | 'naia-shell';
    season: Season;
    time: TimeOfDay;
    weather: Weather;
    isChristmas: boolean;
    isOpen: boolean;
    backgroundSrc?: string;
}

const SEASON_KO: Record<Season, string> = {
    spring: '봄',
    summer: '여름',
    autumn: '가을',
    winter: '겨울',
};

const TIME_KO: Record<TimeOfDay, string> = {
    day: '낮',
    sunset: '해질녘',
    night: '밤',
    closed: '영업 종료 시간',
};

const WEATHER_KO: Record<Weather, string> = {
    sunny: '맑음',
    clear: '맑음',
    rain: '비',
    snow: '눈',
    storm: '천둥번개',
    closed: '영업 종료',
};

const SEASON_EN: Record<Season, string> = {
    spring: 'spring',
    summer: 'summer',
    autumn: 'autumn',
    winter: 'winter',
};

const TIME_EN: Record<TimeOfDay, string> = {
    day: 'daytime',
    sunset: 'sunset',
    night: 'night',
    closed: 'after closing',
};

const WEATHER_EN: Record<Weather, string> = {
    sunny: 'sunny',
    clear: 'clear',
    rain: 'rainy',
    snow: 'snowy',
    storm: 'stormy',
    closed: 'closed',
};

const isSeason = (value: string | null): value is Season =>
    value === 'spring' || value === 'summer' || value === 'autumn' || value === 'winter';

const isTimeOfDay = (value: string | null): value is TimeOfDay =>
    value === 'day' || value === 'sunset' || value === 'night' || value === 'closed';

const isWeather = (value: string | null): value is Weather =>
    value === 'sunny' || value === 'clear' || value === 'rain' || value === 'snow' || value === 'storm' || value === 'closed';

export function parseRuntimeEnvironmentFromSearchParams(
    searchParams: Pick<URLSearchParams, 'get'>,
    options: {
        space: string;
        backgroundSrc?: string;
        surface?: RuntimeEnvironmentContext['surface'];
    }
): RuntimeEnvironmentContext {
    const seasonParam = searchParams.get('season');
    const timeParam = searchParams.get('time');
    const weatherParam = searchParams.get('weather');
    const christmasParam = searchParams.get('christmas');
    const season = isSeason(seasonParam) ? seasonParam : 'spring';
    const time = isTimeOfDay(timeParam) ? timeParam : 'day';
    const weather = isWeather(weatherParam) ? weatherParam : 'sunny';
    const isChristmas = christmasParam === 'true' || christmasParam === '1';

    return {
        world: 'Cαfé Luα',
        character: 'Alpha',
        space: options.space,
        surface: options.surface ?? 'web',
        season,
        time,
        weather,
        isChristmas,
        isOpen: time !== 'closed',
        backgroundSrc: options.backgroundSrc,
    };
}

export function describeRuntimeEnvironment(
    context: RuntimeEnvironmentContext,
    language: 'ko' | 'en' = 'ko'
): string {
    if (language === 'en') {
        const openState = context.isOpen ? 'open' : 'closed';
        const event = context.isChristmas ? ', Christmas season' : '';
        return `${context.world}, ${context.space}: ${SEASON_EN[context.season]}, ${TIME_EN[context.time]}, ${WEATHER_EN[context.weather]}, ${openState}${event}.`;
    }

    const openState = context.isOpen ? '영업 중' : '영업 종료';
    const event = context.isChristmas ? ', 크리스마스 시즌' : '';
    return `${context.world} ${context.space}: ${SEASON_KO[context.season]}, ${TIME_KO[context.time]}, ${WEATHER_KO[context.weather]}, ${openState}${event}.`;
}

export function getRuntimeEnvironmentPrompt(
    context: RuntimeEnvironmentContext,
    language: 'ko' | 'en' = 'ko'
): string {
    const summary = describeRuntimeEnvironment(context, language);

    if (language === 'en') {
        return `## Runtime Environment
This is the current Naia World runtime context for Alpha and the visit context for this guest.
- Summary: ${summary}
- World: ${context.world}
- Character: ${context.character}
- Space: ${context.space}
- Surface: ${context.surface}
- Season: ${context.season}
- Time: ${context.time}
- Weather: ${context.weather}
- Open state: ${context.isOpen ? 'open' : 'closed'}
- Event: ${context.isChristmas ? 'Christmas season' : 'none'}
- Background: ${context.backgroundSrc ?? 'not provided'}

Alpha must understand that the guest visited under this season, time, weather, Christmas mode, and open/closed state. Refer to it naturally when helpful, and never contradict it.`;
    }

    return `## 런타임 환경
이 정보는 Alpha가 현재 인지해야 하는 Naia World 런타임 컨텍스트이자, 손님이 방문한 상황입니다.
- 요약: ${summary}
- 월드: ${context.world}
- 캐릭터: ${context.character}
- 공간: ${context.space}
- Surface: ${context.surface}
- 계절: ${context.season}
- 시간: ${context.time}
- 날씨: ${context.weather}
- 영업 상태: ${context.isOpen ? '영업 중' : '영업 종료'}
- 이벤트: ${context.isChristmas ? '크리스마스 시즌' : '없음'}
- 배경: ${context.backgroundSrc ?? '전달되지 않음'}

Alpha는 손님이 이 계절, 시간, 날씨, 크리스마스 모드, 영업 상태에서 방문했다는 것을 알고 있어야 합니다. 필요할 때 자연스럽게 반영하고, 현재 상황과 모순되는 말을 하지 마세요.`;
}
