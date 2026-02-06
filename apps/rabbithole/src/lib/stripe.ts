import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('[stripe] STRIPE_SECRET_KEY not set — Stripe features will be unavailable.');
}

export const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : (null as unknown as Stripe);

export const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    price: 19,
    mode: 'subscription' as const,
    priceId: process.env.STRIPE_STARTER_PRICE_ID || '',
    agents: 1,
    credits: 500,
    features: [
      '1 managed Wunderbot AI assistant',
      '500 AI messages/mo included',
      'No API key needed to get started',
      'All Tier 1 integrations',
      'Managed hosting',
      'Community + AI support',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 49,
    mode: 'subscription' as const,
    priceId: process.env.STRIPE_PRO_PRICE_ID || '',
    agents: 5,
    credits: 2500,
    features: [
      'Up to 5 Wunderbot AI assistants',
      '2,500 AI messages/mo included',
      'No API key needed to get started',
      'All Tier 1 + premium integrations',
      'Encrypted credential vault',
      'BYO API key for unlimited messages',
      'Custom agent personalities',
      'Priority 24/7 support',
    ],
  },
] as const;

export type PlanId = (typeof PLANS)[number]['id'];

export function getPlanByPriceId(priceId: string) {
  return PLANS.find((p) => p.priceId === priceId) ?? null;
}
