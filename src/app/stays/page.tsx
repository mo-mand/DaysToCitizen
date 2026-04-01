'use client';

import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowLeft, MapPin, Pencil, Trash2, Check, X, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { format, parseISO } from 'date-fns';

import { TripForm } from '@/components/TripForm';
import { useAuth } from '@/contexts/AuthContext';
import { Stay, ResidencyStatus } from '@/lib/types';
import {
  getStays as localGetStays,
  addStay as localAddStay,
  deleteStay as localDeleteStay,
  updateStay as localUpdateStay,
} from '@/lib/storage';

function EditRow({
  stay,
  onSave,
  onCancel,
}: {
  stay: Stay;
  onSave: (updates: Partial<Stay>) => Promise<void>;
  onCancel: () => void;
}) {
  const [entryDate, setEntryDate] = useState(stay.entryDate);
  const [exitDate, setExitDate] = useState(stay.exitDate ?? '');
  const [stillInCanada, setStillInCanada] = useState(stay.exitDate === null);
  const [status, setStatus] = useState<ResidencyStatus>(stay.status);
  const [notes, setNotes] = useState(stay.notes ?? '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const today = new Date().toISOString().split('T')[0];

  async function handleSave() {
    setError('');
    if (!entryDate) { setError('Start date is required.'); return; }
    if (!stillInCanada && !exitDate) { setError('End date required or check "still in Canada".'); return; }
    if (!stillInCanada && exitDate < entryDate) { setError('End date must be after start date.'); return; }
    setSaving(true);
    try {
      await onSave({
        entryDate,
        exitDate: stillInCanada ? null : exitDate,
        status,
        notes: notes.trim() || undefined,
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-red-50 border border-red-200 rounded-xl p-4 space-y-3"
    >
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-500">Start date</label>
          <input
            type="date"
            max={today}
            value={entryDate}
            onChange={(e) => { setEntryDate(e.target.value); setError(''); }}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-500">End date</label>
          <input
            type="date"
            min={entryDate || undefined}
            max={today}
            value={exitDate}
            disabled={stillInCanada}
            onChange={(e) => { setExitDate(e.target.value); setError(''); }}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-white disabled:bg-gray-50 disabled:text-gray-300"
          />
        </div>
      </div>

      <label className="flex items-center gap-2 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={stillInCanada}
          onChange={(e) => setStillInCanada(e.target.checked)}
          className="w-4 h-4 accent-red-600 rounded"
        />
        <span className="text-sm text-gray-500">Currently in Canada</span>
      </label>

      <select
        value={status}
        onChange={(e) => setStatus(e.target.value as ResidencyStatus)}
        className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
      >
        <option value="permanent-resident">Permanent Resident — Full Days</option>
        <option value="other">Any Other Status (Visitor, Work, Student…) — Half Days</option>
      </select>

      <input
        type="text"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Notes (optional)"
        className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
      />

      {error && (
        <p className="text-xs text-red-600 bg-white px-3 py-2 rounded-lg border border-red-200">{error}</p>
      )}

      <div className="flex gap-2">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-60"
        >
          {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
          Save
        </button>
        <button
          onClick={onCancel}
          className="flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium transition-colors"
        >
          <X className="w-3.5 h-3.5" />
          Cancel
        </button>
      </div>
    </motion.div>
  );
}

export default function ManageStays() {
  const { email, loading: authLoading } = useAuth();
  const [stays, setStays] = useState<Stay[]>([]);
  const [mounted, setMounted] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (email) {
      const res = await fetch('/api/trips', { credentials: 'include' });
      if (res.ok) setStays(await res.json());
    } else {
      setStays(localGetStays());
    }
    setMounted(true);
  }, [email]);

  useEffect(() => {
    if (!authLoading) loadData();
  }, [authLoading, loadData]);

  async function handleAdd(stay: Stay) {
    if (email) {
      const res = await fetch('/api/trips', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(stay),
      });
      if (res.ok) {
        const saved: Stay = await res.json();
        setStays((prev) =>
          [saved, ...prev].sort(
            (a, b) => new Date(b.entryDate).getTime() - new Date(a.entryDate).getTime(),
          ),
        );
      }
    } else {
      setStays(localAddStay(stay));
    }
  }

  async function handleDelete(id: string) {
    if (email) {
      await fetch(`/api/trips/${id}`, { method: 'DELETE', credentials: 'include' });
    } else {
      localDeleteStay(id);
    }
    setStays((prev) => prev.filter((s) => s.id !== id));
  }

  async function handleUpdate(id: string, updates: Partial<Stay>) {
    if (email) {
      const res = await fetch(`/api/trips/${id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        const updated: Stay = await res.json();
        setStays((prev) =>
          prev
            .map((s) => (s.id === id ? updated : s))
            .sort((a, b) => new Date(b.entryDate).getTime() - new Date(a.entryDate).getTime()),
        );
      }
    } else {
      setStays(localUpdateStay(id, updates));
    }
    setEditingId(null);
  }

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to dashboard
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-gray-900">Manage Stays</h1>
        <p className="text-sm text-gray-500 mt-1">Add, edit, or remove your stays in Canada.</p>
      </div>

      <TripForm onAdd={handleAdd} />

      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-semibold text-gray-700">Recorded stays</h2>
          <span className="text-xs text-gray-400 bg-white border border-gray-100 rounded-full px-2.5 py-0.5 shadow-sm">
            {stays.length} {stays.length === 1 ? 'stay' : 'stays'}
          </span>
        </div>

        {stays.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-10 bg-white rounded-2xl border border-dashed border-gray-200 text-center">
            <MapPin className="w-7 h-7 text-gray-300" />
            <p className="text-sm text-gray-400">No stays recorded yet</p>
          </div>
        ) : (
          <AnimatePresence>
            {stays.map((stay) => {
              const isPR = stay.status === 'permanent-resident';
              const entry = parseISO(stay.entryDate);
              const isEditing = editingId === stay.id;

              return (
                <motion.div
                  key={stay.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0, transition: { duration: 0.18 } }}
                  className="space-y-2"
                >
                  {isEditing ? (
                    <EditRow
                      stay={stay}
                      onSave={(updates) => handleUpdate(stay.id, updates)}
                      onCancel={() => setEditingId(null)}
                    />
                  ) : (
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-semibold text-gray-800">
                            {format(entry, 'MMM d, yyyy')}
                          </span>
                          <span className="text-gray-300 text-xs">→</span>
                          <span className={`text-sm font-medium ${!stay.exitDate ? 'text-red-600' : 'text-gray-700'}`}>
                            {stay.exitDate ? format(parseISO(stay.exitDate), 'MMM d, yyyy') : 'Present'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${isPR ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                            {isPR ? 'PR' : 'Visitor / Work / Other'}
                          </span>
                          {stay.notes && (
                            <span className="text-xs text-gray-400 italic truncate max-w-[200px]">· {stay.notes}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button
                          onClick={() => setEditingId(stay.id)}
                          className="text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors p-2 rounded-lg"
                          aria-label="Edit stay"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(stay.id)}
                          className="text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors p-2 rounded-lg"
                          aria-label="Delete stay"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>
    </main>
  );
}
