// File: backend/services/user_auth/SubscriptionService.ts
/**
 * @fileoverview Implements the SubscriptionService for AgentOS.
 * This service manages subscription tiers, user entitlements, and interactions
 * with payment gateways (e.g., Lemon Squeezy) for subscription lifecycle events.
 * It ensures that user access to features and resources aligns with their
 * current subscription status and tier.
 *
 * @module backend/services/user_auth/SubscriptionService
 */

import { PrismaClient, SubscriptionTier as PrismaSubscriptionTier, User as PrismaUser } from '@prisma/client';
import { IAuthService } from './IAuthService';
import { ISubscriptionTier, SubscriptionTier } from './SubscriptionTier';
import { v4 as uuidv4 } from 'uuid';
import { ILemonSqueezyService, LemonSqueezySubscription, LemonSqueezyWebhookEvent, LemonSqueezyProductMap } from '../payment/LemonSqueezyService'; // Ensure these types are correctly defined/imported
import { GMIError, GMIErrorCode } from '../../utils/errors';

/**
 * Custom error class for SubscriptionService specific errors.
 * @class SubscriptionServiceError
 * @extends {GMIError}
 */
class SubscriptionServiceError extends GMIError {
  constructor(message: string, code: GMIErrorCode, details?: any) {
    super(message, code, details);
    this.name = 'SubscriptionServiceError';
    Object.setPrototypeOf(this, SubscriptionServiceError.prototype);
  }
}

/**
 * @interface ISubscriptionService
 * @description Defines the contract for the Subscription Service. This service is responsible for
 * managing subscription tiers, determining user entitlements based on their tier,
 * and handling interactions with payment providers like Lemon Squeezy for subscription events.
 */
export interface ISubscriptionService {
  /**
   * Initializes the SubscriptionService.
   * This can include ensuring default tiers exist or connecting to payment gateways.
   * @async
   * @returns {Promise<void>}
   */
  initialize(): Promise<void>;

  /**
   * Retrieves a subscription tier by its unique ID.
   * @async
   * @param {string} tierId - The ID of the subscription tier.
   * @returns {Promise<ISubscriptionTier | null>} The subscription tier object if found, otherwise null.
   */
  getTierById(tierId: string): Promise<ISubscriptionTier | null>;

  /**
   * Retrieves a subscription tier by its unique name (e.g., "Free", "Premium").
   * Tier names are typically case-sensitive.
   * @async
   * @param {string} name - The name of the subscription tier.
   * @returns {Promise<ISubscriptionTier | null>} The subscription tier object if found, otherwise null.
   */
  getTierByName(name: string): Promise<ISubscriptionTier | null>;

  /**
   * Retrieves a subscription tier by its numerical level.
   * Levels usually define a hierarchy (e.g., 0 for Free, 1 for Basic, etc.).
   * @async
   * @param {number} level - The numerical level of the subscription tier.
   * @returns {Promise<ISubscriptionTier | null>} The subscription tier object if found, otherwise null.
   */
  getTierByLevel(level: number): Promise<ISubscriptionTier | null>;

  /**
   * Retrieves all defined subscription tiers, typically ordered by level.
   * @async
   * @returns {Promise<ISubscriptionTier[]>} An array of all subscription tier objects.
   */
  getAllTiers(): Promise<ISubscriptionTier[]>;
  
  /**
   * Checks if a user has access to a specific feature based on their current subscription tier.
   * @async
   * @param {string} userId - The ID of the user whose feature access is being checked.
   * @param {string} featureName - The name/identifier of the feature (e.g., "ADVANCED_RAG", "UNLIMITED_PERSONAS").
   * @returns {Promise<boolean>} True if the user's tier grants access to the feature, false otherwise.
   * Returns false if the user or their tier cannot be determined.
   */
  userHasFeature(userId: string, featureName: string): Promise<boolean>;

