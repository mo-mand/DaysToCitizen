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
      sub: t.physicalDaysLabel,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      icon: ShieldCheck,
      label: t.prDays,
      value: stats.prDays.toLocaleString(),
      sub: t.fullCredit,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      icon: Layers,
      label: t.preprCredit,
      value: stats.otherDaysCredited.toLocaleString(),
      sub: `${stats.otherDaysCredited} ${t.eligibleDaysOf} ${stats.otherDaysRaw} ${t.visaDays}`,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
    {
      icon: Clock,
      label: t.stillNeeded,
      value: stats.daysRemaining.toLocaleString(),
      sub: t.creditedDays,
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
            <p className="text-xs font-medium text-gray-500">{c.label}</p>
            <p className="text-xl font-bold text-gray-900 leading-tight">{c.value}</p>
            <p className="text-xs text-gray-400">{c.sub}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
