'use client';

import { useState } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { Stay, ResidencyStatus } from '@/lib/types';

interface Props {
  onAdd: (stay: Stay) => void | Promise<void>;
}

export function TripForm({ onAdd }: Props) {
  const [entryDate, setEntryDate] = useState('');
  const [exitDate, setExitDate] = useState('');
  const [stillInCanada, setStillInCanada] = useState(false);
  const [status, setStatus] = useState<ResidencyStatus>('permanent-resident');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!entryDate) { setError('Start date is required.'); return; }
    if (!stillInCanada && !exitDate) { setError('End date is required, or check "Still in Canada".'); return; }
    if (!stillInCanada && exitDate < entryDate) { setError('End date must be after start date.'); return; }

    const stay: Stay = {
      id: crypto.randomUUID(),
      entryDate,
      exitDate: stillInCanada ? null : exitDate,
      status,
      notes: notes.trim() || undefined,
    };

    setLoading(true);
    try {
      await onAdd(stay);
      setEntryDate(''); setExitDate(''); setStillInCanada(false);
      setStatus('permanent-resident'); setNotes('');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 card-neon">
      <h2 className="text-base font-semibold text-gray-900 mb-4">Add a Stay in Canada</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Dates */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-500" htmlFor="entry">
              Start date
            </label>
            <input
              id="entry"
              type="date"
              required
              max={today}
              value={entryDate}
              onChange={(e) => { setEntryDate(e.target.value); setError(''); }}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-500" htmlFor="exit">
              End date
            </label>
            <input
              id="exit"
              type="date"
              min={entryDate || undefined}
              max={today}
              value={exitDate}
              disabled={stillInCanada}
              onChange={(e) => { setExitDate(e.target.value); setError(''); }}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-300"
            />
          </div>
        </div>

        <label className="flex items-center gap-2 cursor-pointer select-none -mt-1">
          <input
            type="checkbox"
            checked={stillInCanada}
            onChange={(e) => setStillInCanada(e.target.checked)}
            className="w-4 h-4 accent-red-600 rounded"
          />
          <span className="text-sm text-gray-500">I&apos;m currently in Canada</span>
        </label>

        {/* Status */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-gray-500" htmlFor="status">
            Immigration status
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as ResidencyStatus)}
            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="permanent-resident">Permanent Resident — Full Days</option>
            <option value="other">Any Other Status (Visitor, Work, Student…) — Half Days</option>
          </select>
        </div>

        {/* Notes */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-gray-500" htmlFor="notes">
            Notes <span className="font-normal">(optional)</span>
          </label>
          <input
            id="notes"
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Landed as PR, work permit…"
            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg border border-red-100">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-sm transition-colors disabled:opacity-60 shadow-sm"
        >
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Adding…</> : <><Plus className="w-4 h-4" /> Add Stay</>}
        </button>
      </form>
    </div>
  );
}
