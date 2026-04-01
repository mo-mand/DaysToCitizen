'use client';

import { useState } from 'react';
import { PlaneTakeoff, Plus, Loader2 } from 'lucide-react';
import { Absence } from '@/lib/types';
import { useLanguage } from '@/contexts/LanguageContext';

interface Props {
  onAdd: (absence: Absence) => void | Promise<void>;
  prDate?: string | null;
}

export function TripForm({ onAdd, prDate }: Props) {
  const { t } = useLanguage();

  const [departure, setDeparture] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [stillAbroad, setStillAbroad] = useState(false);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!departure) { setError(t.errorRequired); return; }
    if (!stillAbroad && !returnDate) { setError(t.errorRequired); return; }
    if (!stillAbroad && returnDate < departure) { setError(t.errorDates); return; }

    const absence: Absence = {
      id: crypto.randomUUID(),
      departureDate: departure,
      returnDate: stillAbroad ? null : returnDate,
      notes: notes.trim() || undefined,
    };

    setLoading(true);
    try {
      await onAdd(absence);
      setDeparture('');
      setReturnDate('');
      setStillAbroad(false);
      setNotes('');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="p-2 bg-red-50 rounded-xl">
          <PlaneTakeoff className="w-5 h-5 text-red-600" />
        </div>
        <h2 className="text-base font-semibold text-gray-900">{t.addTripTitle}</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Departure */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-600" htmlFor="departure">
              {t.leftCanada}
            </label>
            <div className="relative">
              <input
                id="departure"
                type="date"
                required
                max={today}
                min={prDate ?? undefined}
                value={departure}
                onChange={(e) => { setDeparture(e.target.value); setError(''); }}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Return */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-600" htmlFor="return">
              {t.returnedToCanada}
            </label>
            <input
              id="return"
              type="date"
              min={departure || undefined}
              max={today}
              value={returnDate}
              disabled={stillAbroad}
              onChange={(e) => { setReturnDate(e.target.value); setError(''); }}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-400"
            />
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={stillAbroad}
                onChange={(e) => setStillAbroad(e.target.checked)}
                className="w-4 h-4 accent-red-600 rounded"
              />
              <span className="text-xs text-gray-500">{t.stillAbroad}</span>
            </label>
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-600" htmlFor="notes">
            {t.tripNotes}{' '}
            <span className="font-normal text-gray-400">(optional)</span>
          </label>
          <input
            id="notes"
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={t.tripNotesPlaceholder}
            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg border border-red-100">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold text-sm transition-colors disabled:opacity-60 shadow-sm"
        >
          {loading
            ? <><Loader2 className="w-4 h-4 animate-spin" /> {t.adding}</>
            : <><Plus className="w-4 h-4" /> {t.addTrip}</>
          }
        </button>
      </form>
    </div>
  );
}
