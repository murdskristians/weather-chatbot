import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true,
});

export interface ParsedQuery {
  location: string | null;
  intent: 'current_weather' | 'temperature' | 'forecast' | 'rain' | 'wind' | 'humidity' | 'uv' | 'sunrise_sunset' | 'tomorrow' | 'hourly' | 'general';
  timeframe: 'now' | 'today' | 'tomorrow' | 'day_after_tomorrow' | 'week' | 'hourly' | null;
  specificDate: string | null; // ISO date format YYYY-MM-DD
}

export const parseQueryWithAI = async (query: string): Promise<ParsedQuery | null> => {
  try {
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
- "cik būs parīt?" (Latvian) → {"location": null, "intent": "temperature", "timeframe": "day_after_tomorrow", "specificDate": null}
- "Cik būs grādi Rīgā 08.01.2026?" → {"location": "Riga", "intent": "temperature", "timeframe": null, "specificDate": "2026-01-08"}
- "Какая температура в Киеве?" (Russian: What's the temperature in Kyiv?) → {"location": "Kyiv", "intent": "temperature", "timeframe": "now", "specificDate": null}
- "Погода в Москве завтра" (Russian: Weather in Moscow tomorrow) → {"location": "Moscow", "intent": "current_weather", "timeframe": "tomorrow", "specificDate": null}
- "Будет ли дождь в Риге?" (Russian: Will it rain in Riga?) → {"location": "Riga", "intent": "rain", "timeframe": "now", "specificDate": null}
- "Яка погода в Києві?" (Ukrainian: What's the weather in Kyiv?) → {"location": "Kyiv", "intent": "current_weather", "timeframe": "now", "specificDate": null}
- "Температура у Львові завтра" (Ukrainian: Temperature in Lviv tomorrow) → {"location": "Lviv", "intent": "temperature", "timeframe": "tomorrow", "specificDate": null}
- "Чи буде дощ в Одесі?" (Ukrainian: Will it rain in Odesa?) → {"location": "Odesa", "intent": "rain", "timeframe": "now", "specificDate": null}

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
    if (!content) return null;

    const parsed = JSON.parse(content);
    return {
      location: parsed.location || null,
      intent: parsed.intent || 'general',
      timeframe: parsed.timeframe || null,
      specificDate: parsed.specificDate || null,
    };
  } catch (error) {
    console.error('AI query parsing error:', error);
    return null;
  }
};

export const isGroqConfigured = (): boolean => {
  return !!import.meta.env.VITE_GROQ_API_KEY;
};
