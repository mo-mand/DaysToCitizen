'use client';

import { useState, useEffect, useRef } from 'react';
import { Bell, BellRing, X, Settings, Mail, CheckCircle2 } from 'lucide-react';
import { CitizenshipStats } from '@/lib/types';
import { useAuth } from '@/contexts/AuthContext';

const REMINDER_DAYS_KEY = 'dtc-reminder-days';
const REMINDER_NOTIFIED_KEY = 'dtc-reminder-notified';
const DEFAULT_DAYS = 14;

function getDaysSinceNotified(): number | null {
  const ts = localStorage.getItem(REMINDER_NOTIFIED_KEY);
  if (!ts) return null;
  return Math.floor((Date.now() - Number(ts)) / (1000 * 60 * 60 * 24));
}

interface Props {
  stats: CitizenshipStats;
}

export function ReminderBanner({ stats }: Props) {
  const { email } = useAuth();
  const [reminderDays, setReminderDays] = useState(DEFAULT_DAYS);
  const [dismissed, setDismissed] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [notifStatus, setNotifStatus] = useState<'idle' | 'requested' | 'granted' | 'denied' | 'sent'>('idle');
  const [emailStatus, setEmailStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [settingInput, setSettingInput] = useState(DEFAULT_DAYS);
  const notifSentRef = useRef(false);

  useEffect(() => {
    const saved = localStorage.getItem(REMINDER_DAYS_KEY);
    const days = saved ? Number(saved) : DEFAULT_DAYS;
    setReminderDays(days);
    setSettingInput(days);

    // Auto-dismiss if already notified today
    const daysSince = getDaysSinceNotified();
    if (daysSince !== null && daysSince < 1) setDismissed(true);

    // Check notification permission
    if (typeof Notification !== 'undefined') {
      if (Notification.permission === 'granted') setNotifStatus('granted');
      if (Notification.permission === 'denied') setNotifStatus('denied');
    }
  }, []);

  // Auto-send browser notification once when in window
  useEffect(() => {
    if (
      !email &&
      notifStatus === 'granted' &&
      stats.daysRemaining <= reminderDays &&
      stats.daysRemaining > 0 &&
      !notifSentRef.current
    ) {
      const daysSince = getDaysSinceNotified();
      if (daysSince === null || daysSince >= 1) {
        notifSentRef.current = true;
        new Notification('DaysToCitizen — Almost Eligible!', {
          body: `Only ${stats.daysRemaining} days until Canadian citizenship eligibility. Start preparing your application!`,
          icon: '/favicon.ico',
        });
        localStorage.setItem(REMINDER_NOTIFIED_KEY, String(Date.now()));
      }
    }
  }, [notifStatus, stats.daysRemaining, reminderDays, email]);

  const isInWindow = stats.daysRemaining <= reminderDays && stats.daysRemaining > 0 && !stats.isEligible;

  if (!isInWindow || dismissed) return null;

  function handleDismiss() {
    setDismissed(true);
  }

  function handleSaveReminderDays() {
    const val = Math.max(1, Math.min(365, settingInput));
    setReminderDays(val);
    setSettingInput(val);
    localStorage.setItem(REMINDER_DAYS_KEY, String(val));
    setShowSettings(false);
  }

  async function handleBrowserNotify() {
    if (typeof Notification === 'undefined') return;
    if (Notification.permission === 'granted') {
      setNotifStatus('granted');
      new Notification('DaysToCitizen — Almost Eligible!', {
        body: `Only ${stats.daysRemaining} days until Canadian citizenship eligibility. Start preparing your application!`,
        icon: '/favicon.ico',
      });
      localStorage.setItem(REMINDER_NOTIFIED_KEY, String(Date.now()));
      setNotifStatus('sent');
    } else {
      setNotifStatus('requested');
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        new Notification('DaysToCitizen — Almost Eligible!', {
          body: `Only ${stats.daysRemaining} days until Canadian citizenship eligibility. Start preparing your application!`,
          icon: '/favicon.ico',
        });
        localStorage.setItem(REMINDER_NOTIFIED_KEY, String(Date.now()));
        setNotifStatus('sent');
      } else {
        setNotifStatus('denied');
      }
    }
  }

  async function handleEmailReminder() {
    setEmailStatus('sending');
    try {
      const res = await fetch('/api/reminder', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ daysRemaining: stats.daysRemaining }),
      });
      if (res.ok) {
        setEmailStatus('sent');
        localStorage.setItem(REMINDER_NOTIFIED_KEY, String(Date.now()));
      } else {
        setEmailStatus('error');
      }
    } catch {
      setEmailStatus('error');
    }
  }

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-amber-100 rounded-xl flex-shrink-0">
          <BellRing className="w-5 h-5 text-amber-600" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-sm font-bold text-amber-900">
                Almost eligible — {stats.daysRemaining} {stats.daysRemaining === 1 ? 'day' : 'days'} to go!
              </p>
              <p className="text-xs text-amber-700 mt-0.5">
                Start preparing your citizenship application documents now.
              </p>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-1.5 rounded-lg text-amber-500 hover:bg-amber-100 transition-colors"
                aria-label="Reminder settings"
              >
                <Settings className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleDismiss}
                className="p-1.5 rounded-lg text-amber-500 hover:bg-amber-100 transition-colors"
                aria-label="Dismiss"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Settings panel */}
          {showSettings && (
            <div className="mt-3 p-3 bg-white rounded-xl border border-amber-100 space-y-2">
              <p className="text-xs font-medium text-gray-600">Show this reminder when</p>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  max={365}
                  value={settingInput}
                  onChange={(e) => setSettingInput(Number(e.target.value))}
                  className="w-20 px-2 py-1 rounded-lg border border-gray-200 text-sm text-center focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
                <span className="text-xs text-gray-500">days away from eligibility</span>
                <button
                  onClick={handleSaveReminderDays}
                  className="ml-auto text-xs font-semibold text-amber-700 hover:text-amber-900 px-2 py-1 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors"
                >
                  Save
                </button>
              </div>
            </div>
          )}

          {/* Notification actions */}
          <div className="mt-3 flex items-center gap-2 flex-wrap">
            {!email ? (
              // Anonymous — browser notification
              notifStatus === 'sent' ? (
                <span className="flex items-center gap-1.5 text-xs text-green-700 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Notification sent!
                </span>
              ) : notifStatus === 'denied' ? (
                <span className="text-xs text-gray-500">Browser notifications blocked. Enable in browser settings.</span>
              ) : (
                <button
                  onClick={handleBrowserNotify}
                  disabled={notifStatus === 'requested'}
                  className="flex items-center gap-1.5 text-xs font-semibold text-amber-800 bg-amber-100 hover:bg-amber-200 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-60"
                >
                  <Bell className="w-3 h-3" />
                  {notifStatus === 'requested' ? 'Requesting…' : 'Enable browser notifications'}
                </button>
              )
            ) : (
              // Logged in — email reminder
              emailStatus === 'sent' ? (
                <span className="flex items-center gap-1.5 text-xs text-green-700 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Email reminder set for {email}
                </span>
              ) : (
                <button
                  onClick={handleEmailReminder}
                  disabled={emailStatus === 'sending'}
                  className="flex items-center gap-1.5 text-xs font-semibold text-amber-800 bg-amber-100 hover:bg-amber-200 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-60"
                >
                  <Mail className="w-3 h-3" />
                  {emailStatus === 'sending' ? 'Setting up…' : 'Remind me by email'}
                </button>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
