import type { Metadata } from 'next';
import { FAQSection } from '@/components/landing/FAQSection';
import { CTASection } from '@/components/landing/CTASection';

export const metadata: Metadata = {
  title: 'FAQ – Frequently Asked Questions',
  description: 'Common questions about GitPayWidget: security, pricing, integrations, and more. Find answers to everything you need to know.',
  openGraph: {
    title: 'GitPayWidget FAQ – Everything You Need to Know',
    description: 'Security, pricing, provider support, and more. All your questions answered.',
    url: '/faq',
  },
  alternates: {
    canonical: '/faq',
  },
};

// FAQ JSON-LD structured data for SEO
const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How does GitPayWidget work without a backend?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'GitPayWidget hosts the checkout orchestration layer. When a user clicks a payment button, we securely retrieve your provider credentials, create a checkout session, and redirect to the hosted checkout page (Stripe, Lemon Squeezy, etc.). Your static site never handles sensitive data.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is it secure? How are my API keys protected?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'All provider credentials are encrypted with AES-256-GCM before storage. We use row-level security in Supabase, and keys are only decrypted server-side during checkout session creation. Your keys are never exposed to the client.',
      },
    },
    {
      '@type': 'Question',
      name: 'What payment providers are supported?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Currently we support Stripe and Lemon Squeezy, with Paddle and Coinbase Commerce coming soon. You can use different providers for different plans, and we handle all the routing automatically.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much does it cost?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'GitPayWidget is free to start with a 1% platform fee per transaction. For creators who want zero fees, our Pro plan is a one-time $250 lifetime license that removes all platform fees forever, plus gives you full analytics, custom branding, and priority support.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does it work with any static site host?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! GitPayWidget works on GitHub Pages, Netlify, Vercel, Cloudflare Pages, AWS S3, or any host that serves static files. It\'s just a script tag—if you can add HTML, you can use GitPayWidget.',
      },
    },
  ],
};

export default function FAQPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <div className="pt-20">
        <FAQSection />
        <CTASection />
      </div>
    </>
  );
}





