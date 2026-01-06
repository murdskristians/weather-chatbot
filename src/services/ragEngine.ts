import { WeatherData } from '../types/weather';
import { getWeatherInfo, getWindDirection, formatTime, formatDate } from '../utils/weatherCodes';
import { Language, getTranslations } from '../utils/translations';

export type { Language };

type QueryIntent = 
  | 'current_weather'
  | 'temperature'
  | 'forecast'
  | 'rain'
  | 'wind'
  | 'humidity'
  | 'uv'
  | 'sunrise_sunset'
  | 'tomorrow'
  | 'week'
  | 'hourly'
  | 'general';

const detectIntent = (query: string): QueryIntent[] => {
  const queryLower = query.toLowerCase();
  const intents: QueryIntent[] = [];
  
  if (queryLower.includes('tomorrow')) intents.push('tomorrow');
  if (queryLower.includes('week') || queryLower.includes('7 day') || queryLower.includes('forecast')) intents.push('week');
  if (queryLower.includes('hour') || queryLower.includes('today')) intents.push('hourly');
  
  if (queryLower.includes('rain') || queryLower.includes('precipitation') || queryLower.includes('umbrella') || queryLower.includes('wet')) {
    intents.push('rain');
  }
  if (queryLower.includes('wind') || queryLower.includes('breeze') || queryLower.includes('gust')) {
    intents.push('wind');
  }
  if (queryLower.includes('humid') || queryLower.includes('moisture') || queryLower.includes('muggy')) {
    intents.push('humidity');
  }
  if (queryLower.includes('uv') || queryLower.includes('sunburn') || queryLower.includes('sun protection')) {
    intents.push('uv');
  }
  if (queryLower.includes('sunrise') || queryLower.includes('sunset') || queryLower.includes('sun rise') || queryLower.includes('sun set')) {
    intents.push('sunrise_sunset');
  }
  if (queryLower.includes('temperature') || queryLower.includes('temp') || queryLower.includes('hot') || queryLower.includes('cold') || queryLower.includes('warm') || queryLower.includes('degrees')) {
    intents.push('temperature');
  }
  
  if (intents.length === 0) {
    intents.push('current_weather');
  }
  
  return intents;
};

const generateCurrentWeatherResponse = (weather: WeatherData, lang: Language = 'en'): string => {
  const { current, location, country } = weather;
  const weatherInfo = getWeatherInfo(current.weatherCode);
  const windDir = getWindDirection(current.windDirection);
  const tr = getTranslations(lang);

  return `**${tr.currentWeatherIn} ${location}, ${country}** ${weatherInfo.icon}

${weatherInfo.description} ${tr.with} **${Math.round(current.temperature)}°C** (${tr.feelsLike.toLowerCase()} ${Math.round(current.apparentTemperature)}°C).

• **${tr.humidity}:** ${current.humidity}%
• **${tr.wind}:** ${Math.round(current.windSpeed)} km/h ${tr.fromDirection} ${windDir} (${tr.gustsUpTo} ${Math.round(current.windGusts)} km/h)
• **${tr.cloudCover}:** ${current.cloudCover}%
• **${tr.pressure}:** ${Math.round(current.pressure)} hPa
${current.precipitation > 0 ? `• **${tr.precipitation}:** ${current.precipitation} mm` : ''}`;
};

const generateTemperatureResponse = (weather: WeatherData, lang: Language = 'en'): string => {
  const { current, daily, location } = weather;
  const today = daily[0];
  const tr = getTranslations(lang);

  return `**${tr.temperatureIn} ${location}** 🌡️

${tr.rightNowIts} **${Math.round(current.temperature)}°C** (${tr.feelsLike.toLowerCase()} ${Math.round(current.apparentTemperature)}°C).

${tr.todayRange}: **${Math.round(today.minTemp)}°C** — **${Math.round(today.maxTemp)}°C**

**${tr.upcomingDays}:**
${daily.slice(1, 5).map(d =>
  `• ${formatDate(d.date)}: ${Math.round(d.minTemp)}°C — ${Math.round(d.maxTemp)}°C`
).join('\n')}`;
};

