'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useState } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign in',
  description: 'Authenticate with GitHub to access GitPayWidget dashboard and projects.',
  robots: { index: false },
  alternates: { canonical: '/login' },
};

/**
 * OAuth sign-in entry point. Uses Supabase GitHub provider.
 */
export default function LoginPage() {
  const supabase = createClientComponentClient();
  const [loading, setLoading] = useState(false);

  const signInWithGitHub = async () => {
    setLoading(true);
    await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
    setLoading(false);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gpw-primary/10 to-gpw-purple-secondary/10 px-6 py-16 space-y-6 text-center">
      <h1 className="font-display text-5xl text-gpw-primary">Welcome to GitPayWidget</h1>
      <p className="max-w-xl text-ink-600 dark:text-ink-200">
        Sign in with GitHub to manage your payment widgets, provider keys, and hosted checkout
        flows.
      </p>
      <button
        onClick={signInWithGitHub}
        disabled={loading}
        className="rounded-full bg-gpw-primary px-6 py-3 text-white font-semibold shadow-lg hover:bg-gpw-purple-tertiary disabled:opacity-50"
      >
        {loading ? 'Redirecting…' : 'Continue with GitHub'}
      </button>
    </main>
  );
}
