import en, { Translations } from './en';
import fr from './fr';
import fa from './fa';
import zh from './zh';
import ar from './ar';
import es from './es';
import hi from './hi';
import pa from './pa';
import ur from './ur';
import ko from './ko';
import pt from './pt';
import ru from './ru';
import de from './de';
import tr from './tr';
import vi from './vi';
import tl from './tl';
import ja from './ja';
import ro from './ro';
import uk from './uk';
import pl from './pl';
import it from './it';
import bn from './bn';
import gu from './gu';

export const languages = {
  en: { label: 'English',    flag: '🇨🇦', dir: 'ltr', translations: en },
  fr: { label: 'Français',   flag: '🇫🇷', dir: 'ltr', translations: fr },
  es: { label: 'Español',    flag: '🇪🇸', dir: 'ltr', translations: es },
  pt: { label: 'Português',  flag: '🇧🇷', dir: 'ltr', translations: pt },
  de: { label: 'Deutsch',    flag: '🇩🇪', dir: 'ltr', translations: de },
  it: { label: 'Italiano',   flag: '🇮🇹', dir: 'ltr', translations: it },
  pl: { label: 'Polski',     flag: '🇵🇱', dir: 'ltr', translations: pl },
  ro: { label: 'Română',     flag: '🇷🇴', dir: 'ltr', translations: ro },
  ru: { label: 'Русский',    flag: '🇷🇺', dir: 'ltr', translations: ru },
  uk: { label: 'Українська', flag: '🇺🇦', dir: 'ltr', translations: uk },
  tr: { label: 'Türkçe',     flag: '🇹🇷', dir: 'ltr', translations: tr },
  vi: { label: 'Tiếng Việt', flag: '🇻🇳', dir: 'ltr', translations: vi },
  ko: { label: '한국어',      flag: '🇰🇷', dir: 'ltr', translations: ko },
  ja: { label: '日本語',      flag: '🇯🇵', dir: 'ltr', translations: ja },
  zh: { label: '简体中文',    flag: '🇨🇳', dir: 'ltr', translations: zh },
  hi: { label: 'हिन्दी',     flag: '🇮🇳', dir: 'ltr', translations: hi },
  bn: { label: 'বাংলা',      flag: '🇧🇩', dir: 'ltr', translations: bn },
  gu: { label: 'ગુજરાતી',    flag: '🇮🇳', dir: 'ltr', translations: gu },
  pa: { label: 'ਪੰਜਾਬੀ',     flag: '🇮🇳', dir: 'ltr', translations: pa },
  tl: { label: 'Filipino',   flag: '🇵🇭', dir: 'ltr', translations: tl },
  fa: { label: 'فارسی',      flag: '🇮🇷', dir: 'rtl', translations: fa },
  ar: { label: 'العربية',    flag: '🇸🇦', dir: 'rtl', translations: ar },
  ur: { label: 'اردو',       flag: '🇵🇰', dir: 'rtl', translations: ur },
} as const;

export type LanguageCode = keyof typeof languages;
export type { Translations };
export { en, fr };
