'use client';

import { useLanguage } from '@/contexts/LanguageContext';

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="mt-6 pb-8 border-t border-gray-100 pt-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-400">
        <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
          <span>{t.footerBuiltBy}</span>
          <a
            href="https://momand.cloud/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
          >
            Mo Mand
          </a>
          <span className="text-gray-300">·</span>
          <
            href="https://github.com/mo-mand/daystocitizen"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-700 transition-colors"
          >
            {t.footerOpenSource} ↗
          </a>
        </div>

        <p className="text-xs text-gray-400 text-center sm:text-right">{t.footerDisclaimer}</p>
      </div>
    </footer>
  );
}
