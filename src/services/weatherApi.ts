import { WeatherData, GeoLocation } from '../types/weather';

const WEATHER_API = 'https://api.open-meteo.com/v1/forecast';

export const fetchWeatherData = async (location: GeoLocation): Promise<WeatherData> => {
  const params = new URLSearchParams({
    latitude: location.latitude.toString(),
    longitude: location.longitude.toString(),
    current: [
      'temperature_2m',
      'relative_humidity_2m',
      'apparent_temperature',
      'is_day',
      'wind_speed_10m',
      'wind_direction_10m',
      'wind_gusts_10m',
      'precipitation',
      'rain',
      'weather_code',
      'cloud_cover',
      'pressure_msl',
    ].join(','),
    hourly: [
      'temperature_2m',
      'relative_humidity_2m',
      'dew_point_2m',
      'apparent_temperature',
      'precipitation_probability',
      'precipitation',
      'rain',
      'snowfall',
      'weather_code',
      'cloud_cover',
      'visibility',
      'wind_speed_10m',
      'wind_direction_10m',
      'wind_gusts_10m',
    ].join(','),
    daily: [
      'weather_code',
      'temperature_2m_max',
      'temperature_2m_min',
      'apparent_temperature_max',
      'apparent_temperature_min',
      'sunrise',
      'sunset',
      'daylight_duration',
      'uv_index_max',
      'precipitation_sum',
      'precipitation_hours',
      'precipitation_probability_max',
      'wind_speed_10m_max',
      'wind_gusts_10m_max',
      'wind_direction_10m_dominant',
    ].join(','),
    timezone: location.timezone || 'auto',
    forecast_days: '7',
  });

  const response = await fetch(`${WEATHER_API}?${params}`);
  
  if (!response.ok) {
    throw new Error('Weather data request failed');
  }
  
  const data = await response.json();

  return {
    location: location.name,
    country: location.country,
    latitude: location.latitude,
    longitude: location.longitude,
    timezone: data.timezone,
    current: {
      temperature: data.current.temperature_2m,
      apparentTemperature: data.current.apparent_temperature,
      humidity: data.current.relative_humidity_2m,
      windSpeed: data.current.wind_speed_10m,
      windDirection: data.current.wind_direction_10m,
      windGusts: data.current.wind_gusts_10m,
      weatherCode: data.current.weather_code,
      precipitation: data.current.precipitation,
      rain: data.current.rain,
      cloudCover: data.current.cloud_cover,
      pressure: data.current.pressure_msl,
      isDay: data.current.is_day === 1,
    },
    daily: data.daily.time.map((date: string, i: number) => ({
      date,
      maxTemp: data.daily.temperature_2m_max[i],
      minTemp: data.daily.temperature_2m_min[i],
      apparentMaxTemp: data.daily.apparent_temperature_max[i],
      apparentMinTemp: data.daily.apparent_temperature_min[i],
      weatherCode: data.daily.weather_code[i],
      precipitationSum: data.daily.precipitation_sum[i],
      precipitationProbability: data.daily.precipitation_probability_max[i],
      precipitationHours: data.daily.precipitation_hours[i],
      sunrise: data.daily.sunrise[i],
      sunset: data.daily.sunset[i],
      daylightDuration: data.daily.daylight_duration[i],
      uvIndex: data.daily.uv_index_max[i],
      windSpeedMax: data.daily.wind_speed_10m_max[i],
      windGustsMax: data.daily.wind_gusts_10m_max[i],
      windDirection: data.daily.wind_direction_10m_dominant[i],
    })),
    hourly: data.hourly.time.slice(0, 48).map((time: string, i: number) => ({
      time,
      temperature: data.hourly.temperature_2m[i],
      apparentTemperature: data.hourly.apparent_temperature[i],
      humidity: data.hourly.relative_humidity_2m[i],
      dewPoint: data.hourly.dew_point_2m[i],
      precipitationProbability: data.hourly.precipitation_probability[i],
      precipitation: data.hourly.precipitation[i],
      rain: data.hourly.rain[i],
      snowfall: data.hourly.snowfall[i],
      weatherCode: data.hourly.weather_code[i],
      cloudCover: data.hourly.cloud_cover[i],
      visibility: data.hourly.visibility[i],
      windSpeed: data.hourly.wind_speed_10m[i],
      windDirection: data.hourly.wind_direction_10m[i],
      windGusts: data.hourly.wind_gusts_10m[i],
    })),
  };
};

