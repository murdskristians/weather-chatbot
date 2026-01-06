import { useState, useCallback, useEffect } from 'react';
import { Message, MessageMeta, WeatherData, GeoLocation } from '../types/weather';
import { geocodeLocation, extractLocationFromQuery } from '../services/geocoding';
import { fetchWeatherData } from '../services/weatherApi';
import { generateWeatherResponse, generateErrorResponse, Language } from '../services/ragEngine';
import { parseQueryWithAI, isGroqConfigured } from '../services/aiQueryParser';
import { generateWeatherInsight, isInsightEnabled } from '../services/aiInsightGenerator';
import { getTranslations } from '../utils/translations';

const generateId = () => Math.random().toString(36).substring(2, 15);

const regenerateMessageContent = (
  message: Message,
  language: Language
): string => {
  const tr = getTranslations(language);
  const meta = message.meta;

  if (!meta) {
    return message.content;
  }

  switch (meta.type) {
    case 'welcome':
      return tr.welcomeMessage;
    case 'cleared':
      return tr.chatCleared;
    case 'error':
      return generateErrorResponse(meta.errorType || 'api_error', language);
    case 'weather':
      if (message.weatherData) {
        return generateWeatherResponse(
          meta.query || '',
          message.weatherData,
          meta.aiIntent,
          meta.aiTimeframe,
          meta.aiSpecificDate,
          language
        );
      }
      return message.content;
    default:
      return message.content;
  }
};

export const useChat = () => {
  const [language, setLanguage] = useState<Language>('en');
  const tr = getTranslations(language);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: generateId(),
      role: 'assistant',
      content: tr.welcomeMessage,
      timestamp: new Date(),
      meta: { type: 'welcome' },
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [thinkingMode, setThinkingMode] = useState(true);
  const [lastLocation, setLastLocation] = useState<GeoLocation | null>(null);

  // Re-translate all assistant messages when language changes
  // Note: Only regenerates text content, preserves existing insights
  useEffect(() => {
    const regenerateMessages = async () => {
      const updatedMessages = await Promise.all(
        messages.map(async (msg) => {
          if (msg.role === 'assistant' && msg.meta) {
            // Only regenerate insight if message already has one (preserve toggle state at send time)
            let newInsight = msg.insight;
            if (msg.insight && msg.meta.type === 'weather' && msg.weatherData && isInsightEnabled()) {
              newInsight = await generateWeatherInsight(
                msg.weatherData,
                msg.meta.aiIntent || null,
                language
              );
            }
            return {
              ...msg,
              content: regenerateMessageContent(msg, language),
              insight: newInsight,
            };
          }
          return msg;
        })
      );
      setMessages(updatedMessages);
    };

    regenerateMessages();
  }, [language]);

  const addMessage = useCallback((
    role: 'user' | 'assistant',
    content: string,
    weatherData?: WeatherData | null,
    meta?: MessageMeta,
    insight?: string | null
  ) => {
    const newMessage: Message = {
      id: generateId(),
      role,
      content,
      timestamp: new Date(),
      weatherData,
      meta,
      insight,
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
        const errorType = locationQuery ? 'location_not_found' : 'no_location';
        const errorMessage = generateErrorResponse(errorType, language);
        addMessage('assistant', errorMessage, null, {
          type: 'error',
          errorType,
        });

        return;
      }

      setLastLocation(location);

      const weatherData = await fetchWeatherData(location);

      // Generate AI insight if enabled and thinking mode is on
      let insight: string | null = null;
      if (isInsightEnabled() && thinkingMode) {
        setIsThinking(true);
        setIsLoading(false);
        insight = await generateWeatherInsight(weatherData, aiIntent, language);
        setIsThinking(false);
        setIsLoading(true);
      }

      const response = generateWeatherResponse(
        query,
        weatherData,
        aiIntent,
        aiTimeframe,
        aiSpecificDate,
        language
      );

      addMessage('assistant', response, weatherData, {
        type: 'weather',
        query,
        aiIntent,
        aiTimeframe,
        aiSpecificDate,
      }, insight);

    } catch (error) {
      console.error('Error processing query:', error);
      addMessage('assistant', generateErrorResponse('api_error', language), null, {
        type: 'error',
        errorType: 'api_error',
      });
    } finally {
      setIsLoading(false);
    }
  }, [addMessage, lastLocation, language, thinkingMode]);

  const clearChat = useCallback(() => {
    const currentTr = getTranslations(language);
    setMessages([
      {
        id: generateId(),
        role: 'assistant',
        content: currentTr.chatCleared,
        timestamp: new Date(),
        meta: { type: 'cleared' },
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
    isThinking,
    thinkingMode,
    setThinkingMode,
    sendMessage: processQuery,
    clearChat,
    lastLocation,
    userMessageHistory,
    language,
    setLanguage,
  };
};
