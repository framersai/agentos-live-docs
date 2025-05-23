// backend/services/user_auth/SubscriptionTier.ts
import { SubscriptionTier as PrismaSubscriptionTier } from '@prisma/client';

/**
 * @interface ISubscriptionTier
 * Defines the structure for a subscription tier.
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
  isPublic: boolean;
  features: string[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Represents a subscription tier in the AgentOS system.
 * This class provides a clean interface for accessing tier properties,
 * mirroring the Prisma `SubscriptionTier` model.
 */
export class SubscriptionTier implements ISubscriptionTier {
  public id: string;
  public name: string;
  public description: string | null;
  public level: number;
  public maxGmiInstances: number;
  public maxApiKeys: number;
  public maxConversationHistoryTurns: number;
  public maxContextWindowTokens: number;
  public dailyCostLimitUsd: number;
  public isPublic: boolean;
  public features: string[];
  public createdAt: Date;
  public updatedAt: Date;

  /**
   * Creates an instance of SubscriptionTier.
   * @param {Object} params - The parameters to initialize the tier.
   * @param {string} params.id - The tier's ID.
   * @param {string} params.name - The name of the tier.
   * @param {string | null} params.description - The description of the tier.
   * @param {number} params.level - The hierarchical level of the tier.
   * @param {number} params.maxGmiInstances - Maximum number of concurrent GMI instances allowed.
   * @param {number} params.maxApiKeys - Maximum number of user-provided API keys allowed.
   * @param {number} params.maxConversationHistoryTurns - Max turns to retain in conversation history.
   * @param {number} params.maxContextWindowTokens - Max tokens for LLM context window.
   * @param {number} params.dailyCostLimitUsd - Daily cost limit in USD.
   * @param {boolean} params.isPublic - True if the tier is accessible to public/unauthenticated users.
   * @param {string[]} params.features - Array of feature flags associated with this tier.
   * @param {Date} [params.createdAt=new Date()] - The creation timestamp.
   * @param {Date} [params.updatedAt=new Date()] - The last update timestamp.
   */
  constructor(params: {
    id: string;
    name: string;
    description: string | null;
    level: number;
    maxGmiInstances: number;
    maxApiKeys: number;
    maxConversationHistoryTurns: number;
    maxContextWindowTokens: number;
    dailyCostLimitUsd: number;
    isPublic: boolean;
    features: string[];
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this.id = params.id;
    this.name = params.name;
    this.description = params.description;
    this.level = params.level;
    this.maxGmiInstances = params.maxGmiInstances;
    this.maxApiKeys = params.maxApiKeys;
    this.maxConversationHistoryTurns = params.maxConversationHistoryTurns;
    this.maxContextWindowTokens = params.maxContextWindowTokens;
    this.dailyCostLimitUsd = params.dailyCostLimitUsd;
    this.isPublic = params.isPublic;
    this.features = params.features;
    this.createdAt = params.createdAt || new Date();
    this.updatedAt = params.updatedAt || new Date();
  }

  /**
   * Creates a SubscriptionTier instance from a Prisma SubscriptionTier object.
   * @param {PrismaSubscriptionTier} prismaTier - The Prisma SubscriptionTier object.
   * @returns {SubscriptionTier} The SubscriptionTier instance.
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
      isPublic: prismaTier.isPublic,
      features: prismaTier.features,
      createdAt: prismaTier.createdAt,
      updatedAt: prismaTier.updatedAt,
    });
  }
}