// File: backend/services/payment/LemonSqueezyService.ts

import { 
  lemonSqueezySetup,
  createCheckout,
  getCustomer,
  getSubscription,
  updateSubscription,
  cancelSubscription,
  listSubscriptions,
  Checkout,
  Customer,
  Subscription,
  NewCheckout,
} from '@lemonsqueezy/lemonsqueezy.js';
import { PrismaClient } from '@prisma/client';

/**
 * LemonSqueezy Payment Service Integration
 * Handles subscription management, webhooks, and billing operations
 */
export class LemonSqueezyService {
  private prisma: PrismaClient;
  private storeId: string;
  private isTestMode: boolean;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
    this.storeId = process.env.LEMONSQUEEZY_STORE_ID || '';
    this.isTestMode = process.env.LEMONSQUEEZY_TEST_MODE === 'true';

    // Initialize LemonSqueezy SDK
    lemonSqueezySetup({
      apiKey: process.env.LEMONSQUEEZY_API_KEY || '',
      onError: (error) => {
        console.error('LemonSqueezy API Error:', error);
      },
    });

    if (!process.env.LEMONSQUEEZY_API_KEY) {
      console.warn('⚠️ LemonSqueezy API key not configured. Payment features will be limited.');
    }
  }

  /**
   * Create a checkout session for subscription
   */
  async createCheckoutSession(userId: string, variantId: string, customData?: Record<string, any>): Promise<string> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new Error('User not found');
      }

      const checkoutData: NewCheckout = {
        type: 'checkouts',
        attributes: {
          checkout_data: {
            email: user.email,
            name: user.username,
            custom: {
              user_id: userId,
              ...customData,
            },
          },
          product_options: {
            enabled_variants: [variantId],
            redirect_url: `${process.env.FRONTEND_URL}/subscription/success`,
            receipt_button_text: 'Go to Dashboard',
            receipt_thank_you_note: 'Thank you for subscribing to Voice Chat Assistant!',
          },
          checkout_options: {
            embed: false,
            media: true,
            logo: true,
          },
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
        },
        relationships: {
          store: {
            data: {
              type: 'stores',
              id: this.storeId,
            },
          },
          variant: {
            data: {
              type: 'variants',
              id: variantId,
            },
          },
        },
      };

      const checkout = await createCheckout(checkoutData);
      
      if (!checkout.data?.attributes?.url) {
        throw new Error('Failed to create checkout session');
      }

      return checkout.data.attributes.url;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      throw new Error('Failed to create checkout session');
    }
  }

  /**
   * Handle successful subscription creation from webhook
   */
  async handleSubscriptionCreated(subscriptionData: any): Promise<void> {
    try {
      const { customer_id, product_id, variant_id, user_id } = subscriptionData;
      
      // Find the subscription tier based on variant ID
      const tier = await this.prisma.subscriptionTier.findFirst({
        where: { lemonSqueezyVariantId: variant_id.toString() },
      });

      if (!tier) {
        console.error(`No subscription tier found for variant ID: ${variant_id}`);
        return;
      }

      // Update user subscription
      await this.prisma.user.update({
        where: { id: user_id },
        data: {
          subscriptionTierId: tier.id,
          lemonSqueezyCustomerId: customer_id.toString(),
          lemonSqueezySubscriptionId: subscriptionData.id.toString(),
          subscriptionStatus: 'active',
          subscriptionEndsAt: new Date(subscriptionData.ends_at),
        },
      });

      console.log(`✅ Subscription created for user ${user_id}, tier: ${tier.name}`);
    } catch (error) {
      console.error('Error handling subscription created:', error);
    }
  }

  /**
   * Handle subscription updates from webhook
   */
  async handleSubscriptionUpdated(subscriptionData: any): Promise<void> {
    try {
      const user = await this.prisma.user.findFirst({
        where: { lemonSqueezySubscriptionId: subscriptionData.id.toString() },
      });

      if (!user) {
        console.error(`No user found for subscription ID: ${subscriptionData.id}`);
        return;
      }

      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          subscriptionStatus: subscriptionData.status,
          subscriptionEndsAt: new Date(subscriptionData.ends_at),
        },
      });

      console.log(`✅ Subscription updated for user ${user.id}, status: ${subscriptionData.status}`);
    } catch (error) {
      console.error('Error handling subscription updated:', error);
    }
  }

  /**
   * Handle subscription cancellation from webhook
   */
  async handleSubscriptionCancelled(subscriptionData: any): Promise<void> {
    try {
      const user = await this.prisma.user.findFirst({
        where: { lemonSqueezySubscriptionId: subscriptionData.id.toString() },
      });

      if (!user) {
        console.error(`No user found for subscription ID: ${subscriptionData.id}`);
        return;
      }

      // Downgrade to free tier
      const freeTier = await this.prisma.subscriptionTier.findFirst({
        where: { level: 0 }, // Free tier
      });

      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          subscriptionTierId: freeTier?.id || null,
          subscriptionStatus: 'cancelled',
          subscriptionEndsAt: new Date(subscriptionData.ends_at),
        },
      });

      console.log(`✅ Subscription cancelled for user ${user.id}`);
    } catch (error) {
      console.error('Error handling subscription cancelled:', error);
    }
  }

  /**
   * Get customer subscription details
   */
  async getCustomerSubscription(userId: string): Promise<any> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        include: { subscriptionTier: true },
      });

      if (!user || !user.lemonSqueezySubscriptionId) {
        return null;
      }

      const subscription = await getSubscription(user.lemonSqueezySubscriptionId);
      return subscription.data;
    } catch (error) {
      console.error('Error getting customer subscription:', error);
      return null;
    }
  }

  /**
   * Cancel subscription
   */
  async cancelUserSubscription(userId: string): Promise<boolean> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user || !user.lemonSqueezySubscriptionId) {
        throw new Error('No active subscription found');
      }

      await cancelSubscription(user.lemonSqueezySubscriptionId);
      
      // Update local status (webhook will handle the rest)
      await this.prisma.user.update({
        where: { id: userId },
        data: { subscriptionStatus: 'cancelled' },
      });

      return true;
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      return false;
    }
  }

  /**
   * Get customer portal URL (for managing billing)
   */
  async getCustomerPortalUrl(userId: string): Promise<string | null> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user || !user.lemonSqueezyCustomerId) {
        return null;
      }

      const customer = await getCustomer(user.lemonSqueezyCustomerId);
      return customer.data?.attributes?.urls?.customer_portal || null;
    } catch (error) {
      console.error('Error getting customer portal URL:', error);
      return null;
    }
  }

  /**
   * Verify webhook signature
   */
  verifyWebhookSignature(payload: string, signature: string): boolean {
    const crypto = require('crypto');
    const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
    
    if (!secret) {
      console.warn('LemonSqueezy webhook secret not configured');
      return false;
    }

    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');

    return signature === expectedSignature;
  }

  /**
   * Process webhook event
   */
  async processWebhookEvent(eventType: string, data: any): Promise<void> {
    console.log(`Processing LemonSqueezy webhook: ${eventType}`);

    switch (eventType) {
      case 'subscription_created':
        await this.handleSubscriptionCreated(data);
        break;
      case 'subscription_updated':
        await this.handleSubscriptionUpdated(data);
        break;
      case 'subscription_cancelled':
        await this.handleSubscriptionCancelled(data);
        break;
      default:
        console.log(`Unhandled webhook event: ${eventType}`);
    }
  }
}