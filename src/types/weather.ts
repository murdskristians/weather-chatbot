export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  weatherData?: WeatherData | null;
  isLoading?: boolean;
}

export interface WeatherData {
  location: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone: string;
  current: CurrentWeather;
  daily: DailyForecast[];
  hourly: HourlyForecast[];
}

export interface CurrentWeather {
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  windGusts: number;
  weatherCode: number;
  precipitation: number;
  rain: number;
  cloudCover: number;
  pressure: number;
  isDay: boolean;
}

export interface DailyForecast {
  date: string;
  maxTemp: number;
  minTemp: number;
  apparentMaxTemp: number;
  apparentMinTemp: number;
  weatherCode: number;
  precipitationSum: number;
  precipitationProbability: number;
  precipitationHours: number;
  sunrise: string;
  sunset: string;
  daylightDuration: number;
  uvIndex: number;
  windSpeedMax: number;
  windGustsMax: number;
  windDirection: number;
}

export interface HourlyForecast {
  time: string;
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  dewPoint: number;
  precipitationProbability: number;
  precipitation: number;
  rain: number;
  snowfall: number;
  weatherCode: number;
  cloudCover: number;
  visibility: number;
  windSpeed: number;
  windDirection: number;
  windGusts: number;
}

export interface GeoLocation {
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string;
  timezone: string;
}
