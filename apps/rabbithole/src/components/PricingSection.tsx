'use client';

import { PRICING_TIERS } from '@/config/pricing';
import { PricingCard } from './PricingCard';

export function PricingSection() {
  const handleSelect = (_planId: string) => {
    window.location.href = '/pricing';
  };

  return (
    <section className="pricing" id="pricing">
      <div className="container">
        <div className="features__header">
          <h2 className="features__title">
            <span className="text-holographic">Simple</span> Pricing
          </h2>
          <p className="features__subtitle">
            One platform, transparent pricing, no hidden fees
          </p>
        </div>

        <div className="pricing__grid">
          {PRICING_TIERS.map((tier) => (
            <PricingCard key={tier.id} {...tier} onSelect={handleSelect} />
          ))}
        </div>
      </div>
    </section>
  );
}
