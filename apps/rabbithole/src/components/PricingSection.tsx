'use client';

import { PRICING_TIERS, ASSISTANT_ADDON } from '@/config/pricing';
import { PricingCard } from './PricingCard';

export function PricingSection() {
  const handleSelect = (planId: string) => {
    // Future: redirect to Stripe Checkout
    window.location.href = `/signup?plan=${planId}`;
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

        <div className="pricing__addon">
          <div className="pricing__addon-title">{ASSISTANT_ADDON.name}</div>
          <p className="pricing__addon-desc">{ASSISTANT_ADDON.description}</p>
          <span className="pricing__addon-price">
            {ASSISTANT_ADDON.price}<span className="pricing-card__period">{ASSISTANT_ADDON.period}</span>
          </span>
        </div>
      </div>
    </section>
  );
}
