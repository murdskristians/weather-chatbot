import Groq from 'groq-sdk';
import { WeatherData } from '../types/weather';
import { Language } from '../utils/translations';
import { getWeatherInfo } from '../utils/weatherCodes';

// Use direct Groq SDK in development, serverless function in production
const isDev = import.meta.env.DEV && import.meta.env.VITE_GROQ_API_KEY;

const groq = isDev ? new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true,
}) : null;

const languageInstructions: Record<Language, { name: string; examples: string }> = {
  en: {
    name: 'English',
    examples: `Examples:
- "Perfect day for outdoor activities! Don't forget sunscreen."
- "Looks like rain is coming - grab an umbrella before heading out."
- "Chilly but clear today. A warm jacket will keep you comfortable."`,
  },
  lv: {
    name: 'Latvian (latviešu valodā)',
    examples: `Piemēri latviešu valodā:
- "Lieliska diena aktivitātēm ārā! Neaizmirsti sauļošanās krēmu."
- "Gaidāms lietus - paņem līdzi lietussargu."
- "Vēss, bet skaidrs laiks. Silta jaka noderēs."
- "Sniegots laiks - ģērbies silti un uzmanies uz slideniem ceļiem."`,
  },
  ru: {
    name: 'Russian (на русском языке)',
    examples: `Примеры на русском:
- "Отличный день для прогулки! Не забудьте солнцезащитный крем."
- "Ожидается дождь - захватите зонт."
- "Прохладно, но ясно. Тёплая куртка пригодится."
- "Снежная погода - одевайтесь тепло и осторожно на дорогах."`,
  },
  uk: {
    name: 'Ukrainian (українською мовою)',
    examples: `Приклади українською:
- "Чудовий день для прогулянки! Не забудьте сонцезахисний крем."
- "Очікується дощ - візьміть парасольку."
- "Прохолодно, але ясно. Тепла куртка знадобиться."
- "Сніжна погода - одягайтесь тепло та обережно на дорогах."`,
  },
};

const generateInsightLocal = async (weatherSummary: string, language: Language): Promise<string | null> => {
  if (!groq) return null;

  try {
    const langInfo = languageInstructions[language] || languageInstructions.en;

    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: `You are a weather assistant. Write a short, friendly weather tip in ${langInfo.name}.

IMPORTANT RULES:
- Write ONLY 1-2 sentences
- Write ONLY in ${langInfo.name} - no other language
- Give practical advice (umbrella, jacket, sunscreen, etc.)
- Be natural and conversational
- Do NOT include numbers or repeat weather data

${langInfo.examples}`,
        },
        {
          role: 'user',
          content: weatherSummary,
        },
      ],
      temperature: 0.6,
      max_tokens: 80,
    });

    return response.choices[0]?.message?.content?.trim() || null;
  } catch (error) {
    console.error('Local AI insight generation error:', error);
    return null;
  }
};

const generateInsightServerless = async (weatherSummary: string, language: Language): Promise<string | null> => {
  try {
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
    console.error('Serverless AI insight generation error:', error);
    return null;
  }
};

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

    if (isDev) {
      return generateInsightLocal(weatherSummary, language);
    }
    return generateInsightServerless(weatherSummary, language);
  } catch (error) {
    console.error('AI insight generation error:', error);
    return null;
  }
};

export const isInsightEnabled = (): boolean => {
  return true;
};
