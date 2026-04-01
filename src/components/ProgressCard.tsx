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
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 card-neon">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold text-gray-800">{t.progress}</span>
        <span className="text-sm font-bold text-red-600">{pct}%</span>
      </div>

      <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full transition-all duration-700 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="flex items-center justify-between mt-2">
        <span className="text-sm text-gray-500">
          <strong className="text-gray-800 text-base">{stats.creditedDays.toLocaleString()}</strong>{' '}
          {t.creditedDays}
        </span>
        <span className="text-sm text-gray-500">
          <strong className="text-gray-800 text-base">{REQUIRED.toLocaleString()}</strong>{' '}
          {t.daysNeeded}
        </span>
      </div>
    </div>
  );
}
