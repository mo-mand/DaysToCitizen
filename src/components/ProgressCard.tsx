'use client';

import { CitizenshipStats } from '@/lib/types';
import { useLanguage } from '@/contexts/LanguageContext';

interface Props {
  stats: CitizenshipStats;
}

const REQUIRED = 1095;

export function ProgressCard({ stats }: Props) {
  const { t } = useLanguage();
  const pct = stats.percentComplete;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold text-gray-800">{t.progress}</span>
        <span className="text-sm font-bold text-red-600">{pct}%</span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-red-600 rounded-full transition-all duration-700 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="flex items-center justify-between mt-2">
        <span className="text-xs text-gray-500">
          <strong className="text-gray-800">{stats.creditedDays.toLocaleString()}</strong>{' '}
          {t.creditedDays}
        </span>
        <span className="text-xs text-gray-500">
          <strong className="text-gray-800">{REQUIRED.toLocaleString()}</strong>{' '}
          {t.daysNeeded}
        </span>
      </div>
    </div>
  );
}
