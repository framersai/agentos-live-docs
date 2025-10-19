// File: backend/config/router.ts
/**
 * @file API Router Configuration
 * @description Defines and configures all API routes for the application.
 * Routes are organized by feature. The strict authMiddleware is applied to routes
 * that absolutely require an authenticated user.
 * @version 1.2.1 - Renamed jwtMiddleware to authMiddleware.
 */

import { Router, Request, Response } from 'express';
// Import the strict authMiddleware
import { authMiddleware } from '../middleware/auth.js';

// Import route handlers
import {
  postGlobalLogin,
  postStandardLogin,
  getStatus as getAuthStatus,
  deleteSession as deleteAuthSession,
  postRegister,
} from '../src/features/auth/auth.routes.js';
import * as chatApiRoutes from '../src/features/chat/chat.routes.js';
import { postDetectLanguage } from '../src/features/chat/language.routes.js';
import * as diagramApiRoutes from '../src/features/chat/diagram.routes.js';
import * as sttApiRoutes from '../src/features/speech/stt.routes.js';
import * as ttsApiRoutes from '../src/features/speech/tts.routes.js';
import * as costApiRoutes from '../src/features/cost/cost.routes.js';
import { rateLimiter } from '../middleware/ratelimiter.js'; // For fetching public rate limit status
import * as promptApiRoutes from '../src/features/prompts/prompt.routes.js';
import { postCheckoutSession, postLemonWebhook, getCheckoutStatus } from '../src/features/billing/billing.routes.js';
import * as organizationRoutes from '../src/features/organization/organization.routes.js';
import { getLlmStatus as getSystemLlmStatus } from '../src/features/system/system.routes.js';

/**
 * Configures and returns the main API router with all routes registered.
 * @returns {Promise<Router>} A promise that resolves to the configured Express Router.
 */
export async function configureRouter(): Promise<Router> {
  const router = Router();

  console.log('🔧 Configuring API routes...');

  try {
    // --- Authentication Routes (These are handled by authMiddleware's internal logic for /api/auth paths) ---
    router.post('/auth/global', postGlobalLogin);
    router.post('/auth/login', postStandardLogin);
    router.post('/auth/register', postRegister);
    router.get('/auth', authMiddleware, getAuthStatus);
    router.delete('/auth', authMiddleware, deleteAuthSession);
    console.log('✅ Registered auth routes');

    router.get('/prompts/:filename', promptApiRoutes.GET);
    router.get('/system/llm-status', getSystemLlmStatus);
    console.log('�o. Registered system diagnostics routes');

    // --- Publicly Accessible Informational Routes ---
    // This endpoint allows frontend to get info about public rate limits.
    // It does not require auth. The global optionalAuthMiddleware would have run.
    router.get('/rate-limit/status', async (req: Request, res: Response) => {
        // @ts-ignore - req.user is custom property added by optional auth middleware
        if (req.user && req.user.authenticated) {
            return res.json({
                tier: 'authenticated',
                message: 'Authenticated users have elevated or unlimited request capacity.',
            });
        }

        const ip = rateLimiter.resolveClientIp(req);

        if (!ip || ip === 'unknown') {
            return res.json({
                tier: 'public',
                ip: null,
                message: 'Unable to determine client IP from proxy headers. Public rate limits are skipped for this request.',
                storeType: 'unresolved-ip',
            });
        }

        try {
            const usage = await rateLimiter.getPublicUsage(ip);
            return res.json({ tier: 'public', ip, ...usage });
        } catch (error: any) {
            console.error('Error fetching rate limit status:', error.message);
            return res.json({
                tier: 'public',
                ip,
                used: 0,
                limit: 0,
                remaining: 0,
                resetAt: null,
                storeType: 'error',
                message: 'Rate limit status currently unavailable. Requests continue without enforcement.',
            });
        }
    });
    console.log('✅ Registered GET /rate-limit/status route');

    // --- Core Application Routes ---
    // These routes can be accessed by public (IP rate-limited) or authenticated (unlimited) users.
    // The global optionalAuthMiddleware + rateLimiter in server.ts handle this differentiation.
    // No strict authMiddleware is applied here, allowing public access.
    // The route handlers themselves can check req.user if behavior needs to differ for logged-in users.
    router.post('/chat', chatApiRoutes.POST);
    router.post('/chat/persona', chatApiRoutes.POST_PERSONA);
    router.post('/chat/detect-language', postDetectLanguage);
    console.log('✅ Registered chat routes (public/private access)');

    router.post('/diagram', chatApiRoutes.POST); // Typically diagrams are generated in context of chat.
                                                   // If it needs to be strictly private, add authMiddleware.
    console.log('✅ Registered diagram routes (public/private access)');

    router.post('/stt', sttApiRoutes.POST);
    router.get('/stt/stats', sttApiRoutes.GET); // This might be better as a private route.
    console.log('✅ Registered STT routes (public/private access)');

    router.post('/tts', ttsApiRoutes.POST);
    router.get('/tts/voices', ttsApiRoutes.GET); // Publicly listable voices is fine.
    console.log('✅ Registered TTS routes (public/private access)');

    router.post('/billing/checkout', authMiddleware, postCheckoutSession);
    router.get('/billing/status/:checkoutId', authMiddleware, getCheckoutStatus);
    router.post('/billing/webhook', postLemonWebhook);
    console.log('✅ Registered billing routes');


    router.get('/organizations', authMiddleware, organizationRoutes.getOrganizations);
    router.post('/organizations', authMiddleware, organizationRoutes.postOrganization);
    router.patch('/organizations/:organizationId', authMiddleware, organizationRoutes.patchOrganization);
    router.post('/organizations/:organizationId/invites', authMiddleware, organizationRoutes.postInvite);
    router.delete('/organizations/:organizationId/invites/:inviteId', authMiddleware, organizationRoutes.deleteInvite);
    router.patch('/organizations/:organizationId/members/:memberId', authMiddleware, organizationRoutes.patchMember);
    router.delete('/organizations/:organizationId/members/:memberId', authMiddleware, organizationRoutes.deleteMember);
    router.post('/organizations/invites/:token/accept', authMiddleware, organizationRoutes.postAcceptInvite);
    console.log('�o. Registered organization routes');


    // --- Strictly Authenticated Routes ---
    // These routes REQUIRE a valid token, enforced by the strict authMiddleware.
    // Example: if there were user-specific settings to save, or private data.
    router.get('/cost', authMiddleware, costApiRoutes.GET); // Cost info is user-specific
    router.post('/cost', authMiddleware, costApiRoutes.POST); // Resetting cost is user-specific
    console.log('✅ Registered strictly authenticated cost routes');
    // Add other strictly private routes here using authMiddleware

    // Test endpoint
    router.get('/test', (req: Request, res: Response) => {
      // @ts-ignore - req.user is custom property
      const userInfo = req.user ? { id: req.user.id, authenticated: req.user.authenticated } : 'No user identified (public or token invalid/missing)';
      res.json({
        message: 'Router test endpoint is working!',
        timestamp: new Date().toISOString(),
        userContext: userInfo,
        note: "Access to this endpoint is first processed by optionalAuth, then rateLimiter.",
      });
    });
    console.log('✅ Added test route: GET /api/test');

  } catch (error) {
    console.error('❌ Error setting up API routes:', error);
    throw error;
  }

  return router;
}

