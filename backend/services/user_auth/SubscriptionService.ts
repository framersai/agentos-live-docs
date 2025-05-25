/**
 * @fileoverview SubscriptionService with proper class structure and method definitions.
 * This file defines the service responsible for managing user subscriptions,
 * subscription tiers, and handling webhook events from payment providers like LemonSqueezy.
 * It interacts with the Prisma ORM for data persistence.
 *
 * @module backend/services/user_auth/SubscriptionService
 */
import { PrismaClient, SubscriptionTier as PrismaSubscriptionTierModel, User as PrismaUser } from '@prisma/client';
import { GMIError, GMIErrorCode } from '../../utils/errors';
// Import ISubscriptionTier from the centralized SubscriptionTier.ts file
import { ISubscriptionTier } from './SubscriptionTier';
// NOTE: IAuthService would typically be imported if used, e.g., import { IAuthService } from './IAuthService';


/**
 * @interface ISubscriptionService
 * @description Defines the contract for the SubscriptionService. This service handles
 * all logic related to user subscriptions, tier management, feature access based on
 * subscriptions, and integration with payment providers for webhook events.
 */
export interface ISubscriptionService {
  /**
   * Initializes the subscription service, potentially setting up default tiers.
   * @returns {Promise<void>} A promise that resolves upon successful initialization.
   */
  initialize(): Promise<void>;

  /**
   * Retrieves the subscription tier for a given user.
   * If the user has no specific tier assigned, a default (e.g., 'Free') tier is returned.
   * @param {string} userId - The ID of the user.
   * @returns {Promise<ISubscriptionTier | null>} The user's subscription tier, or null if the user is not found.
   */
  getUserSubscriptionTier(userId: string): Promise<ISubscriptionTier | null>;

  /**
   * Assigns a specific subscription tier to a user.
   * @param {string} userId - The ID of the user.
   * @param {string} tierId - The ID of the subscription tier to assign.
   * @returns {Promise<PrismaUser>} The updated user object with the new tier assignment.
   * @throws {GMIError} If the tier or user is not found.
   */
  assignTierToUser(userId: string, tierId: string): Promise<PrismaUser>;

  /**
   * Checks if a user can access a specific persona based on their subscription.
   * (Currently a placeholder, actual logic would depend on persona-tier mapping).
   * @param {string} userId - The ID of the user.
   * @param {string} personaId - The ID of the persona.
   * @returns {Promise<boolean>} True if access is allowed, false otherwise.
   */
  userCanAccessPersona(userId: string, personaId: string): Promise<boolean>;

  /**
   * Creates or updates the default subscription tiers in the database.
   * This is typically called during service initialization.
   * @returns {Promise<void>}
   */
  createDefaultTiers(): Promise<void>;

  /**
   * Retrieves all available subscription tiers, ordered by level.
   * @returns {Promise<ISubscriptionTier[]>} A list of all subscription tiers.
   */
  getAllTiers(): Promise<ISubscriptionTier[]>;

  /**
   * Retrieves a specific subscription tier by its name.
   * @param {string} name - The name of the tier.
   * @returns {Promise<ISubscriptionTier | null>} The subscription tier, or null if not found.
   */
  getTierByName(name: string): Promise<ISubscriptionTier | null>;

  /**
   * Handles incoming webhook events from a payment provider (e.g., LemonSqueezy).
   * It routes events to specific handlers based on the event name.
   * @param {LemonSqueezyWebhookEvent} eventData - The webhook event payload.
   * @returns {Promise<void>}
   * @throws {GMIError} If an error occurs during webhook processing.
   */
  handleSubscriptionWebhook(eventData: LemonSqueezyWebhookEvent): Promise<void>;

  /**
   * Upgrades a user's subscription tier to a higher level.
   * @param {string} userId - The ID of the user.
   * @param {string} newTierName - The name of the target higher tier.
   * @returns {Promise<void>}
   * @throws {GMIError} If the user or target tier is not found, or if it's not a valid upgrade.
   */
  upgradeTier(userId: string, newTierName: string): Promise<void>;

  /**
   * Downgrades a user's subscription tier to a lower level.
   * @param {string} userId - The ID of the user.
   * @param {string} newTierName - The name of the target lower tier.
   * @returns {Promise<void>}
   * @throws {GMIError} If the user or target tier is not found, or if it's not a valid downgrade.
   */
  downgradeTier(userId: string, newTierName: string): Promise<void>;

