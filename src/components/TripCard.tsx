'use client';

import { motion } from 'motion/react';
import { format, parseISO, differenceInDays } from 'date-fns';
import { Plane, Trash2, MapPin } from 'lucide-react';
import { Absence } from '@/lib/types';
import { useLanguage } from '@/contexts/LanguageContext';

interface Props {
  absence: Absence;
  index: number;
  onDelete: (id: string) => void;
}

export function TripCard({ absence, index, onDelete }: Props) {
  const { t } = useLanguage();

  const dept = parseISO(absence.departureDate);
  const ret = absence.returnDate ? parseISO(absence.returnDate) : new Date();
  const totalDays = Math.max(0, differenceInDays(ret, dept));
  const isOngoing = !absence.returnDate;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -10 }}
      transition={{ delay: index * 0.04 }}
      className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-start gap-3"
    >
      <div className={`mt-0.5 p-2 rounded-lg flex-shrink-0 ${isOngoing ? 'bg-orange-50' : 'bg-gray-50'}`}>
        {isOngoing ? (
          <MapPin className="w-4 h-4 text-orange-500" />
        ) : (
          <Plane className="w-4 h-4 text-gray-400" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-semibold text-gray-900">
            {format(dept, 'MMM d, yyyy')}
          </span>
          <span className="text-gray-300 text-xs">→</span>
          <span className={`text-sm font-medium ${isOngoing ? 'text-orange-600' : 'text-gray-700'}`}>
            {absence.returnDate
              ? format(parseISO(absence.returnDate), 'MMM d, yyyy')
              : t.currentlyAbroad}
          </span>
        </div>

        <div className="flex items-center gap-3 mt-1 flex-wrap">
          <span className="text-xs text-gray-400">
            {totalDays} {totalDays === 1 ? t.day : t.days}
          </span>
          {absence.notes && (
            <span className="text-xs text-gray-400 truncate">· {absence.notes}</span>
          )}
        </div>
      </div>

      <button
        onClick={() => onDelete(absence.id)}
        className="text-gray-300 hover:text-red-500 transition-colors p-1 flex-shrink-0"
        aria-label={t.deleteTrip}
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </motion.div>
  );
}
