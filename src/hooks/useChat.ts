import { useState, useCallback } from 'react';
import { Message, WeatherData, GeoLocation } from '../types/weather';
import { geocodeLocation, extractLocationFromQuery } from '../services/geocoding';
import { fetchWeatherData } from '../services/weatherApi';
import { generateWeatherResponse, generateErrorResponse } from '../services/ragEngine';

const generateId = () => Math.random().toString(36).substring(2, 15);

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: generateId(),
      role: 'assistant',
      content: "Hi! I'm your weather assistant. Ask me anything about the weather in any city around the world! 🌍\n\nTry questions like:\n• \"What's the weather in Tokyo?\"\n• \"Will it rain in London tomorrow?\"\n• \"Show me the forecast for New York this week\"\n• \"What's the UV index in Sydney?\"",
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastLocation, setLastLocation] = useState<GeoLocation | null>(null);

  const addMessage = useCallback((role: 'user' | 'assistant', content: string, weatherData?: WeatherData | null) => {
    const newMessage: Message = {
      id: generateId(),
      role,
      content,
      timestamp: new Date(),
      weatherData,
    };
    setMessages((prev) => [...prev, newMessage]);

    return newMessage;
  }, []);

  const processQuery = useCallback(async (query: string) => {
    addMessage('user', query);
    setIsLoading(true);

    try {
      const locationQuery = extractLocationFromQuery(query);
      let location: GeoLocation | null = null;

      if (locationQuery) {
        location = await geocodeLocation(locationQuery);
      } else if (lastLocation) {
        location = lastLocation;
      }

      if (!location) {
        const errorMessage = locationQuery 
          ? generateErrorResponse('location_not_found')
          : generateErrorResponse('no_location');
        addMessage('assistant', errorMessage);

        return;
      }

      setLastLocation(location);

      const weatherData = await fetchWeatherData(location);

      const response = generateWeatherResponse(query, weatherData);

      addMessage('assistant', response, weatherData);

    } catch (error) {
      console.error('Error processing query:', error);
      addMessage('assistant', generateErrorResponse('api_error'));
    } finally {
      setIsLoading(false);
    }
  }, [addMessage, lastLocation]);

  const clearChat = useCallback(() => {
    setMessages([
      {
        id: generateId(),
        role: 'assistant',
        content: "Chat cleared! How can I help you with the weather today? 🌤️",
        timestamp: new Date(),
      },
    ]);
    setLastLocation(null);
  }, []);

  return {
    messages,
    isLoading,
    sendMessage: processQuery,
    clearChat,
    lastLocation,
  };
};

