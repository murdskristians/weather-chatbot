import { WeatherData } from '../types/weather';
import { getWeatherInfo, getWindDirection, formatTime, formatDate } from '../utils/weatherCodes';

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

const generateCurrentWeatherResponse = (weather: WeatherData): string => {
  const { current, location, country } = weather;
  const weatherInfo = getWeatherInfo(current.weatherCode);
  const windDir = getWindDirection(current.windDirection);
  
  return `**Current weather in ${location}, ${country}** ${weatherInfo.icon}

${weatherInfo.description} with a temperature of **${Math.round(current.temperature)}°C** (feels like ${Math.round(current.apparentTemperature)}°C).

• **Humidity:** ${current.humidity}%
• **Wind:** ${Math.round(current.windSpeed)} km/h from ${windDir} (gusts up to ${Math.round(current.windGusts)} km/h)
• **Cloud cover:** ${current.cloudCover}%
• **Pressure:** ${Math.round(current.pressure)} hPa
${current.precipitation > 0 ? `• **Precipitation:** ${current.precipitation} mm` : ''}`;
};

const generateTemperatureResponse = (weather: WeatherData): string => {
  const { current, daily, location } = weather;
  const today = daily[0];
  
  return `**Temperature in ${location}** 🌡️

Right now it's **${Math.round(current.temperature)}°C** (feels like ${Math.round(current.apparentTemperature)}°C).

Today's range: **${Math.round(today.minTemp)}°C** to **${Math.round(today.maxTemp)}°C**

**Upcoming days:**
${daily.slice(1, 5).map(d => 
  `• ${formatDate(d.date)}: ${Math.round(d.minTemp)}°C — ${Math.round(d.maxTemp)}°C`
).join('\n')}`;
};

const generateRainResponse = (weather: WeatherData): string => {
  const { current, hourly, daily, location } = weather;
  
  const next12Hours = hourly.slice(0, 12);
  const rainyHours = next12Hours.filter(h => h.precipitationProbability > 30);
  
  let rainForecast = '';
  if (rainyHours.length === 0) {
    rainForecast = 'No significant rain expected in the next 12 hours.';
  } else {
    const maxProb = Math.max(...rainyHours.map(h => h.precipitationProbability));
    const peakHour = rainyHours.find(h => h.precipitationProbability === maxProb);
    rainForecast = `Rain likely! Peak probability of ${maxProb}% around ${formatTime(peakHour!.time)}.`;
  }
  
  return `**Rain forecast for ${location}** 🌧️

**Current:** ${current.precipitation > 0 ? `${current.precipitation} mm precipitation` : 'No precipitation'}

**Next 12 hours:** ${rainForecast}

**This week:**
${daily.slice(0, 5).map(d => {
  const emoji = d.precipitationProbability > 50 ? '🌧️' : d.precipitationProbability > 20 ? '🌦️' : '☀️';

  return `• ${formatDate(d.date)}: ${d.precipitationProbability}% chance ${emoji} (${d.precipitationSum} mm expected)`;
}).join('\n')}

${rainyHours.length > 0 ? '\n☔ **Tip:** You might want to bring an umbrella!' : ''}`;
};

const generateWindResponse = (weather: WeatherData): string => {
  const { current, daily, location } = weather;
  const windDir = getWindDirection(current.windDirection);
  
  let windAdvice = '';
  if (current.windGusts > 50) {
    windAdvice = '⚠️ Strong gusts today - secure loose items outdoors!';
  } else if (current.windSpeed > 30) {
    windAdvice = 'Moderate winds - might affect outdoor activities.';
  } else {
    windAdvice = 'Light winds - good conditions for outdoor activities.';
  }
  
  return `**Wind conditions in ${location}** 💨

**Current:**
• Speed: **${Math.round(current.windSpeed)} km/h** from ${windDir}
• Gusts: up to **${Math.round(current.windGusts)} km/h**

${windAdvice}

**This week's max winds:**
${daily.slice(0, 5).map(d => 
  `• ${formatDate(d.date)}: ${Math.round(d.windSpeedMax)} km/h (gusts ${Math.round(d.windGustsMax)} km/h)`
).join('\n')}`;
};