const generateRainResponse = (weather: WeatherData, lang: Language = 'en'): string => {
  const { current, hourly, daily, location } = weather;
  const tr = getTranslations(lang);

  const next12Hours = hourly.slice(0, 12);
  const rainyHours = next12Hours.filter(h => h.precipitationProbability > 30);

  let rainForecast = '';
  if (rainyHours.length === 0) {
    rainForecast = tr.noSignificantRain;
  } else {
    const maxProb = Math.max(...rainyHours.map(h => h.precipitationProbability));
    const peakHour = rainyHours.find(h => h.precipitationProbability === maxProb);
    rainForecast = `${tr.rainLikely} ${tr.peakProbability} ${maxProb}% ${tr.around} ${formatTime(peakHour!.time)}.`;
  }

  return `**${tr.rainForecastFor} ${location}** 🌧️

**${tr.current}:** ${current.precipitation > 0 ? `${current.precipitation} mm ${tr.precipitation.toLowerCase()}` : tr.noPrecipitation}

**${tr.next12Hours}:** ${rainForecast}

**${tr.thisWeek}:**
${daily.slice(0, 5).map(d => {
  const emoji = d.precipitationProbability > 50 ? '🌧️' : d.precipitationProbability > 20 ? '🌦️' : '☀️';

  return `• ${formatDate(d.date)}: ${d.precipitationProbability}% ${tr.chanceOf} ${emoji} (${d.precipitationSum} mm ${tr.expected})`;
}).join('\n')}

${rainyHours.length > 0 ? `\n☔ **${tr.umbrellaAdvice}**` : ''}`;
};

const generateWindResponse = (weather: WeatherData, lang: Language = 'en'): string => {
  const { current, daily, location } = weather;
  const windDir = getWindDirection(current.windDirection);
  const tr = getTranslations(lang);

  let windAdvice = '';
  if (current.windGusts > 50) {
    windAdvice = `⚠️ ${tr.strongGusts}`;
  } else if (current.windSpeed > 30) {
    windAdvice = tr.moderateWinds;
  } else {
    windAdvice = tr.lightWinds;
  }

  return `**${tr.windConditionsIn} ${location}** 💨

**${tr.current}:**
• ${tr.speed}: **${Math.round(current.windSpeed)} km/h** ${tr.fromDirection} ${windDir}
• ${tr.gusts}: **${Math.round(current.windGusts)} km/h**

${windAdvice}

**${tr.thisWeek} ${tr.maxWinds}:**
${daily.slice(0, 5).map(d =>
  `• ${formatDate(d.date)}: ${Math.round(d.windSpeedMax)} km/h (${tr.gusts.toLowerCase()} ${Math.round(d.windGustsMax)} km/h)`
).join('\n')}`;
};

const generateHumidityResponse = (weather: WeatherData, lang: Language = 'en'): string => {
  const { current, hourly, location } = weather;
  const tr = getTranslations(lang);

  let comfort = '';
  if (current.humidity < 30) {
    comfort = tr.veryDry;
  } else if (current.humidity < 50) {
    comfort = tr.comfortableHumidity;
  } else if (current.humidity < 70) {
    comfort = tr.moderateHumidity;
  } else {
    comfort = tr.highHumidity;
  }

  return `**${tr.humidityIn} ${location}** 💧

**${tr.current}:** ${current.humidity}%
${comfort}

**${tr.next12Hours}:**
${hourly.slice(0, 12).filter((_, i) => i % 3 === 0).map(h =>
  `• ${formatTime(h.time)}: ${h.humidity}%`
).join('\n')}`;
};

