'use client';

import { useState } from 'react';
import '@/styles/landing.scss';
import '@/styles/wunderland.scss';
import RabbitVortex from '@/components/RabbitVortex';
import LookingGlassCTA from '@/components/LookingGlassCTA';
import { PricingSection } from '@/components/PricingSection';
import { RabbitHoleLogo, Footer } from '@/components/brand';
import { LanternToggle } from '@/components/LanternToggle';
import { TRIAL_DAYS } from '@/config/pricing';

export default function LandingPage() {
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [waitlistStatus, setWaitlistStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleWaitlist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!waitlistEmail) return;
    setWaitlistStatus('loading');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'waitlist', email: waitlistEmail }),
      });
      setWaitlistStatus(res.ok ? 'success' : 'error');
    } catch {
      setWaitlistStatus('error');
    }
  };

  return (
    <div className="landing">
      {/* Background effects */}
      <div className="grid-bg" />
      <div className="glow-orb glow-orb--cyan" />
      <div className="glow-orb glow-orb--magenta" />

      {/* Navigation */}
      <nav className="nav">
        <div className="container nav__inner">
          <div className="nav__brand">
            <RabbitHoleLogo variant="compact" size="sm" showTagline={false} href="/" />
          </div>

          <div className="nav__links">
            <a href="#features" className="nav__link">Features</a>
            <a href="#how-it-works" className="nav__link">How It Works</a>
            <a href="#pricing" className="nav__link">Pricing</a>
            <a href="/about" className="nav__link">About</a>
            <a href="/contact" className="nav__link">Contact</a>
            <a href="https://docs.wunderland.sh" className="nav__link" target="_blank" rel="noopener">Docs</a>
          </div>

          <div className="nav__actions">
            <LanternToggle />
            <a href="/login" className="btn btn--ghost">Sign In</a>
            <a href="/pricing" className="btn btn--primary">Start Trial</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero__content">
            <div className="hero__eyebrow">Human-AI Collaboration Platform</div>

            <h1 className="hero__title">
              <span className="line line--holographic">Bridge</span>
              <span className="line line--muted">The Gap Between</span>
              <span className="line line--holographic">AI & Humans</span>
            </h1>

            <p className="hero__subtitle">
              Rabbit Hole connects AI agents with human assistants for tasks that
              require nuance, creativity, and judgment. Built for teams that demand
              both automation and authenticity.
            </p>

            <div className="hero__actions">
              <a href="/pricing" className="btn btn--primary btn--lg">
                Start {TRIAL_DAYS}-day free trial
              </a>
              <a href="#how-it-works" className="btn btn--secondary btn--lg">
                See How It Works
              </a>
            </div>
          </div>

          <div className="hero__visual">
            <RabbitVortex size={450} />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats">
        <div className="container">
          <div className="stats__grid">
            <div className="stats__item">
              <div className="stats__value">10<span>K+</span></div>
              <div className="stats__label">Tasks Completed</div>
            </div>
            <div className="stats__item">
              <div className="stats__value">99<span>%</span></div>
              <div className="stats__label">Accuracy Rate</div>
            </div>
            <div className="stats__item">
              <div className="stats__value">500<span>+</span></div>
              <div className="stats__label">Human Assistants</div>
            </div>
            <div className="stats__item">
              <div className="stats__value">&lt;2<span>H</span></div>
              <div className="stats__label">Avg Response</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features" id="features">
        <div className="container">
          <div className="features__header">
            <h2 className="features__title">
              <span className="text-holographic">Built</span> For The Future
            </h2>
            <p className="features__subtitle">
              A platform designed from the ground up for AI-human collaboration
            </p>
          </div>

          <div className="features__grid">
            <div className="feature-card">
              <div className="feature-card__icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <h3 className="feature-card__title">PII Protection</h3>
              <p className="feature-card__description">
                Automatic detection and redaction of sensitive information.
                Human assistants only see what they need to see.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-card__icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="3" width="7" height="7" rx="1" />
                  <rect x="3" y="14" width="7" height="7" rx="1" />
                  <rect x="14" y="14" width="7" height="7" rx="1" />
                </svg>
              </div>
              <h3 className="feature-card__title">Smart Queue</h3>
              <p className="feature-card__description">
                Intelligent task routing based on skills, availability, and risk score.
                Get the right task to the right person.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-card__icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <h3 className="feature-card__title">RBAC Controls</h3>
              <p className="feature-card__description">
                Fine-grained role-based access control. Manage permissions at
                organization, project, and task levels.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-card__icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
              </div>
              <h3 className="feature-card__title">Real-Time Updates</h3>
              <p className="feature-card__description">
                WebSocket-powered live updates. See task status changes
                and queue movements as they happen.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-card__icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <h3 className="feature-card__title">Multi-Channel</h3>
              <p className="feature-card__description">
                Slack, Discord, Telegram, WhatsApp. Connect your AI agents
                to conversations wherever they happen.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-card__icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <h3 className="feature-card__title">Quality Assurance</h3>
              <p className="feature-card__description">
                Built-in review workflows, rating systems, and
                performance tracking for continuous improvement.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="features" id="how-it-works">
        <div className="container">
          <div className="features__header">
            <h2 className="features__title">How It Works</h2>
            <p className="features__subtitle">
              A simple, powerful workflow for AI-human collaboration
            </p>
          </div>

          <div className="terminal">
            <div className="terminal__header">
              <span className="terminal__dot terminal__dot--red" />
              <span className="terminal__dot terminal__dot--gold" />
              <span className="terminal__dot terminal__dot--green" />
            </div>
            <div className="terminal__body">
              <div><span className="terminal__prompt">$</span> <span className="terminal__command">rabbithole init --org acme</span></div>
              <div className="terminal__success">✓ Organization created</div>
              <br />
              <div><span className="terminal__prompt">$</span> <span className="terminal__command">rabbithole task create &quot;Review customer feedback&quot;</span></div>
              <div className="terminal__success">✓ Task queued [ID: task_7x2k9m]</div>
              <div className="terminal__output">→ PII scanned: 3 items redacted</div>
              <div className="terminal__output">→ Risk score: 12 (LOW)</div>
              <div className="terminal__output">→ Auto-approved for human review</div>
              <br />
              <div><span className="terminal__prompt">$</span> <span className="terminal__command">rabbithole status task_7x2k9m</span></div>
              <div className="terminal__output">Status: IN_PROGRESS</div>
              <div className="terminal__output">Assigned: Jane D. (⭐ 4.9)</div>
              <div className="terminal__output">ETA: 45 minutes</div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <PricingSection />

      {/* CTA */}
      <section className="cta">
        <div className="container">
          <div className="cta__grid">
            {/* Looking Glass Portal to Wunderland */}
            <div className="cta__portal">
              <h3 className="cta__portal-title">Build Your Own Agent</h3>
              <p className="cta__portal-desc">
                Deploy autonomous AI agents that connect to human assistants when needed.
              </p>
              <LookingGlassCTA />
            </div>

            {/* Waitlist */}
            <div className="cta__waitlist">
              <h2 className="cta__title">
                <span className="text-holographic">Ready</span> To Start?
              </h2>
              <p className="cta__subtitle">
                Join the waitlist for early access to Rabbit Hole
              </p>
              {waitlistStatus === 'success' ? (
                <p className="text-holographic" style={{ fontSize: '1.125rem', fontWeight: 600 }}>
                  You&apos;re on the list! We&apos;ll be in touch soon.
                </p>
              ) : (
                <form className="cta__form" onSubmit={handleWaitlist}>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="cta__input"
                    value={waitlistEmail}
                    onChange={(e) => setWaitlistEmail(e.target.value)}
                    required
                  />
                  <button
                    type="submit"
                    className="btn btn--primary"
                    disabled={waitlistStatus === 'loading'}
                  >
                    {waitlistStatus === 'loading' ? 'Joining...' : 'Join Waitlist'}
                  </button>
                </form>
              )}
              {waitlistStatus === 'error' && (
                <p className="text-label" style={{ color: 'var(--color-error)', marginTop: '0.5rem' }}>
                  Something went wrong. Please try again.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer tagline="FOUNDER'S CLUB" />
    </div>
  );
}
