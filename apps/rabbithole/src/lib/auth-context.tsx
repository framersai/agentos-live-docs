'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface AuthUser {
  id: string;
  email?: string;
  name?: string;
}

export interface AuthState {
  /** The authenticated user, or null */
  user: AuthUser | null;
  /** True once the initial auth check has completed */
  ready: boolean;
  /** Shorthand for !!user */
  isAuthenticated: boolean;
  /** True when the user has an active paid subscription */
  isPaid: boolean;
  /** True when showing demo content (not authenticated) */
  isDemo: boolean;
  /** Sign out and clear token */
  logout: () => void;
  /** Re-check auth state (e.g. after login redirect) */
  refresh: () => void;
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const AuthContext = createContext<AuthState | null>(null);

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  const parts = token.split('.');
  if (parts.length !== 3 || !parts[1]) return null;
  try {
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=');
    return JSON.parse(atob(padded)) as Record<string, unknown>;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [ready, setReady] = useState(false);
  const [isPaid, setIsPaid] = useState(false);

  const checkAuth = useCallback(() => {
    try {
      const token = localStorage.getItem('vcaAuthToken');
      if (!token) {
        setUser(null);
        setIsPaid(false);
        setReady(true);
        return;
      }

      // Decode JWT payload (no verification — the backend validates the token)
      const payload = decodeJwtPayload(token);
      if (payload) {
        const exp = typeof payload.exp === 'number' ? payload.exp : null;
        if (exp && exp * 1000 <= Date.now()) {
          localStorage.removeItem('vcaAuthToken');
          setUser(null);
          setIsPaid(false);
          setReady(true);
          return;
        }

        setUser({
          id:
            (typeof payload.sub === 'string' && payload.sub) ||
            (typeof payload.id === 'string' && payload.id) ||
            '',
          email: typeof payload.email === 'string' ? payload.email : undefined,
          name: typeof payload.name === 'string' ? payload.name : undefined,
        });
        // Determine paid access from token claims.
        const subscriptionStatus =
          (typeof payload.subscriptionStatus === 'string' && payload.subscriptionStatus) ||
          (typeof payload.subscription_status === 'string' && payload.subscription_status) ||
          '';
        const tier = typeof payload.tier === 'string' ? payload.tier : '';
        const paidByStatus =
          subscriptionStatus === 'active' ||
          subscriptionStatus === 'trialing' ||
          subscriptionStatus === 'unlimited';
        const paidByTier = tier === 'unlimited';
        setIsPaid(paidByStatus || paidByTier);
      } else {
        // Opaque token — user is authenticated but we don't know subscription status
        setUser({ id: 'unknown' });
        setIsPaid(false);
      }
    } catch {
      setUser(null);
      setIsPaid(false);
    }
    setReady(true);
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Listen for storage events (e.g. login in another tab)
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === 'vcaAuthToken') checkAuth();
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, [checkAuth]);

  const logout = useCallback(() => {
    try {
      localStorage.removeItem('vcaAuthToken');
      localStorage.removeItem('wunderlandActiveSeedId');
    } catch {
      // ignore
    }
    setUser(null);
    setIsPaid(false);
  }, []);

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        ready,
        isAuthenticated,
        isPaid,
        isDemo: !isAuthenticated,
        logout,
        refresh: checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an <AuthProvider>');
  }
  return ctx;
}
