import { GeoLocation } from '../types/weather';

const GEOCODING_API = 'https://geocoding-api.open-meteo.com/v1/search';

// Normalize city names to their standard English form for better geocoding results
const normalizeCity = (city: string): string => {
  const normalizations: Record<string, string> = {
    // Ukrainian cities (various grammatical cases)
    'одеса': 'Odesa',
    'одесі': 'Odesa',
    'одесу': 'Odesa',
    'київ': 'Kyiv',
    'києві': 'Kyiv',
    'києва': 'Kyiv',
    'львів': 'Lviv',
    'львові': 'Lviv',
    'львова': 'Lviv',
    'харків': 'Kharkiv',
    'харкові': 'Kharkiv',
    'харкова': 'Kharkiv',
    'дніпро': 'Dnipro',
    'дніпрі': 'Dnipro',
    'запоріжжя': 'Zaporizhzhia',
    'запоріжжі': 'Zaporizhzhia',
    // Russian city names (various grammatical cases)
    'москва': 'Moscow',
    'москве': 'Moscow',
    'москву': 'Moscow',
    'киев': 'Kyiv',
    'киеве': 'Kyiv',
    'санкт-петербург': 'Saint Petersburg',
    'петербурге': 'Saint Petersburg',
    'петербург': 'Saint Petersburg',
    'одесса': 'Odesa',
    'одессе': 'Odesa',
    // Latvian cities
    'rīga': 'Riga',
    'rīgā': 'Riga',
    'rīgai': 'Riga',
    'liepāja': 'Liepaja',
    'liepājā': 'Liepaja',
    'daugavpils': 'Daugavpils',
    'daugavpilī': 'Daugavpils',
    'ventspils': 'Ventspils',
    'ventspilī': 'Ventspils',
    'jelgava': 'Jelgava',
    'jelgavā': 'Jelgava',
    'jūrmala': 'Jurmala',
    'jūrmalā': 'Jurmala',
  };

  const lowerCity = city.toLowerCase().trim();
  return normalizations[lowerCity] || city;
};

export const geocodeLocation = async (query: string): Promise<GeoLocation | null> => {
  const normalizedQuery = normalizeCity(query);

  try {
    const response = await fetch(
      `${GEOCODING_API}?name=${encodeURIComponent(normalizedQuery)}&count=1&language=en&format=json`
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
    // English patterns
    /weather\s+(?:in|at|for)\s+(.+?)(?:\?|$|today|tomorrow|this week|next)/i,
    /(?:what's|what is|how's|how is)\s+(?:the\s+)?weather\s+(?:like\s+)?(?:in|at|for)\s+(.+?)(?:\?|$)/i,
    /\b(?:in|at|for)\s+(.+?)(?:\s+weather|\?|$)/i,
    /^(.+?)\s+weather/i,
    /forecast\s+\b(?:for|in)\s+(.+)$/i,
    /temperature\s+\b(?:in|at|for)\s+(.+)$/i,
    /rain\s+\b(?:in|at|for)\s+(.+)$/i,

    // Latvian patterns
    // "kāds laiks Rīgā" / "kāds laiks ir Rīgā"
    /k[aā]ds\s+laiks\s+(?:ir\s+)?(.+)/i,
    // "laika prognoze Rīgai" / "laika prognoze Rīgā"
    /laika\s+prognoze\s+(.+)/i,
    // "laikapstākļi Rīgā"
    /laikapst[aā]k[lļ]i\s+(.+)/i,
    // "temperatūra Rīgā"
    /temperat[uū]ra\s+(.+)/i,
    // "cik grādu Rīgā" / "cik grādu ir Rīgā"
    /cik\s+gr[aā]du\s+(?:ir\s+)?(.+)/i,
    // "vai līs Rīgā" / "vai līst Rīgā"
    /vai\s+l[iī][sš]t?\s+(.+)/i,
    // "vai būs lietus Rīgā"
    /vai\s+b[uū]s\s+lietus\s+(.+)/i,
    // "parādi laiku Rīgā" / "parādi laiku Rīgai"
    /par[aā]di\s+laiku\s+(.+)/i,
    // "kāda temperatūra Rīgā"
    /k[aā]da\s+temperat[uū]ra\s+(.+)/i,
  ];

  // Latvian temporal words to remove
  const latvianTemporalWords = /\s+(šodien|rīt|šonedēļ|nākamnedēļ|tagad|pašlaik)$/i;

  for (const pattern of patterns) {
    const match = query.match(pattern);
    if (match?.[1]) {
      let location = match[1].trim();
      location = location.replace(/[?,!.]$/, '').trim();
      location = location.replace(/\s+(today|tomorrow|this week|next week|right now|currently)$/i, '').trim();
      location = location.replace(latvianTemporalWords, '').trim();
      if (location.length > 1) {
        return location;
      }
    }
  }

  return null;
};