const generateUVResponse = (weather: WeatherData, lang: Language = 'en'): string => {
  const { daily, location } = weather;
  const today = daily[0];
  const tr = getTranslations(lang);

  let uvAdvice = '';
  if (today.uvIndex >= 11) {
    uvAdvice = `☠️ **${tr.extremeUV}**`;
  } else if (today.uvIndex >= 8) {
    uvAdvice = `🔴 **${tr.veryHighUV}**`;
  } else if (today.uvIndex >= 6) {
    uvAdvice = `🟠 **${tr.highUV}**`;
  } else if (today.uvIndex >= 3) {
    uvAdvice = `🟡 **${tr.moderateUV}**`;
  } else {
    uvAdvice = `🟢 **${tr.lowUV}**`;
  }

  return `**${tr.uvIndexFor} ${location}** ☀️

**${tr.today}:** ${tr.uvIndex} **${Math.round(today.uvIndex)}**
${uvAdvice}

**${tr.thisWeek}:**
${daily.slice(0, 7).map(d => {
  const level = d.uvIndex >= 8 ? '🔴' : d.uvIndex >= 6 ? '🟠' : d.uvIndex >= 3 ? '🟡' : '🟢';

  return `• ${formatDate(d.date)}: ${level} ${Math.round(d.uvIndex)}`;
}).join('\n')}`;
};

const generateSunriseSunsetResponse = (weather: WeatherData, lang: Language = 'en'): string => {
  const { daily, location } = weather;
  const today = daily[0];
  const daylightHours = Math.round(today.daylightDuration / 3600 * 10) / 10;
  const tr = getTranslations(lang);

  return `**${tr.sunriseSunsetIn} ${location}** 🌅

**${tr.today}:**
• 🌅 ${tr.sunrise}: **${formatTime(today.sunrise)}**
• 🌇 ${tr.sunset}: **${formatTime(today.sunset)}**
• ☀️ ${tr.daylight}: **${daylightHours}h**

**${tr.thisWeek}:**
${daily.slice(0, 7).map(d => {
  const hours = Math.round(d.daylightDuration / 3600 * 10) / 10;

  return `• ${formatDate(d.date)}: 🌅 ${formatTime(d.sunrise)} → 🌇 ${formatTime(d.sunset)} (${hours}h)`;
}).join('\n')}`;
};

const generateDayResponse = (weather: WeatherData, dayIndex: number, label: string, lang: Language = 'en'): string => {
  const day = weather.daily[dayIndex];
  const tr = getTranslations(lang);
  if (!day) {
    return tr.noForecastData;
  }
  const weatherInfo = getWeatherInfo(day.weatherCode);
  const windDir = getWindDirection(day.windDirection);

  return `**${label} ${weather.location}** ${weatherInfo.icon}

**${weatherInfo.description}**

• 🌡️ **${tr.temperature}:** ${Math.round(day.minTemp)}°C — ${Math.round(day.maxTemp)}°C
• 🤗 **${tr.feelsLike}:** ${Math.round(day.apparentMinTemp)}°C — ${Math.round(day.apparentMaxTemp)}°C
• 🌧️ **${tr.rainChance}:** ${day.precipitationProbability}%
• 💨 **${tr.wind}:** ${Math.round(day.windSpeedMax)} km/h ${tr.fromDirection} ${windDir}
• ☀️ **${tr.uvIndex}:** ${Math.round(day.uvIndex)}
• 🌅 **${tr.sunrise}:** ${formatTime(day.sunrise)}
• 🌇 **${tr.sunset}:** ${formatTime(day.sunset)}`;
};

const generateTomorrowResponse = (weather: WeatherData, lang: Language = 'en'): string => {
  const tr = getTranslations(lang);
  return generateDayResponse(weather, 1, tr.tomorrowForecastFor, lang);
};

const generateDayAfterTomorrowResponse = (weather: WeatherData, lang: Language = 'en'): string => {
  const tr = getTranslations(lang);
  return generateDayResponse(weather, 2, tr.dayAfterTomorrowForecastFor, lang);
};

const generateSpecificDateResponse = (weather: WeatherData, specificDate: string, lang: Language = 'en'): string => {
  const targetDate = new Date(specificDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tr = getTranslations(lang);

  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return tr.pastDateError;
  }

  if (diffDays > 6) {
    return tr.futureDateError;
  }

  const dateLabel = `${formatDate(specificDate)} ${tr.forecastFor}`;
  return generateDayResponse(weather, diffDays, dateLabel, lang);
};

