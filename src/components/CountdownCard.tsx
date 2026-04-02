'use client';

import { Clock, CheckCircle2 } from 'lucide-react';
import { CitizenshipStats } from '@/lib/types';
import { daysToYMD } from '@/lib/calculations';
import { useLanguage } from '@/contexts/LanguageContext';

interface Props {
  stats: CitizenshipStats;
}

export function CountdownCard({ stats }: Props) {
  const { t, lang } = useLanguage();
  const { years, months, days } = daysToYMD(stats.daysRemaining);

  // Round up: if 6 or more months remaining within the year, show years+1 only
  const roundedUp = months >= 6;
  const displayYears = roundedUp ? years + 1 : years;
  const showYears = displayYears > 0;
  const showMonths = !roundedUp && months > 0;
  const showDays = !roundedUp && (days > 0 || (!showYears && !showMonths));

  const formattedDate = stats.eligibilityDate
    ? new Intl.DateTimeFormat(lang, { year: 'numeric', month: 'long', day: 'numeric' }).format(stats.eligibilityDate)
    : null;

  if (stats.isEligible) {
    return (
      <div className="bg-white rounded-2xl border border-green-200 shadow-sm p-6 flex flex-col items-center justify-center gap-4 text-center min-h-[200px] card-neon-green">
        <CheckCircle2 className="w-14 h-14 text-green-500" />
        <div>
          <p className="text-2xl font-bold text-gray-900">{t.eligible}</p>
          <p className="text-sm text-gray-500 mt-1">{t.estimatedEligibility} {formattedDate}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col items-center justify-center gap-4 text-center min-h-[200px] card-neon">
      <Clock className="w-8 h-8 text-red-400" />
      <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">{t.timeRemaining}</p>

      <div className="flex items-end justify-center gap-5">
        {showYears && (
          <div className="flex flex-col items-center">
            <span className="text-5xl font-bold text-red-600 leading-none tabular-nums">{displayYears}</span>
            <span className="text-xs text-gray-400 mt-1">{displayYears === 1 ? t.year : t.years}</span>
          </div>
        )}
        {showMonths && (
          <div className="flex flex-col items-center">
            <span className="text-5xl font-bold text-red-600 leading-none tabular-nums">{months}</span>
            <span className="text-xs text-gray-400 mt-1">{months === 1 ? t.month : t.months}</span>
          </div>
        )}
        {showDays && (
          <div className="flex flex-col items-center">
            <span className="text-5xl font-bold text-red-600 leading-none tabular-nums">{days}</span>
            <span className="text-xs text-gray-400 mt-1">{days === 1 ? t.day : t.days}</span>
          </div>
        )}
      </div>

      <div className="text-center mt-1">
        <p className="text-sm text-gray-600">
          {t.estimatedEligibility}{' '}
          <strong className="text-gray-900">{formattedDate}</strong>
        </p>
        <p className="text-xs text-gray-400 mt-0.5">({t.assumingStay})</p>
      </div>
    </div>
  );
}
