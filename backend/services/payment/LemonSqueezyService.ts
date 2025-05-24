// File: backend/services/payment/LemonSqueezyService.ts
/**
 * @fileoverview LemonSqueezy payment service with proper exports
 * FIXES: Export missing interfaces and configuration types
 */

import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

// FIXED: Export ILemonSqueezyService interface
export interface ILemonSqueezyService {
  initialize?(): Promise<void>;
  verifyWebhookSignature(rawBody: string, signature: string): boolean;
  processWebhookEvent(eventName: string, data: any): Promise<void>;
  getCustomerSubscriptions?(customerId: string): Promise<LemonSqueezySubscription[]>;
  createCustomer?(customerData: any): Promise<any>;
  getProducts?(): Promise<any[]>;
  createCheckoutSession?(productId: string, customerId: string): Promise<string>;
}

// FIXED: Export LemonSqueezyConfig interface
export interface LemonSqueezyConfig {
  apiKey: string;
  storeId: string;
  webhookSecret: string;
  baseUrl?: string;
  productMap?: LemonSqueezyProductMap;
}

// FIXED: Export LemonSqueezySubscription interface
export interface LemonSqueezySubscription {
  id: string;
  status: string;
  customerId: string;
  productId: string;
  variantId: string;
  currentPeriodStart?: Date;
  currentPeriodEnd?: Date;
  cancelAtPeriodEnd?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// FIXED: Export LemonSqueezyWebhookEvent interface
export interface LemonSqueezyWebhookEvent {
  meta: {
    event_name: string;
    custom_data?: any;
    webhook_id?: string;
  };
  data: {
    id: string;
    type: string;
    attributes: {
      [key: string]: any;
      status?: string;
      customer_id?: number;
      product_id?: number;
      variant_id?: number;
      user_email?: string;
      user_name?: string;
    };
    relationships?: {
      [key: string]: any;
    };
  };
}

// FIXED: Export LemonSqueezyProductMap interface
export interface LemonSqueezyProductMap {
  [productId: string]: {
    name: string;
    tierId: string;
    variantId?: string;
    price?: number;
    currency?: string;
  };
}

export interface LemonSqueezyCustomer {
  id: string;
  email: string;
  name?: string;
  city?: string;
  region?: string;
  country?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * LemonSqueezyService implementation
 */
export class LemonSqueezyService implements ILemonSqueezyService {
  private prisma: PrismaClient;
  private config: LemonSqueezyConfig;
  private baseUrl: string;

  constructor(prisma: PrismaClient, config?: LemonSqueezyConfig) {
    this.prisma = prisma;
    this.config = config || {
      apiKey: process.env.LEMONSQUEEZY_API_KEY || '',
      storeId: process.env.LEMONSQUEEZY_STORE_ID || '',
      webhookSecret: process.env.LEMONSQUEEZY_WEBHOOK_SECRET || '',
    };
    this.baseUrl = this.config.baseUrl || 'https://api.lemonsqueezy.com/v1';
  }

  async initialize(): Promise<void> {
    console.log('LemonSqueezyService: Initializing...');
    
    if (!this.config.apiKey || !this.config.storeId || !this.config.webhookSecret) {
      console.warn('LemonSqueezyService: Missing required configuration. Some features may not work.');
      return;
    }

    try {
      // Test the API connection
      await this.testConnection();
      console.log('LemonSqueezyService: Initialized successfully');
    } catch (error: any) {
      console.error('LemonSqueezyService: Initialization failed:', error.message);
      throw error;
    }
  }

