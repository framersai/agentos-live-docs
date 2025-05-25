/**
 * @fileoverview Defines the ISubscriptionTier interface and the SubscriptionTier class
 * for representing and managing subscription tier data and capabilities.
 * @module backend/services/user_auth/SubscriptionTier
 */

import { SubscriptionTier as PrismaSubscriptionTier } from '@prisma/client';

/**
 * @interface ISubscriptionTier
 * @description Defines the data structure for a subscription tier, detailing its features,
 * limits, and associated pricing information. This interface represents the plain data object
 * for a tier.
 */
export interface ISubscriptionTier {
  id: string;
  name: string;
  description?: string | null;
  level: number;
  maxGmiInstances: number;
  maxApiKeys: number;
  maxConversationHistoryTurns: number;
  maxContextWindowTokens: number;
  dailyCostLimitUsd: number;
  monthlyCostLimitUsd: number;
  isPublic: boolean;
  features: string[];
  lemonSqueezyProductId?: string | null;
  lemonSqueezyVariantId?: string | null;
  priceMonthlyUsd?: number | null;
  priceYearlyUsd?: number | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * @interface TierCapabilities
 * @description Defines methods to check capabilities and limits of a subscription tier.
 * This can be implemented by classes or returned by helper functions.
 */
export interface TierCapabilities {
  /** Checks if a persona can be accessed with this tier. */
  canAccessPersona: (personaId: string) => boolean;
  /** Checks if more API keys can be created based on the tier's limit. */
  canCreateAPIKeys: (currentCount: number) => boolean;
  /** Checks if more GMI instances can be created based on the tier's limit. */
  canCreateGMIInstances: (currentCount: number) => boolean;
  /** Checks if the tier includes a specific feature flag. */
  hasFeature: (feature: string) => boolean;
  /** Checks if a given cost is within the tier's daily cost limit. */
  isWithinDailyCostLimit: (currentCost: number) => boolean;
  /** Checks if a given cost is within the tier's monthly cost limit. */
  isWithinMonthlyCostLimit: (currentCost: number) => boolean;
}

/**
 * @class SubscriptionTier
 * @description Represents a subscription tier with utility methods to access its properties
 * and capabilities. It encapsulates the data defined by the ISubscriptionTier interface.
 * This class provides a richer object model around the tier data.
 */
export class SubscriptionTier {
  /**
   * The underlying data for the subscription tier, conforming to the ISubscriptionTier interface.
   * This stores the actual properties of the tier.
   * @private
   * @readonly
   */
  private readonly data: ISubscriptionTier;

  /**
   * Private constructor to enforce the use of factory methods like `fromPrisma`
   * for creating instances of SubscriptionTier.
   * @param {ISubscriptionTier} data - The raw data object conforming to ISubscriptionTier.
   */
  private constructor(data: ISubscriptionTier) {
    this.data = data;
  }

  /**
   * Creates a `SubscriptionTier` class instance from a Prisma-generated `SubscriptionTier` object.
   * This acts as a factory method to translate database models into domain objects.
   * @static
   * @param {PrismaSubscriptionTier} prismaTier - The subscription tier object fetched from Prisma.
   * @returns {SubscriptionTier} An instance of the `SubscriptionTier` class, wrapping the tier data.
   */
  static fromPrisma(prismaTier: PrismaSubscriptionTier): SubscriptionTier {
    // Map the Prisma model fields to the ISubscriptionTier interface structure.
    const tierData: ISubscriptionTier = {
      id: prismaTier.id,
      name: prismaTier.name,
      description: prismaTier.description, // Prisma's optional fields map directly to (type | null)
      level: prismaTier.level,
      maxGmiInstances: prismaTier.maxGmiInstances,
      maxApiKeys: prismaTier.maxApiKeys,
      maxConversationHistoryTurns: prismaTier.maxConversationHistoryTurns,
      maxContextWindowTokens: prismaTier.maxContextWindowTokens,
      dailyCostLimitUsd: prismaTier.dailyCostLimitUsd,
      monthlyCostLimitUsd: prismaTier.monthlyCostLimitUsd,
      isPublic: prismaTier.isPublic,
      features: prismaTier.features, // Prisma schema should define this as String[]
      lemonSqueezyProductId: prismaTier.lemonSqueezyProductId,
      lemonSqueezyVariantId: prismaTier.lemonSqueezyVariantId,
      priceMonthlyUsd: prismaTier.priceMonthlyUsd,
      priceYearlyUsd: prismaTier.priceYearlyUsd,
      createdAt: prismaTier.createdAt,
      updatedAt: prismaTier.updatedAt,
    };
    return new SubscriptionTier(tierData);
  }

