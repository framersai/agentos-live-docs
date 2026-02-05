'use client';

import type { PricingTier } from '@/config/pricing';

interface PricingCardProps extends PricingTier {
  onSelect?: (id: string) => void;
}

export function PricingCard({
  id,
  name,
  price,
  period,
  description,
  features,
  cta,
  highlighted,
  badge,
  note,
  onSelect,
}: PricingCardProps) {
  return (
    <div className={`pricing-card${highlighted ? ' pricing-card--highlighted' : ''}`}>
      {badge && <span className="badge badge--gold pricing-card__badge">{badge}</span>}
      <div className="pricing-card__name">{name}</div>
      <div className="pricing-card__price">
        {price}
        <span className="pricing-card__period">{period}</span>
      </div>
      <p className="pricing-card__description">{description}</p>
      <ul className="pricing-card__features">
        {features.map((feature) => (
          <li key={feature} className="pricing-card__feature">
            {feature}
          </li>
        ))}
      </ul>
      <button
        className={`btn ${highlighted ? 'btn--primary' : 'btn--secondary'} btn--lg`}
        onClick={() => onSelect?.(id)}
      >
        {cta}
      </button>
      {note && <p className="pricing-card__note">{note}</p>}
    </div>
  );
}