  /**
   * Creates or updates default subscription tiers in the database (e.g., "Free", "Basic", "Premium").
   * This method is typically called on application startup to ensure essential tiers are available.
   * It should be idempotent.
   * @async
   * @returns {Promise<void>}
   */
  ensureDefaultTiersExist(): Promise<void>;

  /**
   * Assigns a specific subscription tier to a user.
   * This method might be used for administrative purposes or after a manual subscription process.
   * @async
   * @param {string} userId - The ID of the user.
   * @param {string} tierId - The ID of the subscription tier to assign.
   * @returns {Promise<PrismaUser>} The updated Prisma User object.
   * @throws {SubscriptionServiceError} If the user or tier is not found.
   */
  assignTierToUser(userId: string, tierId: string): Promise<PrismaUser>;

  /**
   * Creates a checkout URL for a user to subscribe to a specific tier via Lemon Squeezy.
   * @async
   * @param {string} userId - The internal ID of the user initiating the subscription.
   * @param {string} tierId - The ID of the AgentOS subscription tier they are subscribing to.
   * @param {string} userEmail - The email of the user, for pre-filling checkout information.
   * @param {string} userName - The name of the user, for pre-filling checkout information.
   * @param {string} [redirectUrl] - Optional custom redirect URL after successful payment.
   * @returns {Promise<string>} The Lemon Squeezy checkout URL.
   * @throws {SubscriptionServiceError} If the tier is not found, not configured for Lemon Squeezy, or if the payment gateway interaction fails.
   */
  createSubscriptionCheckoutUrl(
    userId: string,
    tierId: string,
    userEmail: string,
    userName?: string,
    redirectUrl?: string
  ): Promise<string>;

  /**
   * Processes a webhook event received from Lemon Squeezy.
   * This method updates the user's subscription status, tier, and related information
   * in the local database based on events like `subscription_created`, `subscription_updated`, etc.
   * It must validate the webhook signature for security.
   * @async
   * @param {string} rawBody - The raw request body of the webhook.
   * @param {string} signature - The `X-Signature` header from the Lemon Squeezy webhook request.
   * @returns {Promise<void>}
   * @throws {SubscriptionServiceError} If signature verification fails, the event type is unhandled, or processing fails.
   */
  processLemonSqueezyWebhook(rawBody: string, signature: string): Promise<void>;
}


/**
 * @class SubscriptionService
 * @implements {ISubscriptionService}
 * @description Manages subscription tiers, user entitlements, and interactions with payment gateways.
 * It ensures robust handling of subscription lifecycles and feature access control.
 */
export class SubscriptionService implements ISubscriptionService {
  private prisma: PrismaClient;
  private authService: IAuthService;
  private lemonSqueezyService: ILemonSqueezyService;
  private isInitialized: boolean = false;

  /**
   * Creates an instance of SubscriptionService.
   * @param {PrismaClient} prisma - The Prisma client instance for database interaction.
   * @param {IAuthService} authService - The authentication service, used to retrieve user and tier information.
   * @param {ILemonSqueezyService} lemonSqueezyService - The service for interacting with the Lemon Squeezy payment gateway.
   */
  constructor(prisma: PrismaClient, authService: IAuthService, lemonSqueezyService: ILemonSqueezyService) {
    this.prisma = prisma;
    this.authService = authService;
    this.lemonSqueezyService = lemonSqueezyService;
  }

  /** @inheritdoc */
  public async initialize(): Promise<void> {
    await this.ensureDefaultTiersExist();
    this.isInitialized = true;
    console.log("SubscriptionService initialized and default tiers ensured.");
  }

  private ensureInitialized(): void {
    if (!this.isInitialized) {
      throw new SubscriptionServiceError("SubscriptionService is not initialized. Call initialize() first.", GMIErrorCode.NOT_INITIALIZED);
    }
  }

