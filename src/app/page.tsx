'use client';

import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Edit2, MapPin } from 'lucide-react';
import { format, parseISO } from 'date-fns';

import { PRDateSetup } from '@/components/PRDateSetup';
import { TripForm } from '@/components/TripForm';
import { TripCard } from '@/components/TripCard';
import { CountdownCard } from '@/components/CountdownCard';
import { ProgressCard } from '@/components/ProgressCard';
import { StatsCards } from '@/components/StatsCards';
import { Footer } from '@/components/Footer';
import { MapleLeaf } from '@/components/MapleLeaf';

import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

import { Absence, UserProfile } from '@/lib/types';
import { calculateStats } from '@/lib/calculations';
import {
  getAbsences as localGetAbsences,
  addAbsence as localAddAbsence,
  deleteAbsence as localDeleteAbsence,
  getProfile as localGetProfile,
  saveProfile as localSaveProfile,
} from '@/lib/storage';

// ─── helpers ──────────────────────────────────────────────────────────────────

function formatDate(dateStr: string | null) {
  if (!dateStr) return '';
  return format(parseISO(dateStr), 'MMM d, yyyy');
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Home() {
  const { email, loading: authLoading } = useAuth();
  const { t } = useLanguage();

  const [profile, setProfile] = useState<UserProfile>({ prDate: null, arrivalDate: null });
  const [absences, setAbsences] = useState<Absence[]>([]);
  const [mounted, setMounted] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);

  // ── Load data ─────────────────────────────────────────────────────────────

  const loadData = useCallback(async () => {
    if (email) {
      const [profileRes, absencesRes] = await Promise.all([
        fetch('/api/profile', { credentials: 'include' }),
        fetch('/api/trips', { credentials: 'include' }),
      ]);
      if (profileRes.ok) setProfile(await profileRes.json());
      if (absencesRes.ok) setAbsences(await absencesRes.json());
    } else {
      setProfile(localGetProfile());
      setAbsences(localGetAbsences());
    }
    setMounted(true);
  }, [email]);

  useEffect(() => {
    if (!authLoading) loadData();
  }, [authLoading, loadData]);

  // ── Profile actions ───────────────────────────────────────────────────────

  async function handleSaveProfile(p: UserProfile) {
    if (email) {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(p),
      });
      if (res.ok) setProfile(await res.json());
    } else {
      localSaveProfile(p);
      setProfile(p);
    }
    setEditingProfile(false);
  }

  // ── Absence actions ───────────────────────────────────────────────────────

  async function handleAddAbsence(absence: Absence) {
    if (email) {
      const res = await fetch('/api/trips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(absence),
      });
      if (res.ok) {
        const saved: Absence = await res.json();
        setAbsences((prev) =>
          [saved, ...prev].sort(
            (a, b) => new Date(b.departureDate).getTime() - new Date(a.departureDate).getTime(),
          ),
        );
      }
    } else {
      setAbsences(localAddAbsence(absence));
    }
  }

  async function handleDeleteAbsence(id: string) {
    if (email) {
      await fetch(`/api/trips/${id}`, { method: 'DELETE', credentials: 'include' });
    } else {
      localDeleteAbsence(id);
    }
    setAbsences((prev) => prev.filter((a) => a.id !== id));
  }

  // ── Loading state ─────────────────────────────────────────────────────────

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // ── First-time setup ──────────────────────────────────────────────────────

  if (!profile.prDate && !editingProfile) {
    return (
      <main className="max-w-6xl mx-auto px-4 py-12">
        <PRDateSetup onSave={handleSaveProfile} />
      </main>
    );
  }

  // ── Main dashboard ────────────────────────────────────────────────────────

  const stats = calculateStats(absences, profile);

  return (
    <main className="max-w-6xl mx-auto px-4 py-8 space-y-6">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t.journeyTitle}</h1>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span className="text-sm text-gray-500">
              {t.prDate}:{' '}
              <span className="font-semibold text-gray-800">
                {formatDate(profile.prDate)}
              </span>
              {profile.arrivalDate && (
                <span className="ml-2 text-gray-400">
                  · Arrived: {formatDate(profile.arrivalDate)}
                </span>
              )}
            </span>
            <button
              onClick={() => setEditingProfile((v) => !v)}
              className="flex items-center gap-1 text-xs text-red-600 hover:text-red-700 font-medium transition-colors"
            >
              <Edit2 className="w-3 h-3" />
              {t.changeDates}
            </button>
          </div>

          {/* Inline profile editor */}
          <AnimatePresence>
            {editingProfile && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden mt-3"
              >
                <PRDateSetup onSave={handleSaveProfile} initialProfile={profile} compact />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <MapleLeaf className="w-10 h-10 flex-shrink-0 opacity-80" />
      </motion.div>

      {/* Main grid: form (left) + countdown + stats (right) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Left — Add trip form */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <TripForm onAdd={handleAddAbsence} prDate={profile.prDate} />
        </motion.div>

        {/* Right — Countdown + progress + stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="space-y-4"
        >
          <CountdownCard stats={stats} />
          <ProgressCard stats={stats} />
          <StatsCards stats={stats} />
        </motion.div>
      </div>

      {/* Trip list */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-3"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">{t.tripsTitle}</h2>
          <span className="text-xs text-gray-400 bg-white border border-gray-100 rounded-full px-3 py-1 shadow-sm">
            {absences.length} {absences.length === 1 ? 'trip' : 'trips'}
          </span>
        </div>

        {absences.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-10 bg-white rounded-2xl border border-dashed border-gray-200 text-center">
            <MapPin className="w-8 h-8 text-gray-300" />
            <div>
              <p className="text-sm font-medium text-gray-500">{t.noTrips}</p>
              <p className="text-xs text-gray-400 mt-0.5">{t.noTripsHint}</p>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <AnimatePresence>
              {absences.map((absence, i) => (
                <TripCard
                  key={absence.id}
                  absence={absence}
                  index={i}
                  onDelete={handleDeleteAbsence}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.div>

      {/* How it works */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-3"
      >
        <h3 className="font-bold text-gray-900">{t.howTitle}</h3>
        <ul className="space-y-2">
          {[t.how1, t.how2, t.how3, t.how4].map((text, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
              <span className="text-red-500 font-bold mt-0.5 flex-shrink-0">·</span>
              <span>{text}</span>
            </li>
          ))}
        </ul>
      </motion.div>

      <Footer />
    </main>
  );
}
