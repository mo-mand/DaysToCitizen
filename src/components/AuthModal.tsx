'use client';

import { useState } from 'react';
import { X, Mail, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getStays, clearStays } from '@/lib/storage';

interface Props {
  onClose: () => void;
}

export function AuthModal({ onClose }: Props) {
  const { setEmail } = useAuth();
  const [emailInput, setEmailInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const trimmed = emailInput.trim().toLowerCase();
    if (!trimmed || !trimmed.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    setLoading(true);
    try {
      // Migrate local stays before signing in
      const localStays = getStays();

      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmed }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? 'Something went wrong. Please try again.'); return; }

      // Migrate local stays to the account
      if (localStays.length > 0) {
        await Promise.all(
          localStays.map((s) =>
            fetch('/api/trips', {
              method: 'POST',
              credentials: 'include',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(s),
            }),
          ),
        );
        clearStays();
      }

      setEmail(data.email);
      onClose();
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl p-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-red-50 rounded-xl">
              <Mail className="w-5 h-5 text-red-600" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">Sign in to save your data</h2>
          </div>
          <p className="text-sm text-gray-500">
            Enter your email — no password or verification needed. Your stays will be saved permanently.
          </p>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700" htmlFor="auth-email">
              Email address
            </label>
            <input
              id="auth-email"
              type="email"
              required
              autoFocus
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-sm transition-colors disabled:opacity-60"
          >
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing in…</> : 'Continue with Email'}
          </button>

          <p className="text-xs text-center text-gray-400">
            No verification email. We use your address only to identify you.
          </p>
        </form>
      </div>
    </div>
  );
}
