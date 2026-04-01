'use client';

import { CalendarDays, ShieldCheck, Clock, Layers } from 'lucide-react';
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
      sub: 'physical days',
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      icon: ShieldCheck,
      label: t.prDays,
      value: stats.prDays.toLocaleString(),
      sub: 'full credit',
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      icon: Layers,
      label: 'Other Status',
      value: stats.otherDaysCredited.toLocaleString(),
      sub: `of ${stats.otherDaysRaw} raw`,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
    {
      icon: Clock,
      label: 'Still Needed',
      value: stats.daysRemaining.toLocaleString(),
      sub: 'credited days',
      color: 'text-orange-600',
      bg: 'bg-orange-50',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {cards.map((c) => (
        <div key={c.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3 card-neon">
          <div className={`p-2 rounded-xl flex-shrink-0 ${c.bg}`}>
            <c.icon className={`w-4 h-4 ${c.color}`} />
          </div>
          <div>
            <p className="text-xs text-gray-500">{c.label}</p>
            <p className="text-lg font-bold text-gray-900 leading-tight">{c.value}</p>
            <p className="text-xs text-gray-400">{c.sub}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
