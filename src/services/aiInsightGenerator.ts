import Groq from 'groq-sdk';
import { WeatherData } from '../types/weather';
import { Language } from '../utils/translations';
import { getWeatherInfo } from '../utils/weatherCodes';

const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true,
});

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

export const generateWeatherInsight = async (
  weather: WeatherData,
  intent: string | null,
  language: Language
): Promise<string | null> => {
  if (!import.meta.env.VITE_GROQ_API_KEY) {
    return null;
  }

  try {
    const weatherInfo = getWeatherInfo(weather.current.weatherCode);
    const today = weather.daily[0];
    const rainProb = today?.precipitationProbability || 0;
    const uvIndex = today?.uvIndex || 0;
    const langInfo = languageInstructions[language];

    const weatherSummary = `
Temperature: ${Math.round(weather.current.temperature)}°C (feels like ${Math.round(weather.current.apparentTemperature)}°C)
Conditions: ${weatherInfo.description}
Wind: ${Math.round(weather.current.windSpeed)} km/h
Rain probability: ${rainProb}%
UV index: ${Math.round(uvIndex)}
`.trim();

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

    const insight = response.choices[0]?.message?.content?.trim();
    return insight || null;
  } catch (error) {
    console.error('AI insight generation error:', error);
    return null;
  }
};

export const isInsightEnabled = (): boolean => {
  return !!import.meta.env.VITE_GROQ_API_KEY;
};
