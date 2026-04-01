'use client';

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { languages, LanguageCode } from '@/i18n';

export function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();
  const [open, setOpen] = useState(false);

  const current = languages[lang];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 px-2 py-1 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <span>{current.flag}</span>
        <span className="hidden sm:block font-medium">{current.label}</span>
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <>
          <div className="fixed inset-0" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-lg border border-gray-100 z-50 overflow-hidden">
            <div className="max-h-72 overflow-y-auto py-1">
              {(Object.entries(languages) as [LanguageCode, typeof languages[LanguageCode]][]).map(([code, info]) => (
                <button
                  key={code}
                  onClick={() => { setLang(code); setOpen(false); }}
                  className={`w-full flex items-center gap-2.5 px-4 py-2 text-sm transition-colors ${
                    lang === code
                      ? 'text-red-600 bg-red-50 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-base leading-none">{info.flag}</span>
                  <span>{info.label}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
