import type { Handler } from '@netlify/functions';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

type Language = 'en' | 'lv' | 'ru' | 'uk';

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

export const handler: Handler = async (event) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { weatherSummary, language } = JSON.parse(event.body || '{}');

    if (!weatherSummary || !language) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'weatherSummary and language are required' }),
      };
    }

    const langInfo = languageInstructions[language as Language] || languageInstructions.en;

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

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ insight: insight || null }),
    };
  } catch (error) {
    console.error('Generate insight error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to generate insight', insight: null }),
    };
  }
};