  /**
   * Gets a copy of the raw data of the subscription tier.
   * @returns {ISubscriptionTier} A plain data object representing the tier, conforming to the ISubscriptionTier interface.
   */
  getData(): ISubscriptionTier {
    return { ...this.data }; // Return a shallow copy to prevent external mutation of internal state
  }

  // --- Getters for ISubscriptionTier properties ---

  /** Gets the unique identifier of the tier. */
  get id(): string { return this.data.id; }

  /** Gets the name of the tier (e.g., "Free", "Pro"). */
  get name(): string { return this.data.name; }

  /** Gets the description of the tier, or `null` if not provided. */
  get description(): string | null { return this.data.description ?? null; }

  /** Gets the numerical level of the tier (e.g., 0 for Free, 1 for Pro). Higher levels generally mean more features/limits. */
  get level(): number { return this.data.level; }

  /** Gets the maximum number of concurrent GMI (Agent) instances allowed for this tier. -1 might signify unlimited. */
  get maxGmiInstances(): number { return this.data.maxGmiInstances; }

  /** Gets the maximum number of user-provided API keys allowed for this tier. -1 might signify unlimited. */
  get maxApiKeys(): number { return this.data.maxApiKeys; }

  /** Gets the limit for conversation history turns (e.g., number of messages) retained or processed. -1 might signify unlimited. */
  get maxConversationHistoryTurns(): number { return this.data.maxConversationHistoryTurns; }

  /** Gets the maximum context window size (in tokens) for LLM interactions under this tier. */
  get maxContextWindowTokens(): number { return this.data.maxContextWindowTokens; }

  /** Gets the daily spending cap in USD for services used under this tier. 0.0 for free tiers, -1 might signify unlimited for paid tiers. */
  get dailyCostLimitUsd(): number { return this.data.dailyCostLimitUsd; }

  /** Gets the monthly spending cap in USD for services used under this tier. 0.0 for free tiers, -1 might signify unlimited for paid tiers. */
  get monthlyCostLimitUsd(): number { return this.data.monthlyCostLimitUsd; }

  /** Indicates if features of this tier are accessible to unauthenticated users (if the application supports such a mode). */
  get isPublic(): boolean { return this.data.isPublic; }

  /** Gets an array of feature flags or capability identifiers enabled for this tier. Returns a copy. */
  get features(): string[] { return [...this.data.features]; } // Return a copy for immutability

  /** Gets the LemonSqueezy Product ID associated with this tier, or `null` if not set. */
  get lemonSqueezyProductId(): string | null { return this.data.lemonSqueezyProductId ?? null; }

  /** Gets the LemonSqueezy Variant ID associated with this tier, or `null` if not set. */
  get lemonSqueezyVariantId(): string | null { return this.data.lemonSqueezyVariantId ?? null; }

  /** Gets the monthly price in USD for this tier, or `null` if not applicable (e.g., for free or custom-priced tiers). */
  get priceMonthlyUsd(): number | null { return this.data.priceMonthlyUsd ?? null; }

  /** Gets the yearly price in USD for this tier, or `null` if not applicable. */
  get priceYearlyUsd(): number | null { return this.data.priceYearlyUsd ?? null; }

  /** Gets the timestamp when the tier record was created. */
  get createdAt(): Date { return this.data.createdAt; }

  /** Gets the timestamp when the tier record was last updated. */
  get updatedAt(): Date { return this.data.updatedAt; }


  // --- Utility methods for tier capabilities ---

  /**
   * Checks if this tier includes a specific feature flag.
   * @param {string} feature - The feature flag (string identifier) to check for.
   * @returns {boolean} True if the tier includes the specified feature, false otherwise.
   */
  hasFeature(feature: string): boolean {
    return this.data.features.includes(feature);
  }

  /**
   * Checks if this tier is considered a "free" tier.
   * Typically determined by its level or price.
   * @returns {boolean} True if the tier is free, false otherwise.
   */
  isFree(): boolean {
    return this.data.level === 0 || (this.data.priceMonthlyUsd === 0);
  }

  /**
   * Checks if this tier is a paid (non-free) tier.
   * @returns {boolean} True if the tier is a paid tier, false otherwise.
   */
  isPaid(): boolean {
    return !this.isFree();
  }

