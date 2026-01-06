export type Language = 'en' | 'lv' | 'ru';

interface Translations {
  // Headers and titles
  currentWeatherIn: string;
  temperatureIn: string;
  rainForecastFor: string;
  windConditionsIn: string;
  humidityIn: string;
  uvIndexFor: string;
  sunriseSunsetIn: string;
  hourlyForecastFor: string;
  weekForecastFor: string;
  tomorrowForecastFor: string;
  dayAfterTomorrowForecastFor: string;
  forecastFor: string;

  // Labels
  temperature: string;
  feelsLike: string;
  humidity: string;
  wind: string;
  cloudCover: string;
  pressure: string;
  precipitation: string;
  rainChance: string;
  uvIndex: string;
  sunrise: string;
  sunset: string;
  daylight: string;
  current: string;
  today: string;
  todayRange: string;
  upcomingDays: string;
  thisWeek: string;
  next12Hours: string;
  fromDirection: string;
  gustsUpTo: string;

  // Weather descriptions
  rightNowIts: string;
  with: string;

  // Rain-related
  noSignificantRain: string;
  rainLikely: string;
  peakProbability: string;
  around: string;
  noPrecipitation: string;
  chanceOf: string;
  expected: string;
  umbrellaAdvice: string;

  // Wind advice
  strongGusts: string;
  moderateWinds: string;
  lightWinds: string;
  speed: string;
  gusts: string;
  maxWinds: string;

  // Humidity comfort
  veryDry: string;
  comfortableHumidity: string;
  moderateHumidity: string;
  highHumidity: string;

  // UV advice
  extremeUV: string;
  veryHighUV: string;
  highUV: string;
  moderateUV: string;
  lowUV: string;

  // Error messages
  locationNotFound: string;
  noLocation: string;
  apiError: string;
  pastDateError: string;
  futureDateError: string;
  noForecastData: string;

  // Welcome message
  welcomeMessage: string;
  chatCleared: string;
}

