export interface PricingTier {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
  badge?: string;
  note?: string;
}

export const PRICING_TIERS: PricingTier[] = [
  {
    id: 'rh-pro-monthly',
    name: 'Pro',
    price: '$29.99',
    period: '/month',
    description: 'Everything you need for AI-human collaboration',
    features: [
      'Full platform access',
      '3 hours/week human assistant',
      'Priority task routing',
      'All AI agent integrations',
      'PII protection & RBAC',
      'Real-time WebSocket updates',
    ],
    cta: 'Start Pro',
    highlighted: true,
  },
  {
    id: 'rh-pro-annual',
    name: 'Pro Annual',
    price: '$249',
    period: '/year',
    description: 'Save 31% with annual billing',
    badge: 'BEST VALUE',
    features: [
      'Everything in Pro Monthly',
      '3 hours/week human assistant',
      'Save $110.88/year vs monthly',
      'Priority support',
    ],
    cta: 'Start Annual',
  },
  {
    id: 'rh-lifetime',
    name: 'Lifetime',
    price: '$499',
    period: 'one-time',
    description: 'Platform access forever, no recurring fees',
    features: [
      'Lifetime platform access',
      'All AI agent integrations',
      'PII protection & RBAC',
      'All future updates included',
    ],
    cta: 'Get Lifetime Access',
    note: 'Add human assistant hours for $150/year',
  },
];

export const ASSISTANT_ADDON = {
  id: 'rh-assistant-addon',
  name: 'Human Assistant Add-on',
  price: '$150',
  period: '/year',
  description: '3 hours/week of human assistant support. Available for Lifetime plan members.',
};