const generateWeekResponse = (weather: WeatherData, lang: Language = 'en'): string => {
  const tr = getTranslations(lang);
  return `**${tr.weekForecastFor} ${weather.location}** 📅

${weather.daily.map(d => {
  const info = getWeatherInfo(d.weatherCode);

  return `**${formatDate(d.date)}** ${info.icon}
${info.description} | ${Math.round(d.minTemp)}° — ${Math.round(d.maxTemp)}° | 🌧️ ${d.precipitationProbability}%`;
}).join('\n\n')}`;
};

const generateHourlyResponse = (weather: WeatherData, lang: Language = 'en'): string => {
  const tr = getTranslations(lang);
  return `**${tr.hourlyForecastFor} ${weather.location}** ⏰

${weather.hourly.slice(0, 12).map(h => {
  const info = getWeatherInfo(h.weatherCode);

  return `**${formatTime(h.time)}** ${info.icon} ${Math.round(h.temperature)}°C | 💧 ${h.precipitationProbability}% | 💨 ${Math.round(h.windSpeed)} km/h`;
}).join('\n')}`;
};

export const generateWeatherResponse = (
  query: string,
  weather: WeatherData,
  aiIntent?: string | null,
  aiTimeframe?: string | null,
  aiSpecificDate?: string | null,
  language: Language = 'en'
): string => {
  // Handle specific date first
  if (aiSpecificDate) {
    return generateSpecificDateResponse(weather, aiSpecificDate, language);
  }

  // Handle day after tomorrow
  if (aiTimeframe === 'day_after_tomorrow') {
    return generateDayAfterTomorrowResponse(weather, language);
  }

  // Use AI-detected intent/timeframe if available, otherwise fall back to regex detection
  let intents: QueryIntent[];

  if (aiIntent || aiTimeframe) {
    intents = [];
    // Map timeframe to intent
    if (aiTimeframe === 'tomorrow') intents.push('tomorrow');
    if (aiTimeframe === 'week') intents.push('week');
    if (aiTimeframe === 'hourly') intents.push('hourly');

    // Map intent
    if (aiIntent === 'temperature') intents.push('temperature');
    if (aiIntent === 'rain') intents.push('rain');
    if (aiIntent === 'wind') intents.push('wind');
    if (aiIntent === 'humidity') intents.push('humidity');
    if (aiIntent === 'uv') intents.push('uv');
    if (aiIntent === 'sunrise_sunset') intents.push('sunrise_sunset');
    if (aiIntent === 'forecast') intents.push('week');
    if (aiIntent === 'hourly') intents.push('hourly');
    if (aiIntent === 'tomorrow') intents.push('tomorrow');

    // Default to current weather if no specific intent matched
    if (intents.length === 0 || (aiIntent === 'current_weather' || aiIntent === 'general')) {
      intents.push('current_weather');
    }
  } else {
    intents = detectIntent(query);
  }

  const responses: string[] = [];

  for (const intent of intents) {
    switch (intent) {
      case 'tomorrow':
        responses.push(generateTomorrowResponse(weather, language));
        break;
      case 'week':
        responses.push(generateWeekResponse(weather, language));
        break;
      case 'hourly':
        responses.push(generateHourlyResponse(weather, language));
        break;
      case 'rain':
        responses.push(generateRainResponse(weather, language));
        break;
      case 'wind':
        responses.push(generateWindResponse(weather, language));
        break;
      case 'humidity':
        responses.push(generateHumidityResponse(weather, language));
        break;
      case 'uv':
        responses.push(generateUVResponse(weather, language));
        break;
      case 'sunrise_sunset':
        responses.push(generateSunriseSunsetResponse(weather, language));
        break;
      case 'temperature':
        responses.push(generateTemperatureResponse(weather, language));
        break;
      case 'current_weather':
      default:
        responses.push(generateCurrentWeatherResponse(weather, language));
        break;
    }
  }

  const uniqueResponses = [...new Set(responses)];

  return uniqueResponses.join('\n\n---\n\n');
};

export const generateErrorResponse = (error: string, language: Language = 'en'): string => {
  const tr = getTranslations(language);
  const errorResponses: Record<string, string> = {
    'location_not_found': tr.locationNotFound,
    'no_location': tr.noLocation,
    'api_error': tr.apiError,
  };

  return errorResponses[error] || tr.apiError;
};

