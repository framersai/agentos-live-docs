'use client';

import { useState } from 'react';

const plans = [
  {
    id: 'free',
    label: 'Starter',
    price: '$0',
    period: '/mo',
    description: 'Perfect for trying things out',
    features: ['1 project', 'Basic analytics', 'Community support', '1,000 checkouts/mo'],
    cta: 'Get Started',
    featured: false,
  },
  {
    id: 'pro',
    label: 'Pro',
    price: '$19',
    period: '/mo',
    description: 'For growing projects',
    features: ['10 projects', 'Advanced analytics', 'Priority support', 'Unlimited checkouts', 'Custom branding', 'Webhook events'],
    cta: 'Start Free Trial',
    featured: true,
  },
  {
    id: 'team',
    label: 'Team',
    price: '$49',
    period: '/mo',
    description: 'For agencies & teams',
    features: ['Unlimited projects', 'Team members', 'White-label widget', 'SLA guarantee', 'Dedicated support', 'Custom integrations'],
    cta: 'Contact Sales',
    featured: false,
  },
];

const themes = [
  { id: 'purple', label: 'Purple', primary: '#8b5cf6', secondary: '#ec4899' },
  { id: 'ocean', label: 'Ocean', primary: '#0ea5e9', secondary: '#6366f1' },
  { id: 'forest', label: 'Forest', primary: '#10b981', secondary: '#06b6d4' },
  { id: 'sunset', label: 'Sunset', primary: '#f97316', secondary: '#ec4899' },
];

export function WidgetPreviewSection() {
  const [selectedTheme, setSelectedTheme] = useState(themes[0]);

  return (
    <section className="gpw-section bg-gpw-bg-subtle dark:bg-gpw-bg-muted overflow-hidden">
      <div className="gpw-container">
        <div className="gpw-section-header">
          <span className="gpw-badge-primary mb-4">Live Preview</span>
          <h2 className="gpw-section-title">
            See how it looks{' '}
            <span className="font-display text-gpw-pink-500">on your site</span>
          </h2>
          <p className="gpw-section-subtitle">
            Fully customizable pricing cards that match your brand. 
            Light and dark mode included.
          </p>
        </div>

        {/* Theme selector */}
        <div className="flex justify-center gap-3 mb-10">
          {themes.map((theme) => (
            <button
              key={theme.id}
              onClick={() => setSelectedTheme(theme)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                ${selectedTheme.id === theme.id 
                  ? 'bg-white dark:bg-gpw-surface-raised shadow-gpw-md scale-105' 
                  : 'bg-transparent hover:bg-white/50 dark:hover:bg-white/10'}
              `}
            >
              <span
                className="w-4 h-4 rounded-full"
                style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})` }}
              />
              <span className={selectedTheme.id === theme.id ? 'text-gpw-text-primary' : 'text-gpw-text-muted'}>
                {theme.label}
              </span>
            </button>
          ))}
        </div>

        {/* Widget preview */}
        <div className="relative max-w-5xl mx-auto">
          {/* Browser chrome */}
          <div className="rounded-t-2xl bg-gray-100 dark:bg-gray-800 px-4 py-3 flex items-center gap-3 border border-b-0 border-gray-200 dark:border-gray-700">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
            </div>
            <div className="flex-1 mx-4">
              <div className="bg-white dark:bg-gray-700 rounded-lg px-4 py-1.5 text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>your-awesome-site.github.io</span>
              </div>
            </div>
          </div>

          {/* Content area */}
          <div className="bg-white dark:bg-gpw-surface rounded-b-2xl border border-t-0 border-gray-200 dark:border-gray-700 p-8 md:p-12">
            {/* Fake content */}
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-2 text-gpw-text-primary">Choose Your Plan</h3>
              <p className="text-gpw-text-muted">Start free, upgrade when you need more.</p>
            </div>

            {/* Plan cards */}
            <div className="grid md:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className={`
                    relative rounded-2xl p-6 transition-all duration-300
                    ${plan.featured 
                      ? 'ring-2 shadow-gpw-lg scale-105' 
                      : 'border border-gray-200 dark:border-gray-700 hover:shadow-gpw-md'}
                  `}
                  style={{
                    ringColor: plan.featured ? selectedTheme.primary : undefined,
                    background: plan.featured 
                      ? `linear-gradient(135deg, ${selectedTheme.primary}15, ${selectedTheme.secondary}15)`
                      : undefined,
                  }}
                >
                  {plan.featured && (
                    <div
                      className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold text-white"
                      style={{ background: `linear-gradient(135deg, ${selectedTheme.primary}, ${selectedTheme.secondary})` }}
                    >
                      MOST POPULAR
                    </div>
                  )}

                  <h4 
                    className="font-display text-2xl font-bold mb-1"
                    style={{ color: selectedTheme.primary }}
                  >
                    {plan.label}
                  </h4>
                  <div className="mb-3">
                    <span className="text-3xl font-bold text-gpw-text-primary">{plan.price}</span>
                    <span className="text-gpw-text-muted">{plan.period}</span>
                  </div>
                  <p className="text-sm text-gpw-text-muted mb-4">{plan.description}</p>

                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm">
                        <svg 
                          className="w-4 h-4 flex-shrink-0" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke={selectedTheme.secondary}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gpw-text-secondary">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    className={`
                      w-full py-3 rounded-full font-semibold transition-all duration-200
                      ${plan.featured 
                        ? 'text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5' 
                        : 'border-2 hover:bg-gray-50 dark:hover:bg-white/5'}
                    `}
                    style={{
                      background: plan.featured 
                        ? `linear-gradient(135deg, ${selectedTheme.primary}, ${selectedTheme.secondary})`
                        : 'transparent',
                      borderColor: plan.featured ? 'transparent' : selectedTheme.primary + '50',
                      color: plan.featured ? 'white' : selectedTheme.primary,
                    }}
                  >
                    {plan.cta}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Code example */}
        <div className="mt-8 max-w-2xl mx-auto">
          <p className="text-center text-sm text-gpw-text-muted mb-4">
            Generate this with just a few lines of code:
          </p>
          <div className="gpw-code-block">
            <pre className="gpw-code-content text-sm">
              <code>
                <span className="text-pink-400">renderGitPayWidget</span>
                <span className="text-gray-400">(&#123;</span>
                {'\n  '}
                <span className="text-purple-300">project</span>
                <span className="text-gray-400">:</span>
                <span className="text-green-300"> 'your-org/site'</span>
                <span className="text-gray-400">,</span>
                {'\n  '}
                <span className="text-purple-300">plans</span>
                <span className="text-gray-400">:</span>
                <span className="text-gray-400"> [...]</span>
                <span className="text-gray-400">,</span>
                {'\n  '}
                <span className="text-purple-300">theme</span>
                <span className="text-gray-400">:</span>
                <span className="text-gray-400"> &#123;</span>
                <span className="text-purple-300"> accentHex</span>
                <span className="text-gray-400">:</span>
                <span className="text-green-300"> '{selectedTheme.primary}'</span>
                <span className="text-gray-400"> &#125;</span>
                {'\n'}
                <span className="text-gray-400">&#125;)</span>
              </code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}





