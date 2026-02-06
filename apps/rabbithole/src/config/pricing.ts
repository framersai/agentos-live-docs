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
  ctaType?: 'checkout' | 'contact';
  ctaHref?: string;
}

export const TRIAL_DAYS = 3;

export const PRICING_TIERS: PricingTier[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: '$19',
    period: '/mo',
    description: 'Launch your first managed Wunderbot quickly',
    features: [
      `${TRIAL_DAYS}-day free trial`,
      '1 managed Wunderbot AI assistant',
      '500 AI messages/mo included',
      'No API key needed to get started',
      'All Tier 1 integrations',
      'Managed hosting',
      'Community + AI support',
    ],
    cta: `Start ${TRIAL_DAYS}-day trial`,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$49',
    period: '/mo',
    description: 'Scale to multiple production agents with premium integrations',
    badge: 'MOST POPULAR',
    features: [
      `${TRIAL_DAYS}-day free trial`,
      'Up to 5 Wunderbot AI assistants',
      '2,500 AI messages/mo included',
      'No API key needed to get started',
      'All Tier 1 + premium integrations',
      'Encrypted credential vault',
      'BYO API key for unlimited messages',
      'Custom agent personalities',
      'Priority 24/7 support',
    ],
    cta: `Start ${TRIAL_DAYS}-day trial`,
    highlighted: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'Dedicated infrastructure and white-glove support for large teams',
    badge: 'ENTERPRISE',
    features: [
      'Unlimited Wunderbot AI assistants',
      'Unlimited AI messages',
      'On-site / self-hosted deployment',
      'Custom integrations & API access',
      'Dedicated account manager',
      'Team pricing & volume discounts',
      'SLA guarantees',
      'SSO / SAML authentication',
    ],
    cta: 'Contact Sales',
    ctaType: 'contact',
    ctaHref: '/contact',
  },
];
