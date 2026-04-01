'use client';

import { CalendarDays, TrendingUp, MapPin, ShieldCheck } from 'lucide-react';
import { CitizenshipStats } from '@/lib/types';
import { useLanguage } from '@/contexts/LanguageContext';

interface Props {
  stats: CitizenshipStats;
}

export function StatsCards({ stats }: Props) {
  const { t } = useLanguage();

  const cards = [
    {
      icon: CalendarDays,
      label: t.daysInCanada,
      value: stats.physicalDays.toLocaleString(),
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      icon: TrendingUp,
      label: t.daysOutside,
      value: stats.absenceDays.toLocaleString(),
      color: 'text-orange-600',
      bg: 'bg-orange-50',
    },
    {
      icon: ShieldCheck,
      label: t.prDays,
      value: stats.prDays.toLocaleString(),
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      icon: MapPin,
      label: t.preprCredit,
      value: stats.preprCredited.toLocaleString(),
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {cards.map((c) => (
        <div key={c.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
          <div className={`p-2 rounded-xl ${c.bg}`}>
            <c.icon className={`w-4 h-4 ${c.color}`} />
          </div>
          <div>
            <p className="text-xs text-gray-500">{c.label}</p>
            <p className="text-lg font-bold text-gray-900 leading-tight">{c.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
