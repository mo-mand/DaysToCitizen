import en, { Translations } from './en';
import fr from './fr';

export const languages = {
  en: { label: 'English', flag: '🇨🇦', translations: en },
  fr: { label: 'Français', flag: '🇫🇷', translations: fr },
} as const;

export type LanguageCode = keyof typeof languages;
export type { Translations };
export { en, fr };
