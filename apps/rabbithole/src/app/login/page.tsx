'use client';

import { useState } from 'react';
import Link from 'next/link';
import '@/styles/landing.scss';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Demo: simulate login
        await new Promise(r => setTimeout(r, 1000));

        if (email && password) {
            // In real app, call auth API
            window.location.href = '/admin';
        } else {
            setError('Please enter email and password');
        }
        setLoading(false);
    };

    return (
        <div className="landing" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="grid-bg" />
            <div className="glow-orb glow-orb--cyan" />

            <div className="panel panel--holographic" style={{ width: '100%', maxWidth: 420, padding: '2.5rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <Link href="/">
                        <div className="nav__logo" style={{ margin: '0 auto 1rem', width: 56, height: 56, cursor: 'pointer' }}>
                            <span style={{ fontSize: '1.5rem' }}>R</span>
                        </div>
                    </Link>
                    <h1 className="heading-3" style={{ marginBottom: '0.5rem' }}>Welcome Back</h1>
                    <p className="text-label">Sign in to your account</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label className="text-label" style={{ display: 'block', marginBottom: '0.5rem' }}>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@company.com"
                            className="cta__input"
                            style={{ width: '100%' }}
                        />
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label className="text-label" style={{ display: 'block', marginBottom: '0.5rem' }}>Password</label>
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
                        <div className="badge badge--coral" style={{ width: '100%', justifyContent: 'center', marginBottom: '1rem', padding: '0.75rem' }}>
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
                    <Link href="/signup" style={{ color: 'var(--color-accent)' }}>Sign up</Link>
                </p>

                <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                    <Link href="/admin" className="text-label" style={{ color: 'var(--color-text-muted)' }}>
                        Or continue as guest →
                    </Link>
                </div>
            </div>
        </div>
    );
}
