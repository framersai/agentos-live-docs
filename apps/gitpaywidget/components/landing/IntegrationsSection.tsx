const integrations = [
  {
    name: 'Stripe',
    description: 'Industry-leading payment processing',
    logo: (
      <svg className="w-10 h-10" viewBox="0 0 32 32" fill="none">
        <rect width="32" height="32" rx="6" fill="#635BFF" />
        <path d="M15.2 13.76c0-.74.61-1.04 1.62-1.04 1.45 0 3.28.44 4.73 1.22V10.4c-1.58-.63-3.14-.88-4.73-.88-3.87 0-6.44 2.02-6.44 5.4 0 5.27 7.25 4.43 7.25 6.7 0 .88-.77 1.16-1.84 1.16-1.59 0-3.63-.65-5.24-1.54v3.64c1.78.77 3.58 1.1 5.24 1.1 3.96 0 6.68-1.96 6.68-5.38-.01-5.69-7.27-4.68-7.27-6.84z" fill="#fff" />
      </svg>
    ),
    status: 'live',
  },
  {
    name: 'Lemon Squeezy',
    description: 'Merchant of record for creators',
    logo: (
      <svg className="w-10 h-10" viewBox="0 0 32 32" fill="none">
        <rect width="32" height="32" rx="6" fill="#FFC233" />
        <ellipse cx="16" cy="18" rx="8" ry="6" fill="#fff" />
        <ellipse cx="16" cy="14" rx="6" ry="4" fill="#2D2D2D" />
        <circle cx="14" cy="13" r="1" fill="#fff" />
      </svg>
    ),
    status: 'live',
  },
  {
    name: 'Paddle',
    description: 'Complete payments infrastructure',
    logo: (
      <svg className="w-10 h-10" viewBox="0 0 32 32" fill="none">
        <rect width="32" height="32" rx="6" fill="#1D1D1D" />
        <path d="M8 16c0-4.4 3.6-8 8-8s8 3.6 8 8-3.6 8-8 8-8-3.6-8-8z" fill="#3DDC84" />
        <path d="M14 12v8l6-4-6-4z" fill="#1D1D1D" />
      </svg>
    ),
    status: 'coming',
  },
  {
    name: 'Coinbase Commerce',
    description: 'Accept crypto payments easily',
    logo: (
      <svg className="w-10 h-10" viewBox="0 0 32 32" fill="none">
        <rect width="32" height="32" rx="6" fill="#0052FF" />
        <path d="M16 6c5.523 0 10 4.477 10 10s-4.477 10-10 10S6 21.523 6 16 10.477 6 16 6zm-3.5 7.5a5 5 0 100 5h7a5 5 0 100-5h-7z" fill="#fff" />
      </svg>
    ),
    status: 'coming',
  },
  {
    name: 'GitHub Pages',
    description: 'Deploy directly from your repo',
    logo: (
      <svg className="w-10 h-10" viewBox="0 0 32 32" fill="none">
        <rect width="32" height="32" rx="6" className="fill-gray-900 dark:fill-white" />
        <path d="M16 6C10.477 6 6 10.477 6 16c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.891 1.529 2.341 1.087 2.91.831.092-.647.349-1.086.635-1.337-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.03-2.683-.104-.253-.447-1.27.097-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0116 9.785c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C23.137 24.163 26 20.418 26 16c0-5.523-4.477-10-10-10z" className="fill-white dark:fill-gray-900" />
      </svg>
    ),
    status: 'live',
  },
  {
    name: 'Vercel',
    description: 'Edge-powered deployments',
    logo: (
      <svg className="w-10 h-10" viewBox="0 0 32 32" fill="none">
        <rect width="32" height="32" rx="6" className="fill-black dark:fill-white" />
        <path d="M16 8l10 16H6L16 8z" className="fill-white dark:fill-black" />
      </svg>
    ),
    status: 'live',
  },
  {
    name: 'Netlify',
    description: 'Build, deploy, and scale',
    logo: (
      <svg className="w-10 h-10" viewBox="0 0 32 32" fill="none">
        <rect width="32" height="32" rx="6" fill="#00C7B7" />
        <path d="M18.3 9.7l3.6 3.6-5.9 1.6 2.3-5.2zm-4.6 10.6l-3.6-3.6 5.9-1.6-2.3 5.2zm8.6-5l-3.6-3.6-6.4 1.7 6.4 6.4 3.6-4.5zm-12.6 0l3.6 3.6 6.4-1.7-6.4-6.4-3.6 4.5z" fill="#fff" />
      </svg>
    ),
    status: 'live',
  },
  {
    name: 'Cloudflare Pages',
    description: 'Global edge network',
    logo: (
      <svg className="w-10 h-10" viewBox="0 0 32 32" fill="none">
        <rect width="32" height="32" rx="6" fill="#F38020" />
        <path d="M22.5 18.5c.2-.6.1-1.2-.2-1.6-.3-.4-.8-.7-1.4-.7l-10.4-.1c-.1 0-.2 0-.2-.1-.1-.1-.1-.2 0-.3.1-.2.2-.3.4-.3l10.5-.1c1.4-.1 2.8-1.2 3.3-2.6l.4-1.1c0-.1.1-.2 0-.3-.1-.1-.2-.2-.3-.2-1.1-.2-2.3-.3-3.5-.3-4.2 0-7.8 2.5-9.4 6.1-.8-.6-1.8-.9-2.8-.8-1.6.2-2.8 1.4-3.1 3-.1.5-.1 1 0 1.4-1.7.2-3 1.6-3 3.4 0 .2 0 .4.1.6v.1c.1.1.2.2.4.2h19c.2 0 .4-.2.5-.4l.3-.9c.3-.9.2-1.8-.1-2.5-.1-.2-.1-.4-.2-.5z" fill="#fff" />
      </svg>
    ),
    status: 'coming',
  },
];

export function IntegrationsSection() {
  return (
    <section className="gpw-section bg-gpw-bg-base dark:bg-gpw-bg-base">
      <div className="gpw-container">
        <div className="gpw-section-header">
          <span className="gpw-badge-success mb-4">Integrations</span>
          <h2 className="gpw-section-title">
            Works with your{' '}
            <span className="gpw-text-gradient">favorite tools</span>
          </h2>
          <p className="gpw-section-subtitle">
            Connect your payment providers and deploy anywhere. 
            More integrations coming soon.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
          {integrations.map((integration) => (
            <div
              key={integration.name}
              className="gpw-card-hover p-5 text-center group"
            >
              <div className="relative inline-block mb-4">
                <div className="group-hover:scale-110 transition-transform duration-300">
                  {integration.logo}
                </div>
                {integration.status === 'coming' && (
                  <span className="absolute -top-1 -right-1 px-1.5 py-0.5 rounded text-2xs font-bold bg-gpw-purple-500/20 text-gpw-purple-600 dark:text-gpw-purple-400">
                    SOON
                  </span>
                )}
              </div>
              <h3 className="font-semibold text-gpw-text-primary mb-1">
                {integration.name}
              </h3>
              <p className="text-xs text-gpw-text-muted">
                {integration.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}