const generateHumidityResponse = (weather: WeatherData): string => {
  const { current, hourly, location } = weather;
  
  let comfort = '';
  if (current.humidity < 30) {
    comfort = 'Very dry - consider using moisturizer.';
  } else if (current.humidity < 50) {
    comfort = 'Comfortable humidity levels.';
  } else if (current.humidity < 70) {
    comfort = 'Moderate humidity - slightly muggy.';
  } else {
    comfort = 'High humidity - may feel uncomfortable.';
  }
  
  return `**Humidity in ${location}** 💧

**Current:** ${current.humidity}%
${comfort}

**Next 12 hours:**
${hourly.slice(0, 12).filter((_, i) => i % 3 === 0).map(h => 
  `• ${formatTime(h.time)}: ${h.humidity}%`
).join('\n')}`;
};

const generateUVResponse = (weather: WeatherData): string => {
  const { daily, location } = weather;
  const today = daily[0];
  
  let uvAdvice = '';
  if (today.uvIndex >= 11) {
    uvAdvice = '☠️ **Extreme UV!** Avoid sun exposure, stay indoors during midday.';
  } else if (today.uvIndex >= 8) {
    uvAdvice = '🔴 **Very high UV!** Wear SPF 50+, hat, and sunglasses. Limit sun exposure.';
  } else if (today.uvIndex >= 6) {
    uvAdvice = '🟠 **High UV.** Wear SPF 30+, seek shade during midday hours.';
  } else if (today.uvIndex >= 3) {
    uvAdvice = '🟡 **Moderate UV.** Wear sunscreen if outside for extended periods.';
  } else {
    uvAdvice = '🟢 **Low UV.** Minimal sun protection needed.';
  }
  
  return `**UV Index for ${location}** ☀️

**Today:** UV Index **${Math.round(today.uvIndex)}**
${uvAdvice}

**This week:**
${daily.slice(0, 7).map(d => {
  const level = d.uvIndex >= 8 ? '🔴' : d.uvIndex >= 6 ? '🟠' : d.uvIndex >= 3 ? '🟡' : '🟢';

  return `• ${formatDate(d.date)}: ${level} ${Math.round(d.uvIndex)}`;
}).join('\n')}`;
};

const generateSunriseSunsetResponse = (weather: WeatherData): string => {
  const { daily, location } = weather;
  const today = daily[0];
  const daylightHours = Math.round(today.daylightDuration / 3600 * 10) / 10;
  
  return `**Sunrise & Sunset in ${location}** 🌅

**Today:**
• 🌅 Sunrise: **${formatTime(today.sunrise)}**
• 🌇 Sunset: **${formatTime(today.sunset)}**
• ☀️ Daylight: **${daylightHours} hours**

**This week:**
${daily.slice(0, 7).map(d => {
  const hours = Math.round(d.daylightDuration / 3600 * 10) / 10;

  return `• ${formatDate(d.date)}: 🌅 ${formatTime(d.sunrise)} → 🌇 ${formatTime(d.sunset)} (${hours}h)`;
}).join('\n')}`;
};

