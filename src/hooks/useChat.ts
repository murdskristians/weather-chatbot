import { useState, useCallback } from 'react';
import { Message, WeatherData, GeoLocation } from '../types/weather';
import { geocodeLocation, extractLocationFromQuery } from '../services/geocoding';
import { fetchWeatherData } from '../services/weatherApi';
import { generateWeatherResponse, generateErrorResponse, Language } from '../services/ragEngine';
import { parseQueryWithAI, isGroqConfigured } from '../services/aiQueryParser';
import { getTranslations } from '../utils/translations';

const generateId = () => Math.random().toString(36).substring(2, 15);

export const useChat = () => {
  const [language, setLanguage] = useState<Language>('en');
  const tr = getTranslations(language);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: generateId(),
      role: 'assistant',
      content: tr.welcomeMessage,
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
      let locationQuery: string | null = null;
      let aiIntent: string | null = null;
      let aiTimeframe: string | null = null;
      let aiSpecificDate: string | null = null;

      // Try AI parsing first if Groq is configured
      if (isGroqConfigured()) {
        const aiParsed = await parseQueryWithAI(query);
        if (aiParsed) {
          locationQuery = aiParsed.location;
          aiIntent = aiParsed.intent;
          aiTimeframe = aiParsed.timeframe;
          aiSpecificDate = aiParsed.specificDate;
        }
      }

      // Fall back to regex-based extraction for location
      if (!locationQuery) {
        locationQuery = extractLocationFromQuery(query);
      }

      let location: GeoLocation | null = null;

      if (locationQuery) {
        location = await geocodeLocation(locationQuery);
      } else if (lastLocation) {
        location = lastLocation;
      }

      if (!location) {
        const errorMessage = locationQuery
          ? generateErrorResponse('location_not_found', language)
          : generateErrorResponse('no_location', language);
        addMessage('assistant', errorMessage);

        return;
      }

      setLastLocation(location);

      const weatherData = await fetchWeatherData(location);

      const response = generateWeatherResponse(query, weatherData, aiIntent, aiTimeframe, aiSpecificDate, language);

      addMessage('assistant', response, weatherData);

    } catch (error) {
      console.error('Error processing query:', error);
      addMessage('assistant', generateErrorResponse('api_error', language));
    } finally {
      setIsLoading(false);
    }
  }, [addMessage, lastLocation, language]);

  const clearChat = useCallback(() => {
    const currentTr = getTranslations(language);
    setMessages([
      {
        id: generateId(),
        role: 'assistant',
        content: currentTr.chatCleared,
        timestamp: new Date(),
      },
    ]);
    setLastLocation(null);
  }, [language]);

  const userMessageHistory = messages
    .filter((m) => m.role === 'user')
    .map((m) => m.content);

  return {
    messages,
    isLoading,
    sendMessage: processQuery,
    clearChat,
    lastLocation,
    userMessageHistory,
    language,
    setLanguage,
  };
};

