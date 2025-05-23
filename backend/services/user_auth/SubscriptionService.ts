// backend/services/user_auth/SubscriptionService.ts
import { PrismaClient, SubscriptionTier as PrismaSubscriptionTier, User as PrismaUser } from '@prisma/client';
import { IAuthService } from './AuthService.js';
import { ISubscriptionTier } from './SubscriptionTier.js';
import { v4 as uuidv4 } from 'uuid';
import { ILemonSqueezyService, LemonSqueezySubscription, LemonSqueezyWebhookEvent } from '../payment_gateway/LemonSqueezyService.js'; // Import Lemon Squeezy Service interfaces

/**
 * @class SubscriptionTier
 * Represents a subscription tier in the AgentOS system.
 * This class provides a clean interface for accessing tier properties,
 * mirroring the Prisma `SubscriptionTier` model.
 * Note: This class definition is kept here as per the provided context structure.
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
      // Ensure features is an array, as Prisma JSON field might sometimes be null or not an array
      features: (prismaTier.features || []) as string[],
      createdAt: prismaTier.createdAt,
      updatedAt: prismaTier.updatedAt,
    });
  }
}

/**
 * @interface ISubscriptionService
 * Defines the interface for the Subscription Service.
 */
export interface ISubscriptionService {
  /**
   * Retrieves a subscription tier by its ID.
   * @param {string} tierId - The ID of the tier.
   * @returns {Promise<ISubscriptionTier | null>} The subscription tier, or null if not found.
   */
  getTierById(tierId: string): Promise<ISubscriptionTier | null>;

  /**
   * Retrieves a subscription tier by its name.
   * @param {string} name - The name of the tier.
   * @returns {Promise<ISubscriptionTier | null>} The subscription tier, or null if not found.
   */
  getTierByName(name: string): Promise<ISubscriptionTier | null>;

  /**
   * Retrieves a subscription tier by its level.
   * @param {number} level - The level of the tier.
   * @returns {Promise<ISubscriptionTier | null>} The subscription tier, or null if not found.
   */
  getTierByLevel(level: number): Promise<ISubscriptionTier | null>;

  /**
   * Checks if a user has access to a specific feature based on their subscription tier.
   * @param {string} userId - The ID of the user.
   * @param {string} featureName - The name of the feature (e.g., "CAN_GENERATE_UI_BLOCK_JS").
   * @returns {Promise<boolean>} True if the user has access, false otherwise.
   */
  userHasFeature(userId: string, featureName: string): Promise<boolean>;

  /**
   * Ensures that default subscription tiers (Free, Basic, Premium) exist in the database.
   * This method should be called on application startup.
   * @returns {Promise<void>}
   */
  ensureDefaultTiersExist(): Promise<void>;

  /**
   * Retrieves all available subscription tiers.
   * @returns {Promise<ISubscriptionTier[]>} An array of all subscription tiers.
   */
  getAllTiers(): Promise<ISubscriptionTier[]>;

  /**
   * Initiates a subscription checkout process by generating a Lemon Squeezy checkout URL.
   * @param userId Our internal user ID.
   * @param tierId The ID of the subscription tier (e.g., 'BASIC', 'PREMIUM').
   * @param userEmail The email of the user for pre-filling checkout.
   * @param successUrl The URL to redirect to upon successful checkout.
   * @param cancelUrl The URL to redirect to if the user cancels checkout.
   * @returns A promise that resolves with the Lemon Squeezy checkout URL.
   */
  createSubscriptionCheckoutUrl(
    userId: string,
    tierId: string,
    userEmail: string,
    successUrl: string,
    cancelUrl: string
  ): Promise<string>;

  /**
   * Processes a webhook event received from Lemon Squeezy,
   * updating the user's subscription status in our database accordingly.
   * @param event The parsed Lemon Squeezy webhook event.
   * @returns {Promise<void>}
   * @throws {Error} If the event processing fails.
   */
  processWebhookEvent(event: LemonSqueezyWebhookEvent): Promise<void>;
}

/**
 * @class SubscriptionService
 * Manages subscription tiers and user entitlements, interacting with the database via Prisma
 * and with Lemon Squeezy for payment processing.
 */
export class SubscriptionService implements ISubscriptionService {
  private prisma: PrismaClient;
  private authService: IAuthService; // Used for fetching user data in userHasFeature
  private lemonSqueezyService: ILemonSqueezyService; // New dependency

