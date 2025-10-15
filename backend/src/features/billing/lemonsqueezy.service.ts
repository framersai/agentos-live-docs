// File: backend/src/features/billing/lemonsqueezy.service.ts
/**
 * @file lemonsqueezy.service.ts
 * @description Helpers for interacting with the Lemon Squeezy API.
 */

import crypto from 'crypto';
import axios from 'axios';
import type { AxiosInstance } from 'axios';
import { appConfig } from '../../config/appConfig.js';
import { upsertUserFromSubscription } from '../auth/auth.service.js';
import { storeLemonSqueezyEvent } from '../auth/user.repository.js';

const LEMON_API_BASE = 'https://api.lemonsqueezy.com/v1';

const buildClient = (): AxiosInstance => {
  if (!appConfig.lemonsqueezy.enabled) {
    throw new Error('LEMONSQUEEZY_NOT_CONFIGURED');
  }
  return axios.create({
    baseURL: LEMON_API_BASE,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${appConfig.lemonsqueezy.apiKey}`,
    },
  });
};

export interface CreateCheckoutPayload {
  productId: string;
  variantId: string;
  email: string;
  successUrl?: string;
  cancelUrl?: string;
  userId: string;
}

export const createCheckoutSession = async (payload: CreateCheckoutPayload) => {
  const client = buildClient();
  const response = await client.post('/checkouts', {
    data: {
      type: 'checkouts',
      attributes: {
        checkout_data: {
          email: payload.email,
          custom: {
            user_id: payload.userId,
          },
        },
        checkout_options: {
          embed: false,
          media: false,
          logo_url: undefined,
        },
        redirect_url: payload.successUrl || appConfig.lemonsqueezy.defaultSuccessUrl || undefined,
        cancel_url: payload.cancelUrl || appConfig.lemonsqueezy.defaultCancelUrl || undefined,
      },
      relationships: {
        store: {
          data: {
            type: 'stores',
            id: appConfig.lemonsqueezy.storeId,
          },
        },
        product: {
          data: {
            type: 'products',
            id: payload.productId,
          },
        },
        variant: {
          data: {
            type: 'variants',
            id: payload.variantId,
          },
        },
      },
    },
  });

  const checkoutUrl = response.data?.data?.attributes?.url;
  if (!checkoutUrl) {
    throw new Error('LEMONSQUEEZY_CHECKOUT_URL_MISSING');
  }
  return checkoutUrl;
};

export const verifyWebhookSignature = (payload: string, signature: string | undefined): boolean => {
  if (!appConfig.lemonsqueezy.webhookSecret) return false;
  if (!signature) return false;
  const digest = crypto
    .createHmac('sha256', appConfig.lemonsqueezy.webhookSecret)
    .update(payload, 'utf8')
    .digest('hex');
  return crypto.timingSafeEqual(Buffer.from(signature, 'hex'), Buffer.from(digest, 'hex'));
};

interface LemonSqueezyWebhookData {
  meta?: { event_name?: string };
  data?: {
    attributes?: {
      status?: string;
      cancel_at?: string | null;
      renews_at?: string | null;
      expires_at?: string | null;
      user_email?: string;
    };
    relationships?: {
      order?: { data?: { id?: string } };
      product?: { data?: { id?: string } };
    };
  };
}

export const handleSubscriptionWebhook = (eventId: string, payload: string, parsed: LemonSqueezyWebhookData): void => {
  const eventName = parsed.meta?.event_name || 'unknown';
  storeLemonSqueezyEvent({ id: eventId, eventName, payload, processed: false });

  const email = parsed.data?.attributes?.user_email;
  if (!email) {
    return;
  }

  const status = parsed.data?.attributes?.status || 'active';
  const renewsAt = parsed.data?.attributes?.renews_at ? Date.parse(parsed.data.attributes.renews_at) : null;
  const expiresAt = parsed.data?.attributes?.expires_at ? Date.parse(parsed.data.attributes.expires_at) : null;

  upsertUserFromSubscription({
    email,
    subscriptionStatus: status,
    subscriptionTier: status === 'active' ? 'unlimited' : 'metered',
    lemonSubscriptionId: parsed.data?.relationships?.order?.data?.id,
    renewsAt,
    expiresAt,
  });
};
