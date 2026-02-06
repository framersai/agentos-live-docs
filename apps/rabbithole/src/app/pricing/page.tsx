'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { PRICING_TIERS, TRIAL_DAYS } from '@/config/pricing';
import '@/styles/landing.scss';

export default function PricingPage() {
  return (
    <Suspense>
      <PricingContent />
    </Suspense>
  );
}

function PricingContent() {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const cancelled = searchParams.get('checkout') === 'cancelled';

  const handleSelectPlan = async (planId: string) => {
    setLoading(planId);
    setError('');

    const token =
      typeof window !== 'undefined' ? localStorage.getItem('vcaAuthToken') : null;

    if (!token) {
      setLoading(null);
      router.push(`/signup?next=/pricing`);
      return;
    }

    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ planId }),
      });

      const body = await res.json();
      if (!res.ok) {
        setError(body.error || 'Failed to create checkout session');
        return;
      }

      if (body.url) {
        window.location.href = body.url;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div
      className="landing"
      style={{
        minHeight: '100vh',
        padding: '4rem 1rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <div className="grid-bg" />
      <div className="glow-orb glow-orb--cyan" />
      <div className="glow-orb glow-orb--magenta" style={{ right: '10%', top: '30%' }} />

      <div style={{ maxWidth: 1100, width: '100%', textAlign: 'center' }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <div
            className="nav__logo"
            style={{ margin: '0 auto 1.5rem', width: 56, height: 56, cursor: 'pointer' }}
          >
            <span style={{ fontSize: '1.5rem' }}>R</span>
          </div>
        </Link>

        <h1
          className="heading-2"
          style={{ marginBottom: '0.75rem' }}
        >
          Launch Your Autonomous Agents
        </h1>
        <p
          className="text-label"
          style={{ maxWidth: 520, margin: '0 auto 2.5rem', fontSize: '1rem', lineHeight: 1.6 }}
        >
          Create, configure, and deploy AI agents on the Wunderland network.
          Managed hosting, encrypted credentials, and full social integration.
        </p>

        {cancelled && (
          <div
            className="badge badge--coral"
            style={{
              display: 'inline-flex',
              padding: '0.75rem 1.5rem',
              marginBottom: '1.5rem',
              fontSize: '0.875rem',
            }}
          >
            Checkout was cancelled. Choose a plan to try again.
          </div>
        )}

        {error && (
          <div
            className="badge badge--coral"
            style={{
              display: 'inline-flex',
              padding: '0.75rem 1.5rem',
              marginBottom: '1.5rem',
              fontSize: '0.875rem',
            }}
          >
            {error}
          </div>
        )}

        <div className="pricing__grid">
          {PRICING_TIERS.map((tier) => {
            const isEnterprise = tier.ctaType === 'contact';
            const isHighlighted = tier.highlighted;

            return (
              <div
                key={tier.id}
                className={[
                  'pricing-card',
                  isHighlighted && 'pricing-card--highlighted',
                  isEnterprise && 'pricing-card--enterprise',
                ].filter(Boolean).join(' ')}
              >
                {tier.badge && (
                  <span className="badge badge--gold pricing-card__badge">
                    {tier.badge}
                  </span>
                )}

                <div className="pricing-card__name">{tier.name}</div>

                <div className="pricing-card__price">
                  {tier.price}
                  {tier.period && (
                    <span className="pricing-card__period">{tier.period}</span>
                  )}
                </div>

                <p className="pricing-card__description">{tier.description}</p>

                <ul className="pricing-card__features">
                  {tier.features.map((feature) => (
                    <li key={feature} className="pricing-card__feature">
                      {feature}
                    </li>
                  ))}
                </ul>

                {isEnterprise ? (
                  <Link
                    href={tier.ctaHref || '/contact'}
                    className="btn btn--holographic btn--lg"
                    style={{ width: '100%', textAlign: 'center' }}
                  >
                    {tier.cta}
                  </Link>
                ) : (
                  <button
                    className={`btn ${isHighlighted ? 'btn--primary' : 'btn--ghost'} btn--lg`}
                    style={{ width: '100%' }}
                    onClick={() => handleSelectPlan(tier.id)}
                    disabled={loading !== null}
                  >
                    {loading === tier.id ? 'Redirecting...' : tier.cta}
                  </button>
                )}
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: '3rem', marginBottom: '2rem' }}>
          <p
            className="text-label"
            style={{ color: 'var(--color-text-muted)', fontSize: '0.8125rem', lineHeight: 1.6 }}
          >
            Cancel anytime. No contracts.
            <br />
            Includes a {TRIAL_DAYS}-day free trial on every paid plan.
            <br />
            Prefer to self-host? You can always run agents on your own infrastructure with{' '}
            <code style={{ color: 'var(--color-accent)' }}>npm install @framers/wunderland</code>.
          </p>
          <p
            className="text-label"
            style={{ color: 'var(--color-text-muted)', fontSize: '0.6875rem', lineHeight: 1.5, opacity: 0.6 }}
          >
            Included AI messages are powered by GPT-4o. Pro plans support BYO API key for unlimited usage.
          </p>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '1rem',
            flexWrap: 'wrap',
          }}
        >
          <Link
            href="/wunderland"
            className="text-label"
            style={{ color: 'var(--color-text-muted)' }}
          >
            Explore Wunderland for free
          </Link>
          <span className="text-label" style={{ color: 'var(--color-text-muted)' }}>
            |
          </span>
          <Link href="/login" className="text-label" style={{ color: 'var(--color-accent)' }}>
            Already have an account? Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