  /**
   * Creates an instance of SubscriptionService.
   * @param prisma The Prisma client instance.
   * @param authService The authentication service, used to get user's current tier for permission checks.
   * @param lemonSqueezyService The LemonSqueezyService instance for payment gateway interactions.
   */
  constructor(prisma: PrismaClient, authService: IAuthService, lemonSqueezyService: ILemonSqueezyService) {
    this.prisma = prisma;
    this.authService = authService;
    this.lemonSqueezyService = lemonSqueezyService;
  }

  /**
   * Retrieves a subscription tier by its ID.
   * @param {string} tierId - The ID of the tier.
   * @returns {Promise<ISubscriptionTier | null>} The subscription tier, or null if not found.
   */
  public async getTierById(tierId: string): Promise<ISubscriptionTier | null> {
    try {
      const tier = await this.prisma.subscriptionTier.findUnique({
        where: { id: tierId },
      });
      return tier ? SubscriptionTier.fromPrisma(tier) : null;
    } catch (error) {
      console.error(`Error retrieving tier by ID ${tierId}:`, error);
      // Re-throw or handle more gracefully based on application error policy
      throw new Error(`Failed to retrieve subscription tier.`);
    }
  }

  /**
   * Retrieves a subscription tier by its name.
   * @param {string} name - The name of the tier.
   * @returns {Promise<ISubscriptionTier | null>} The subscription tier, or null if not found.
   */
  public async getTierByName(name: string): Promise<ISubscriptionTier | null> {
    try {
      const tier = await this.prisma.subscriptionTier.findUnique({
        where: { name: name },
      });
      return tier ? SubscriptionTier.fromPrisma(tier) : null;
    } catch (error) {
      console.error(`Error retrieving tier by name ${name}:`, error);
      throw new Error(`Failed to retrieve subscription tier.`);
    }
  }

  /**
   * Retrieves a subscription tier by its level.
   * @param {number} level - The level of the tier.
   * @returns {Promise<ISubscriptionTier | null>} The subscription tier, or null if not found.
   */
  public async getTierByLevel(level: number): Promise<ISubscriptionTier | null> {
    try {
      const tier = await this.prisma.subscriptionTier.findUnique({
        where: { level: level },
      });
      return tier ? SubscriptionTier.fromPrisma(tier) : null;
    } catch (error) {
      console.error(`Error retrieving tier by level ${level}:`, error);
      throw new Error(`Failed to retrieve subscription tier.`);
    }
  }

  /**
   * Retrieves all available subscription tiers.
   * @returns {Promise<ISubscriptionTier[]>} An array of all subscription tiers, sorted by level.
   */
  public async getAllTiers(): Promise<ISubscriptionTier[]> {
    try {
      const tiers = await this.prisma.subscriptionTier.findMany({
        orderBy: { level: 'asc' },
      });
      return tiers.map(t => SubscriptionTier.fromPrisma(t));
    } catch (error) {
      console.error("Error retrieving all tiers:", error);
      throw new Error(`Failed to retrieve all subscription tiers.`);
    }
  }

  /**
   * Checks if a user has access to a specific feature based on their subscription tier.
   * This method uses the AuthService to get the user's current tier.
   * @param {string} userId - The ID of the user.
   * @param {string} featureName - The name of the feature (e.g., "CAN_GENERATE_UI_BLOCK_JS").
   * @returns {Promise<boolean>} True if the user has access, false otherwise.
   */
  public async userHasFeature(userId: string, featureName: string): Promise<boolean> {
    const userTier = await this.authService.getUserSubscriptionTier(userId);

    // If no tier is assigned (e.g., user not found or tier mapping issue), they don't have access
    if (!userTier) {
      console.warn(`User ${userId} or their subscription tier not found. Denying feature access for "${featureName}".`);
      return false;
    }

    return userTier.features.includes(featureName);
  }

