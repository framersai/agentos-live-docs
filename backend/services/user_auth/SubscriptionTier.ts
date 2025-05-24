// File: backend/services/user_auth/SubscriptionTier.ts
/**
 * @fileoverview SubscriptionTier class and interface with proper exports
 * FIXES: Export SubscriptionTier type properly
 */

import { SubscriptionTier as PrismaSubscriptionTier } from '@prisma/client';

// FIXED: Export SubscriptionTier interface
export interface SubscriptionTier {
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
 * Subscription tier capabilities and limits.
 */
export interface TierCapabilities {
  canAccessPersona: (personaId: string) => boolean;
  canCreateAPIKeys: (currentCount: number) => boolean;
  canCreateGMIInstances: (currentCount: number) => boolean;
  hasFeature: (feature: string) => boolean;
  isWithinDailyCostLimit: (currentCost: number) => boolean;
  isWithinMonthlyCostLimit: (currentCost: number) => boolean;
}

/**
 * SubscriptionTier class with utility methods.
 */
export class SubscriptionTier {
  private constructor(private data: SubscriptionTier) {}

  /**
   * Creates a SubscriptionTier instance from Prisma data.
   */
  static fromPrisma(prismaTier: PrismaSubscriptionTier): SubscriptionTier {
    return new SubscriptionTier({
      id: prismaTier.id,
      name: prismaTier.name,
      description: prismaTier.description,
      level: prismaTier.level,
      maxGmiInstances: prismaTier.maxGmiInstances,
      maxApiKeys: prismaTier.maxApiKeys,
      maxConversationHistoryTurns: prismaTier.maxConversationHistoryTurns,
      maxContextWindowTokens: prismaTier.maxContextWindowTokens,
      dailyCostLimitUsd: prismaTier.dailyCostLimitUsd,
      monthlyCostLimitUsd: prismaTier.monthlyCostLimitUsd,
      isPublic: prismaTier.isPublic,
      features: prismaTier.features,
      lemonSqueezyProductId: prismaTier.lemonSqueezyProductId,
      lemonSqueezyVariantId: prismaTier.lemonSqueezyVariantId,
      priceMonthlyUsd: prismaTier.priceMonthlyUsd,
      priceYearlyUsd: prismaTier.priceYearlyUsd,
      createdAt: prismaTier.createdAt,
      updatedAt: prismaTier.updatedAt,
    });
  }

  /**
   * Gets the full tier data.
   */
  getData(): SubscriptionTier {
    return { ...this.data };
  }

  /**
   * Gets the tier ID.
   */
  get id(): string {
    return this.data.id;
  }

  /**
   * Gets the tier name.
   */
  get name(): string {
    return this.data.name;
  }

  /**
   * Gets the tier description.
   */
  get description(): string | null {
    return this.data.description;
  }

  /**
   * Gets the tier level (higher numbers = more privileges).
   */
  get level(): number {
    return this.data.level;
  }

  /**
   * Gets the maximum number of GMI instances allowed.
   */
  get maxGmiInstances(): number {
    return this.data.maxGmiInstances;
  }

  /**
   * Gets the maximum number of API keys allowed.
   */
  get maxApiKeys(): number {
    return this.data.maxApiKeys;
  }

  /**
   * Gets the maximum conversation history turns.
   */
  get maxConversationHistoryTurns(): number {
    return this.data.maxConversationHistoryTurns;
  }

  /**
   * Gets the maximum context window tokens.
   */
  get maxContextWindowTokens(): number {
    return this.data.maxContextWindowTokens;
  }

  /**
   * Gets the daily cost limit in USD.
   */
  get dailyCostLimitUsd(): number {
    return this.data.dailyCostLimitUsd;
  }

  /**
   * Gets the monthly cost limit in USD.
   */
  get monthlyCostLimitUsd(): number {
    return this.data.monthlyCostLimitUsd;
  }

  /**
   * Checks if this tier is available to public/unauthenticated users.
   */
  get isPublic(): boolean {
    return this.data.isPublic;
  }

  /**
   * Gets the feature flags for this tier.
   */
  get features(): string[] {
    return [...this.data.features];
  }

  /**
   * Gets the monthly price in USD.
   */
  get priceMonthlyUsd(): number | null {
    return this.data.priceMonthlyUsd;
  }

  /**
   * Gets the yearly price in USD.
   */
  get priceYearlyUsd(): number | null {
    return this.data.priceYearlyUsd;
  }

  /**
   * Checks if this tier has a specific feature.
   */
  hasFeature(feature: string): boolean {
    return this.data.features.includes(feature);
  }

  /**
   * Checks if this tier is free.
   */
  isFree(): boolean {
    return this.data.level === 0 || this.data.name.toLowerCase() === 'free';
  }

  /**
   * Checks if this tier is a paid tier.
   */
  isPaid(): boolean {
    return !this.isFree();
  }

  /**
   * Checks if user can create more GMI instances.
   */
  canCreateMoreGMIs(currentCount: number): boolean {
    return currentCount < this.data.maxGmiInstances;
  }

  /**
   * Checks if user can create more API keys.
   */
  canCreateMoreApiKeys(currentCount: number): boolean {
    return currentCount < this.data.maxApiKeys;
  }

  /**
   * Checks if a cost amount is within daily limit.
   */
  isWithinDailyCostLimit(currentCost: number): boolean {
    if (this.data.dailyCostLimitUsd === 0) {
      return currentCost === 0; // Free tier
    }
    return currentCost <= this.data.dailyCostLimitUsd;
  }

  /**
   * Checks if a cost amount is within monthly limit.
   */
  isWithinMonthlyCostLimit(currentCost: number): boolean {
    if (this.data.monthlyCostLimitUsd === 0) {
      return currentCost === 0; // Free tier
    }
    return currentCost <= this.data.monthlyCostLimitUsd;
  }

  /**
   * Gets tier capabilities helper object.
   */
  getCapabilities(): TierCapabilities {
    return {
      canAccessPersona: (personaId: string) => {
        // Basic implementation - in real app, would check persona requirements
        return this.data.level >= 0;
      },
      canCreateAPIKeys: (currentCount: number) => this.canCreateMoreApiKeys(currentCount),
      canCreateGMIInstances: (currentCount: number) => this.canCreateMoreGMIs(currentCount),
      hasFeature: (feature: string) => this.hasFeature(feature),
      isWithinDailyCostLimit: (currentCost: number) => this.isWithinDailyCostLimit(currentCost),
      isWithinMonthlyCostLimit: (currentCost: number) => this.isWithinMonthlyCostLimit(currentCost),
    };
  }

  /**
   * Compares this tier with another tier.
   */
  isHigherThan(otherTier: SubscriptionTier): boolean {
    return this.data.level > otherTier.level;
  }

  /**
   * Compares this tier with another tier.
   */
  isLowerThan(otherTier: SubscriptionTier): boolean {
    return this.data.level < otherTier.level;
  }

  /**
   * Compares this tier with another tier.
   */
  isSameLevel(otherTier: SubscriptionTier): boolean {
    return this.data.level === otherTier.level;
  }
}