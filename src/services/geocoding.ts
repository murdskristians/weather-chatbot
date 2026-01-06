import { GeoLocation } from '../types/weather';

const GEOCODING_API = 'https://geocoding-api.open-meteo.com/v1/search';

export const geocodeLocation = async (query: string): Promise<GeoLocation | null> => {
  try {
    const response = await fetch(
      `${GEOCODING_API}?name=${encodeURIComponent(query)}&count=1&language=en&format=json`
    );

    if (!response.ok) {
      throw new Error('Geocoding request failed');
    }

    const data = await response.json();

    if (data.results && data.results.length > 0) {
      const result = data.results[0];
      return {
        name: result.name,
        latitude: result.latitude,
        longitude: result.longitude,
        country: result.country || '',
        admin1: result.admin1,
        timezone: result.timezone || 'auto',
      };
    }

    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
};

export const extractLocationFromQuery = (query: string): string | null => {
  const patterns = [
    /weather\s+(?:in|at|for)\s+(.+?)(?:\?|$|today|tomorrow|this week|next)/i,
    /(?:what's|what is|how's|how is)\s+(?:the\s+)?weather\s+(?:like\s+)?(?:in|at|for)\s+(.+?)(?:\?|$)/i,
    /\b(?:in|at|for)\s+(.+?)(?:\s+weather|\?|$)/i,
    /^(.+?)\s+weather/i,
    /forecast\s+\b(?:for|in)\s+(.+)$/i,
    /temperature\s+\b(?:in|at|for)\s+(.+)$/i,
    /rain\s+\b(?:in|at|for)\s+(.+)$/i,
  ];

  for (const pattern of patterns) {
    const match = query.match(pattern);
    if (match?.[1]) {
      let location = match[1].trim();
      location = location.replace(/[?,!.]$/, '').trim();
      location = location.replace(/\s+(today|tomorrow|this week|next week|right now|currently)$/i, '').trim();
      if (location.length > 1) {
        return location;
      }
    }
  }

  return null;
};