  /**
   * Ensures that default subscription tiers exist in the database.
   * This is crucial for initial setup and idempotent for subsequent runs.
   * It creates or updates 'Free', 'Basic', and 'Premium' tiers.
   */
  public async ensureDefaultTiersExist(): Promise<void> {
    const defaultTiers = [
      {
        name: 'Free',
        description: 'Limited access for testing and basic interaction.',
        level: 0,
        maxGmiInstances: 1,
        maxApiKeys: 0, // Free tier might not allow user-provided keys
        maxConversationHistoryTurns: 10,
        maxContextWindowTokens: 2048,
        dailyCostLimitUsd: 0.0,
        isPublic: true, // This tier might be accessible to unauthenticated users
        features: [],
      },
      {
        name: 'Basic',
        description: 'Enhanced access for regular use.',
        level: 1,
        maxGmiInstances: 3,
        maxApiKeys: 1,
        maxConversationHistoryTurns: 50,
        maxContextWindowTokens: 8192,
        dailyCostLimitUsd: 5.0,
        isPublic: false,
        features: ["BASIC_TOOL_ACCESS"], // Example: can use certain tools
      },
      {
        name: 'Premium',
        description: 'Full access with advanced capabilities.',
        level: 2,
        maxGmiInstances: 10,
        maxApiKeys: 5,
        maxConversationHistoryTurns: 200,
        maxContextWindowTokens: 32768,
        dailyCostLimitUsd: 20.0,
        isPublic: false,
        features: ["CAN_GENERATE_UI_BLOCK_JS", "ADVANCED_TOOL_ACCESS", "PERSISTENT_LEARNING", "IMAGE_GENERATION_ACCESS"], // Example advanced features
      },
    ];

    for (const tierData of defaultTiers) {
      try {
        await this.prisma.subscriptionTier.upsert({
          where: { name: tierData.name },
          update: {
            description: tierData.description,
            level: tierData.level,
            maxGmiInstances: tierData.maxGmiInstances,
            maxApiKeys: tierData.maxApiKeys,
            maxConversationHistoryTurns: tierData.maxConversationHistoryTurns,
            maxContextWindowTokens: tierData.maxContextWindowTokens,
            dailyCostLimitUsd: tierData.dailyCostLimitUsd,
            isPublic: tierData.isPublic,
            features: tierData.features,
          },
          create: {
            id: uuidv4(), // Generate UUID for new tiers
            name: tierData.name,
            description: tierData.description,
            level: tierData.level,
            maxGmiInstances: tierData.maxGmiInstances,
            maxApiKeys: tierData.maxApiKeys,
            maxConversationHistoryTurns: tierData.maxConversationHistoryTurns,
            maxContextWindowTokens: tierData.maxContextWindowTokens,
            dailyCostLimitUsd: tierData.dailyCostLimitUsd,
            isPublic: tierData.isPublic,
            features: tierData.features,
          },
        });
      } catch (error) {
        console.error(`Error upserting subscription tier ${tierData.name}:`, error);
        throw new Error(`Failed to ensure default tier ${tierData.name} exists.`);
      }
    }
    console.log("Subscription tiers ensured to exist in DB.");
  }

  /**
   * Initiates a subscription checkout process by generating a Lemon Squeezy checkout URL.
   * This method retrieves the Lemon Squeezy variant ID from the internal products map.
   * @param userId Our internal user ID.
   * @param tierId The ID of the subscription tier (e.g., 'BASIC', 'PREMIUM').
   * @param userEmail The email of the user for pre-filling checkout.
   * @param successUrl The URL to redirect to upon successful checkout.
   * @param cancelUrl The URL to redirect to if the user cancels checkout.
   * @returns A promise that resolves with the Lemon Squeezy checkout URL.
   * @throws {Error} If the tierId is not found or not mapped to a Lemon Squeezy variant.
   */
  public async createSubscriptionCheckoutUrl(
    userId: string,
    tierId: string,
    userEmail: string,
    successUrl: string,
    cancelUrl: string
  ): Promise<string> {
    const tier = await this.getTierById(tierId);
    if (!tier) {
      throw new Error(`Subscription tier with ID '${tierId}' not found.`);
    }

    // Assuming LemonSqueezyService has a productsMap loaded from config
    const lsVariantId = (this.lemonSqueezyService as any).productsMap[tier.name.toUpperCase()]; // Accessing private property for now, refine later
    if (!lsVariantId) {
      throw new Error(`Lemon Squeezy variant not configured for tier: ${tier.name}`);
    }

    try {
      return await this.lemonSqueezyService.createCheckoutUrl(
        userId,
        lsVariantId,
        userEmail,
        successUrl,
        cancelUrl
      );
    } catch (error) {
      console.error(`Failed to create Lemon Squeezy checkout URL for user ${userId}, tier ${tierId}:`, error);
      throw new Error(`Failed to initiate subscription checkout: ${(error as Error).message}`);
    }
  }

