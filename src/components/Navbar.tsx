'use client';

import { useState } from 'react';
import { LogIn, LogOut, ChevronDown, HelpCircle } from 'lucide-react';
import Link from 'next/link';
import { MapleLeaf } from './MapleLeaf';
import { AuthModal } from './AuthModal';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

export function Navbar() {
  const { email, logout } = useAuth();
  const { t } = useLanguage();
  const [showAuth, setShowAuth] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  return (
    <>
      <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <MapleLeaf className="w-7 h-7 flex-shrink-0" />
            <div>
              <span className="font-bold text-lg text-gray-900 leading-none block">DaysToCitizen</span>
              <span className="text-xs text-gray-400 leading-none">{t.tagline}</span>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <Link href="/help" className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 transition-colors hidden sm:flex">
              <HelpCircle className="w-4 h-4" />
              {t.help}
            </Link>
            <LanguageSwitcher />

            {email ? (
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="flex items-center gap-1.5 text-sm text-gray-700 hover:text-gray-900 font-medium transition-colors"
                >
                  <span className="hidden sm:block truncate max-w-[140px]">{email}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                {showMenu && (
                  <>
                    <div className="fixed inset-0" onClick={() => setShowMenu(false)} />
                    <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                      <button
                        onClick={() => { logout(); setShowMenu(false); }}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        {t.signOut}
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button
                onClick={() => setShowAuth(true)}
                className="flex items-center gap-1.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 px-4 py-1.5 rounded-lg transition-colors"
              >
                <LogIn className="w-4 h-4" />
                {t.signIn}
              </button>
            )}
          </div>
        </div>
      </nav>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </>
  );
}