  /**
   * Retrieves usage statistics for a user, such as costs and resource consumption.
   * @param {string} userId - The ID of the user.
   * @returns {Promise<UserUsageStats>} The user's current usage statistics.
   */
  getUserUsageStats(userId: string): Promise<UserUsageStats>;

  /**
   * Checks if a user is within their usage limits for a specific resource type.
   * @param {string} userId - The ID of the user.
   * @param {string} resourceType - The type of resource being checked (e.g., 'daily_cost', 'api_keys').
   * @param {number} [attemptedUsageIncrement=1] - The amount of usage being attempted (e.g., 1 for a new API key, cost for a new transaction). Relevant for incremental checks. Defaults to 1 for count-based resources.
   * @returns {Promise<boolean>} True if within limits, false otherwise.
   */
  isWithinUsageLimits(userId: string, resourceType: string, attemptedUsageIncrement?: number): Promise<boolean>;
}

/**
 * @interface ILemonSqueezyService
 * @description Defines the contract for a service interacting with the LemonSqueezy API.
 * This would typically handle tasks like verifying webhooks, managing customer data,
 * fetching product information, and creating checkout sessions.
 */
export interface ILemonSqueezyService {
  /** Optional initialization method for the LemonSqueezy service. */
  initialize?(): Promise<void>;
  /** Verifies the signature of an incoming LemonSqueezy webhook. */
  verifyWebhookSignature(rawBody: string, signature: string): boolean;
  /** Processes a LemonSqueezy webhook event based on its name and data. */
  processWebhookEvent(eventName: string, data: any): Promise<void>; // data can be specific per event
  /** Retrieves subscriptions for a LemonSqueezy customer. */
  getCustomerSubscriptions?(customerId: string): Promise<LemonSqueezySubscription[]>;
  /** Creates a new customer in LemonSqueezy. */
  createCustomer?(customerData: any): Promise<any>; // Define specific types if possible
  /** Retrieves product listings from LemonSqueezy. */
  getProducts?(): Promise<any[]>; // Define specific types if possible
  /** Creates a checkout session URL for a given product and customer. */
  createCheckoutSession?(productId: string, variantId: string, customerId?: string, userEmail?: string): Promise<string>; // Added variantId
}

/**
 * @interface LemonSqueezySubscription
 * @description Represents the structure of a subscription object from LemonSqueezy.
 * Based on common fields; refer to LemonSqueezy API docs for exact structure.
 */
export interface LemonSqueezySubscription {
  id: string; // LemonSqueezy subscription ID
  status: string; // e.g., "active", "cancelled", "expired", "past_due", "on_trial"
  customerId: string; // LemonSqueezy customer ID
  orderId: string; // LemonSqueezy order ID
  productId: string; // LemonSqueezy product ID
  variantId: string; // LemonSqueezy variant ID
  productName: string;
  variantName: string;
  userName: string;
  userEmail: string;
  renewsAt?: string | null; // ISO 8601 datetime
  endsAt?: string | null; // ISO 8601 datetime, if subscription is set to cancel or has expired
  trialEndsAt?: string | null; // ISO 8601 datetime
  cancelled: boolean;
  urls: {
    update_payment_method?: string;
    customer_portal?: string;
  };
  createdAt: string; // ISO 8601 datetime
  updatedAt: string; // ISO 8601 datetime
  // Add other relevant fields like price, currency, etc.
}

/**
 * @interface LemonSqueezyWebhookEvent
 * @description Represents the structure of a webhook event payload from LemonSqueezy.
 */
export interface LemonSqueezyWebhookEvent {
  meta: {
    event_name: string; // e.g., "subscription_created", "subscription_payment_success"
    custom_data?: Record<string, any>; // Any custom data you passed when creating the checkout/subscription
    webhook_id?: string;
  };
  data: {
    id: string; // ID of the object related to the event (e.g., subscription ID, order ID)
    type: string; // Type of the object (e.g., "subscriptions", "orders")
    attributes: any; // Object attributes, structure varies by event type
    relationships?: Record<string, any>; // Related objects
  };
}

/**
 * @interface UserUsageStats
 * @description Defines the structure for tracking a user's resource usage statistics.
 */
export interface UserUsageStats {
  dailyCostUsd: number;
  monthlyCostUsd: number;
  currentGmiInstances: number;
  currentApiKeys: number;
  conversationTurnsToday: number;
  lastResetDate: Date; // Timestamp of the last daily reset for turns/costs
}

