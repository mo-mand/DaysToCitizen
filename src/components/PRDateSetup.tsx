'use client';

import { useState } from 'react';
import { CalendarDays, Loader2 } from 'lucide-react';
import { MapleLeaf } from './MapleLeaf';
import { UserProfile } from '@/lib/types';
import { useLanguage } from '@/contexts/LanguageContext';

interface Props {
  onSave: (profile: UserProfile) => void;
  initialProfile?: UserProfile;
  compact?: boolean; // renders as an inline edit row instead of a full-page card
}

export function PRDateSetup({ onSave, initialProfile, compact = false }: Props) {
  const { t } = useLanguage();
  const [prDate, setPrDate] = useState(initialProfile?.prDate ?? '');
  const [arrivalDate, setArrivalDate] = useState(initialProfile?.arrivalDate ?? '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const today = new Date().toISOString().split('T')[0];

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!prDate) { setError(t.errorRequired); return; }
    if (arrivalDate && arrivalDate > prDate) {
      setError('Arrival date must be before your PR date.');
      return;
    }
    setLoading(true);
    onSave({ prDate, arrivalDate: arrivalDate || null });
  }

  if (compact) {
    return (
      <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-3 bg-gray-50 rounded-xl p-4">
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-600">{t.prDateLabel}</label>
          <input
            type="date"
            required
            max={today}
            value={prDate}
            onChange={(e) => { setPrDate(e.target.value); setError(''); }}
            className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-600">
            {t.arrivalDateLabel}{' '}
            <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <input
            type="date"
            max={prDate || today}
            value={arrivalDate}
            onChange={(e) => { setArrivalDate(e.target.value); setError(''); }}
            className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
          />
        </div>
        {error && <p className="w-full text-xs text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-colors disabled:opacity-60"
        >
          {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
          Save
        </button>
      </form>
    );
  }

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        {/* Hero */}
        <div className="text-center space-y-3">
          <MapleLeaf className="w-16 h-16 mx-auto" />
          <h1 className="text-3xl font-bold text-gray-900">DaysToCitizen</h1>
          <p className="text-gray-500">{t.tagline}</p>
        </div>

        {/* Form card */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5"
        >
          <h2 className="font-semibold text-gray-800">{t.setPrDate}</h2>

          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700" htmlFor="pr-date">
              <CalendarDays className="w-4 h-4 text-red-500" />
              {t.prDateLabel}
            </label>
            <input
              id="pr-date"
              type="date"
              required
              max={today}
              value={prDate}
              onChange={(e) => { setPrDate(e.target.value); setError(''); }}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700" htmlFor="arrival-date">
              <CalendarDays className="w-4 h-4 text-blue-500" />
              {t.arrivalDateLabel}{' '}
              <span className="font-normal text-gray-400">(optional)</span>
            </label>
            <input
              id="arrival-date"
              type="date"
              max={prDate || today}
              value={arrivalDate}
              onChange={(e) => { setArrivalDate(e.target.value); setError(''); }}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-400">{t.arrivalDateHint}</p>
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-sm transition-colors disabled:opacity-60"
          >
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</> : t.saveAndStart}
          </button>
        </form>
      </div>
    </div>
  );
}
