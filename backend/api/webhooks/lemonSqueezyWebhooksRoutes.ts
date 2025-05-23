// backend/api/webhooks/lemonSqueezyWebhookRoutes.ts
import { Router, Request, Response, NextFunction } from 'express';
import { ILemonSqueezyService } from '../../services/payment_gateway/LemonSqueezyService.js';
import { ISubscriptionService } from '../../services/user_auth/SubscriptionService.js';

/**
 * Creates and returns an Express Router for Lemon Squeezy webhook events.
 * This router is responsible for receiving, validating, and processing
 * Lemon Squeezy webhooks to update internal subscription statuses.
 * @param lemonSqueezyService The initialized LemonSqueezyService instance.
 * @param subscriptionService The initialized SubscriptionService instance.
 * @returns An Express Router instance.
 */
export const createLemonSqueezyWebhookRoutes = (
  lemonSqueezyService: ILemonSqueezyService,
  subscriptionService: ISubscriptionService
): Router => {
  const router = Router();

  /**
   * Middleware to get the raw body for webhook signature verification.
   * Express's `express.json()` parses the body, making signature verification impossible.
   * This specific middleware must be used ONLY for webhook routes.
   * @param req Express Request object.
   * @param res Express Response object.
   * @param next NextFunction.
   */
  const rawBodyMiddleware = (req: Request, res: Response, next: NextFunction) => {
    // Only process raw body if content-type is json
    if (req.headers['content-type'] === 'application/json') {
      req.setEncoding('utf8');
      let data = '';
      req.on('data', chunk => {
        data += chunk;
      });
      req.on('end', () => {
        (req as any).rawBody = data;
        next();
      });
    } else {
      next();
    }
  };

  /**
   * POST /api/v1/webhooks/lemonsqueezy
   * Endpoint for Lemon Squeezy webhook events.
   * It expects a raw JSON body and the 'x-signature' header for verification.
   */
  router.post('/', rawBodyMiddleware, async (req: Request, res: Response) => {
    // Ensure rawBody is available for signature verification
    const rawBody = (req as any).rawBody;
    const signature = req.headers['x-signature'] as string;

    if (!rawBody || !signature) {
      console.warn('Lemon Squeezy Webhook: Missing raw body or x-signature header.');
      return res.status(400).json({ message: 'Bad Request: Missing raw body or signature.' });
    }

    try {
      // 1. Verify the webhook signature and parse the event
      const event = await lemonSqueezyService.handleWebhookEvent(rawBody, signature);

      // 2. Process the event based on its type
      await subscriptionService.processWebhookEvent(event);

      // Respond immediately to the webhook to avoid timeouts
      res.status(200).json({ received: true });
    } catch (error: any) {
      console.error('Lemon Squeezy Webhook processing failed:', error.message);
      // It's generally good practice to return 200 even on processing failure
      // to prevent the webhook sender from retrying endlessly,
      // but log the error for internal debugging.
      res.status(200).json({ received: true, error: error.message });
    }
  });

  return router;
};