  /** @inheritdoc */
  public async getTierById(tierId: string): Promise<ISubscriptionTier | null> {
    this.ensureInitialized();
    try {
      const tierRecord = await this.prisma.subscriptionTier.findUnique({ where: { id: tierId } });
      return tierRecord ? SubscriptionTier.fromPrisma(tierRecord) : null;
    } catch (error: any) {
      console.error(`SubscriptionService: Error retrieving tier by ID '${tierId}':`, error);
      throw new SubscriptionServiceError(`Failed to retrieve subscription tier by ID: ${error.message}`, GMIErrorCode.DATABASE_ERROR, error);
    }
  }

  /** @inheritdoc */
  public async getTierByName(name: string): Promise<ISubscriptionTier | null> {
    this.ensureInitialized();
    try {
      const tierRecord = await this.prisma.subscriptionTier.findUnique({ where: { name } });
      return tierRecord ? SubscriptionTier.fromPrisma(tierRecord) : null;
    } catch (error: any) {
      console.error(`SubscriptionService: Error retrieving tier by name '${name}':`, error);
      throw new SubscriptionServiceError(`Failed to retrieve subscription tier by name: ${error.message}`, GMIErrorCode.DATABASE_ERROR, error);
    }
  }

  /** @inheritdoc */
  public async getTierByLevel(level: number): Promise<ISubscriptionTier | null> {
    this.ensureInitialized();
    try {
      const tierRecord = await this.prisma.subscriptionTier.findUnique({ where: { level } });
      return tierRecord ? SubscriptionTier.fromPrisma(tierRecord) : null;
    } catch (error: any) {
      console.error(`SubscriptionService: Error retrieving tier by level ${level}:`, error);
      throw new SubscriptionServiceError(`Failed to retrieve subscription tier by level: ${error.message}`, GMIErrorCode.DATABASE_ERROR, error);
    }
  }

  /** @inheritdoc */
  public async getAllTiers(): Promise<ISubscriptionTier[]> {
    this.ensureInitialized();
    try {
      const tierRecords = await this.prisma.subscriptionTier.findMany({ orderBy: { level: 'asc' } });
      return tierRecords.map(SubscriptionTier.fromPrisma);
    } catch (error: any) {
      console.error("SubscriptionService: Error retrieving all tiers:", error);
      throw new SubscriptionServiceError(`Failed to retrieve all subscription tiers: ${error.message}`, GMIErrorCode.DATABASE_ERROR, error);
    }
  }

  /** @inheritdoc */
  public async userHasFeature(userId: string, featureName: string): Promise<boolean> {
    this.ensureInitialized();
    if (!userId || !featureName) return false;

    try {
      const userTier = await this.authService.getUserSubscriptionTier(userId);
      if (!userTier) {
        // User might not exist or has no assigned tier; typically defaults to a base level of access or none.
        // If a "default guest" or "default unassigned" tier exists, logic could apply that.
        // For now, no tier means no specific features.
        console.warn(`SubscriptionService: User '${userId}' has no assigned subscription tier. Denying feature '${featureName}'.`);
        return false;
      }
      return userTier.features.includes(featureName);
    } catch (error: any) {
      console.error(`SubscriptionService: Error checking feature '${featureName}' for user '${userId}':`, error);
      // Default to false on error to be restrictive.
      return false;
    }
  }