  /**
   * Processes a webhook event received from Lemon Squeezy,
   * updating the user's subscription status in our database accordingly.
   * @param event The parsed Lemon Squeezy webhook event.
   * @returns {Promise<void>}
   * @throws {Error} If the event type is unhandled or processing fails.
   */
  public async processWebhookEvent(event: LemonSqueezyWebhookEvent): Promise<void> {
    const eventName = event.meta.event_name;
    const lsSubscription = event.data.attributes as LemonSqueezySubscription; // Directly cast attributes for simplicity, assuming correct structure

    // Extract our internal user_id from custom_data, if available
    const userId = event.meta.custom_data?.user_id;

    if (!userId) {
      console.warn(`Lemon Squeezy webhook event ${eventName} received without internal user_id in custom_data. Cannot update user's subscription.`);
      // Depending on requirements, we might attempt to look up by email or external customer ID here
      return;
    }

    try {
      switch (eventName) {
        case 'subscription_created':
          await this._handleSubscriptionCreated(userId, lsSubscription);
          break;
        case 'subscription_updated':
          await this._handleSubscriptionUpdated(userId, lsSubscription);
          break;
        case 'subscription_cancelled':
          await this._handleSubscriptionCancelled(userId, lsSubscription);
          break;
        case 'subscription_paused':
        case 'subscription_resumed':
        case 'subscription_expired':
        case 'subscription_unpaid':
          // Implement specific logic for these states as needed
          console.log(`Lemon Squeezy event '${eventName}' received for user ${userId}. Status: ${lsSubscription.status}`);
          await this._updateUserSubscriptionStatus(userId, lsSubscription); // Generic update for status changes
          break;
        default:
          console.log(`Unhandled Lemon Squeezy webhook event type: ${eventName}. Skipping.`);
      }
    } catch (error) {
      console.error(`Error processing Lemon Squeezy webhook event '${eventName}' for user ${userId}:`, error);
      throw new Error(`Failed to process Lemon Squeezy webhook event: ${(error as Error).message}`);
    }
  }

