import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Changelog',
  description: 'GitPayWidget changelog. See what\'s new, improved, and fixed in each release.',
  robots: { index: true, follow: true },
  alternates: { canonical: '/changelog' },
};

interface ChangelogEntry {
  version: string;
  date: string;
  tag?: 'major' | 'minor' | 'patch';
  changes: {
    type: 'added' | 'improved' | 'fixed' | 'removed';
    text: string;
  }[];
}

const changelog: ChangelogEntry[] = [
  {
    version: '0.2.0',
    date: 'December 4, 2024',
    tag: 'minor',
    changes: [
      { type: 'added', text: 'New lifetime Pro license option at $250 (no monthly fees!)' },
      { type: 'added', text: 'Cookie consent banner for GDPR compliance' },
      { type: 'added', text: 'Comprehensive legal pages (Cookie Policy, AUP, Refund, Security)' },
      { type: 'improved', text: 'Simplified pricing: Free (1% fee) or Pro (0% fee)' },
      { type: 'improved', text: 'Contact form now sends real emails via Resend' },
      { type: 'improved', text: 'Better mobile responsiveness on pricing cards' },
      { type: 'fixed', text: 'Widget demo metadata export issue' },
    ],
  },
  {
    version: '0.1.0',
    date: 'December 1, 2024',
    tag: 'major',
    changes: [
      { type: 'added', text: 'Initial public beta release' },
      { type: 'added', text: 'Stripe payment provider integration' },
      { type: 'added', text: 'Lemon Squeezy payment provider integration' },
      { type: 'added', text: 'Embeddable widget with one-line integration' },
      { type: 'added', text: 'Dashboard with project management' },
      { type: 'added', text: 'Basic analytics (checkout counts, conversion rate)' },
      { type: 'added', text: 'Webhook event handling and email notifications' },
      { type: 'added', text: 'AES-256-GCM encrypted API key storage' },
      { type: 'added', text: 'Light/dark mode support' },
      { type: 'added', text: 'Widget theming and customization' },
    ],
  },
];

const typeConfig = {
  added: { icon: '✨', label: 'Added', color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10' },
  improved: { icon: '⚡', label: 'Improved', color: 'text-blue-600 dark:text-blue-400 bg-blue-500/10' },
  fixed: { icon: '🐛', label: 'Fixed', color: 'text-amber-600 dark:text-amber-400 bg-amber-500/10' },
  removed: { icon: '🗑️', label: 'Removed', color: 'text-red-600 dark:text-red-400 bg-red-500/10' },
};

const tagConfig = {
  major: { label: 'Major', color: 'bg-gpw-purple-600 text-white' },
  minor: { label: 'Minor', color: 'bg-gpw-pink-500 text-white' },
  patch: { label: 'Patch', color: 'bg-gray-500 text-white' },
};

export default function ChangelogPage() {
  return (
    <div className="pt-24 pb-20">
      <div className="gpw-container max-w-4xl">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="gpw-badge-primary mb-4">Changelog</span>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            What's <span className="gpw-text-gradient">new</span>
          </h1>
          <p className="text-lg text-gpw-text-muted max-w-2xl mx-auto">
            Stay up to date with the latest features, improvements, and fixes 
            in GitPayWidget.
          </p>
        </div>

        {/* Subscribe */}
        <div className="gpw-card p-6 mb-12 flex flex-col sm:flex-row items-center gap-4">
          <div className="flex-1">
            <h3 className="font-semibold mb-1">Get notified about updates</h3>
            <p className="text-sm text-gpw-text-muted">
              Subscribe to our changelog via RSS or follow us on Twitter.
            </p>
          </div>
          <div className="flex gap-3">
            <a
              href="/changelog.xml"
              className="gpw-btn-secondary text-sm px-4 py-2"
            >
              RSS Feed
            </a>
            <a
              href="https://twitter.com/gitpaywidget"
              target="_blank"
              rel="noopener noreferrer"
              className="gpw-btn-primary text-sm px-4 py-2"
            >
              Follow @gitpaywidget
            </a>
          </div>
        </div>

        {/* Changelog entries */}
        <div className="space-y-12">
          {changelog.map((entry, index) => (
            <article key={entry.version} className="relative">
              {/* Version header */}
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <h2 className="text-2xl font-bold">v{entry.version}</h2>
                {entry.tag && (
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${tagConfig[entry.tag].color}`}>
                    {tagConfig[entry.tag].label}
                  </span>
                )}
                <span className="text-gpw-text-muted">{entry.date}</span>
              </div>

              {/* Changes list */}
              <div className="gpw-card p-6">
                <ul className="space-y-4">
                  {entry.changes.map((change, changeIndex) => {
                    const config = typeConfig[change.type];
                    return (
                      <li key={changeIndex} className="flex items-start gap-3">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.color}`}>
                          <span>{config.icon}</span>
                          {config.label}
                        </span>
                        <span className="text-gpw-text-secondary pt-0.5">{change.text}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Timeline connector */}
              {index < changelog.length - 1 && (
                <div className="absolute left-4 top-full h-12 w-px bg-gpw-border" />
              )}
            </article>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-16 text-center">
          <p className="text-gpw-text-muted mb-4">
            Looking for older versions?
          </p>
          <a
            href="https://github.com/manicinc/gitpaywidget/releases"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gpw-purple-600 dark:text-gpw-purple-400 hover:underline"
          >
            View all releases on GitHub →
          </a>
        </div>
      </div>
    </div>
  );
}