const translations: Record<Language, Translations> = {
  en: {
    // Headers and titles
    currentWeatherIn: 'Current weather in',
    temperatureIn: 'Temperature in',
    rainForecastFor: 'Rain forecast for',
    windConditionsIn: 'Wind conditions in',
    humidityIn: 'Humidity in',
    uvIndexFor: 'UV Index for',
    sunriseSunsetIn: 'Sunrise & Sunset in',
    hourlyForecastFor: 'Hourly forecast for',
    weekForecastFor: '7-Day Forecast for',
    tomorrowForecastFor: "Tomorrow's forecast for",
    dayAfterTomorrowForecastFor: "Day after tomorrow's forecast for",
    forecastFor: 'forecast for',

    // Labels
    temperature: 'Temperature',
    feelsLike: 'Feels like',
    humidity: 'Humidity',
    wind: 'Wind',
    cloudCover: 'Cloud cover',
    pressure: 'Pressure',
    precipitation: 'Precipitation',
    rainChance: 'Rain chance',
    uvIndex: 'UV Index',
    sunrise: 'Sunrise',
    sunset: 'Sunset',
    daylight: 'Daylight',
    current: 'Current',
    today: 'Today',
    todayRange: "Today's range",
    upcomingDays: 'Upcoming days',
    thisWeek: 'This week',
    next12Hours: 'Next 12 hours',
    fromDirection: 'from',
    gustsUpTo: 'gusts up to',

    // Weather descriptions
    rightNowIts: 'Right now it\'s',
    with: 'with a temperature of',

    // Rain-related
    noSignificantRain: 'No significant rain expected in the next 12 hours.',
    rainLikely: 'Rain likely!',
    peakProbability: 'Peak probability of',
    around: 'around',
    noPrecipitation: 'No precipitation',
    chanceOf: 'chance',
    expected: 'expected',
    umbrellaAdvice: 'Tip: You might want to bring an umbrella!',

    // Wind advice
    strongGusts: 'Strong gusts today - secure loose items outdoors!',
    moderateWinds: 'Moderate winds - might affect outdoor activities.',
    lightWinds: 'Light winds - good conditions for outdoor activities.',
    speed: 'Speed',
    gusts: 'Gusts',
    maxWinds: 'max winds',

    // Humidity comfort
    veryDry: 'Very dry - consider using moisturizer.',
    comfortableHumidity: 'Comfortable humidity levels.',
    moderateHumidity: 'Moderate humidity - slightly muggy.',
    highHumidity: 'High humidity - may feel uncomfortable.',

    // UV advice
    extremeUV: 'Extreme UV! Avoid sun exposure, stay indoors during midday.',
    veryHighUV: 'Very high UV! Wear SPF 50+, hat, and sunglasses. Limit sun exposure.',
    highUV: 'High UV. Wear SPF 30+, seek shade during midday hours.',
    moderateUV: 'Moderate UV. Wear sunscreen if outside for extended periods.',
    lowUV: 'Low UV. Minimal sun protection needed.',

    // Error messages
    locationNotFound: "I couldn't find that location. Could you please check the spelling or try a different city name? You can also try adding the country (e.g., 'Paris, France').",
    noLocation: "I'd love to help with the weather! Please tell me which city you'd like to know about. For example, try asking 'What's the weather in London?' or 'Will it rain in Tokyo?'",
    apiError: "I'm having trouble fetching weather data right now. Please try again in a moment.",
    pastDateError: "Sorry, I can't show weather for past dates. Please ask about today or future dates.",
    futureDateError: "Sorry, I can only show forecasts up to 7 days ahead. The date is too far in the future.",
    noForecastData: "Sorry, I don't have forecast data for that day. I can only show forecasts up to 7 days ahead.",

    // Welcome message
    welcomeMessage: "Hi! I'm your weather assistant. Ask me anything about the weather in any city around the world!\n\nTry questions like:\n• \"What's the weather in Tokyo?\"\n• \"Will it rain in London tomorrow?\"\n• \"Show me the forecast for New York this week\"\n• \"What's the UV index in Sydney?\"",
    chatCleared: 'Chat cleared! How can I help you with the weather today?',
  },

  lv: {
    // Headers and titles
    currentWeatherIn: 'Pašreizējie laika apstākļi',
    temperatureIn: 'Temperatūra',
    rainForecastFor: 'Lietus prognoze',
    windConditionsIn: 'Vēja apstākļi',
    humidityIn: 'Mitrums',
    uvIndexFor: 'UV indekss',
    sunriseSunsetIn: 'Saullēkts un saulriets',
    hourlyForecastFor: 'Stundu prognoze',
    weekForecastFor: '7 dienu prognoze',
    tomorrowForecastFor: 'Rītdienas prognoze',
    dayAfterTomorrowForecastFor: 'Parīt prognoze',
    forecastFor: 'prognoze',

    // Labels
    temperature: 'Temperatūra',
    feelsLike: 'Jūtas kā',
    humidity: 'Mitrums',
    wind: 'Vējš',
    cloudCover: 'Mākoņainība',
    pressure: 'Spiediens',
    precipitation: 'Nokrišņi',
    rainChance: 'Lietus iespējamība',
    uvIndex: 'UV indekss',
    sunrise: 'Saullēkts',
    sunset: 'Saulriets',
    daylight: 'Dienas gaisma',
    current: 'Pašlaik',
    today: 'Šodien',
    todayRange: 'Šodienas diapazons',
    upcomingDays: 'Nākamās dienas',
    thisWeek: 'Šonedēļ',
    next12Hours: 'Nākamās 12 stundas',
    fromDirection: 'no',
    gustsUpTo: 'brāzmas līdz',

    // Weather descriptions
    rightNowIts: 'Pašlaik ir',
    with: 'ar temperatūru',

    // Rain-related
    noSignificantRain: 'Nākamajās 12 stundās būtiski nokrišņi nav gaidāmi.',
    rainLikely: 'Iespējams lietus!',
    peakProbability: 'Maksimālā varbūtība',
    around: 'ap',
    noPrecipitation: 'Nav nokrišņu',
    chanceOf: 'iespējamība',
    expected: 'gaidāms',
    umbrellaAdvice: 'Padoms: Ieteicams paņemt līdzi lietussargu!',

    // Wind advice
    strongGusts: 'Stipras vēja brāzmas - nostipriniet brīvus priekšmetus ārā!',
    moderateWinds: 'Mērens vējš - var ietekmēt āra aktivitātes.',
    lightWinds: 'Vājš vējš - labi apstākļi āra aktivitātēm.',
    speed: 'Ātrums',
    gusts: 'Brāzmas',
    maxWinds: 'maks. vējš',

    // Humidity comfort
    veryDry: 'Ļoti sauss - ieteicams lietot mitrinātāju.',
    comfortableHumidity: 'Komfortabls mitruma līmenis.',
    moderateHumidity: 'Mērens mitrums - nedaudz smacīgs.',
    highHumidity: 'Augsts mitrums - var justies neērti.',

    // UV advice
    extremeUV: 'Ekstrēms UV! Izvairieties no saules, palieciet iekštelpās pusdienlaikā.',
    veryHighUV: 'Ļoti augsts UV! Lietojiet SPF 50+, cepuri un saulesbrilles. Ierobežojiet uzturēšanos saulē.',
    highUV: 'Augsts UV. Lietojiet SPF 30+, meklējiet ēnu pusdienlaikā.',
    moderateUV: 'Mērens UV. Lietojiet saules aizsargkrēmu, ja esat ārā ilgstoši.',
    lowUV: 'Zems UV. Minimāla saules aizsardzība nepieciešama.',

    // Error messages
    locationNotFound: 'Nevarēju atrast šo vietu. Lūdzu, pārbaudiet pareizrakstību vai mēģiniet citu pilsētas nosaukumu. Varat arī pievienot valsti (piem., "Parīze, Francija").',
    noLocation: 'Labprāt palīdzēšu ar laika prognozi! Lūdzu, norādiet pilsētu. Piemēram, jautājiet "Kāds laiks Rīgā?" vai "Vai rīt līs Liepājā?"',
    apiError: 'Pašlaik ir problēmas ar laika datu iegūšanu. Lūdzu, mēģiniet vēlreiz pēc brīža.',
    pastDateError: 'Atvainojiet, nevaru parādīt laiku pagātnes datumiem. Lūdzu, jautājiet par šodienu vai nākotnes datumiem.',
    futureDateError: 'Atvainojiet, varu parādīt prognozi tikai līdz 7 dienām uz priekšu. Datums ir pārāk tālu nākotnē.',
    noForecastData: 'Atvainojiet, man nav prognozes datu šai dienai. Varu parādīt prognozi tikai līdz 7 dienām uz priekšu.',

    // Welcome message
    welcomeMessage: 'Sveiki! Es esmu jūsu laika asistents. Jautājiet man par laiku jebkurā pilsētā pasaulē!\n\nMēģiniet jautāt:\n• "Kāds laiks Rīgā?"\n• "Vai rīt līs Liepājā?"\n• "Parādi nedēļas prognozi Jelgavai"\n• "Kāds UV indekss Jūrmalā?"',
    chatCleared: 'Čats notīrīts! Kā varu palīdzēt ar laika prognozi šodien?',
  },

  ru: {
    // Headers and titles
    currentWeatherIn: 'Текущая погода в',
    temperatureIn: 'Температура в',
    rainForecastFor: 'Прогноз осадков для',
    windConditionsIn: 'Ветер в',
    humidityIn: 'Влажность в',
    uvIndexFor: 'УФ-индекс для',
    sunriseSunsetIn: 'Восход и закат в',
    hourlyForecastFor: 'Почасовой прогноз для',
    weekForecastFor: 'Прогноз на 7 дней для',
    tomorrowForecastFor: 'Прогноз на завтра для',
    dayAfterTomorrowForecastFor: 'Прогноз на послезавтра для',
    forecastFor: 'прогноз для',

    // Labels
    temperature: 'Температура',
    feelsLike: 'Ощущается как',
    humidity: 'Влажность',
    wind: 'Ветер',
    cloudCover: 'Облачность',
    pressure: 'Давление',
    precipitation: 'Осадки',
    rainChance: 'Вероятность дождя',
    uvIndex: 'УФ-индекс',
    sunrise: 'Восход',
    sunset: 'Закат',
    daylight: 'Световой день',
    current: 'Сейчас',
    today: 'Сегодня',
    todayRange: 'Диапазон на сегодня',
    upcomingDays: 'Ближайшие дни',
    thisWeek: 'На этой неделе',
    next12Hours: 'Следующие 12 часов',
    fromDirection: 'с',
    gustsUpTo: 'порывы до',

    // Weather descriptions
    rightNowIts: 'Сейчас',
    with: 'температура',

    // Rain-related
    noSignificantRain: 'В ближайшие 12 часов значительных осадков не ожидается.',
    rainLikely: 'Вероятен дождь!',
    peakProbability: 'Максимальная вероятность',
    around: 'около',
    noPrecipitation: 'Без осадков',
    chanceOf: 'вероятность',
    expected: 'ожидается',
    umbrellaAdvice: 'Совет: Возьмите с собой зонт!',

    // Wind advice
    strongGusts: 'Сильные порывы ветра - закрепите незакреплённые предметы!',
    moderateWinds: 'Умеренный ветер - может повлиять на активности на улице.',
    lightWinds: 'Слабый ветер - хорошие условия для прогулок.',
    speed: 'Скорость',
    gusts: 'Порывы',
    maxWinds: 'макс. ветер',

    // Humidity comfort
    veryDry: 'Очень сухо - рекомендуется увлажняющий крем.',
    comfortableHumidity: 'Комфортный уровень влажности.',
    moderateHumidity: 'Умеренная влажность - немного душно.',
    highHumidity: 'Высокая влажность - может быть некомфортно.',

    // UV advice
    extremeUV: 'Экстремальный УФ! Избегайте солнца, оставайтесь в помещении в полдень.',
    veryHighUV: 'Очень высокий УФ! Используйте SPF 50+, шляпу и очки. Ограничьте пребывание на солнце.',
    highUV: 'Высокий УФ. Используйте SPF 30+, ищите тень в полуденные часы.',
    moderateUV: 'Умеренный УФ. Используйте солнцезащитный крем при длительном пребывании на улице.',
    lowUV: 'Низкий УФ. Минимальная защита от солнца.',

    // Error messages
    locationNotFound: 'Не удалось найти это место. Проверьте правильность написания или попробуйте другое название города. Можно также добавить страну (например, "Париж, Франция").',
    noLocation: 'С удовольствием помогу с погодой! Укажите город. Например, спросите "Какая погода в Москве?" или "Будет ли дождь в Киеве?"',
    apiError: 'Сейчас возникли проблемы с получением данных о погоде. Попробуйте позже.',
    pastDateError: 'Извините, не могу показать погоду за прошедшие даты. Спрашивайте о сегодня или будущих датах.',
    futureDateError: 'Извините, прогноз доступен только на 7 дней вперёд. Дата слишком далеко в будущем.',
    noForecastData: 'Извините, нет данных прогноза на этот день. Прогноз доступен только на 7 дней вперёд.',

    // Welcome message
    welcomeMessage: 'Привет! Я ваш погодный помощник. Спрашивайте о погоде в любом городе мира!\n\nПопробуйте спросить:\n• "Какая погода в Москве?"\n• "Будет ли дождь в Киеве завтра?"\n• "Покажи прогноз на неделю для Риги"\n• "Какой УФ-индекс в Одессе?"',
    chatCleared: 'Чат очищен! Чем могу помочь с погодой сегодня?',
  },
};

export const t = (key: keyof Translations, language: Language): string => {
  return translations[language][key];
};

export const getTranslations = (language: Language): Translations => {
  return translations[language];
};

export default translations;
