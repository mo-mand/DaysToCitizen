'use client';

import { motion } from 'motion/react';
import { format, parseISO, differenceInDays } from 'date-fns';
import { Trash2, Calendar } from 'lucide-react';
import { Stay } from '@/lib/types';
import { useLanguage } from '@/contexts/LanguageContext';

interface Props {
  stay: Stay;
  index: number;
  onDelete: (id: string) => void;
}

export function TripCard({ stay, index, onDelete }: Props) {
  const { t } = useLanguage();
  const entry = parseISO(stay.entryDate);
  const exit = stay.exitDate ? parseISO(stay.exitDate) : new Date();
  const totalDays = Math.max(1, differenceInDays(exit, entry) + 1); // inclusive: both entry and exit day count
  const isOngoing = !stay.exitDate;
  const isPR = stay.status === 'permanent-resident';
  const creditedDays = isPR ? totalDays : Math.floor(totalDays / 2);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0, marginBottom: 0, transition: { duration: 0.18 } }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-xl border border-gray-100 shadow-sm p-3.5 flex items-start gap-3"
    >
      <div className="flex-1 min-w-0">
        {/* Dates row */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <Calendar className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
          <span className="text-sm font-medium text-gray-800">
            {format(entry, 'MMM d, yyyy')}
          </span>
          <span className="text-gray-300 text-xs">→</span>
          <span className={`text-sm font-medium ${isOngoing ? 'text-red-600' : 'text-gray-700'}`}>
            {stay.exitDate ? format(parseISO(stay.exitDate), 'MMM d, yyyy') : t.presentLabel}
          </span>
          {isOngoing && (
            <span className="inline-flex items-center gap-1 text-xs text-red-600 font-medium">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
              Now
            </span>
          )}
        </div>

        {/* Tags row */}
        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
              isPR
                ? 'bg-green-100 text-green-800'
                : 'bg-blue-100 text-blue-800'
            }`}
          >
            {isPR ? 'PR' : t.visitorOther}
          </span>
          <span className="text-xs text-gray-400">
            {totalDays} {t.physicalDaysLabel}
          </span>
          <span className="text-xs font-semibold text-red-600">
            = {creditedDays} {t.creditedDays}
          </span>
          {stay.notes && (
            <span className="text-xs text-gray-400 italic truncate max-w-[140px]">· {stay.notes}</span>
          )}
        </div>
      </div>

      <button
        onClick={() => onDelete(stay.id)}
        className="text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors p-2 rounded-lg flex-shrink-0 mt-0.5"
        aria-label="Delete stay"
      >
        <Trash2 className="w-5 h-5" />
      </button>
    </motion.div>
  );
}
