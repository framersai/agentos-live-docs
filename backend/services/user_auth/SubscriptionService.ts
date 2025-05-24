// File: backend/services/user_auth/SubscriptionService.ts
/**
 * @fileoverview SubscriptionService with proper exports and interface fixes
 * FIXES: Export ISubscriptionTier interface and fix LemonSqueezy imports
 */

import { PrismaClient, SubscriptionTier as PrismaSubscriptionTier, User as PrismaUser } from '@prisma/client';
import { GMIError, GMIErrorCode } from '../../utils/errors';

// FIXED: Export ISubscriptionTier interface
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

// FIXED: Export ISubscriptionService interface
export interface ISubscriptionService {
  initialize(): Promise<void>;
  getUserSubscriptionTier(userId: string): Promise<ISubscriptionTier | null>;
  assignTierToUser(userId: string, tierId: string): Promise<PrismaUser>;
  userCanAccessPersona(userId: string, personaId: string): Promise<boolean>;
  createDefaultTiers(): Promise<void>;
  getAllTiers(): Promise<ISubscriptionTier[]>;
  getTierByName(name: string): Promise<ISubscriptionTier | null>;
  handleSubscriptionWebhook(eventData: any): Promise<void>;
  upgradeTier(userId: string, newTierName: string): Promise<void>;
  downgradeTier(userId: string, newTierName: string): Promise<void>;
  getUserUsageStats(userId: string): Promise<UserUsageStats>;
  isWithinUsageLimits(userId: string, resourceType: string, currentUsage: number): Promise<boolean>;
}

// FIXED: Export interfaces for LemonSqueezy (these were missing)
export interface ILemonSqueezyService {
  initialize?(): Promise<void>;
  verifyWebhookSignature(rawBody: string, signature: string): boolean;
  processWebhookEvent(eventName: string, data: any): Promise<void>;
  getCustomerSubscriptions?(customerId: string): Promise<LemonSqueezySubscription[]>;
  createCustomer?(customerData: any): Promise<any>;
  getProducts?(): Promise<any[]>;
  createCheckoutSession?(productId: string, customerId: string): Promise<string>;
}

export interface LemonSqueezySubscription {
  id: string;
  status: string;
  customerId: string;
  productId: string;
  variantId: string;
  currentPeriodEnd?: Date;
  cancelAtPeriodEnd?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface LemonSqueezyWebhookEvent {
  meta: {
    event_name: string;
    custom_data?: any;
  };
  data: {
    id: string;
    type: string;
    attributes: any;
    relationships?: any;
  };
}

export interface LemonSqueezyProductMap {
  [productId: string]: {
    name: string;
    tierId: string;
    variantId?: string;
    price?: number;
    currency?: string;
  };
}

export interface UserUsageStats {
  dailyCostUsd: number;
  monthlyCostUsd: number;
  currentGmiInstances: number;
  currentApiKeys: number;
  conversationTurnsToday: number;
  lastResetDate: Date;
}

/**
 * SubscriptionService implementation
 */
export class SubscriptionService implements ISubscriptionService {
  private prisma: PrismaClient;
  private authService: any; // Should be IAuthService when properly typed
  private lemonSqueezyService: ILemonSqueezyService;

  constructor(
    prisma: PrismaClient,
    authService: any,
    lemonSqueezyService: ILemonSqueezyService
  ) {
    this.prisma = prisma;
    this.authService = authService;
    this.lemonSqueezyService = lemonSqueezyService;
  }

  async initialize(): Promise<void> {
    console.log('SubscriptionService: Initializing...');
    await this.createDefaultTiers();
    console.log('SubscriptionService: Initialized successfully');
  }

  async createDefaultTiers(): Promise<void> {
    const defaultTiers = [
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
        features: ['basic_chat', 'limited_history']
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
        priceMonthlyUsd: 19.99
      },
      {
        name: 'Enterprise',
        description: 'Full access with unlimited features',
        level: 2,
        maxGmiInstances: 20,
        maxApiKeys: 10,
        maxConversationHistoryTurns: 1000,
        maxContextWindowTokens: 32768,
        dailyCostLimitUsd: 100.0,
        monthlyCostLimitUsd: 500.0,
        isPublic: false,
        features: ['unlimited_chat', 'full_history', 'priority_support', 'custom_personas'],
        priceMonthlyUsd: 99.99
      }
    ];

