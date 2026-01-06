import { WeatherData } from '../types/weather';
import { Language } from '../utils/translations';
import { getWeatherInfo } from '../utils/weatherCodes';

export const generateWeatherInsight = async (
  weather: WeatherData,
  _intent: string | null,
  language: Language
): Promise<string | null> => {
  try {
    const weatherInfo = getWeatherInfo(weather.current.weatherCode);
    const today = weather.daily[0];
    const rainProb = today?.precipitationProbability || 0;
    const uvIndex = today?.uvIndex || 0;

    const weatherSummary = `
Temperature: ${Math.round(weather.current.temperature)}°C (feels like ${Math.round(weather.current.apparentTemperature)}°C)
Conditions: ${weatherInfo.description}
Wind: ${Math.round(weather.current.windSpeed)} km/h
Rain probability: ${rainProb}%
UV index: ${Math.round(uvIndex)}
`.trim();

    const response = await fetch('/.netlify/functions/generate-insight', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ weatherSummary, language }),
    });

    if (!response.ok) {
      console.error('Generate insight API error:', response.status);
      return null;
    }

    const data = await response.json();
    return data.insight || null;
  } catch (error) {
    console.error('AI insight generation error:', error);
    return null;
  }
};

export const isInsightEnabled = (): boolean => {
  // In production (Netlify), always enabled - the serverless function has the API key
  return true;
};
