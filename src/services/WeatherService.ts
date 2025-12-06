// Types for our app (matching IntroPage types)
export type AppWeather = 'sunny' | 'clear' | 'rain' | 'snow' | 'storm' | 'closed';
export type AppTimeOfDay = 'day' | 'sunset' | 'night' | 'closed';

interface WeatherResponse {
    weather:Array<{
        id: number;
        main: string;
        description: string;
        icon: string;
    }>;
    main: {
        temp: number;
    };
    sys: {
        sunrise: number;
        sunset: number;
    };
    dt: number;
}

const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY || '';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

export const getWeatherByCoords = async (lat: number, lon: number): Promise<{ weather: AppWeather, time: AppTimeOfDay } | null> => {
    if (!API_KEY) {
        console.warn('OpenWeatherMap API Key not found in env (NEXT_PUBLIC_OPENWEATHER_API_KEY)');
        return null;
    }

    try {
        const response = await fetch(`${BASE_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}`);
        if (!response.ok) throw new Error('Weather API call failed');
        
        const data: WeatherResponse = await response.json();
        return mapApiDataToApp(data);
    } catch (error) {
        console.error("Error fetching weather:", error);
        return null;
    }
};

const mapApiDataToApp = (data: WeatherResponse): { weather: AppWeather, time: AppTimeOfDay } => {
    const { weather, dt, sys } = data;
    const weatherId = weather[0].id;
    const now = dt;
    const { sunrise, sunset } = sys;

    // Map Time of Day
    // Use a 1-hour buffer around sunrise/sunset for "twilight/sunset" feel
    let time: AppTimeOfDay = 'day';
    
    // Check if it's night (before sunrise or after sunset)
    if (now < sunrise || now > sunset + 3600) { // 1 hour after sunset considered full night
        time = 'night';
    } 
    // Check for sunset/sunrise golden hour (approx 1 hour around sunset)
    else if (now >= sunset - 1800 && now <= sunset + 3600) {
        time = 'sunset';
    }
    // Otherwise it's day
    else {
        time = 'day';
    }

    // Map Weather Condition
    let condition: AppWeather = 'sunny';

    // Group 2xx: Thunderstorm
    if (weatherId >= 200 && weatherId < 300) {
        condition = 'storm';
    }
    // Group 3xx: Drizzle -> Rain
    // Group 5xx: Rain
    else if (weatherId >= 300 && weatherId < 600) {
        condition = 'rain';
    }
    // Group 6xx: Snow
    else if (weatherId >= 600 && weatherId < 700) {
        condition = 'snow';
    }
    // Group 7xx: Atmosphere (Fog, Mist) -> Clear/Cloudy handled below
    // Group 800: Clear
    else if (weatherId === 800) {
        condition = time === 'night' ? 'clear' : 'sunny';
    }
    // Group 80x: Clouds
    else if (weatherId > 800) {
        // CafeLua doesn't have explicit "cloudy" art yet, map to clear/sunny or maybe rain if very cloudy?
        // For now, map to sunny/clear unless we add cloudy art. 
        // Or we could treat heavy clouds (803, 804) as 'rain' contextually or just 'cloudy' if supported.
        // Let's stick to sunny/clear for light clouds, maybe 'rain' visual for heavy overcast if we want moodiness?
        // Actually, let's keep it safe:
        condition = time === 'night' ? 'clear' : 'sunny';
    }

    return { weather: condition, time };
};