/**
 * @class SubscriptionService
 * @implements {ISubscriptionService}
 * @description Service responsible for managing user subscriptions, tiers, and payment provider webhooks.
 */
export class SubscriptionService implements ISubscriptionService {
  private prisma: PrismaClient;
  private authService: any; // Should be IAuthService if used and properly typed
  private lemonSqueezyService: ILemonSqueezyService;

  /**
   * Constructs a SubscriptionService instance.
   * @param {PrismaClient} prisma - The Prisma client instance for database interaction.
   * @param {any} authService - An instance of the authentication service (TODO: type with IAuthService).
   * @param {ILemonSqueezyService} lemonSqueezyService - An instance of the LemonSqueezy service.
   */
  constructor(
    prisma: PrismaClient,
    authService: any, 
    lemonSqueezyService: ILemonSqueezyService
  ) {
    this.prisma = prisma;
    this.authService = authService;
    this.lemonSqueezyService = lemonSqueezyService;
  }

  /** @inheritdoc */
  public async initialize(): Promise<void> {
    console.log('SubscriptionService: Initializing...');
    await this.createDefaultTiers();
    console.log('SubscriptionService: Initialized successfully.');
  }

  /** @inheritdoc */
  public async createDefaultTiers(): Promise<void> {
    const defaultTiersData: Omit<ISubscriptionTier, 'id' | 'createdAt' | 'updatedAt'>[] = [
      // ... (tier data as previously defined)
      {
        name: 'Free',
        description: 'Basic access with limited features',
        level: 0,
        maxGmiInstances: 1,
        maxApiKeys: 1,
        maxConversationHistoryTurns: 20,
        maxContextWindowTokens: 4096,
        dailyCostLimitUsd: 0.0,
        monthlyCostLimitUsd: 0.0,
        isPublic: true,
        features: ['basic_chat', 'limited_history'],
        lemonSqueezyProductId: process.env.LEMONSQUEEZY_FREE_PRODUCT_ID || null,
        lemonSqueezyVariantId: process.env.LEMONSQUEEZY_FREE_VARIANT_ID || null,
        priceMonthlyUsd: 0.00,
      },
      {
        name: 'Pro',
        description: 'Professional features with higher limits',
        level: 1,
        maxGmiInstances: 5,
        maxApiKeys: 3,
        maxConversationHistoryTurns: 100,
        maxContextWindowTokens: 16384,
        dailyCostLimitUsd: 10.0,
        monthlyCostLimitUsd: 50.0,
        isPublic: false,
        features: ['advanced_chat', 'extended_history', 'priority_support'],
        lemonSqueezyProductId: process.env.LEMONSQUEEZY_PRO_PRODUCT_ID || null,
        lemonSqueezyVariantId: process.env.LEMONSQUEEZY_PRO_MONTHLY_VARIANT_ID || null, // Example
        priceMonthlyUsd: 19.99,
        priceYearlyUsd: 199.90, // Example yearly price
      },
      {
        name: 'Enterprise',
        description: 'Full access with unlimited features for large teams',
        level: 2,
        maxGmiInstances: 20, // Or -1 for unlimited, handled in logic
        maxApiKeys: 10,      // Or -1 for unlimited
        maxConversationHistoryTurns: 1000, // Or -1 for unlimited
        maxContextWindowTokens: 32768,
        dailyCostLimitUsd: 100.0, // Or -1 for unlimited
        monthlyCostLimitUsd: 500.0, // Or -1 for unlimited
        isPublic: false,
        features: ['unlimited_chat', 'full_history', 'priority_support', 'custom_personas', 'dedicated_support'],
        lemonSqueezyProductId: process.env.LEMONSQUEEZY_ENTERPRISE_PRODUCT_ID || null,
        lemonSqueezyVariantId: process.env.LEMONSQUEEZY_ENTERPRISE_MONTHLY_VARIANT_ID || null, // Example
        priceMonthlyUsd: 99.99,
        // priceYearlyUsd: Contact sales
      }
    ];

    for (const tierData of defaultTiersData) {
      await this.prisma.subscriptionTier.upsert({
        where: { name: tierData.name },
        update: tierData,
        create: tierData as any, // Prisma will handle the default ID, createdAt, updatedAt
      });
    }
    console.log('SubscriptionService: Default tiers created/updated.');
  }

