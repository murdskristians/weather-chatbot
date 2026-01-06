import { Language } from '../services/ragEngine';

interface LanguageSwitcherProps {
  language: Language;
  onLanguageChange: (language: Language) => void;
}

const languages: { code: Language; label: string; flag: string }[] = [
  { code: 'en', label: 'EN', flag: '' },
  { code: 'lv', label: 'LV', flag: '' },
  { code: 'ru', label: 'RU', flag: '' },
  { code: 'uk', label: 'UK', flag: '' },
];

export const LanguageSwitcher = ({ language, onLanguageChange }: LanguageSwitcherProps) => {
  return (
    <select
      className="language-switcher"
      value={language}
      onChange={(e) => onLanguageChange(e.target.value as Language)}
      aria-label="Select language"
    >
      {languages.map((lang) => (
        <option key={lang.code} value={lang.code}>
          {lang.flag} {lang.label}
        </option>
      ))}
    </select>
  );
};
