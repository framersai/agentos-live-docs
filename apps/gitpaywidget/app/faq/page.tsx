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

export default function FAQPage() {
  return (
    <div className="pt-20">
      <FAQSection />
      <CTASection />
    </div>
  );
}





