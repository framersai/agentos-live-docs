import type { Metadata } from 'next';
import { PricingSection } from '@/components/landing/PricingSection';
import { FAQSection } from '@/components/landing/FAQSection';
import { CTASection } from '@/components/landing/CTASection';

export const metadata: Metadata = {
  title: 'Pricing – Free to Start, $250 Lifetime Pro',
  description: 'GitPayWidget is free with 1% platform fee. Go Pro for $250 one-time and remove all fees forever. Perfect for indie founders and solo creators.',
  openGraph: {
    title: 'GitPayWidget Pricing – Free or $250 Lifetime License',
    description: 'Start free with 1% fee, or pay once for lifetime Pro access with zero platform fees.',
    url: '/pricing',
  },
  alternates: {
    canonical: '/pricing',
  },
};

// Pricing JSON-LD structured data
const pricingJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'GitPayWidget',
  description: 'Plug-and-play payment widget for static sites. Accept Stripe, Lemon Squeezy, and crypto payments with a single script tag.',
  brand: {
    '@type': 'Organization',
    name: 'Manic Agency',
  },
  offers: [
    {
      '@type': 'Offer',
      name: 'Free Plan',
      price: '0',
      priceCurrency: 'USD',
      description: 'Free forever with 1% platform fee per transaction',
      availability: 'https://schema.org/InStock',
    },
    {
      '@type': 'Offer',
      name: 'Pro Lifetime License',
      price: '250',
      priceCurrency: 'USD',
      description: 'One-time payment for lifetime access with 0% platform fees',
      availability: 'https://schema.org/InStock',
    },
  ],
};

export default function PricingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pricingJsonLd) }}
      />
      <div className="pt-20">
        <PricingSection />
        <FAQSection />
        <CTASection />
      </div>
    </>
  );
}





