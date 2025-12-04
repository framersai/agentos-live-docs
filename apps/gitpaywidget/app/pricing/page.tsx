import type { Metadata } from 'next';
import { PricingSection } from '@/components/landing/PricingSection';
import { FAQSection } from '@/components/landing/FAQSection';
import { CTASection } from '@/components/landing/CTASection';

export const metadata: Metadata = {
  title: 'Pricing – Simple, Transparent Plans',
  description: 'GitPayWidget pricing starts free. No platform fees, no hidden charges. Upgrade as you grow with plans for individuals, teams, and enterprises.',
  openGraph: {
    title: 'GitPayWidget Pricing – Start Free, Scale as You Grow',
    description: 'Free tier includes 1,000 checkouts/month. Pro plans from $19/mo with unlimited checkouts.',
    url: '/pricing',
  },
  alternates: {
    canonical: '/pricing',
  },
};

export default function PricingPage() {
  return (
    <div className="pt-20">
      <PricingSection />
      <FAQSection />
      <CTASection />
    </div>
  );
}





