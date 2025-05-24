// File: backend/services/user_auth/SubscriptionTier.ts
/**
 * @fileoverview Defines the SubscriptionTier domain model and its interface for AgentOS.
 * This model represents a subscription level within the system, detailing its properties,
 * entitlements, and pricing information. It aligns with the Prisma schema for the
 * SubscriptionTier entity and provides a clean, typed representation for use throughout the application.
 *
 * @module backend/services/user_auth/SubscriptionTier
 */

import { SubscriptionTier as PrismaSubscriptionTierType } from '@prisma/client';

/**
 * @interface ISubscriptionTier
 * @description Defines the structure and properties for a subscription tier.
 * This interface ensures that all parts of the system interacting with subscription tiers
 * adhere to a consistent data model.
 *
 * @property {string} id - The unique identifier for the subscription tier (e.g., UUID).
 * @property {string} name - The human-readable name of the tier (e.g., "Free", "Basic", "Premium"). Should be unique.
 * @property {string | null} description - A brief description of the tier and its benefits.
 * @property {number} level - A numerical level representing the hierarchy or rank of the tier (e.g., 0 for Free, 1 for Basic). Used for comparison.
 * @property {number} maxGmiInstances - The maximum number of concurrent GMI (Generalized Mind Instance) instances a user on this tier can have.
 * @property {number} maxApiKeys - The maximum number of user-provided LLM API keys a user on this tier can store.
 * @property {number} maxConversationHistoryTurns - The maximum number of turns to retain in a conversation history for users on this tier.
 * @property {number} maxContextWindowTokens - The maximum context window size (in tokens) preferred or enforced for LLMs used by users on this tier.
 * @property {number} dailyCostLimitUsd - The daily spending limit in USD for services that incur costs (e.g., LLM API usage) for users on this tier.
 * @property {number} monthlyCostLimitUsd - The monthly spending limit in USD. (Added based on common practice, matches Prisma schema)
 * @property {boolean} isPublic - Indicates if this tier is available to unauthenticated or newly registered users by default.
 * @property {string[]} features - An array of feature flags or strings representing specific entitlements granted by this tier (e.g., "ADVANCED_TOOLS", "API_ACCESS").
 * @property {string | null} lemonSqueezyProductId - Optional Product ID from LemonSqueezy associated with this tier.
 * @property {string | null} lemonSqueezyVariantId - Optional Variant ID from LemonSqueezy for this specific tier/plan.
 * @property {number | null} priceMonthlyUsd - The monthly price of this tier in USD.
 * @property {number | null} priceYearlyUsd - The yearly price of this tier in USD.
 * @property {Date} createdAt - Timestamp of when the tier definition was created.
 * @property {Date} updatedAt - Timestamp of the last update to the tier definition.
 */
export interface ISubscriptionTier {
  id: string;
  name: string;
  description: string | null;
  level: number;
  maxGmiInstances: number;
  maxApiKeys: number;
  maxConversationHistoryTurns: number;
  maxContextWindowTokens: number;
  dailyCostLimitUsd: number;
  monthlyCostLimitUsd: number; // Added for completeness from schema
  isPublic: boolean;
  features: string[];
  lemonSqueezyProductId?: string | null; // Added from schema
  lemonSqueezyVariantId?: string | null; // Added from schema
  priceMonthlyUsd?: number | null; // Added from schema
  priceYearlyUsd?: number | null; // Added from schema
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Represents a subscription tier in the AgentOS system.
 * This class provides a clean interface for accessing tier properties,
 * mirroring the Prisma `SubscriptionTier` model and implementing `ISubscriptionTier`.
 * It facilitates the transformation of database records into domain objects.
 *
 * @class SubscriptionTier
 * @implements {ISubscriptionTier}
 */
export class SubscriptionTier implements ISubscriptionTier {
  public readonly id: string;
  public name: string;
  public description: string | null;
  public level: number;
  public maxGmiInstances: number;
  public maxApiKeys: number;
  public maxConversationHistoryTurns: number;
  public maxContextWindowTokens: number;
  public dailyCostLimitUsd: number;
  public monthlyCostLimitUsd: number;
  public isPublic: boolean;
  public features: string[];
  public lemonSqueezyProductId: string | null;
  public lemonSqueezyVariantId: string | null;
  public priceMonthlyUsd: number | null;
  public priceYearlyUsd: number | null;
  public readonly createdAt: Date;
  public updatedAt: Date;

  /**
   * Private constructor to enforce creation via `fromPrisma` static method.
   * @param {PrismaSubscriptionTierType} prismaTier - The Prisma SubscriptionTier object.
   */
  private constructor(prismaTier: PrismaSubscriptionTierType) {
    this.id = prismaTier.id;
    this.name = prismaTier.name;
    this.description = prismaTier.description;
    this.level = prismaTier.level;
    this.maxGmiInstances = prismaTier.maxGmiInstances;
    this.maxApiKeys = prismaTier.maxApiKeys;
    this.maxConversationHistoryTurns = prismaTier.maxConversationHistoryTurns;
    this.maxContextWindowTokens = prismaTier.maxContextWindowTokens;
    this.dailyCostLimitUsd = prismaTier.dailyCostLimitUsd;
    this.monthlyCostLimitUsd = prismaTier.monthlyCostLimitUsd;
    this.isPublic = prismaTier.isPublic;
    this.features = prismaTier.features; // Prisma stores string[] as is
    this.lemonSqueezyProductId = prismaTier.lemonSqueezyProductId;
    this.lemonSqueezyVariantId = prismaTier.lemonSqueezyVariantId;
    this.priceMonthlyUsd = prismaTier.priceMonthlyUsd;
    this.priceYearlyUsd = prismaTier.priceYearlyUsd;
    this.createdAt = prismaTier.createdAt;
    this.updatedAt = prismaTier.updatedAt;
  }

  /**
   * Static factory method to create a SubscriptionTier instance from a Prisma SubscriptionTier object.
   * This is the preferred way to instantiate SubscriptionTier domain objects from database records.
   *
   * @static
   * @param {PrismaSubscriptionTierType} prismaTier - The Prisma SubscriptionTier object from the database.
   * @returns {SubscriptionTier} A new instance of the SubscriptionTier domain model.
   */
  public static fromPrisma(prismaTier: PrismaSubscriptionTierType): SubscriptionTier {
    return new SubscriptionTier(prismaTier);
  }
}