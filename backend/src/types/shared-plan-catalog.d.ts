declare module '../../../shared/planCatalog.js' {
  export type PlanId = 'global-pass' | 'free' | 'basic' | 'creator' | 'organization';
  export type PlanTier = 'metered' | 'unlimited';

  export type ByoApiKeyPolicy = 'disallowed' | 'optional' | 'required';

  export interface PlanUsageProfile {
    dailyUsdAllowance: number;
    approxGpt4oTokensPerDay: number;
    approxGpt4oMiniTokensPerDay: number;
    byoApiKeys: ByoApiKeyPolicy;
    notes?: string;
  }

  export interface PlanCheckoutDescriptor {
    provider: 'lemonsqueezy' | 'stripe';
    productEnvVar: string;
    variantEnvVar?: string;
    priceEnvVar?: string;
  }

  export interface PlanCatalogEntry {
    id: PlanId;
    slug: string;
    displayName: string;
    headline: string;
    monthlyPriceUsd: number;
    usageAllocationPct: number;
    usage: PlanUsageProfile;
    bullets: string[];
    targetAudience: string;
    checkout: PlanCheckoutDescriptor[];
    public: boolean;
    metadata?: {
      featured?: boolean;
      requiresContact?: boolean;
      hiddenOnMarketing?: boolean;
      tier?: PlanTier;
    };
  }

  export const GPT4O_COST_PER_KTOKENS: number;
  export const GPT4O_MINI_COST_PER_KTOKENS: number;

  export const PLAN_CATALOG: Record<PlanId, PlanCatalogEntry>;
  export const PUBLIC_PLAN_ORDER: PlanId[];
  export const getPublicPlans: () => PlanCatalogEntry[];
  export const findPlanById: (id: PlanId) => PlanCatalogEntry;

  export interface PlanRolloverExplanation {
    planId: PlanId;
    description: string;
  }

  export const PLAN_ROLLOVER_RULES: PlanRolloverExplanation[];
}