  /** @inheritdoc */
  public async ensureDefaultTiersExist(): Promise<void> {
    // This method should be idempotent.
    const defaultTiersData: Omit<PrismaSubscriptionTier, 'id' | 'createdAt' | 'updatedAt' | 'lemonSqueezyProductId' | 'lemonSqueezyVariantId' | 'priceMonthlyUsd' | 'priceYearlyUsd'>[] = [
      { name: 'Free', description: 'Basic access with limited features.', level: 0, maxGmiInstances: 1, maxApiKeys: 0, maxConversationHistoryTurns: 20, maxContextWindowTokens: 4096, dailyCostLimitUsd: 0.10, monthlyCostLimitUsd: 1.00, isPublic: true, features: ["BASIC_GMI_INTERACTION"] },
      { name: 'Basic', description: 'Standard features for regular users.', level: 1, maxGmiInstances: 3, maxApiKeys: 2, maxConversationHistoryTurns: 100, maxContextWindowTokens: 16384, dailyCostLimitUsd: 1.00, monthlyCostLimitUsd: 10.00, isPublic: false, features: ["BASIC_GMI_INTERACTION", "STANDARD_TOOLS", "PERSISTENT_CONVERSATIONS"] },
      { name: 'Premium', description: 'Full access to all features and higher limits.', level: 2, maxGmiInstances: 10, maxApiKeys: 5, maxConversationHistoryTurns: 500, maxContextWindowTokens: 128000, dailyCostLimitUsd: 10.00, monthlyCostLimitUsd: 100.00, isPublic: false, features: ["BASIC_GMI_INTERACTION", "STANDARD_TOOLS", "ADVANCED_TOOLS", "PERSISTENT_CONVERSATIONS", "CUSTOM_PERSONAS", "PRIORITY_SUPPORT"] },
    ];

    for (const tierData of defaultTiersData) {
      try {
        const existingTier = await this.prisma.subscriptionTier.findUnique({ where: { name: tierData.name }});
        const dataToUpsert = {
            ...tierData,
            // Map LemonSqueezy IDs from environment variables based on tier name
            lemonSqueezyProductId: process.env[`LEMONSQUEEZY_${tierData.name.toUpperCase()}_PRODUCT_ID`] || null,
            lemonSqueezyVariantId: process.env[`LEMONSQUEEZY_${tierData.name.toUpperCase()}_VARIANT_ID`] || null,
            priceMonthlyUsd: parseFloat(process.env[`LEMONSQUEEZY_${tierData.name.toUpperCase()}_PRICE_MONTHLY_USD`] || "0") || null,
            priceYearlyUsd: parseFloat(process.env[`LEMONSQUEEZY_${tierData.name.toUpperCase()}_PRICE_YEARLY_USD`] || "0") || null,
        };

        await this.prisma.subscriptionTier.upsert({
          where: { name: tierData.name },
          update: dataToUpsert, // Update existing tier with new values from code/env
          create: { id: uuidv4(), ...dataToUpsert },
        });
      } catch (error: any) {
        console.error(`SubscriptionService: Error upserting default subscription tier '${tierData.name}':`, error);
        // Do not re-throw here, as other tiers might succeed. Log and continue.
      }
    }
    console.log("SubscriptionService: Default subscription tiers ensured in DB.");
  }

  /** @inheritdoc */
  public async assignTierToUser(userId: string, tierId: string): Promise<PrismaUser> {
    this.ensureInitialized();
    try {
      // Verify user and tier exist
      const user = await this.authService.getUserById(userId);
      if (!user) {
        throw new SubscriptionServiceError(`User with ID '${userId}' not found.`, GMIErrorCode.USER_NOT_FOUND);
      }
      const tier = await this.getTierById(tierId);
      if (!tier) {
        throw new SubscriptionServiceError(`Subscription tier with ID '${tierId}' not found.`, GMIErrorCode.RESOURCE_NOT_FOUND);
      }

      return this.prisma.user.update({
        where: { id: userId },
        data: { subscriptionTierId: tierId, updatedAt: new Date() },
      });
    } catch (error: any) {
      console.error(`SubscriptionService: Error assigning tier '${tierId}' to user '${userId}':`, error);
      if (error instanceof SubscriptionServiceError) throw error;
      throw new SubscriptionServiceError(`Failed to assign tier: ${error.message}`, GMIErrorCode.DATABASE_ERROR, error);
    }
  }
  
