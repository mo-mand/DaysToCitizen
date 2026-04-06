'use client';

import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { MapPin, Settings2, ShieldAlert, ExternalLink } from 'lucide-react';
import Link from 'next/link';

import { TripForm } from '@/components/TripForm';
import { TripCard } from '@/components/TripCard';
import { CountdownCard } from '@/components/CountdownCard';
import { ProgressCard } from '@/components/ProgressCard';
import { StatsCards } from '@/components/StatsCards';
import { ReminderBanner } from '@/components/ReminderBanner';
import { Footer } from '@/components/Footer';

import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

import { Stay } from '@/lib/types';
import { calculateStats } from '@/lib/calculations';
import {
  getStays as localGetStays,
  addStay as localAddStay,
  deleteStay as localDeleteStay,
} from '@/lib/storage';

export default function Home() {
  const { email, loading: authLoading } = useAuth();
  const { t } = useLanguage();

  const [stays, setStays] = useState<Stay[]>([]);
  const [mounted, setMounted] = useState(false);

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

  async function handleAddStay(stay: Stay) {
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

  async function handleDeleteStay(id: string) {
    if (email) {
      await fetch(`/api/trips/${id}`, { method: 'DELETE', credentials: 'include' });
    } else {
      localDeleteStay(id);
    }
    setStays((prev) => prev.filter((s) => s.id !== id));
  }

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const stats = calculateStats(stays);

  return (
    <main className="max-w-6xl mx-auto px-4 py-8 space-y-6">

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_2.7fr] gap-10 items-start">

        {/* Left — Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="space-y-4 lg:sticky lg:top-24"
        >
          <ReminderBanner stats={stats} />
          <CountdownCard stats={stats} />
          <ProgressCard stats={stats} />
          <StatsCards stats={stats} />
        </motion.div>

        {/* Right — Form + Stays list */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          <TripForm onAdd={handleAddStay} />

          {/* Stays list */}
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-sm font-semibold text-gray-700">{t.tripsTitle}</h2>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 bg-white border border-gray-100 rounded-full px-2.5 py-0.5 shadow-sm">
                  {stays.length} {stays.length === 1 ? 'stay' : 'stays'}
                </span>
                <Link
                  href="/ManageStays"
                  className="flex items-center gap-1.5 text-xs font-semibold text-white bg-green-600 hover:bg-green-700 rounded-lg px-3 py-1.5 shadow-sm transition-colors"
                >
                  <Settings2 className="w-3.5 h-3.5" />
                  {t.manage}
                </Link>
              </div>
            </div>

            {stays.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 py-8 bg-white rounded-2xl border border-dashed border-gray-200 text-center">
                <MapPin className="w-7 h-7 text-gray-300" />
                <div>
                  <p className="text-sm font-medium text-gray-400">{t.noTrips}</p>
                  <p className="text-xs text-gray-300 mt-0.5">Add your first stay above</p>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <AnimatePresence>
                  {stays.map((stay, i) => (
                    <TripCard
                      key={stay.id}
                      stay={stay}
                      index={i}
                      onDelete={handleDeleteStay}
                    />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* How it works */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
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
          {/* Prohibitions warning */}
          <li className="flex items-start gap-2 text-sm text-blue-700 pt-2 border-t border-gray-100 mt-1">
            <ShieldAlert className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
            <span>
              Certain situations may prohibit you from applying regardless of physical presence — including active criminal charges, indictable convictions in the past 4 years, fraud-based revocation, or terrorism offences while a permanent resident.{' '}
              <a
                href="https://www.canada.ca/en/immigration-refugees-citizenship/services/canadian-citizenship/become-canadian-citizen/eligibility.html"
                target="_blank"
                rel="noopener noreferrer"
                className="underline font-medium hover:text-blue-900 inline-flex items-center gap-0.5"
              >
                Full eligibility criteria at IRCC <ExternalLink className="w-3 h-3" />
              </a>
              {' — '}This tracker counts physical presence only and is not legal advice.
            </span>
          </li>
        </ul>
      </motion.div>

      <Footer />
    </main>
  );
}
