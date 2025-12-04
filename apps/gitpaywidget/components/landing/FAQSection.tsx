'use client';

import { useState } from 'react';
import Link from 'next/link';

const faqs = [
  {
    question: 'How does GitPayWidget work without a backend?',
    answer: 'GitPayWidget hosts the checkout orchestration layer. When a user clicks a payment button, we securely retrieve your provider credentials, create a checkout session, and redirect to the hosted checkout page (Stripe, Lemon Squeezy, etc.). Your static site never handles sensitive data.',
  },
  {
    question: 'Is it secure? How are my API keys protected?',
    answer: 'All provider credentials are encrypted with AES-256-GCM before storage. We use row-level security in Supabase, and keys are only decrypted server-side during checkout session creation. Your keys are never exposed to the client.',
  },
  {
    question: 'What payment providers are supported?',
    answer: 'Currently we support Stripe and Lemon Squeezy, with Paddle and Coinbase Commerce coming soon. You can use different providers for different plans, and we handle all the routing automatically.',
  },
  {
    question: 'Can I customize the look of the widget?',
    answer: 'Absolutely! You can set custom accent colors, button labels, and inject your own CSS. The widget also automatically adapts to light/dark mode. Configure it in the dashboard or inline in your code.',
  },
  {
    question: 'How much does it cost?',
    answer: 'We have a free tier that includes 1 project and 1,000 checkouts/month. Paid plans start at $19/month for unlimited checkouts. We don\'t take a percentage of your revenue—what you charge is what you keep (minus your payment provider\'s fees).',
  },
  {
    question: 'Does it work with any static site host?',
    answer: 'Yes! GitPayWidget works on GitHub Pages, Netlify, Vercel, Cloudflare Pages, AWS S3, or any host that serves static files. It\'s just a script tag—if you can add HTML, you can use GitPayWidget.',
  },
  {
    question: 'How do I handle subscription management?',
    answer: 'For subscription billing (cancellations, upgrades, invoices), users are redirected to your provider\'s customer portal. We can generate portal links via API, or you can link directly to Stripe/Lemon Squeezy\'s portal.',
  },
  {
    question: 'What about webhook handling?',
    answer: 'GitPayWidget receives and processes webhooks from your payment providers. We normalize the events and can forward them to your own endpoint, trigger email notifications, or update analytics—all configurable in the dashboard.',
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="gpw-section bg-gpw-bg-subtle dark:bg-gpw-bg-muted">
      <div className="gpw-container max-w-4xl">
        <div className="gpw-section-header">
          <span className="gpw-badge-primary mb-4">FAQ</span>
          <h2 className="gpw-section-title">
            Frequently asked{' '}
            <span className="font-display text-gpw-purple-600 dark:text-gpw-purple-400">
              questions
            </span>
          </h2>
          <p className="gpw-section-subtitle">
            Everything you need to know about GitPayWidget.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`
                gpw-card overflow-hidden transition-all duration-300
                ${openIndex === index ? 'ring-2 ring-gpw-purple-500/30' : ''}
              `}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 flex items-center justify-between gap-4 text-left hover:bg-gpw-purple-500/5 transition-colors"
                aria-expanded={openIndex === index}
              >
                <span className="font-semibold text-gpw-text-primary">
                  {faq.question}
                </span>
                <svg
                  className={`w-5 h-5 flex-shrink-0 text-gpw-purple-500 transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div
                className={`
                  overflow-hidden transition-all duration-300
                  ${openIndex === index ? 'max-h-96' : 'max-h-0'}
                `}
              >
                <p className="px-6 pb-5 text-gpw-text-muted leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* More help */}
        <div className="text-center mt-12">
          <p className="text-gpw-text-muted mb-4">
            Still have questions?
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/docs" className="gpw-btn-secondary">
              Read the Docs
            </Link>
            <Link href="/contact" className="gpw-btn-primary">
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}





