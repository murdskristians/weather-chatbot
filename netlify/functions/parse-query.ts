import type { Handler } from '@netlify/functions';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const handler: Handler = async (event) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { query } = JSON.parse(event.body || '{}');

    if (!query) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Query is required' }),
      };
    }

    const response = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [
        {
          role: 'system',
          content: `You are a weather query parser. Extract location, intent, timeframe and specific date from user queries in ANY language.

Today's date is: ${new Date().toISOString().split('T')[0]}

IMPORTANT vocabulary by language:

Latvian:
- "Rīgā", "Rīga", "Riga" = Riga (capital of Latvia)
- "šodien" = today, "rīt" = tomorrow, "parīt" = day after tomorrow
- "šonedēļ" = this week

Russian:
- "Москва", "Москве" = Moscow
- "Киев", "Киеве" = Kyiv (capital of Ukraine)
- "Санкт-Петербург", "Петербурге" = Saint Petersburg
- "сегодня" = today, "завтра" = tomorrow, "послезавтра" = day after tomorrow
- "погода" = weather, "температура" = temperature, "дождь" = rain

Ukrainian:
- "Київ", "Києві" = Kyiv (capital of Ukraine)
- "Львів", "Львові" = Lviv
- "Одеса", "Одесі" = Odesa
- "Харків", "Харкові" = Kharkiv
- "сьогодні" = today, "завтра" = tomorrow, "післязавтра" = day after tomorrow
- "погода" = weather, "температура" = temperature, "дощ" = rain

IMPORTANT: Pay attention to Cyrillic letters and grammatical cases (nominative vs prepositional). City names may have different endings based on grammar.

Return ONLY valid JSON with this exact structure:
{
  "location": "city name" or null if no location mentioned,
  "intent": one of: "current_weather", "temperature", "forecast", "rain", "wind", "humidity", "uv", "sunrise_sunset", "tomorrow", "hourly", "general",
  "timeframe": one of: "now", "today", "tomorrow", "day_after_tomorrow", "week", "hourly", or null,
  "specificDate": "YYYY-MM-DD" format if a specific date is mentioned, otherwise null
}

Examples:
- "What's the weather in Tokyo?" → {"location": "Tokyo", "intent": "current_weather", "timeframe": "now", "specificDate": null}
- "Will it rain tomorrow in Paris?" → {"location": "Paris", "intent": "rain", "timeframe": "tomorrow", "specificDate": null}
- "Cik būs rīt grādi Rīgā?" (Latvian) → {"location": "Riga", "intent": "temperature", "timeframe": "tomorrow", "specificDate": null}

Return ONLY the JSON object, no other text.`,
        },
        {
          role: 'user',
          content: query,
        },
      ],
      temperature: 0,
      max_tokens: 150,
    });

    const content = response.choices[0]?.message?.content?.trim();
    if (!content) {
      return {
        statusCode: 200,
        body: JSON.stringify(null),
      };
    }

    const parsed = JSON.parse(content);
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        location: parsed.location || null,
        intent: parsed.intent || 'general',
        timeframe: parsed.timeframe || null,
        specificDate: parsed.specificDate || null,
      }),
    };
  } catch (error) {
    console.error('Parse query error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to parse query' }),
    };
  }
};