  /** @inheritdoc */
  public async getUserSubscriptionTier(userId: string): Promise<ISubscriptionTier | null> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { subscriptionTier: true }
    });

    if (!user) {
      console.warn(`SubscriptionService: User with ID '${userId}' not found when trying to get subscription tier.`);
      return null;
    }

    if (!user.subscriptionTier) {
      console.log(`SubscriptionService: User '${userId}' has no assigned tier, attempting to default to 'Free'.`);
      const freeTier = await this.prisma.subscriptionTier.findUnique({
        where: { name: 'Free' }
      });
      if (!freeTier) {
        console.error("SubscriptionService: CRITICAL - 'Free' tier not found in database. Please ensure default tiers are created.");
        return null; // Or throw an error
      }
      return freeTier as ISubscriptionTier; // Cast Prisma model to interface
    }
    return user.subscriptionTier as ISubscriptionTier; // Cast Prisma model to interface
  }

  /** @inheritdoc */
  public async assignTierToUser(userId: string, tierId: string): Promise<PrismaUser> {
    const tier = await this.prisma.subscriptionTier.findUnique({
      where: { id: tierId }
    });
    if (!tier) {
      throw new GMIError(`Subscription tier with ID '${tierId}' not found.`, GMIErrorCode.RESOURCE_NOT_FOUND, { tierId });
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId }
    });
    if (!user) {
      throw new GMIError(`User with ID '${userId}' not found.`, GMIErrorCode.USER_NOT_FOUND, { userId });
    }

    // Logic to handle unsubscription from previous LemonSqueezy subscription might be needed here
    // if the tier change is manual and not driven by a LemonSqueezy webhook.

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: { 
        subscriptionTierId: tierId,
        // If assigning a tier implies an active subscription, set status.
        // This might be overridden by webhook logic later.
        subscriptionStatus: 'active', 
        // Clear LemonSqueezy specific IDs if this is a manual internal assignment not linked to a current LS sub.
        // lemonSqueezySubscriptionId: null, // Or keep if relevant
        subscriptionEndsAt: null, // Or calculate based on new tier
      }
    });
    console.log(`SubscriptionService: Assigned tier '${tier.name}' to user '${userId}'.`);
    return updatedUser;
  }

  /** @inheritdoc */
  public async userCanAccessPersona(userId: string, personaId: string): Promise<boolean> {
    const userTier = await this.getUserSubscriptionTier(userId);
    if (!userTier) {
      return false;
    }
    // TODO: Implement actual logic based on persona requirements (e.g., a 'allowedPersonas' field on tier or specific features)
    // For now, assuming any tier allows access if 'custom_personas' feature is present for non-basic personas, or it's a basic persona.
    // This is a placeholder.
    if (personaId === 'basic_assistant') return true; // Example: basic assistant always available
    if (userTier.features.includes('custom_personas') || userTier.level > 0) {
         console.log(`SubscriptionService: Persona access check for user '${userId}', persona '${personaId}', tier '${userTier.name}'. Granted.`);
        return true;
    }
    console.log(`SubscriptionService: Persona access check for user '${userId}', persona '${personaId}', tier '${userTier.name}'. Denied.`);
    return false;
  }

  /** @inheritdoc */
  public async getAllTiers(): Promise<ISubscriptionTier[]> {
    const tiers = await this.prisma.subscriptionTier.findMany({
      orderBy: { level: 'asc' }
    });
    return tiers.map(tier => tier as ISubscriptionTier); // Cast Prisma model to interface
  }

  /** @inheritdoc */
  public async getTierByName(name: string): Promise<ISubscriptionTier | null> {
    const tier = await this.prisma.subscriptionTier.findUnique({
      where: { name }
    });
    return tier ? (tier as ISubscriptionTier) : null; // Cast Prisma model to interface
  }

  /** @inheritdoc */
  public async upgradeTier(userId: string, newTierName: string): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { subscriptionTier: true }
    });
    if (!user) {
      throw new GMIError('User not found for tier upgrade.', GMIErrorCode.USER_NOT_FOUND, { userId });
    }

    const newTier = await this.getTierByName(newTierName);
    if (!newTier) {
      throw new GMIError(`Target tier '${newTierName}' not found for upgrade.`, GMIErrorCode.RESOURCE_NOT_FOUND, { newTierName });
    }

    const currentTierLevel = user.subscriptionTier?.level ?? -1; // Default to a very low level if no current tier
    if (newTier.level <= currentTierLevel) {
      throw new GMIError(`Cannot upgrade to a lower or same tier level. Current: ${user.subscriptionTier?.name ?? 'None'}, Target: ${newTierName}`, GMIErrorCode.VALIDATION_ERROR, { userId, currentTierName: user.subscriptionTier?.name, newTierName });
    }

    // TODO: Potentially trigger a payment flow via LemonSqueezyService if this is user-initiated.
    // For now, assumes this is an admin action or post-payment.
    await this.assignTierToUser(userId, newTier.id);
    console.log(`SubscriptionService: Upgraded user '${userId}' from '${user.subscriptionTier?.name ?? 'None'}' to tier '${newTierName}'.`);
  }

  /** @inheritdoc */
  public async downgradeTier(userId: string, newTierName: string): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { subscriptionTier: true }
    });
    if (!user) {
      throw new GMIError('User not found for tier downgrade.', GMIErrorCode.USER_NOT_FOUND, { userId });
    }
    if (!user.subscriptionTier) {
        throw new GMIError('User has no current tier to downgrade from.', GMIErrorCode.VALIDATION_ERROR, { userId });
    }

    const newTier = await this.getTierByName(newTierName);
    if (!newTier) {
      throw new GMIError(`Target tier '${newTierName}' not found for downgrade.`, GMIErrorCode.RESOURCE_NOT_FOUND, { newTierName });
    }

    if (newTier.level >= user.subscriptionTier.level) {
      throw new GMIError(`Cannot downgrade to a higher or same tier level. Current: ${user.subscriptionTier.name}, Target: ${newTierName}`, GMIErrorCode.VALIDATION_ERROR, { userId, currentTierName: user.subscriptionTier.name, newTierName });
    }

    // TODO: Potentially handle LemonSqueezy subscription changes (e.g., if downgrade happens mid-cycle).
    await this.assignTierToUser(userId, newTier.id);
    console.log(`SubscriptionService: Downgraded user '${userId}' from '${user.subscriptionTier.name}' to tier '${newTierName}'.`);
  }

  /** @inheritdoc */
  public async getUserUsageStats(userId: string): Promise<UserUsageStats> {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0); // Use UTC for daily boundaries

    const thisMonth = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), 1));

    const [dailyUsage, monthlyUsage, apiKeyCount, conversationTurns] = await Promise.all([
      this.prisma.usageRecord.aggregate({
        _sum: { costUsd: true },
        where: { userId, createdAt: { gte: today } },
      }),
      this.prisma.usageRecord.aggregate({
        _sum: { costUsd: true },
        where: { userId, createdAt: { gte: thisMonth } },
      }),
      this.prisma.userApiKey.count({
        where: { userId, isActive: true }
      }),
      this.prisma.conversationMessage.count({ // Assuming user messages count towards turns
        where: {
          conversation: { userId },
          role: 'user', // Or count all messages if preferred
          createdAt: { gte: today },
        },
      }),
    ]);

    // GMI instances count typically comes from a live state manager or another service.
    // For simplicity, placeholder. In a real app, query the GMIInstance model or a cache.
    const currentGmiInstances = await this.prisma.gMIInstance.count({
        where: { userId, isActive: true}
    });

    return {
      dailyCostUsd: dailyUsage._sum.costUsd || 0,
      monthlyCostUsd: monthlyUsage._sum.costUsd || 0,
      currentGmiInstances,
      currentApiKeys: apiKeyCount,
      conversationTurnsToday: conversationTurns,
      lastResetDate: today, 
    };
  }

  /** @inheritdoc */
  public async isWithinUsageLimits(userId: string, resourceType: string, attemptedUsageIncrement: number = 1): Promise<boolean> {
    const userTier = await this.getUserSubscriptionTier(userId);
    if (!userTier) {
      console.warn(`SubscriptionService: No tier found for user ${userId} during usage limit check.`);
      return false; 
    }

    const usageStats = await this.getUserUsageStats(userId);

    // Helper for tiers where -1 means unlimited
    const isUnlimited = (limit: number) => limit === -1;

    switch (resourceType) {
      case 'gmi_instances':
        if (isUnlimited(userTier.maxGmiInstances)) return true;
        return (usageStats.currentGmiInstances + attemptedUsageIncrement) <= userTier.maxGmiInstances;
      case 'api_keys':
        if (isUnlimited(userTier.maxApiKeys)) return true;
        return (usageStats.currentApiKeys + attemptedUsageIncrement) <= userTier.maxApiKeys;
      case 'daily_cost':
        if (isUnlimited(userTier.dailyCostLimitUsd)) return true;
        return (usageStats.dailyCostUsd + attemptedUsageIncrement) <= userTier.dailyCostLimitUsd;
      case 'monthly_cost':
        if (isUnlimited(userTier.monthlyCostLimitUsd)) return true;
        return (usageStats.monthlyCostUsd + attemptedUsageIncrement) <= userTier.monthlyCostLimitUsd;
      case 'conversation_turns': // `attemptedUsageIncrement` would typically be 1 for a new turn
        if (isUnlimited(userTier.maxConversationHistoryTurns)) return true;
        return (usageStats.conversationTurnsToday + attemptedUsageIncrement) <= userTier.maxConversationHistoryTurns;
      default:
        console.warn(`SubscriptionService: Unknown resource type '${resourceType}' for usage limit check.`);
        return false;
    }
  }

  /** @inheritdoc */
  public async handleSubscriptionWebhook(eventData: LemonSqueezyWebhookEvent): Promise<void> {
    const { meta, data } = eventData;
    console.log(`SubscriptionService: Handling LemonSqueezy webhook event: ${meta.event_name}`);

    // Optional: Implement webhook signature verification if not done by middleware
    // This requires access to the raw request body and signature header.
    // if (!this.lemonSqueezyService.verifyWebhookSignature(rawBody, signature)) {
    //   throw new GMIError('Invalid LemonSqueezy webhook signature', GMIErrorCode.WEBHOOK_VALIDATION_FAILED);
    // }
    
    try {
      switch (meta.event_name) {
        case 'subscription_created':
        case 'subscription_updated': // Many events might trigger this, e.g., payment success, plan change
          await this.handleSubscriptionUpsert(data.attributes as any, meta.event_name); // Cast to LemonSqueezySubscription like structure
          break;
        case 'subscription_cancelled': // User or admin cancelled, or payment failed finally
          await this.handleSubscriptionStatusChange(data.attributes as any, 'cancelled');
          break;
        case 'subscription_resumed': // User resumed a paused subscription
             await this.handleSubscriptionStatusChange(data.attributes as any, 'active');
            break;
        case 'subscription_expired': // Subscription reached its natural end and was not renewed
             await this.handleSubscriptionStatusChange(data.attributes as any, 'expired');
            break;
        case 'subscription_paused': // E.g., user paused their subscription billing
             await this.handleSubscriptionStatusChange(data.attributes as any, 'paused');
            break;
        case 'subscription_unpaused':
             await this.handleSubscriptionStatusChange(data.attributes as any, 'active');
            break;
        // Handle payment-related events if they affect access immediately
        case 'subscription_payment_success':
            // Usually covered by subscription_updated, but can be handled if specific logic needed
            console.log(`Subscription payment success for subscription ID: ${data.attributes.subscription_id}`);
            await this.handleSubscriptionUpsert(data.attributes as any, meta.event_name);
            break;
        case 'subscription_payment_failed':
        case 'subscription_payment_recovered':
            // Update status based on these, potentially leading to 'past_due' or back to 'active'
            await this.handleSubscriptionUpsert(data.attributes as any, meta.event_name);
            break;
        case 'order_created': 
           await this.handleOrderCreated(data.attributes as any);
           break;
        default:
          console.warn(`SubscriptionService: Unhandled LemonSqueezy webhook event: ${meta.event_name}`);
      }
    } catch (error) {
      console.error(`SubscriptionService: Error handling webhook event ${meta.event_name}:`, error);
      if (error instanceof GMIError) {
        throw error;
      }
      throw new GMIError(`Webhook processing failed for ${meta.event_name}`, GMIErrorCode.WEBHOOK_PROCESSING_ERROR, { originalError: error });
    }
  }

  /**
   * Handles creation or update of a subscription from a webhook.
   * @private
   * @param {any} attributes - The attributes from the LemonSqueezy subscription object.
   * @param {string} eventName - The name of the webhook event.
   */
  private async handleSubscriptionUpsert(attributes: any, eventName: string): Promise<void> {
    const lemonSqueezySubscriptionId = attributes.subscription_id || attributes.id; // ID can be at different places
    const customerId = attributes.customer_id?.toString();
    const productId = attributes.product_id?.toString();
    const variantId = attributes.variant_id?.toString();
    const status = attributes.status?.toLowerCase(); // e.g., "active", "past_due", "unpaid", "cancelled", "expired", "on_trial"
    
    if (!customerId) {
        console.warn(`SubscriptionService: customer_id missing in ${eventName} webhook data.`);
        throw new GMIError('Customer ID missing in webhook data', GMIErrorCode.VALIDATION_ERROR, { attributes });
    }
    
    let user = await this.prisma.user.findUnique({
        where: { lemonSqueezyCustomerId: customerId }
    });

    if (!user) {
        // If user not found by customer ID, try finding via email if provided in custom_data or webhook
        const userEmail = attributes.user_email || attributes.customer_email || (attributes.custom_data as any)?.user_email;
        if (userEmail) {
            user = await this.prisma.user.findUnique({ where: { email: userEmail.toLowerCase() }});
            if (user && !user.lemonSqueezyCustomerId) { // User found by email, link customer ID
                user = await this.prisma.user.update({
                    where: {id: user.id},
                    data: { lemonSqueezyCustomerId: customerId }
                });
            }
        }
        if (!user) {
            console.warn(`SubscriptionService: User not found for customer ID '${customerId}' or email '${userEmail}' during ${eventName}.`);
            // Depending on business logic, you might create a "ghost" user or throw an error.
            // For now, we'll throw if no user can be associated.
            throw new GMIError(`User not found for customer ID ${customerId} or email`, GMIErrorCode.USER_NOT_FOUND, { customerId, userEmail });
        }
    }

    const tier = await this.mapProductToTier(productId, variantId);
    if (!tier) {
        console.warn(`SubscriptionService: Could not map product/variant (P:${productId}, V:${variantId}) to an internal tier for ${eventName}.`);
        // Potentially assign a default/error tier or leave current tier if update
        throw new GMIError(`No tier found for product/variant from LemonSqueezy`, GMIErrorCode.RESOURCE_NOT_FOUND, { productId, variantId });
    }
    
    // Update user's subscription details
    const dataToUpdate: any = {
        subscriptionStatus: status,
        subscriptionTierId: tier.id,
        lemonSqueezySubscriptionId: lemonSqueezySubscriptionId,
        // Store relevant dates from LemonSqueezy
        subscriptionEndsAt: attributes.ends_at ? new Date(attributes.ends_at) : null,
        // trialEndsAt: attributes.trial_ends_at ? new Date(attributes.trial_ends_at) : user.trialEndsAt, // Preserve if not in payload
        // renewsAt: attributes.renews_at ? new Date(attributes.renews_at) : user.renewsAt,
    };
    if (attributes.cancelled !== undefined) { // LemonSqueezy uses `cancelled: boolean`
        // dataToUpdate.cancelAtPeriodEnd = attributes.cancelled;
    }


    await this.prisma.user.update({
        where: { id: user.id },
        data: dataToUpdate
    });

    console.log(`SubscriptionService: Subscription for user '${user.id}' (LS Customer ID: ${customerId}) processed via ${eventName}. Status: ${status}, Tier: '${tier.name}'.`);
  }

  /**
   * Handles subscription status changes like cancellation or expiration.
   * @private
   * @param {any} attributes - The attributes from the LemonSqueezy subscription object.
   * @param {string} newStatusInApp - The new status to set in the application (e.g., 'cancelled', 'expired').
   */
  private async handleSubscriptionStatusChange(attributes: any, newStatusInApp: 'cancelled' | 'expired' | 'paused' | 'active'): Promise<void> {
    const lemonSqueezySubscriptionId = attributes.subscription_id || attributes.id;
    const customerId = attributes.customer_id?.toString();
     if (!lemonSqueezySubscriptionId && !customerId) {
        console.warn(`SubscriptionService: Insufficient identifiers (subscription_id or customer_id) for status change to ${newStatusInApp}. Attributes:`, attributes);
        throw new GMIError('Insufficient identifiers for subscription status change.', GMIErrorCode.VALIDATION_ERROR, { attributes });
    }
    
    // Find user by subscription ID preferably, fallback to customer ID if subscription ID is missing in webhook payload for some reason
    let user = await this.prisma.user.findUnique({
        where: { lemonSqueezySubscriptionId: lemonSqueezySubscriptionId }
    });
     if (!user && customerId) {
        user = await this.prisma.user.findUnique({ where: { lemonSqueezyCustomerId: customerId }});
    }

    if (!user) {
        console.warn(`SubscriptionService: User not found for LemonSqueezy subscription ID '${lemonSqueezySubscriptionId}' or customer ID '${customerId}' during status change to ${newStatusInApp}.`);
        return; // Or throw if this is unexpected
    }

    const updateData: any = { subscriptionStatus: newStatusInApp };
    let targetTierName = user.subscriptionTierId ? (await this.prisma.subscriptionTier.findUnique({where: {id: user.subscriptionTierId}}))?.name : 'current';


    if (newStatusInApp === 'cancelled' || newStatusInApp === 'expired') {
        const freeTier = await this.getTierByName('Free');
        if (freeTier) {
            updateData.subscriptionTierId = freeTier.id;
            targetTierName = freeTier.name;
        } else {
            console.error("SubscriptionService: CRITICAL - 'Free' tier not found for downgrade. User will retain current tier features but status will be inactive.");
            // Keep current tier but mark status, or assign null to tierId if preferred.
            // updateData.subscriptionTierId = null; 
        }
        updateData.subscriptionEndsAt = attributes.ends_at ? new Date(attributes.ends_at) : new Date(); // Mark as ended now or per LS
    } else if (newStatusInApp === 'paused') {
        // User might retain current tier features but status is paused.
        // Or, move to a specific "paused" tier if you have one.
        updateData.subscriptionEndsAt = attributes.resumes_at ? new Date(attributes.resumes_at) : null; // When it might resume or end if not resumed
    } else if (newStatusInApp === 'active') { // For resumed or unpaused
        const productId = attributes.product_id?.toString();
        const variantId = attributes.variant_id?.toString();
        const activeTier = await this.mapProductToTier(productId, variantId);
        if (activeTier) {
            updateData.subscriptionTierId = activeTier.id;
            targetTierName = activeTier.name;
        } else {
            console.warn(`SubscriptionService: Could not map product/variant to tier for resumed/unpaused subscription ${lemonSqueezySubscriptionId}. User may have incorrect tier.`);
        }
        updateData.subscriptionEndsAt = attributes.renews_at ? new Date(attributes.renews_at) : null; // Next renewal date
    }
    
    await this.prisma.user.update({
        where: { id: user.id },
        data: updateData
    });
    console.log(`SubscriptionService: Subscription status for user '${user.id}' changed to '${newStatusInApp}'. Tier set to '${targetTierName}'.`);
  }
  
  /**
   * Handles order creation webhooks, e.g., for one-time purchases.
   * @private
   */
  private async handleOrderCreated(attributes: any): Promise<void> {
    const orderId = attributes.id?.toString();
    const customerId = attributes.customer_id?.toString();
    const userEmail = attributes.user_email || (attributes.custom_data as any)?.user_email;

    console.log(`SubscriptionService: Order created event (ID: ${orderId}) received for Customer ID: ${customerId}, Email: ${userEmail}. Attributes:`, attributes);
    
    // Example: If this order grants some one-time benefit (e.g., credits)
    // const user = await this.prisma.user.findUnique({ where: { lemonSqueezyCustomerId: customerId }});
    // if (user) {
    //   const orderItems = attributes.order_items; // This is an array
    //   for (const item of orderItems) {
    //     if (item.product_name === "1000 Credits Pack") {
    //       // await grantCreditsToUser(user.id, 1000);
    //     }
    //   }
    // } else {
    //    console.warn(`SubscriptionService: User not found for customer ID ${customerId} on order_created.`);
    // }
  }

  /** @inheritdoc */
  private async mapProductToTier(productId?: string, variantId?: string): Promise<ISubscriptionTier | null> {
    if (!productId && !variantId) {
        console.warn('SubscriptionService: mapProductToTier called with no productId or variantId.');
        return null;
    }
    let tierRecord: PrismaSubscriptionTierModel | null = null;

    // Prefer variantId for mapping if available, as it's more specific (e.g. monthly vs yearly of same product)
    if (variantId) {
        tierRecord = await this.prisma.subscriptionTier.findFirst({ // Changed to findFirst in case multiple tiers mistakenly share a variantId (though schema says unique)
            where: { lemonSqueezyVariantId: variantId }
        });
    }
    if (!tierRecord && productId) {
        tierRecord = await this.prisma.subscriptionTier.findFirst({ // Changed to findFirst
            where: { lemonSqueezyProductId: productId }
        });
    }
    
    if (!tierRecord) {
        console.warn(`SubscriptionService: No internal tier found mapping to LemonSqueezy product ID '${productId}' or variant ID '${variantId}'.`);
        return null;
    }
    return tierRecord as ISubscriptionTier; // Cast Prisma model to interface
  }
}