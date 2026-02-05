'use client';

import { useState } from 'react';
import Link from 'next/link';
import '@/styles/landing.scss';

export default function SignupPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Demo: simulate signup
        await new Promise(r => setTimeout(r, 1000));

        if (name && email && password) {
            // In real app, call auth API
            window.location.href = '/admin';
        } else {
            setError('Please fill in all fields');
        }
        setLoading(false);
    };

    return (
        <div className="landing" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="grid-bg" />
            <div className="glow-orb glow-orb--magenta" />

            <div className="panel panel--holographic" style={{ width: '100%', maxWidth: 420, padding: '2.5rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <Link href="/">
                        <div className="nav__logo" style={{ margin: '0 auto 1rem', width: 56, height: 56, cursor: 'pointer' }}>
                            <span style={{ fontSize: '1.5rem' }}>R</span>
                        </div>
                    </Link>
                    <h1 className="heading-3" style={{ marginBottom: '0.5rem' }}>Get Started</h1>
                    <p className="text-label">Create your RabbitHole account</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label className="text-label" style={{ display: 'block', marginBottom: '0.5rem' }}>Full Name</label>
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
                        <label className="text-label" style={{ display: 'block', marginBottom: '0.5rem' }}>Work Email</label>
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
                        {loading ? 'Creating account...' : 'Create Account'}
                    </button>
                </form>

                <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '1rem' }}>
                    By signing up, you agree to our Terms of Service and Privacy Policy
                </p>

                <div className="divider" style={{ margin: '1.5rem 0' }} />

                <p style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                    Already have an account?{' '}
                    <Link href="/login" style={{ color: 'var(--color-accent)' }}>Sign in</Link>
                </p>

                <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                    <Link href="/admin" className="text-label" style={{ color: 'var(--color-text-muted)' }}>
                        Or explore the demo →
                    </Link>
                </div>
            </div>
        </div>
    );
}
