import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About – Our Mission & Team',
  description: 'GitPayWidget is built by Manic Agency, a design & development collective. We believe payments should be simple, beautiful, and accessible to every developer.',
  openGraph: {
    title: 'About GitPayWidget – Built by Manic Agency',
    description: 'Our mission is to make payments accessible for static sites and indie developers.',
    url: '/about',
  },
  alternates: {
    canonical: '/about',
  },
};

const values = [
  {
    icon: '🎯',
    title: 'Developer First',
    description: 'Every decision we make starts with the developer experience. Clean APIs, great docs, and tools that just work.',
  },
  {
    icon: '🔓',
    title: 'Open & Transparent',
    description: 'Our pricing is simple, our code is readable, and we share our roadmap publicly. No surprises.',
  },
  {
    icon: '🎨',
    title: 'Design Matters',
    description: 'Payment widgets don\'t have to be ugly. We obsess over every pixel so your checkout feels premium.',
  },
  {
    icon: '⚡',
    title: 'Performance Obsessed',
    description: 'Under 5KB gzipped. Lazy loading. Edge-first. We care about your Core Web Vitals as much as you do.',
  },
];

const team = [
  {
    name: 'Manic Agency',
    role: 'Design & Development',
    bio: 'A collective of designers and developers building playful, vibrant products for the modern web.',
    avatar: '🎭',
  },
];

export default function AboutPage() {
  return (
    <div className="pt-24 pb-20">
      <div className="gpw-container">
        {/* Hero */}
        <div className="text-center mb-20">
          <span className="gpw-badge-pink mb-4">About Us</span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            Making payments{' '}
            <span className="font-display text-gpw-pink-500">playful</span>
          </h1>
          <p className="text-lg text-gpw-text-muted max-w-2xl mx-auto">
            We believe every developer should be able to monetize their work—without 
            spinning up servers, wrestling with OAuth, or hiring a compliance team.
          </p>
        </div>

        {/* Story */}
        <div className="max-w-3xl mx-auto mb-20">
          <div className="gpw-card p-8 md:p-12">
            <h2 className="text-2xl font-bold mb-6 gpw-text-gradient">Our Story</h2>
            <div className="prose prose-lg dark:prose-invert max-w-none text-gpw-text-secondary">
              <p>
                GitPayWidget was born out of frustration. We were building a documentation 
                site and wanted to add a simple "upgrade to Pro" button. What should have 
                taken 10 minutes turned into a week of backend development, webhook handlers, 
                and PCI compliance research.
              </p>
              <p>
                We thought: there has to be a better way. Static sites are everywhere—GitHub 
                Pages, Netlify, Vercel, Cloudflare. Why should adding payments require 
                abandoning the simplicity that made these platforms great?
              </p>
              <p>
                So we built GitPayWidget: a single script tag that handles everything. 
                Provider keys encrypted. Checkouts hosted. Analytics included. Now you 
                can focus on building your product, not your payment infrastructure.
              </p>
              <p>
                We're building for the <strong>vibe coding era</strong>—where AI assists 
                development, prototypes ship in hours, and the best tools stay out of your way.
              </p>
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">
            What we <span className="gpw-text-gradient">believe</span>
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {values.map((value) => (
              <div key={value.title} className="gpw-card p-6">
                <span className="text-4xl mb-4 block">{value.icon}</span>
                <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                <p className="text-gpw-text-muted">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">
            The <span className="font-display text-gpw-purple-600 dark:text-gpw-purple-400">team</span>
          </h2>
          <div className="max-w-md mx-auto">
            {team.map((member) => (
              <div key={member.name} className="gpw-card p-8 text-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gpw-purple-600 to-gpw-pink-500 flex items-center justify-center text-4xl mx-auto mb-4">
                  {member.avatar}
                </div>
                <h3 className="text-xl font-semibold">{member.name}</h3>
                <p className="text-gpw-purple-600 dark:text-gpw-purple-400 text-sm mb-3">
                  {member.role}
                </p>
                <p className="text-gpw-text-muted">{member.bio}</p>
                <a
                  href="https://manic.agency"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 mt-4 text-sm text-gpw-purple-600 dark:text-gpw-purple-400 hover:underline"
                >
                  Visit manic.agency
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Want to work with us?</h2>
          <p className="text-gpw-text-muted mb-6">
            We're always looking for talented people who share our vision.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/contact" className="gpw-btn-primary">
              Get in Touch
            </Link>
            <a
              href="https://github.com/manicinc/gitpaywidget"
              target="_blank"
              rel="noopener noreferrer"
              className="gpw-btn-secondary"
            >
              View on GitHub
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}





