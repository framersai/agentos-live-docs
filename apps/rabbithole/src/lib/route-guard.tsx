'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './auth-context';

/**
 * Redirect to login if unauthenticated.
 * Returns true when the guard has confirmed access.
 */
export function useRequireAuth(redirectTo = '/login'): boolean {
  const { isAuthenticated, ready } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (ready && !isAuthenticated) {
      const current = typeof window !== 'undefined' ? window.location.pathname : '';
      const target = current ? `${redirectTo}?next=${encodeURIComponent(current)}` : redirectTo;
      router.replace(target);
    }
  }, [ready, isAuthenticated, router, redirectTo]);

  return ready && isAuthenticated;
}

/**
 * Redirect to login if unauthenticated, or to pricing if unpaid.
 * Returns true when the guard has confirmed access.
 */
export function useRequirePaid(): boolean {
  const { isAuthenticated, isPaid, ready } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!ready) return;
    if (!isAuthenticated) {
      const current = typeof window !== 'undefined' ? window.location.pathname : '';
      router.replace(`/login?next=${encodeURIComponent(current)}`);
    } else if (!isPaid) {
      router.replace('/pricing');
    }
  }, [ready, isAuthenticated, isPaid, router]);

  return ready && isAuthenticated && isPaid;
}
