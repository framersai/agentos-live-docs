import Link from 'next/link';

const steps = [
  {
    number: '01',
    title: 'Create a Project',
    description: 'Sign up with GitHub and create a project in the dashboard. Takes 30 seconds.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
    ),
  },
  {
    number: '02',
    title: 'Add Provider Keys',
    description: 'Paste your Stripe or Lemon Squeezy API keys. We encrypt them with AES-256.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
      </svg>
    ),
  },
  {
    number: '03',
    title: 'Embed the Widget',
    description: 'Copy the script tag into your HTML. Configure plans and pricing inline.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
  },
  {
    number: '04',
    title: 'Get Paid',
    description: 'Visitors click, checkout via your provider, and you get paid. That simple.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="gpw-section bg-gpw-bg-base dark:bg-gpw-bg-base">
      <div className="gpw-container">
        <div className="gpw-section-header">
          <span className="gpw-badge-pink mb-4">How It Works</span>
          <h2 className="gpw-section-title">
            From zero to payments{' '}
            <span className="font-display text-gpw-purple-600 dark:text-gpw-purple-400">
              in minutes
            </span>
          </h2>
          <p className="gpw-section-subtitle">
            No backend needed. No OAuth dance. No PCI compliance headaches.
            Just drop in and go.
          </p>
        </div>

        {/* Steps grid */}
        <div className="relative">
          {/* Connection line (desktop) */}
          <div className="hidden lg:block absolute top-20 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-gpw-purple-500/20 via-gpw-pink-500/40 to-gpw-purple-500/20" />

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
            {steps.map((step, index) => (
              <div key={step.number} className="relative">
                {/* Step card */}
                <div className="gpw-card p-6 text-center group hover:shadow-gpw-lg transition-all duration-300">
                  {/* Number circle */}
                  <div className="relative mx-auto mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gpw-purple-600 to-gpw-pink-500 flex items-center justify-center text-white shadow-gpw-button group-hover:shadow-gpw-glow transition-shadow duration-300">
                      {step.icon}
                    </div>
                    <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-gpw-accent-yellow text-gpw-purple-900 text-xs font-bold flex items-center justify-center shadow-md">
                      {step.number}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold mb-2 text-gpw-text-primary">
                    {step.title}
                  </h3>
                  <p className="text-sm text-gpw-text-muted">
                    {step.description}
                  </p>
                </div>

                {/* Arrow (mobile/tablet) */}
                {index < steps.length - 1 && (
                  <div className="lg:hidden flex justify-center my-4">
                    <svg className="w-6 h-6 text-gpw-purple-500/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link href="/docs/quickstart" className="gpw-btn-primary">
            Read the Quick Start Guide
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}





