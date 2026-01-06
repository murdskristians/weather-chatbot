export interface WeatherCodeInfo {
  description: string;
  icon: string;
  severity: 'clear' | 'mild' | 'moderate' | 'severe';
}

export const WEATHER_CODES: Record<number, WeatherCodeInfo> = {
  0: { description: 'Clear sky', icon: '☀️', severity: 'clear' },
  1: { description: 'Mainly clear', icon: '🌤️', severity: 'clear' },
  2: { description: 'Partly cloudy', icon: '⛅', severity: 'mild' },
  3: { description: 'Overcast', icon: '☁️', severity: 'mild' },
  45: { description: 'Foggy', icon: '🌫️', severity: 'mild' },
  48: { description: 'Depositing rime fog', icon: '🌫️', severity: 'mild' },
  51: { description: 'Light drizzle', icon: '🌧️', severity: 'mild' },
  53: { description: 'Moderate drizzle', icon: '🌧️', severity: 'moderate' },
  55: { description: 'Dense drizzle', icon: '🌧️', severity: 'moderate' },
  56: { description: 'Light freezing drizzle', icon: '🌧️', severity: 'moderate' },
  57: { description: 'Dense freezing drizzle', icon: '🌧️', severity: 'severe' },
  61: { description: 'Slight rain', icon: '🌧️', severity: 'mild' },
  63: { description: 'Moderate rain', icon: '🌧️', severity: 'moderate' },
  65: { description: 'Heavy rain', icon: '🌧️', severity: 'severe' },
  66: { description: 'Light freezing rain', icon: '🌧️', severity: 'moderate' },
  67: { description: 'Heavy freezing rain', icon: '🌧️', severity: 'severe' },
  71: { description: 'Slight snow', icon: '🌨️', severity: 'mild' },
  73: { description: 'Moderate snow', icon: '🌨️', severity: 'moderate' },
  75: { description: 'Heavy snow', icon: '❄️', severity: 'severe' },
  77: { description: 'Snow grains', icon: '🌨️', severity: 'mild' },
  80: { description: 'Slight rain showers', icon: '🌦️', severity: 'mild' },
  81: { description: 'Moderate rain showers', icon: '🌦️', severity: 'moderate' },
  82: { description: 'Violent rain showers', icon: '⛈️', severity: 'severe' },
  85: { description: 'Slight snow showers', icon: '🌨️', severity: 'mild' },
  86: { description: 'Heavy snow showers', icon: '❄️', severity: 'severe' },
  95: { description: 'Thunderstorm', icon: '⛈️', severity: 'severe' },
  96: { description: 'Thunderstorm with slight hail', icon: '⛈️', severity: 'severe' },
  99: { description: 'Thunderstorm with heavy hail', icon: '⛈️', severity: 'severe' },
};

export const getWeatherInfo = (code: number): WeatherCodeInfo => {
  return WEATHER_CODES[code] || { description: 'Unknown', icon: '❓', severity: 'mild' };
};

export const getWindDirection = (degrees: number): string => {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degrees / 22.5) % 16;

  return directions[index];
};

export const formatTime = (isoString: string): string => {
  return new Date(isoString).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

export const formatDate = (isoString: string): string => {
  return new Date(isoString).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
};

