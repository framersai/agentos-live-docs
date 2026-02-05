'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import '@/styles/landing.scss';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [useGlobalAccess, setUseGlobalAccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!password || (!useGlobalAccess && !email)) {
      setError(
        useGlobalAccess
          ? 'Please enter the global access password'
          : 'Please enter email and password'
      );
      setLoading(false);
      return;
    }

    try {
      const endpoint = useGlobalAccess ? `${API_BASE}/auth/global` : `${API_BASE}/auth/login`;
      const payload = useGlobalAccess ? { password, rememberMe } : { email, password, rememberMe };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(body?.message || 'Authentication failed');
        return;
      }

      if (typeof window !== 'undefined' && body?.token) {
        localStorage.setItem('vcaAuthToken', String(body.token));
      }

      const next = searchParams.get('next');
      const target = next && next.startsWith('/') ? next : '/wunderland';
      router.push(target);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="landing"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div className="grid-bg" />
      <div className="glow-orb glow-orb--cyan" />

      <div
        className="panel panel--holographic"
        style={{ width: '100%', maxWidth: 420, padding: '2.5rem' }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link href="/">
            <div
              className="nav__logo"
              style={{ margin: '0 auto 1rem', width: 56, height: 56, cursor: 'pointer' }}
            >
              <span style={{ fontSize: '1.5rem' }}>R</span>
            </div>
          </Link>
          <h1 className="heading-3" style={{ marginBottom: '0.5rem' }}>
            Welcome Back
          </h1>
          <p className="text-label">Sign in (email/password or global access)</p>
        </div>

        <form onSubmit={handleSubmit}>
          {!useGlobalAccess && (
            <div style={{ marginBottom: '1rem' }}>
              <label className="text-label" style={{ display: 'block', marginBottom: '0.5rem' }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="cta__input"
                style={{ width: '100%' }}
              />
            </div>
          )}

          <div style={{ marginBottom: '1.5rem' }}>
            <label className="text-label" style={{ display: 'block', marginBottom: '0.5rem' }}>
              {useGlobalAccess ? 'Global Access Password' : 'Password'}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="cta__input"
              style={{ width: '100%' }}
            />
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              marginBottom: '1.5rem',
            }}
          >
            <label
              className="text-label"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}
            >
              <input
                type="checkbox"
                checked={useGlobalAccess}
                onChange={(e) => setUseGlobalAccess(e.target.checked)}
                style={{ accentColor: 'var(--color-accent)' }}
              />
              Use global access (admin)
            </label>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <label
                className="text-label"
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}
              >
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{ accentColor: 'var(--color-accent)' }}
                />
                Remember me
              </label>
              {!useGlobalAccess && (
                <Link
                  href="/signup"
                  className="text-label"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  Need an account?
                </Link>
              )}
            </div>
          </div>

          {error && (
            <div
              className="badge badge--coral"
              style={{
                width: '100%',
                justifyContent: 'center',
                marginBottom: '1rem',
                padding: '0.75rem',
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn btn--primary"
            style={{ width: '100%' }}
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="divider" style={{ margin: '1.5rem 0' }} />

        <p style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
          Don&apos;t have an account?{' '}
          <Link href="/signup" style={{ color: 'var(--color-accent)' }}>
            Sign up
          </Link>
        </p>

        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <Link
            href="/wunderland"
            className="text-label"
            style={{ color: 'var(--color-text-muted)' }}
          >
            Continue without signing in →
          </Link>
        </div>
      </div>
    </div>
  );
}
