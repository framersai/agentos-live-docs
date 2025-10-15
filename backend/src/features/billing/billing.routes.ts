// File: backend/src/features/billing/billing.routes.ts
/**
 * @file billing.routes.ts
 * @description REST handlers for subscription checkout and webhooks.
 */

import type { Request, Response } from 'express';
import { appConfig } from '../../config/appConfig.js';
import {
  createCheckoutSession,
  verifyWebhookSignature,
  handleSubscriptionWebhook,
} from './lemonsqueezy.service.js';

export const postCheckoutSession = async (req: Request, res: Response): Promise<void> => {
  const user = (req as any).user;
  if (!user) {
    res.status(401).json({ message: 'Authentication required.' });
    return;
  }
  if (user.mode === 'global') {
    res.status(403).json({ message: 'Global access users do not require a subscription.' });
    return;
  }
  if (!user.email) {
    res.status(400).json({ message: 'User email is required to start checkout.' });
    return;
  }
  const { variantId, productId, successUrl, cancelUrl } = req.body as {
    variantId?: string;
    productId?: string;
    successUrl?: string;
    cancelUrl?: string;
  };
  if (!variantId || !productId) {
    res.status(400).json({ message: 'variantId and productId are required.' });
    return;
  }
  if (!appConfig.lemonsqueezy.enabled) {
    res.status(503).json({ message: 'Billing is not configured.' });
    return;
  }
  try {
    const checkoutUrl = await createCheckoutSession({
      variantId,
      productId,
      email: user.email,
      successUrl,
      cancelUrl,
      userId: user.sub ?? user.id,
    });
    res.status(200).json({ checkoutUrl });
  } catch (error: any) {
    console.error('[Billing] Failed to create checkout session:', error);
    res.status(500).json({ message: 'Failed to create checkout session.', error: error.message });
  }
};

export const postLemonWebhook = async (req: Request, res: Response): Promise<void> => {
  if (!appConfig.lemonsqueezy.webhookSecret) {
    res.status(503).json({ message: 'Webhook secret not configured.' });
    return;
  }
  const signature = (req.headers['x-signature'] || req.headers['x-lemonsqueezy-signature']) as string | undefined;
  const eventId = (req.headers['x-event-id'] || req.headers['x-lemonsqueezy-event-id'] || req.body?.meta?.event_id || Date.now().toString()) as string;
  const payloadString = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);

  if (!verifyWebhookSignature(payloadString, signature)) {
    res.status(401).json({ message: 'Invalid signature.' });
    return;
  }

  try {
    handleSubscriptionWebhook(eventId, payloadString, typeof req.body === 'string' ? JSON.parse(req.body) : (req.body as any));
    res.status(200).json({ received: true });
  } catch (error: any) {
    console.error('[Billing] Failed to process Lemon Squeezy webhook:', error);
    res.status(500).json({ message: 'Failed to process webhook.', error: error.message });
  }
};
