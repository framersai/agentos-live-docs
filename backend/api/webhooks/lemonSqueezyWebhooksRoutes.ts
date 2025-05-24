// File: backend/api/webhooks/lemonSqueezyWebhooksRoutes.ts

import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { LemonSqueezyService } from '../../services/payment/LemonSqueezyService.js';

/**
 * @fileoverview LemonSqueezy webhook handlers for payment events
 * @module api/webhooks/lemonSqueezyWebhooksRoutes
 */

export const createLemonSqueezyWebhooksRoutes = (prisma: PrismaClient): Router => {
  const router = Router();
  const lemonSqueezyService = new LemonSqueezyService(prisma);

  /**
   * Raw body parser middleware for webhook signature verification
   */
  const rawBodyParser = (req: Request, res: Response, next: any) => {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
    });
    req.on('end', () => {
      req.rawBody = data;
      next();
    });
  };

  /**
   * Main webhook endpoint for all LemonSqueezy events
   * POST /api/webhooks/lemonsqueezy
   */
  router.post('/lemonsqueezy', rawBodyParser, async (req: Request, res: Response) => {
    try {
      const signature = req.headers['x-signature'] as string;
      const rawBody = req.rawBody;

      if (!signature || !rawBody) {
        console.warn('Missing webhook signature or body');
        return res.status(400).json({ 
          success: false, 
          error: 'Missing signature or body' 
        });
      }

      // Verify webhook signature in production
      if (process.env.NODE_ENV === 'production') {
        const isValid = lemonSqueezyService.verifyWebhookSignature(rawBody, signature);
        if (!isValid) {
          console.warn('Invalid webhook signature');
          return res.status(401).json({ 
            success: false, 
            error: 'Invalid signature' 
          });
        }
      }

      // Parse the webhook payload
      const webhookEvent = JSON.parse(rawBody);
      const { meta, data } = webhookEvent;

      if (!meta?.event_name || !data) {
        console.warn('Invalid webhook payload structure');
        return res.status(400).json({ 
          success: false, 
          error: 'Invalid payload structure' 
        });
      }

      console.log(`📨 Received LemonSqueezy webhook: ${meta.event_name}`);

      // Process the webhook event
      await lemonSqueezyService.processWebhookEvent(meta.event_name, data);

      // Respond immediately to prevent timeouts
      res.status(200).json({ 
        success: true, 
        event: meta.event_name,
        processed_at: new Date().toISOString()
      });

    } catch (error) {
      console.error('❌ Error processing LemonSqueezy webhook:', error);
      
      // Still return 200 to prevent webhook retries for permanent errors
      res.status(200).json({ 
        success: false, 
        error: 'Processing failed',
        timestamp: new Date().toISOString()
      });
    }
  });

  /**
   * Test webhook endpoint for development
   * POST /api/webhooks/lemonsqueezy/test
   */
  router.post('/lemonsqueezy/test', async (req: Request, res: Response) => {
    if (process.env.NODE_ENV === 'production') {
      return res.status(404).json({ error: 'Not found' });
    }

    try {
      const { event_name, test_data } = req.body;

      if (!event_name) {
        return res.status(400).json({ 
          error: 'event_name is required for test webhook' 
        });
      }

      console.log(`🧪 Processing test webhook: ${event_name}`);
      
      // Process test event
      await lemonSqueezyService.processWebhookEvent(event_name, test_data || {});

      res.status(200).json({ 
        success: true, 
        message: `Test webhook ${event_name} processed successfully`,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('Error processing test webhook:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Test webhook processing failed' 
      });
    }
  });

  /**
   * Health check for webhook endpoint
   * GET /api/webhooks/lemonsqueezy/health
   */
  router.get('/lemonsqueezy/health', (req: Request, res: Response) => {
    res.status(200).json({
      status: 'healthy',
      service: 'lemonsqueezy-webhooks',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      webhook_secret_configured: !!process.env.LEMONSQUEEZY_WEBHOOK_SECRET,
      api_key_configured: !!process.env.LEMONSQUEEZY_API_KEY,
    });
  });

  return router;
};

// Type augmentation for Express Request to include rawBody
declare global {
  namespace Express {
    interface Request {
      rawBody?: string;
    }
  }
}