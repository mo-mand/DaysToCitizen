'use client';

import { useState } from 'react';
import { X, Mail, KeyRound, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

interface Props {
  onClose: () => void;
}

type Step = 'email' | 'otp';

export function AuthModal({ onClose }: Props) {
  const { setEmail } = useAuth();
  const { t } = useLanguage();

  const [step, setStep] = useState<Step>('email');
  const [email, setEmailInput] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [devMode, setDevMode] = useState(false);

  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? t.errorGeneral); return; }
      // In dev (no RESEND key), show a note that OTP is in server console
      setDevMode(true); // Will show the dev hint by default; harmless in prod
      setStep('otp');
    } catch {
      setError(t.errorGeneral);
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });
      const data = await res.json();
      if (!res.ok) { setError(t.errorOtp); return; }
      setEmail(data.email);
      onClose();
    } catch {
      setError(t.errorGeneral);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {step === 'email' ? (
          <form onSubmit={handleSendOtp} className="space-y-5">
            <div className="flex items-center gap-3 mb-1">
              <div className="p-2 bg-red-50 rounded-xl">
                <Mail className="w-5 h-5 text-red-600" />
              </div>
              <h2 className="text-lg font-bold text-gray-900">{t.authTitle}</h2>
            </div>
            <p className="text-sm text-gray-500">{t.authSubtitle}</p>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700" htmlFor="auth-email">
                {t.emailLabel}
              </label>
              <input
                id="auth-email"
                type="email"
                required
                autoFocus
                value={email}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder={t.emailPlaceholder}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-sm transition-colors disabled:opacity-60"
            >
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> {t.sending}</> : t.sendCode}
            </button>

            <p className="text-xs text-center text-gray-400">{t.authDisclaimer}</p>
          </form>
        ) : (
          <form onSubmit={handleVerify} className="space-y-5">
            <div className="flex items-center gap-3 mb-1">
              <div className="p-2 bg-red-50 rounded-xl">
                <KeyRound className="w-5 h-5 text-red-600" />
              </div>
              <h2 className="text-lg font-bold text-gray-900">{t.checkEmail}</h2>
            </div>
            <p className="text-sm text-gray-500">
              {t.otpSentTo} <strong className="text-gray-800">{email}</strong>
            </p>

            {devMode && (
              <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 px-3 py-2 rounded-lg">
                {t.otpDevNote}
              </p>
            )}

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700" htmlFor="auth-otp">
                {t.otpLabel}
              </label>
              <input
                id="auth-otp"
                type="text"
                inputMode="numeric"
                pattern="[0-9]{6}"
                maxLength={6}
                required
                autoFocus
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                placeholder={t.otpPlaceholder}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-center text-2xl font-bold tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

            <button
              type="submit"
              disabled={loading || code.length !== 6}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-sm transition-colors disabled:opacity-60"
            >
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> {t.verifying}</> : t.verify}
            </button>

            <button
              type="button"
              onClick={() => { setStep('email'); setCode(''); setError(''); }}
              className="w-full text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              {t.resendCode}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
