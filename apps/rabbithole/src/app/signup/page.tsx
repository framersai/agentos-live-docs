'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import '@/styles/landing.scss';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!email || !password) {
      setError('Please enter an email and password');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password, rememberMe, name }),
      });

      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(body?.message || 'Unable to register account');
        return;
      }

      if (typeof window !== 'undefined' && body?.token) {
        localStorage.setItem('vcaAuthToken', String(body.token));
      }

      const next = searchParams.get('next');
      const target = next && next.startsWith('/') ? next : '/wunderland';
      router.push(target);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to register account');
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
      <div className="glow-orb glow-orb--magenta" />

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
            Get Started
          </h1>
          <p className="text-label">Create your RabbitHole account</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label className="text-label" style={{ display: 'block', marginBottom: '0.5rem' }}>
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jane Smith"
              className="cta__input"
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label className="text-label" style={{ display: 'block', marginBottom: '0.5rem' }}>
              Work Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jane@company.com"
              className="cta__input"
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label className="text-label" style={{ display: 'block', marginBottom: '0.5rem' }}>
              Password
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
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '1rem',
          }}
        >
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
          <Link href="/login" className="text-label" style={{ color: 'var(--color-text-muted)' }}>
            Already have an account?
          </Link>
        </div>

        <p
          style={{
            textAlign: 'center',
            fontSize: '0.75rem',
            color: 'var(--color-text-muted)',
            marginTop: '1rem',
          }}
        >
          By signing up, you agree to our Terms of Service and Privacy Policy
        </p>

        <div className="divider" style={{ margin: '1.5rem 0' }} />

        <p style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
          Already have an account?{' '}
          <Link href="/login" style={{ color: 'var(--color-accent)' }}>
            Sign in
          </Link>
        </p>

        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <Link
            href="/wunderland"
            className="text-label"
            style={{ color: 'var(--color-text-muted)' }}
          >
            Explore Wunderland without signing in →
          </Link>
        </div>
      </div>
    </div>
  );
}
