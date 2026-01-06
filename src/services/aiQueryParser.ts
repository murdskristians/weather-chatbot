export interface ParsedQuery {
  location: string | null;
  intent: 'current_weather' | 'temperature' | 'forecast' | 'rain' | 'wind' | 'humidity' | 'uv' | 'sunrise_sunset' | 'tomorrow' | 'hourly' | 'general';
  timeframe: 'now' | 'today' | 'tomorrow' | 'day_after_tomorrow' | 'week' | 'hourly' | null;
  specificDate: string | null;
}

export const parseQueryWithAI = async (query: string): Promise<ParsedQuery | null> => {
  try {
    const response = await fetch('/.netlify/functions/parse-query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      console.error('Parse query API error:', response.status);
      return null;
    }

    const data = await response.json();

    if (!data) return null;

    return {
      location: data.location || null,
      intent: data.intent || 'general',
      timeframe: data.timeframe || null,
      specificDate: data.specificDate || null,
    };
  } catch (error) {
    console.error('AI query parsing error:', error);
    return null;
  }
};

export const isGroqConfigured = (): boolean => {
  // In production (Netlify), always enabled - the serverless function has the API key
  // In development with pnpm dev, this will fail but fall back to regex parsing
  return true;
};