  private async testConnection(): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/stores/${this.config.storeId}`, {
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Accept': 'application/vnd.api+json',
          'Content-Type': 'application/vnd.api+json',
        },
      });

      if (!response.ok) {
        throw new Error(`LemonSqueezy API connection failed: ${response.status} ${response.statusText}`);
      }

      console.log('LemonSqueezyService: API connection test successful');
    } catch (error: any) {
      console.error('LemonSqueezyService: API connection test failed:', error);
      throw error;
    }
  }

  verifyWebhookSignature(rawBody: string, signature: string): boolean {
    try {
      const expectedSignature = crypto
        .createHmac('sha256', this.config.webhookSecret)
        .update(rawBody, 'utf8')
        .digest('hex');

      const receivedSignature = signature.replace('sha256=', '');
      
      return crypto.timingSafeEqual(
        Buffer.from(expectedSignature, 'hex'),
        Buffer.from(receivedSignature, 'hex')
      );
    } catch (error: any) {
      console.error('LemonSqueezyService: Webhook signature verification failed:', error);
      return false;
    }
  }

  async processWebhookEvent(eventName: string, data: any): Promise<void> {
    console.log(`LemonSqueezyService: Processing webhook event: ${eventName}`);

    try {
      switch (eventName) {
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
          console.warn(`LemonSqueezyService: Unhandled webhook event: ${eventName}`);
      }

      console.log(`LemonSqueezyService: Successfully processed webhook event: ${eventName}`);
    } catch (error: any) {
      console.error(`LemonSqueezyService: Error processing webhook event ${eventName}:`, error);
      throw error;
    }
  }

  private async handleSubscriptionCreated(data: any): Promise<void> {
    const { attributes } = data;
    console.log('LemonSqueezyService: Handling subscription created:', attributes);

    // Store subscription data or trigger other business logic
    // This would typically involve updating user subscription status
  }

  private async handleSubscriptionUpdated(data: any): Promise<void> {
    const { attributes } = data;
    console.log('LemonSqueezyService: Handling subscription updated:', attributes);
  }

  private async handleSubscriptionCancelled(data: any): Promise<void> {
    const { attributes } = data;
    console.log('LemonSqueezyService: Handling subscription cancelled:', attributes);
  }

  private async handleSubscriptionResumed(data: any): Promise<void> {
    const { attributes } = data;
    console.log('LemonSqueezyService: Handling subscription resumed:', attributes);
  }

  private async handleSubscriptionExpired(data: any): Promise<void> {
    const { attributes } = data;
    console.log('LemonSqueezyService: Handling subscription expired:', attributes);
  }

  private async handleSubscriptionPaused(data: any): Promise<void> {
    const { attributes } = data;
    console.log('LemonSqueezyService: Handling subscription paused:', attributes);
  }

  private async handleSubscriptionUnpaused(data: any): Promise<void> {
    const { attributes } = data;
    console.log('LemonSqueezyService: Handling subscription unpaused:', attributes);
  }

  private async handleOrderCreated(data: any): Promise<void> {
    const { attributes } = data;
    console.log('LemonSqueezyService: Handling order created:', attributes);
  }

  async getCustomerSubscriptions(customerId: string): Promise<LemonSqueezySubscription[]> {
    try {
      const response = await fetch(`${this.baseUrl}/subscriptions?filter[customer_id]=${customerId}`, {
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Accept': 'application/vnd.api+json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch subscriptions: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      
      return result.data?.map((sub: any) => ({
        id: sub.id,
        status: sub.attributes.status,
        customerId: sub.attributes.customer_id?.toString(),
        productId: sub.attributes.product_id?.toString(),
        variantId: sub.attributes.variant_id?.toString(),
        currentPeriodStart: new Date(sub.attributes.current_period_start),
        currentPeriodEnd: new Date(sub.attributes.current_period_end),
        cancelAtPeriodEnd: sub.attributes.cancel_at_period_end,
        createdAt: new Date(sub.attributes.created_at),
        updatedAt: new Date(sub.attributes.updated_at),
      })) || [];
    } catch (error: any) {
      console.error('LemonSqueezyService: Failed to get customer subscriptions:', error);
      throw error;
    }
  }

  async createCustomer(customerData: any): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/customers`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Accept': 'application/vnd.api+json',
          'Content-Type': 'application/vnd.api+json',
        },
        body: JSON.stringify({
          data: {
            type: 'customers',
            attributes: {
              name: customerData.name,
              email: customerData.email,
              city: customerData.city,
              region: customerData.region,
              country: customerData.country,
            },
            relationships: {
              store: {
                data: {
                  type: 'stores',
                  id: this.config.storeId,
                },
              },
            },
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to create customer: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      return result.data;
    } catch (error: any) {
      console.error('LemonSqueezyService: Failed to create customer:', error);
      throw error;
    }
  }

  async getProducts(): Promise<any[]> {
    try {
      const response = await fetch(`${this.baseUrl}/products?filter[store_id]=${this.config.storeId}`, {
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Accept': 'application/vnd.api+json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      return result.data || [];
    } catch (error: any) {
      console.error('LemonSqueezyService: Failed to get products:', error);
      throw error;
    }
  }

  async createCheckoutSession(productId: string, customerId: string): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/checkouts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Accept': 'application/vnd.api+json',
          'Content-Type': 'application/vnd.api+json',
        },
        body: JSON.stringify({
          data: {
            type: 'checkouts',
            attributes: {
              checkout_data: {
                custom: {
                  customer_id: customerId,
                },
              },
            },
            relationships: {
              store: {
                data: {
                  type: 'stores',
                  id: this.config.storeId,
                },
              },
              variant: {
                data: {
                  type: 'variants',
                  id: productId,
                },
              },
            },
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to create checkout session: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      return result.data.attributes.url;
    } catch (error: any) {
      console.error('LemonSqueezyService: Failed to create checkout session:', error);
      throw error;
    }
  }
}