const generateDayResponse = (weather: WeatherData, dayIndex: number, label: string): string => {
  const day = weather.daily[dayIndex];
  if (!day) {
    return `Sorry, I don't have forecast data for ${label}. I can only show forecasts up to 7 days ahead.`;
  }
  const weatherInfo = getWeatherInfo(day.weatherCode);
  const windDir = getWindDirection(day.windDirection);

  return `**${label} forecast for ${weather.location}** ${weatherInfo.icon}

**${weatherInfo.description}**

• 🌡️ **Temperature:** ${Math.round(day.minTemp)}°C to ${Math.round(day.maxTemp)}°C
• 🤗 **Feels like:** ${Math.round(day.apparentMinTemp)}°C to ${Math.round(day.apparentMaxTemp)}°C
• 🌧️ **Rain chance:** ${day.precipitationProbability}%
• 💨 **Wind:** up to ${Math.round(day.windSpeedMax)} km/h from ${windDir}
• ☀️ **UV Index:** ${Math.round(day.uvIndex)}
• 🌅 **Sunrise:** ${formatTime(day.sunrise)}
• 🌇 **Sunset:** ${formatTime(day.sunset)}`;
};

const generateTomorrowResponse = (weather: WeatherData): string => {
  return generateDayResponse(weather, 1, "Tomorrow's");
};

const generateDayAfterTomorrowResponse = (weather: WeatherData): string => {
  return generateDayResponse(weather, 2, "Day after tomorrow's");
};

const generateSpecificDateResponse = (weather: WeatherData, specificDate: string): string => {
  const targetDate = new Date(specificDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return `Sorry, I can't show weather for past dates. Please ask about today or future dates.`;
  }

  if (diffDays > 6) {
    return `Sorry, I can only show forecasts up to 7 days ahead. The date ${formatDate(specificDate)} is too far in the future.`;
  }

  const dateLabel = formatDate(specificDate);
  return generateDayResponse(weather, diffDays, dateLabel);
};

const generateWeekResponse = (weather: WeatherData): string => {
  return `**7-Day Forecast for ${weather.location}** 📅

${weather.daily.map(d => {
  const info = getWeatherInfo(d.weatherCode);

  return `**${formatDate(d.date)}** ${info.icon}
${info.description} | ${Math.round(d.minTemp)}° — ${Math.round(d.maxTemp)}° | 🌧️ ${d.precipitationProbability}%`;
}).join('\n\n')}`;
};

const generateHourlyResponse = (weather: WeatherData): string => {
  return `**Hourly forecast for ${weather.location}** ⏰

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
  aiSpecificDate?: string | null
): string => {
  // Handle specific date first
  if (aiSpecificDate) {
    return generateSpecificDateResponse(weather, aiSpecificDate);
  }

  // Handle day after tomorrow
  if (aiTimeframe === 'day_after_tomorrow') {
    return generateDayAfterTomorrowResponse(weather);
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
        responses.push(generateTomorrowResponse(weather));
        break;
      case 'week':
        responses.push(generateWeekResponse(weather));
        break;
      case 'hourly':
        responses.push(generateHourlyResponse(weather));
        break;
      case 'rain':
        responses.push(generateRainResponse(weather));
        break;
      case 'wind':
        responses.push(generateWindResponse(weather));
        break;
      case 'humidity':
        responses.push(generateHumidityResponse(weather));
        break;
      case 'uv':
        responses.push(generateUVResponse(weather));
        break;
      case 'sunrise_sunset':
        responses.push(generateSunriseSunsetResponse(weather));
        break;
      case 'temperature':
        responses.push(generateTemperatureResponse(weather));
        break;
      case 'current_weather':
      default:
        responses.push(generateCurrentWeatherResponse(weather));
        break;
    }
  }
  
  const uniqueResponses = [...new Set(responses)];

  return uniqueResponses.join('\n\n---\n\n');
};

export const generateErrorResponse = (error: string): string => {
  const errorResponses: Record<string, string> = {
    'location_not_found': "I couldn't find that location. Could you please check the spelling or try a different city name? You can also try adding the country (e.g., 'Paris, France').",
    'no_location': "I'd love to help with the weather! Please tell me which city you'd like to know about. For example, try asking 'What's the weather in London?' or 'Will it rain in Tokyo?'",
    'api_error': "I'm having trouble fetching weather data right now. Please try again in a moment.",
  };
  
  return errorResponses[error] || "Something went wrong. Please try again!";
};

