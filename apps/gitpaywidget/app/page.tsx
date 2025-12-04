import Link from 'next/link';
import type { Metadata } from 'next';
import { HeroSection } from '@/components/landing/HeroSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { HowItWorksSection } from '@/components/landing/HowItWorksSection';
import { WidgetPreviewSection } from '@/components/landing/WidgetPreviewSection';
import { IntegrationsSection } from '@/components/landing/IntegrationsSection';
import { PricingSection } from '@/components/landing/PricingSection';
import { TestimonialsSection } from '@/components/landing/TestimonialsSection';
import { FAQSection } from '@/components/landing/FAQSection';
import { CTASection } from '@/components/landing/CTASection';

export const metadata: Metadata = {
  title: 'GitPayWidget – Accept Payments on GitHub Pages & Static Sites',
  description:
    'The easiest way to accept Stripe, Lemon Squeezy, and crypto payments on any static site. One script tag. Zero backend. Perfect for vibe coding.',
  openGraph: {
    title: 'GitPayWidget – Payments for Static Sites & GitHub Pages',
    description: 'Accept Stripe & Lemon Squeezy checkouts with a single script tag. No backend required.',
    url: '/',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: '/',
  },
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <WidgetPreviewSection />
      <IntegrationsSection />
      <PricingSection />
      <TestimonialsSection />
      <FAQSection />
      <CTASection />
    </>
  );
}