  /**
   * Handles a 'subscription_created' webhook event.
   * Updates the user's subscription tier and stores Lemon Squeezy subscription ID.
   * @param userId Our internal user ID.
   * @param lsSubscription The Lemon Squeezy subscription details.
   * @private
   */
  private async _handleSubscriptionCreated(userId: string, lsSubscription: LemonSqueezySubscription): Promise<void> {
    console.log(`Processing subscription_created event for user ${userId}. LS Sub ID: ${lsSubscription.id}`);

    const newTier = await this.prisma.subscriptionTier.findFirst({
      where: {
        // Find tier by matching product_id or variant_id if we have a map
        // For simplicity, let's assume variant_id maps directly to our tier name for now, or match via a loaded productsMap
        // If we want to map variantId to tier.name, we'd need a reverse map or more complex lookup.
        // For direct mapping to tier.name:
        // name: lsSubscription.product_id === some_ls_product_id_for_basic ? 'Basic' : 'Premium'
        // A more robust approach involves iterating our internal tiers and checking if their mapped LS ID matches lsSubscription.variant_id
      }
    });

    // A more robust way to map LS Variant ID to our internal Tier ID/Name
    let targetTier: ISubscriptionTier | null = null;
    const allTiers = await this.getAllTiers();
    for (const tier of allTiers) {
        // Assuming productsMap in LemonSqueezyService maps our Tier Name to LS Variant ID
        const lsVariantIdForTier = (this.lemonSqueezyService as any).productsMap[tier.name.toUpperCase()];
        if (lsVariantIdForTier === lsSubscription.variant_id) {
            targetTier = tier;
            break;
        }
    }

    if (!targetTier) {
        console.error(`Subscription created for unknown Lemon Squeezy variant ID: ${lsSubscription.variant_id}. Cannot update user ${userId} tier.`);
        // Potentially alert admin or log for manual review
        return;
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        subscriptionTierId: targetTier.id,
        lemonSqueezySubscriptionId: lsSubscription.id, // Store LS Subscription ID
        lemonSqueezyCustomerId: lsSubscription.customer_id, // Store LS Customer ID
        // Potentially store subscription status and end dates as well
        subscriptionStatus: lsSubscription.status,
        subscriptionRenewsAt: lsSubscription.renews_at ? new Date(lsSubscription.renews_at) : null,
        subscriptionEndsAt: lsSubscription.ends_at ? new Date(lsSubscription.ends_at) : null,
        updatedAt: new Date(),
      },
    });
    console.log(`User ${userId} successfully subscribed to tier '${targetTier.name}'.`);
  }

  /**
   * Handles a 'subscription_updated' webhook event.
   * Updates the user's subscription status and details.
   * @param userId Our internal user ID.
   * @param lsSubscription The updated Lemon Squeezy subscription details.
   * @private
   */
  private async _handleSubscriptionUpdated(userId: string, lsSubscription: LemonSqueezySubscription): Promise<void> {
    console.log(`Processing subscription_updated event for user ${userId}. LS Sub ID: ${lsSubscription.id}. New Status: ${lsSubscription.status}`);

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
        console.error(`User ${userId} not found for subscription update webhook.`);
        return;
    }

    // Determine if tier change occurred (e.g., upgrade/downgrade)
    let newSubscriptionTierId = user.subscriptionTierId;
    // We would need to match lsSubscription.variant_id to a new tier in our database
    const allTiers = await this.getAllTiers();
    for (const tier of allTiers) {
        const lsVariantIdForTier = (this.lemonSqueezyService as any).productsMap[tier.name.toUpperCase()];
        if (lsVariantIdForTier === lsSubscription.variant_id) {
            newSubscriptionTierId = tier.id;
            break;
        }
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        subscriptionTierId: newSubscriptionTierId, // Update tier if changed
        subscriptionStatus: lsSubscription.status,
        subscriptionRenewsAt: lsSubscription.renews_at ? new Date(lsSubscription.renews_at) : null,
        subscriptionEndsAt: lsSubscription.ends_at ? new Date(lsSubscription.ends_at) : null,
        updatedAt: new Date(),
      },
    });
    console.log(`User ${userId}'s subscription (LS ID: ${lsSubscription.id}) updated to status: ${lsSubscription.status}`);
  }

  /**
   * Handles a 'subscription_cancelled' webhook event.
   * Sets the user's subscription status to 'cancelled' and potentially downgrades them to 'Free' tier.
   * @param userId Our internal user ID.
   * @param lsSubscription The Lemon Squeezy subscription details at cancellation.
   * @private
   */
  private async _handleSubscriptionCancelled(userId: string, lsSubscription: LemonSqueezySubscription): Promise<void> {
    console.log(`Processing subscription_cancelled event for user ${userId}. LS Sub ID: ${lsSubscription.id}`);

    const freeTier = await this.getTierByName('Free');
    if (!freeTier) {
      console.error('Default "Free" subscription tier not found. Cannot downgrade user after cancellation.');
      return;
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        subscriptionStatus: 'cancelled', // Mark as cancelled
        subscriptionTierId: freeTier.id, // Downgrade to Free tier
        subscriptionRenewsAt: null, // No longer renews
        subscriptionEndsAt: lsSubscription.ends_at ? new Date(lsSubscription.ends_at) : new Date(), // Set end date
        updatedAt: new Date(),
      },
    });
    console.log(`User ${userId}'s subscription (LS ID: ${lsSubscription.id}) cancelled and downgraded to 'Free' tier.`);
  }

  /**
   * Generic helper to update user's subscription status.
   * @param userId Our internal user ID.
   * @param lsSubscription The Lemon Squeezy subscription details.
   * @private
   */
  private async _updateUserSubscriptionStatus(userId: string, lsSubscription: LemonSqueezySubscription): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        subscriptionStatus: lsSubscription.status,
        subscriptionRenewsAt: lsSubscription.renews_at ? new Date(lsSubscription.renews_at) : null,
        subscriptionEndsAt: lsSubscription.ends_at ? new Date(lsSubscription.ends_at) : null,
        updatedAt: new Date(),
      },
    });
    console.log(`User ${userId}'s subscription (LS ID: ${lsSubscription.id}) status updated to: ${lsSubscription.status}`);
  }

  /**
   * Static helper to convert a Prisma SubscriptionTier object to our ISubscriptionTier type.
   * @param prismaTier The Prisma SubscriptionTier object.
   * @returns The ISubscriptionTier instance.
   */
  static fromPrismaTier(prismaTier: PrismaSubscriptionTier): ISubscriptionTier {
    return new SubscriptionTier(prismaTier); // Use the class constructor to map
  }
}