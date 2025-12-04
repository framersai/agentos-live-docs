const features = [
  {
    icon: '⚡',
    title: 'One-Line Integration',
    description: 'Drop a single script tag into any HTML page. No npm, no build step, no webpack config nightmares.',
    color: 'from-yellow-500/20 to-orange-500/20',
    borderColor: 'border-yellow-500/30',
  },
  {
    icon: '🔐',
    title: 'Zero PCI Scope',
    description: 'We handle all payment processing. Your site never touches card data. Sleep easy.',
    color: 'from-emerald-500/20 to-teal-500/20',
    borderColor: 'border-emerald-500/30',
  },
  {
    icon: '🎨',
    title: 'Fully Customizable',
    description: 'Match your brand with custom colors, fonts, and CSS. Or use our beautiful defaults.',
    color: 'from-pink-500/20 to-rose-500/20',
    borderColor: 'border-pink-500/30',
  },
  {
    icon: '📊',
    title: 'Real-Time Analytics',
    description: 'Track MRR, conversion rates, and checkout funnels from a beautiful dashboard.',
    color: 'from-blue-500/20 to-indigo-500/20',
    borderColor: 'border-blue-500/30',
  },
  {
    icon: '🌍',
    title: 'Multi-Provider Support',
    description: 'Stripe, Lemon Squeezy, Paddle, and crypto. Use one or mix and match per plan.',
    color: 'from-purple-500/20 to-violet-500/20',
    borderColor: 'border-purple-500/30',
  },
  {
    icon: '🚀',
    title: 'Blazing Fast',
    description: 'Under 5KB gzipped. Lazy-loads provider SDKs only when needed. Core Web Vitals friendly.',
    color: 'from-cyan-500/20 to-sky-500/20',
    borderColor: 'border-cyan-500/30',
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="gpw-section bg-gpw-bg-subtle dark:bg-gpw-bg-muted">
      <div className="gpw-container">
        <div className="gpw-section-header">
          <span className="gpw-badge-primary mb-4">Features</span>
          <h2 className="gpw-section-title">
            Everything you need to{' '}
            <span className="gpw-text-gradient">monetize your project</span>
          </h2>
          <p className="gpw-section-subtitle">
            Built for developers who want payments without the pain. 
            All the power, none of the complexity.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className={`gpw-card-hover p-6 lg:p-8 ${feature.borderColor}`}
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              <div className={`gpw-feature-icon bg-gradient-to-br ${feature.color} mb-5`}>
                <span>{feature.icon}</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gpw-text-primary">
                {feature.title}
              </h3>
              <p className="text-gpw-text-muted leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}





