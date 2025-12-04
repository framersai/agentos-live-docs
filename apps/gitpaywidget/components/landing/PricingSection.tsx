import Link from 'next/link';

const plans = [
  {
    name: 'Free',
    price: 'Free',
    period: 'forever',
    description: 'Start accepting payments today with zero upfront cost',
    features: [
      'Unlimited projects',
      'Unlimited checkouts',
      '1% platform fee per transaction',
      'Basic analytics dashboard',
      'Stripe & Lemon Squeezy support',
      'Standard widget themes',
      'Email notifications',
      'Community support via Discord',
    ],
    cta: 'Get Started Free',
    ctaHref: '/login',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '$250',
    period: 'one-time',
    description: 'Lifetime license for serious creators & founders',
    features: [
      'Everything in Free, plus:',
      '0% platform fee forever',
      'Full analytics dashboard',
      'Custom branding & white-label',
      'Priority email support',
      'Webhook event forwarding',
      'A/B testing for pricing',
      'Test/Live mode toggle',
      'Crypto payments (coming soon)',
      'Lifetime updates included',
    ],
    cta: 'Buy Lifetime License',
    ctaHref: '/login?plan=pro',
    highlighted: true,
    badge: 'Best Value',
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="gpw-section bg-gpw-bg-subtle dark:bg-gpw-bg-muted">
      <div className="gpw-container">
        <div className="gpw-section-header">
          <span className="gpw-badge-warning mb-4">Pricing</span>
          <h2 className="gpw-section-title">
            Simple, transparent{' '}
            <span className="font-display text-gpw-accent-yellow">pricing</span>
          </h2>
          <p className="gpw-section-subtitle">
            Start free, upgrade as you grow. No hidden fees. No surprise charges.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`
                relative rounded-3xl p-8 flex flex-col
                ${plan.highlighted 
                  ? 'bg-gradient-to-b from-gpw-purple-600 to-gpw-pink-600 text-white ring-4 ring-gpw-purple-500/30 shadow-gpw-xl scale-105 lg:-my-4' 
                  : 'gpw-card'}
              `}
            >
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-gpw-accent-yellow text-gpw-purple-900 text-sm font-bold shadow-lg">
                  {plan.badge}
                </div>
              )}

              <div className="mb-6">
                <h3 className={`font-display text-3xl font-bold mb-2 ${plan.highlighted ? 'text-white' : 'text-gpw-purple-600 dark:text-gpw-purple-400'}`}>
                  {plan.name}
                </h3>
                <div className="flex items-baseline gap-1">
                  <span className={`text-4xl font-bold ${plan.highlighted ? 'text-white' : 'text-gpw-text-primary'}`}>
                    {plan.price}
                  </span>
                  <span className={plan.highlighted ? 'text-white/70' : 'text-gpw-text-muted'}>
                    {plan.period}
                  </span>
                </div>
                <p className={`mt-2 text-sm ${plan.highlighted ? 'text-white/80' : 'text-gpw-text-muted'}`}>
                  {plan.description}
                </p>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <svg 
                      className={`w-5 h-5 flex-shrink-0 mt-0.5 ${plan.highlighted ? 'text-gpw-accent-yellow' : 'text-gpw-accent-green'}`}
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className={`text-sm ${plan.highlighted ? 'text-white/90' : 'text-gpw-text-secondary'}`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                href={plan.ctaHref}
                className={`
                  w-full py-3.5 px-6 rounded-full font-semibold text-center transition-all duration-200
                  ${plan.highlighted 
                    ? 'bg-white text-gpw-purple-600 hover:bg-gpw-purple-50 shadow-lg hover:shadow-xl hover:-translate-y-0.5' 
                    : 'gpw-btn-secondary'}
                `}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* FAQ link */}
        <p className="text-center mt-12 text-gpw-text-muted">
          Have questions?{' '}
          <Link href="/faq" className="text-gpw-purple-600 dark:text-gpw-purple-400 hover:underline">
            Check our FAQ
          </Link>
          {' '}or{' '}
          <Link href="/contact" className="text-gpw-purple-600 dark:text-gpw-purple-400 hover:underline">
            contact us
          </Link>
          .
        </p>
      </div>
    </section>
  );
}





