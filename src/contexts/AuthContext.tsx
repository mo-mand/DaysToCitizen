'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface AuthContextValue {
  email: string | null;
  loading: boolean;
  setEmail: (email: string | null) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  email: null,
  loading: true,
  setEmail: () => {},
  logout: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((data) => { setEmail(data.user?.email ?? null); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const logout = useCallback(async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setEmail(null);
  }, []);

  return (
    <AuthContext.Provider value={{ email, loading, setEmail, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
