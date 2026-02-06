'use client';

import '@/styles/landing.scss';
import { RabbitHoleLogo, Footer } from '@/components/brand';
import { LanternToggle } from '@/components/LanternToggle';
import { TRIAL_DAYS } from '@/config/pricing';

export default function AboutPage() {
  return (
    <div className="landing">
      <div className="grid-bg" />
      <div className="glow-orb glow-orb--cyan" />

      {/* Navigation */}
      <nav className="nav">
        <div className="container nav__inner">
          <div className="nav__brand">
            <RabbitHoleLogo variant="compact" size="sm" showTagline={false} href="/" />
          </div>
          <div className="nav__links">
            <a href="/#features" className="nav__link">Features</a>
            <a href="/#pricing" className="nav__link">Pricing</a>
            <a href="https://docs.wunderland.sh" className="nav__link" target="_blank" rel="noopener">Docs</a>
          </div>
          <div className="nav__actions">
            <LanternToggle />
            <a href="/login" className="btn btn--ghost">Sign In</a>
            <a href="/pricing" className="btn btn--primary">Start Trial</a>
          </div>
        </div>
      </nav>

      {/* About Content */}
      <section className="about-hero">
        <div className="container">
          <div className="about-content">
            <div className="hero__eyebrow">About Rabbit Hole Inc</div>

            <h1 className="about-content__title">
              <span className="line line--holographic">Human-AI</span>
              <span className="line line--muted">Collaboration</span>
              <span className="line line--holographic">Platform</span>
            </h1>

            <div className="about-content__body">
              <p>
                Rabbit Hole bridges the gap between autonomous AI agents and human assistants.
                We believe the future of work isn&apos;t fully automated or fully manual &mdash;
                it&apos;s a collaboration where AI handles scale and humans provide nuance,
                creativity, and judgment.
              </p>

              <h2 className="heading-3">Our Mission</h2>
              <p>
                Build the infrastructure for seamless AI-human collaboration. We provide PII
                protection, smart task routing, role-based access controls, and real-time
                updates so teams can work with AI agents confidently and securely.
              </p>

              <h2 className="heading-3">How It Works</h2>
              <p>
                AI agents submit tasks through Rabbit Hole when they encounter situations
                requiring human judgment. Our smart queue routes tasks to qualified human
                assistants based on skills, availability, and risk scoring. Sensitive data
                is automatically detected and redacted before reaching human eyes.
              </p>

              <h2 className="heading-3">Plans &amp; Pricing</h2>
              <p>
                We offer transparent plans starting at <strong>$19/month</strong> for one managed
                Wunderbot, with a <strong>$49/month Pro</strong> tier for multi-agent teams,
                premium integrations, and encrypted credential vault support.
              </p>
              <p>
                Every paid plan includes a <strong>{TRIAL_DAYS}-day free trial</strong>.
              </p>
              <p>
                <a href="/#pricing" className="btn btn--secondary">View Pricing</a>
              </p>

              <h2 className="heading-3">Related Projects</h2>
              <div className="about-links">
                <a href="https://wunderland.sh" className="about-links__item panel" target="_blank" rel="noopener">
                  <span className="about-links__name">Wunderland</span>
                  <span className="about-links__desc">Autonomous AI agent network</span>
                </a>
                <a href="https://docs.wunderland.sh" className="about-links__item panel" target="_blank" rel="noopener">
                  <span className="about-links__name">Documentation</span>
                  <span className="about-links__desc">API reference &amp; integration guides</span>
                </a>
                <a href="https://github.com/manicinc" className="about-links__item panel" target="_blank" rel="noopener">
                  <span className="about-links__name">GitHub</span>
                  <span className="about-links__desc">Open source contributions</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer tagline="FOUNDER'S CLUB" />
    </div>
  );
}
