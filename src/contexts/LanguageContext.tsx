'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { languages, LanguageCode, Translations } from '@/i18n';

interface LanguageContextValue {
  lang: LanguageCode;
  t: Translations;
  setLang: (code: LanguageCode) => void;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: 'en',
  t: languages.en.translations,
  setLang: () => {},
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<LanguageCode>('en');

  useEffect(() => {
    const saved = localStorage.getItem('dtc-lang') as LanguageCode | null;
    if (saved && saved in languages) setLangState(saved);
  }, []);

  function setLang(code: LanguageCode) {
    setLangState(code);
    localStorage.setItem('dtc-lang', code);
  }

  return (
    <LanguageContext.Provider value={{ lang, t: languages[lang].translations, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
