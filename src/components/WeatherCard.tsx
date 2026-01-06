import { useState } from 'react';
import { WeatherData } from '../types/weather';
import { getWeatherInfo, formatTime, formatDate } from '../utils/weatherCodes';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface WeatherCardProps {
  weather: WeatherData;
}

const WeatherCard = ({ weather }: WeatherCardProps) => {
  const [showHourly, setShowHourly] = useState(false);
  const currentInfo = getWeatherInfo(weather.current.weatherCode);

  return (
    <div className="weather-card">
      <div className="weather-card-header">
        <div className="weather-main">
          <span className="weather-icon-large">{currentInfo.icon}</span>
          <div className="weather-temp-main">
            <span className="temp-value">{Math.round(weather.current.temperature)}°</span>
            <span className="temp-unit">C</span>
          </div>
        </div>
        <div className="weather-location">
          <div className="location-name">{weather.location}</div>
          <div className="location-country">{weather.country}</div>
        </div>
      </div>

      <div className="weather-forecast-mini">
        {weather.daily.slice(0, 5).map((day, i) => {
          const info = getWeatherInfo(day.weatherCode);

          return (
            <div key={i} className="forecast-day">
              <div className="forecast-day-name">
                {i === 0 ? 'Today' : formatDate(day.date).split(',')[0]}
              </div>
              <div className="forecast-day-icon">{info.icon}</div>
              <div className="forecast-day-temps">
                <span className="temp-high">{Math.round(day.maxTemp)}°</span>
                <span className="temp-low">{Math.round(day.minTemp)}°</span>
              </div>
            </div>
          );
        })}
      </div>

      <button 
        className="weather-expand-button"
        onClick={() => setShowHourly(!showHourly)}
      >
        {showHourly ? (
          <>Hide hourly <ChevronUp size={16} /></>
        ) : (
          <>Show hourly <ChevronDown size={16} /></>
        )}
      </button>

      {showHourly && (
        <div className="weather-hourly">
          {weather.hourly.slice(0, 12).map((hour, i) => {
            const info = getWeatherInfo(hour.weatherCode);

            return (
              <div key={i} className="hourly-item">
                <div className="hourly-time">{formatTime(hour.time)}</div>
                <div className="hourly-icon">{info.icon}</div>
                <div className="hourly-temp">{Math.round(hour.temperature)}°</div>
                <div className="hourly-rain">💧 {hour.precipitationProbability}%</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default WeatherCard;