  /** @inheritdoc */
  public async createSubscriptionCheckoutUrl(
    userId: string,
    tierId: string,
    userEmail: string,
    userName?: string,
    redirectUrl?: string
  ): Promise<string> {
    this.ensureInitialized();
    const tier = await this.getTierById(tierId);
    if (!tier) {
      throw new SubscriptionServiceError(`Subscription tier with ID '${tierId}' not found.`, GMIErrorCode.RESOURCE_NOT_FOUND);
    }
    if (!tier.lemonSqueezyVariantId) {
      throw new SubscriptionServiceError(`Subscription tier '${tier.name}' is not configured for Lemon Squeezy checkout (missing variant ID).`, GMIErrorCode.CONFIG_ERROR);
    }

    try {
      // Ensure ILemonSqueezyService has a method like this.
      // The existing implementation of SubscriptionService directly accessed a productsMap,
      // which is not ideal. ILemonSqueezyService should abstract this.
      return await this.lemonSqueezyService.createCheckout({
        storeId: process.env.LEMONSQUEEZY_STORE_ID!, // Must be configured
        variantId: tier.lemonSqueezyVariantId,
        customPrice: undefined, // Or allow overriding price
        productOptions: {
          name: `Subscription to ${tier.name} Tier`,
          description: tier.description || `Access to ${tier.name} features.`,
          // media: [], // Optional product media
          // redirect_url: redirectUrl || process.env.APP_SUBSCRIPTION_SUCCESS_URL,
          // receipt_button_text
          // receipt_link_url
          // receipt_thank_you_note
        },
        checkoutOptions: {
          // embed: false,
          // media: false,
          // logo: true,
          // dark: false,
          // subscription_preview: true,
        },
        checkoutData: {
          email: userEmail,
          name: userName,
          // billing_address: {...},
          // tax_number: "...",
          // discount_code: "...",
          custom: {
            user_id: userId, // Crucial for linking back to our user
            tier_id: tierId,
          },
        },
        expiresAt: undefined, // Or set an expiry for the checkout link
        preview: true, // If you want to see order summary, tax, discounts
      });
    } catch (error: any) {
      console.error(`SubscriptionService: Failed to create Lemon Squeezy checkout URL for user ${userId}, tier ${tierId}:`, error);
      throw new SubscriptionServiceError(`Failed to initiate subscription checkout: ${error.message}`, GMIErrorCode.PAYMENT_ERROR, error);
    }
  }