  /**
   * Checks if a user on this tier can create more GMI instances, based on the current count and tier limit.
   * @param {number} currentCount - The current number of GMI instances the user already has.
   * @returns {boolean} True if more instances can be created, false otherwise. Considers -1 as unlimited.
   */
  canCreateMoreGMIs(currentCount: number): boolean {
    if (this.data.maxGmiInstances === -1) return true; // -1 signifies unlimited
    return currentCount < this.data.maxGmiInstances;
  }

  /**
   * Checks if a user on this tier can create more API keys, based on the current count and tier limit.
   * @param {number} currentCount - The current number of API keys the user already has.
   * @returns {boolean} True if more API keys can be created, false otherwise. Considers -1 as unlimited.
   */
  canCreateMoreApiKeys(currentCount: number): boolean {
    if (this.data.maxApiKeys === -1) return true; // -1 signifies unlimited
    return currentCount < this.data.maxApiKeys;
  }

  /**
   * Checks if a given current daily cost is within the tier's allowed daily cost limit.
   * @param {number} currentDailyCost - The user's current accumulated daily cost.
   * @returns {boolean} True if the cost is within the limit, false otherwise. Considers -1 as unlimited.
   */
  isWithinDailyCostLimit(currentDailyCost: number): boolean {
    if (this.data.dailyCostLimitUsd === -1) return true; // -1 signifies unlimited
    return currentDailyCost <= this.data.dailyCostLimitUsd;
  }

  /**
   * Checks if a given current monthly cost is within the tier's allowed monthly cost limit.
   * @param {number} currentMonthlyCost - The user's current accumulated monthly cost.
   * @returns {boolean} True if the cost is within the limit, false otherwise. Considers -1 as unlimited.
   */
  isWithinMonthlyCostLimit(currentMonthlyCost: number): boolean {
    if (this.data.monthlyCostLimitUsd === -1) return true; // -1 signifies unlimited
    return currentMonthlyCost <= this.data.monthlyCostLimitUsd;
  }

  /**
   * Gets an object implementing `TierCapabilities` for this tier instance.
   * This provides a convenient way to access all capability checks.
   * @returns {TierCapabilities} An object with methods to check tier capabilities.
   */
  getCapabilities(): TierCapabilities {
    // Using 'this' directly as the class itself implements the logic for these capabilities.
    return {
      canAccessPersona: (personaId: string) => {
        // Example: Allow if tier level is above 0 or has a specific feature.
        // This is a placeholder; actual logic should be based on your application's rules.
        if (this.hasFeature('all_personas_access')) return true;
        if (personaId === 'basic_chat_persona' && this.level >=0) return true;
        return this.level > 0; // Example: Pro and above can access non-basic personas
      },
      canCreateAPIKeys: (currentCount: number) => this.canCreateMoreApiKeys(currentCount),
      canCreateGMIInstances: (currentCount: number) => this.canCreateMoreGMIs(currentCount),
      hasFeature: (feature: string) => this.hasFeature(feature),
      isWithinDailyCostLimit: (currentCost: number) => this.isWithinDailyCostLimit(currentCost),
      isWithinMonthlyCostLimit: (currentCost: number) => this.isWithinMonthlyCostLimit(currentCost),
    };
  }

  // --- Comparison methods ---

  /**
   * Compares this tier's level with another `SubscriptionTier` instance's level.
   * @param {SubscriptionTier} otherTier - The other `SubscriptionTier` instance to compare against.
   * @returns {boolean} True if this tier has a strictly higher level than `otherTier`.
   */
  isHigherThan(otherTier: SubscriptionTier): boolean {
    return this.data.level > otherTier.data.level;
  }

  /**
   * Compares this tier's level with another `SubscriptionTier` instance's level.
   * @param {SubscriptionTier} otherTier - The other `SubscriptionTier` instance to compare against.
   * @returns {boolean} True if this tier has a strictly lower level than `otherTier`.
   */
  isLowerThan(otherTier: SubscriptionTier): boolean {
    return this.data.level < otherTier.data.level;
  }

  /**
   * Compares this tier's level with another `SubscriptionTier` instance's level.
   * @param {SubscriptionTier} otherTier - The other `SubscriptionTier` instance to compare against.
   * @returns {boolean} True if this tier has the same level as `otherTier`.
   */
  isSameLevel(otherTier: SubscriptionTier): boolean {
    return this.data.level === otherTier.data.level;
  }
}