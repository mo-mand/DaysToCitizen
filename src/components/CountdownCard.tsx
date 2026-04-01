'use client';

import { Clock, CheckCircle2 } from 'lucide-react';
import { CitizenshipStats } from '@/lib/types';
import { daysToYMD } from '@/lib/calculations';
import { useLanguage } from '@/contexts/LanguageContext';

interface Props {
  stats: CitizenshipStats;
}

export function CountdownCard({ stats }: Props) {
  const { t } = useLanguage();
  const { years, months, days } = daysToYMD(stats.daysRemaining);

  if (stats.isEligible) {
    return (
      <div className="bg-white rounded-2xl border border-green-200 shadow-sm p-6 flex flex-col items-center justify-center gap-4 text-center min-h-[200px] card-neon-green">
        <CheckCircle2 className="w-14 h-14 text-green-500" />
        <div>
          <p className="text-2xl font-bold text-gray-900">{t.eligible}</p>
          <p className="text-sm text-gray-500 mt-1">{t.estimatedEligibility} {stats.eligibilityDate}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col items-center justify-center gap-4 text-center min-h-[200px] card-neon">
      <Clock className="w-8 h-8 text-red-400" />
      <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">{t.timeRemaining}</p>

      <div className="flex items-end justify-center gap-5">
        {years > 0 && (
          <div className="flex flex-col items-center">
            <span className="text-5xl font-bold text-red-600 leading-none tabular-nums">{years}</span>
            <span className="text-xs text-gray-400 mt-1">{years === 1 ? t.year : t.years}</span>
          </div>
        )}
        {(years > 0 || months > 0) && (
          <div className="flex flex-col items-center">
            <span className="text-5xl font-bold text-red-600 leading-none tabular-nums">{months}</span>
            <span className="text-xs text-gray-400 mt-1">{months === 1 ? t.month : t.months}</span>
          </div>
        )}
        <div className="flex flex-col items-center">
          <span className="text-5xl font-bold text-red-600 leading-none tabular-nums">{days}</span>
          <span className="text-xs text-gray-400 mt-1">{days === 1 ? t.day : t.days}</span>
        </div>
      </div>

      <div className="text-center mt-1">
        <p className="text-sm text-gray-600">
          {t.estimatedEligibility}{' '}
          <strong className="text-gray-900">{stats.eligibilityDate}</strong>
        </p>
        <p className="text-xs text-gray-400 mt-0.5">({t.assumingStay})</p>
      </div>
    </div>
  );
}