  /** @inheritdoc */
  public async processLemonSqueezyWebhook(rawBody: string, signature: string): Promise<void> {
    this.ensureInitialized();
    let event: LemonSqueezyWebhookEvent;
    try {
      event = await this.lemonSqueezyService.validateAndParseWebhook(rawBody, signature);
    } catch (error: any) {
      console.error("SubscriptionService: Lemon Squeezy webhook validation/parsing failed.", error);
      throw new SubscriptionServiceError(error.message, GMIErrorCode.WEBHOOK_VALIDATION_FAILED, error);
    }

    const eventName = event.meta.event_name;
    const lsSubscriptionData = event.data.attributes as LemonSqueezySubscription; // Assume attributes match this type
    const userId = event.meta.custom_data?.user_id as string | undefined;

    if (!userId) {
      console.warn(`SubscriptionService: Lemon Squeezy webhook event '${eventName}' received without 'user_id' in custom_data. Cannot process. LS Subscription ID: ${lsSubscriptionData.id}`);
      // This is critical; without our internal userId, we can't link the subscription.
      // Consider logging this event to a dead-letter queue for manual investigation.
      return; // Or throw an error if this should always be present
    }

    console.log(`SubscriptionService: Processing Lemon Squeezy webhook '${eventName}' for user '${userId}', LS Sub ID '${lsSubscriptionData.id}'.`);

    try {
      // Fetch our representation of the tier based on the variant ID from Lemon Squeezy
      const targetTier = await this.prisma.subscriptionTier.findFirst({
          where: { lemonSqueezyVariantId: lsSubscriptionData.variant_id.toString() } // LS variant_id is number
      });

      if (!targetTier) {
          console.error(`SubscriptionService: No internal subscription tier found matching Lemon Squeezy variant ID '${lsSubscriptionData.variant_id}' for LS Sub ID '${lsSubscriptionData.id}'. User '${userId}'.`);
          // This is a configuration mismatch. Alert admin.
          return; 
      }
      
      const userDataToUpdate: Partial<PrismaUser> = {
        lemonSqueezySubscriptionId: lsSubscriptionData.id.toString(),
        lemonSqueezyCustomerId: lsSubscriptionData.customer_id.toString(),
        subscriptionStatus: lsSubscriptionData.status,
        subscriptionEndsAt: lsSubscriptionData.ends_at ? new Date(lsSubscriptionData.ends_at) : null,
        // Naming conflict: lsSubscriptionData.renews_at vs Prisma User.subscriptionRenewsAt
        // Assuming Prisma schema has `subscriptionRenewsAt`
        ...(lsSubscriptionData.renews_at && { subscriptionRenewsAt: new Date(lsSubscriptionData.renews_at) }),
        subscriptionTierId: targetTier.id, // Always update to the tier associated with the webhook event
      };

      switch (eventName) {
        case 'subscription_created':
        case 'subscription_updated': // Covers renewals, plan changes, etc.
        case 'subscription_resumed':
        case 'subscription_payment_success': // Example, actual event name might differ
          // Ensure user is on the correct, active tier
          userDataToUpdate.subscriptionTierId = targetTier.id;
          userDataToUpdate.subscriptionStatus = 'active'; // Ensure status reflects active paid state
          break;
        case 'subscription_cancelled':
          userDataToUpdate.subscriptionStatus = 'cancelled';
          // Policy: Downgrade to Free tier at `ends_at` or immediately? If immediately:
          // const freeTier = await this.getTierByName('Free');
          // if (freeTier) userDataToUpdate.subscriptionTierId = freeTier.id;
          break;
        case 'subscription_paused':
        case 'subscription_expired':
        case 'subscription_payment_failed':
        case 'subscription_unpaid':
          // Update status, potentially downgrade tier after grace period or immediately
          userDataToUpdate.subscriptionStatus = lsSubscriptionData.status; // Reflect the LS status
          // Policy: If subscription expires or fails, what tier do they fall back to? Typically 'Free'.
          if (eventName === 'subscription_expired' || eventName === 'subscription_unpaid') {
            const freeTier = await this.getTierByName('Free');
            if (freeTier) userDataToUpdate.subscriptionTierId = freeTier.id;
          }
          break;
        default:
          console.log(`SubscriptionService: Unhandled Lemon Squeezy webhook event type: '${eventName}'. LS Sub ID '${lsSubscriptionData.id}'. User '${userId}'.`);
          return; // Exit if event type is not handled
      }

      await this.prisma.user.update({
        where: { id: userId },
        data: { ...userDataToUpdate, updatedAt: new Date() },
      });
      console.log(`SubscriptionService: User '${userId}' subscription details updated successfully for event '${eventName}'. New status: ${userDataToUpdate.subscriptionStatus}, Tier: ${targetTier.name}.`);

    } catch (error: any) {
      console.error(`SubscriptionService: Error processing Lemon Squeezy webhook event '${eventName}' for user '${userId}', LS Sub ID '${lsSubscriptionData.id}':`, error);
      // Do not re-throw to prevent Lemon Squeezy from retrying indefinitely on permanent errors. Log thoroughly.
      // Consider a dead-letter queue for failed webhook events.
      throw new SubscriptionServiceError(`Internal error processing webhook event '${eventName}': ${error.message}`, GMIErrorCode.WEBHOOK_PROCESSING_ERROR, error);
    }
  }
}