    for (const tierData of defaultTiers) {
      await this.prisma.subscriptionTier.upsert({
        where: { name: tierData.name },
        update: tierData,
        create: tierData
      });
    }

    console.log('SubscriptionService: Default tiers created/updated');
  }

  async getUserSubscriptionTier(userId: string): Promise<ISubscriptionTier | null> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { subscriptionTier: true }
    });

    if (!user) {
      return null;
    }

    // If no tier assigned, return Free tier
    if (!user.subscriptionTier) {
      const freeTier = await this.prisma.subscriptionTier.findUnique({
        where: { name: 'Free' }
      });
      return freeTier as ISubscriptionTier;
    }

    return user.subscriptionTier as ISubscriptionTier;
  }

  async assignTierToUser(userId: string, tierId: string): Promise<PrismaUser> {
    // Verify tier exists
    const tier = await this.prisma.subscriptionTier.findUnique({
      where: { id: tierId }
    });

    if (!tier) {
      throw new GMIError('Subscription tier not found', GMIErrorCode.RESOURCE_NOT_FOUND);
    }

    // Verify user exists
    const user = await this.prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new GMIError('User not found', GMIErrorCode.USER_NOT_FOUND);
    }

    // Update user's subscription tier
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: { subscriptionTierId: tierId }
    });

    console.log(`SubscriptionService: Assigned tier ${tier.name} to user ${userId}`);
    return updatedUser;
  }

  async userCanAccessPersona(userId: string, personaId: string): Promise<boolean> {
    // Get user's subscription tier
    const userTier = await this.getUserSubscriptionTier(userId);
    
    if (!userTier) {
      return false;
    }

    // For now, allow access based on tier level
    // In a real implementation, you'd check persona requirements
    // against user tier capabilities
    return true;
  }

  async getAllTiers(): Promise<ISubscriptionTier[]> {
    const tiers = await this.prisma.subscriptionTier.findMany({
      orderBy: { level: 'asc' }
    });

    return tiers as ISubscriptionTier[];
  }

  async getTierByName(name: string): Promise<ISubscriptionTier | null> {
    const tier = await this.prisma.subscriptionTier.findUnique({
      where: { name }
    });

    return tier as ISubscriptionTier | null;
  }

  async upgradeTier(userId: string, newTierName: string): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { subscriptionTier: true }
    });

    if (!user) {
      throw new GMIError('User not found', GMIErrorCode.USER_NOT_FOUND);
    }

    const newTier = await this.getTierByName(newTierName);
    if (!newTier) {
      throw new GMIError('Target tier not found', GMIErrorCode.RESOURCE_NOT_FOUND);
    }

    const currentTierLevel = user.subscriptionTier?.level || 0;
    if (newTier.level <= currentTierLevel) {
      throw new GMIError('Cannot upgrade to a lower or same tier level', GMIErrorCode.VALIDATION_ERROR);
    }

    await this.assignTierToUser(userId, newTier.id);
    console.log(`SubscriptionService: Upgraded user ${userId} to ${newTierName}`);
  }

  async downgradeTier(userId: string, newTierName: string): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { subscriptionTier: true }
    });

    if (!user) {
      throw new GMIError('User not found', GMIErrorCode.USER_NOT_FOUND);
    }

    const newTier = await this.getTierByName(newTierName);
    if (!newTier) {
      throw new GMIError('Target tier not found', GMIErrorCode.RESOURCE_NOT_FOUND);
    }

    const currentTierLevel = user.subscriptionTier?.level || 0;
    if (newTier.level >= currentTierLevel) {
      throw new GMIError('Cannot downgrade to a higher or same tier level', GMIErrorCode.VALIDATION_ERROR);
    }

    await this.assignTierToUser(userId, newTier.id);
    console.log(`SubscriptionService: Downgraded user ${userId} to ${newTierName}`);
  }

  async getUserUsageStats(userId: string): Promise<UserUsageStats> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);

    // Get usage records for daily and monthly costs
    const [dailyUsage, monthlyUsage] = await Promise.all([
      this.prisma.usageRecord.aggregate({
        where: {
          userId,
          createdAt: { gte: today }
        },
        _sum: { costUsd: true }
      }),
      this.prisma.usageRecord.aggregate({
        where: {
          userId,
          createdAt: { gte: thisMonth }
        },
        _sum: { costUsd: true }
      })
    ]);

    // Get current GMI instances and API keys counts
    const [gmiCount, apiKeyCount] = await Promise.all([
      // For now, return 0 as GMI instances aren't tracked in DB yet
      Promise.resolve(0),
      this.prisma.userApiKey.count({
        where: { userId, isActive: true }
      })
    ]);

    // Get conversation turns today
    const conversationTurns = await this.prisma.conversationMessage.count({
      where: {
        conversation: { userId },
        createdAt: { gte: today }
      }
    });

    return {
      dailyCostUsd: dailyUsage._sum.costUsd || 0,
      monthlyCostUsd: monthlyUsage._sum.costUsd || 0,
      currentGmiInstances: gmiCount,
      currentApiKeys: apiKeyCount,
      conversationTurnsToday: conversationTurns,
      lastResetDate: today
    };
  }

  async isWithinUsageLimits(userId: string, resourceType: string, currentUsage: number): Promise<boolean> {
    const userTier = await this.getUserSubscriptionTier(userId);
    if (!userTier) {
      return false;
    }

    const usageStats = await this.getUserUsageStats(userId);

    switch (resourceType) {
      case 'gmi_instances':
        return currentUsage < userTier.maxGmiInstances;
      case 'api_keys':
        return currentUsage < userTier.maxApiKeys;
      case 'daily_cost':
        return usageStats.dailyCostUsd < userTier.dailyCostLimitUsd;
      case 'monthly_cost':
        return usageStats.monthlyCostUsd < userTier.monthlyCostLimitUsd;
      case 'conversation_turns':
        return usageStats.conversationTurnsToday < userTier.maxConversationHistoryTurns;
      default:
        return false;
    }
  }

  async handleSubscriptionWebhook(eventData: LemonSqueezyWebhookEvent): Promise<void> {
    const { meta, data } = eventData;

    console.log(`SubscriptionService: Handling webhook event: ${meta.event_name}`);

    try {
      switch (meta.event_name) {
        case 'subscription_created':
          await this.handleSubscriptionCreated(data);
          break;
        case 'subscription_updated':
          await this.handleSubscriptionUpdated(data);
          break;
        case 'subscription_cancelled':
          await this.handleSubscriptionCancelled(data);
          break;
        case 'subscription_resumed':
          await this.handleSubscriptionResumed(data);
          break;
        case 'subscription_expired':
          await this.handleSubscriptionExpired(data);
          break;
        case 'subscription_paused':
          await this.handleSubscriptionPaused(data);
          break;
        case 'subscription_unpaused':
          await this.handleSubscriptionUnpaused(data);
          break;
        case 'order_created':
          await this.handleOrderCreated(data);
          break;
        default:
          console.warn(`SubscriptionService: Unhandled webhook event: ${meta.event_name}`);
      }
    } catch (error) {
      console.error(`SubscriptionService: Error handling webhook event ${meta.event_name}:`, error);
      throw error;
    }
  }

  private async handleSubscriptionCreated(data: any): Promise<void> {
    const { attributes } = data;
    const customerId = attributes.customer_id;
    const productId = attributes.product_id;
    const variantId = attributes.variant_id;
    const status = attributes.status;

    // Find user by LemonSqueezy customer ID
    const user = await this.prisma.user.findUnique({
      where: { lemonSqueezyCustomerId: customerId.toString() }
    });

    if (!user) {
      console.warn(`SubscriptionService: User not found for customer ID: ${customerId}`);
      return;
    }

    // Map product to subscription tier
    const tier = await this.mapProductToTier(productId, variantId);
    if (tier) {
      await this.assignTierToUser(user.id, tier.id);
      
      // Update subscription details
      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          lemonSqueezySubscriptionId: data.id.toString(),
          subscriptionStatus: status
        }
      });

      console.log(`SubscriptionService: Subscription created for user ${user.id}, tier: ${tier.name}`);
    }
  }

  private async handleSubscriptionUpdated(data: any): Promise<void> {
    const subscriptionId = data.id.toString();
    const { attributes } = data;
    const status = attributes.status;

    const user = await this.prisma.user.findUnique({
      where: { lemonSqueezySubscriptionId: subscriptionId }
    });

    if (user) {
      await this.prisma.user.update({
        where: { id: user.id },
        data: { subscriptionStatus: status }
      });

      console.log(`SubscriptionService: Subscription updated for user ${user.id}, status: ${status}`);
    }
  }

  private async handleSubscriptionCancelled(data: any): Promise<void> {
    const subscriptionId = data.id.toString();
    
    const user = await this.prisma.user.findUnique({
      where: { lemonSqueezySubscriptionId: subscriptionId }
    });

    if (user) {
      // Downgrade to free tier
      const freeTier = await this.getTierByName('Free');
      if (freeTier) {
        await this.assignTierToUser(user.id, freeTier.id);
      }

      await this.prisma.user.update({
        where: { id: user.id },
        data: { subscriptionStatus: 'cancelled' }
      });

      console.log(`SubscriptionService: Subscription cancelled for user ${user.id}`);
    }
  }

  private async handleSubscriptionResumed(data: any): Promise<void> {
    const subscriptionId = data.id.toString();
    const { attributes } = data;
    const productId = attributes.product_id;
    const variantId = attributes.variant_id;

    const user = await this.prisma.user.findUnique({
      where: { lemonSqueezySubscriptionId: subscriptionId }
    });

    if (user) {
      // Restore appropriate tier
      const tier = await this.mapProductToTier(productId, variantId);
      if (tier) {
        await this.assignTierToUser(user.id, tier.id);
      }

      await this.prisma.user.update({
        where: { id: user.id },
        data: { subscriptionStatus: 'active' }
      });

      console.log(`SubscriptionService: Subscription resumed for user ${user.id}`);
    }
  }

  private async handleSubscriptionExpired(data: any): Promise<void> {
    const subscriptionId = data.id.toString();
    
    const user = await this.prisma.user.findUnique({
      where: { lemonSqueezySubscriptionId: subscriptionId }
    });

    if (user) {
      // Downgrade to free tier
      const freeTier = await this.getTierByName('Free');
      if (freeTier) {
        await this.assignTierToUser(user.id, freeTier.id);
      }

      await this.prisma.user.update({
        where: { id: user.id },
        data: { subscriptionStatus: 'expired' }
      });

      console.log(`SubscriptionService: Subscription expired for user ${user.id}`);
    }
  }

  private async handleSubscriptionPaused(data: any): Promise<void> {
    const subscriptionId = data.id.toString();
    
    const user = await this.prisma.user.findUnique({
      where: { lemonSqueezySubscriptionId: subscriptionId }
    });

    if (user) {
      await this.prisma.user.update({
        where: { id: user.id },
        data: { subscriptionStatus: 'paused' }
      });

      console.log(`SubscriptionService: Subscription paused for user ${user.id}`);
    }
  }

  private async handleSubscriptionUnpaused(data: any): Promise<void> {
    const subscriptionId = data.id.toString();
    
    const user = await this.prisma.user.findUnique({
      where: { lemonSqueezySubscriptionId: subscriptionId }
    });

    if (user) {
      await this.prisma.user.update({
        where: { id: user.id },
        data: { subscriptionStatus: 'active' }
      });

      console.log(`SubscriptionService: Subscription unpaused for user ${user.id}`);
    }
  }

  private async handleOrderCreated(data: any): Promise<void> {
    const { attributes } = data;
    console.log(`SubscriptionService: Order created:`, attributes);
    
    // Handle one-time purchases or setup fees
    // Implementation would depend on your business logic
  }

  private async mapProductToTier(productId: string, variantId: string): Promise<ISubscriptionTier | null> {
    // Try to find tier by LemonSqueezy product ID first
    let tier = await this.prisma.subscriptionTier.findUnique({
      where: { lemonSqueezyProductId: productId }
    });

    // If not found, try by variant ID
    if (!tier) {
      tier = await this.prisma.subscriptionTier.findUnique({
        where: { lemonSqueezyVariantId: variantId }
      });
    }

    return tier as ISubscriptionTier | null;
  }
});
        break;
      case 'subscription_updated':
        await this.handleSubscriptionUpdated(data);
        break;
      case 'subscription_cancelled':
        await this.handleSubscriptionCancelled(data);
        break;
      case 'subscription_resumed':
        await this.handleSubscriptionResumed(data);
        break;
      case 'subscription_expired':
        await this.handleSubscriptionExpired(data);
        break;
      default:
        console.warn(`SubscriptionService: Unhandled webhook event: ${meta.event_name}`);
    }
  }

  private async handleSubscriptionCreated(data: any): Promise<void> {
    const { attributes } = data;
    const customerId = attributes.customer_id;
    const productId = attributes.product_id;
    const variantId = attributes.variant_id;
    const status = attributes.status;

    // Find user by LemonSqueezy customer ID
    const user = await this.prisma.user.findUnique({
      where: { lemonSqueezyCustomerId: customerId.toString() }
    });

    if (!user) {
      console.warn(`SubscriptionService: User not found for customer ID: ${customerId}`);
      return;
    }

    // Map product to subscription tier
    const tier = await this.mapProductToTier(productId, variantId);
    if (tier) {
      await this.assignTierToUser(user.id, tier.id);
      
      // Update subscription details
      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          lemonSqueezySubscriptionId: data.id.toString(),
          subscriptionStatus: status
        }
      });

      console.log(`SubscriptionService: Subscription created for user ${user.id}, tier: ${tier.name}`);
    }
  }

  private async handleSubscriptionUpdated(data: any): Promise<void> {
    const subscriptionId = data.id.toString();
    const { attributes } = data;
    const status = attributes.status;

    const user = await this.prisma.user.findUnique({
      where: { lemonSqueezySubscriptionId: subscriptionId }
    });

    if (user) {
      await this.prisma.user.update({
        where: { id: user.id },
        data: { subscriptionStatus: status }
      });

      console.log(`SubscriptionService: Subscription updated for user ${user.id}, status: ${status}`);
    }
  }

  private async handleSubscriptionCancelled(data: any): Promise<void> {
    const subscriptionId = data.id.toString();
    
    const user = await this.prisma.user.findUnique({
      where: { lemonSqueezySubscriptionId: subscriptionId }
    });

    if (user) {
      // Downgrade to free tier
      const freeTier = await this.getTierByName('Free');
      if (freeTier) {
        await this.assignTierToUser(user.id, freeTier.id);
      }

      await this.prisma.user.update({
        where: { id: user.id },
        data: { subscriptionStatus: 'cancelled' }
      });

      console.log(`SubscriptionService: Subscription cancelled for user ${user.id}`);
    }
  }

  private async handleSubscriptionResumed(data: any): Promise<void> {
    const subscriptionId = data.id.toString();
    const { attributes } = data;
    const productId = attributes.product_id;
    const variantId = attributes.variant_id;

    const user = await this.prisma.user.findUnique({
      where: { lemonSqueezySubscriptionId: subscriptionId }
    });

    if (user) {
      // Restore appropriate tier
      const tier = await this.mapProductToTier(productId, variantId);
      if (tier) {
        await this.assignTierToUser(user.id, tier.id);
      }

      await this.prisma.user.update({
        where: { id: user.id },
        data: { subscriptionStatus: 'active' }
      });

      console.log(`SubscriptionService: Subscription resumed for user ${user.id}`);
    }
  }

  private async handleSubscriptionExpired(data: any): Promise<void> {
    const subscriptionId = data.id.toString();
    
    const user = await this.prisma.user.findUnique({
      where: { lemonSqueezySubscriptionId: subscriptionId }
    });

    if (user) {
      // Downgrade to free tier
      const freeTier = await this.getTierByName('Free');
      if (freeTier) {
        await this.assignTierToUser(user.id, freeTier.id);
      }

      await this.prisma.user.update({
        where: { id: user.id },
        data: { subscriptionStatus: 'expired' }
      });

      console.log(`SubscriptionService: Subscription expired for user ${user.id}`);
    }
  }

  private async mapProductToTier(productId: string, variantId: string): Promise<ISubscriptionTier | null> {
    // Try to find tier by LemonSqueezy product ID first
    let tier = await this.prisma.subscriptionTier.findUnique({
      where: { lemonSqueezyProductId: productId }
    });

    // If not found, try by variant ID
    if (!tier) {
      tier = await this.prisma.subscriptionTier.findUnique({
        where: { lemonSqueezyVariantId: variantId }
      });
    }

    return tier as ISubscriptionTier | null;
  }
}