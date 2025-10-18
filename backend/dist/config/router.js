import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { postGlobalLogin, postStandardLogin, getStatus as getAuthStatus, deleteSession as deleteAuthSession, postRegister, } from '../src/features/auth/auth.routes.js';
import * as chatApiRoutes from '../src/features/chat/chat.routes.js';
import * as sttApiRoutes from '../src/features/speech/stt.routes.js';
import * as ttsApiRoutes from '../src/features/speech/tts.routes.js';
import * as costApiRoutes from '../src/features/cost/cost.routes.js';
import { rateLimiter } from '../middleware/ratelimiter.js';
import * as promptApiRoutes from '../src/features/prompts/prompt.routes.js';
import { postCheckoutSession, postLemonWebhook, getCheckoutStatus } from '../src/features/billing/billing.routes.js';
import * as organizationRoutes from '../src/features/organization/organization.routes.js';
import { getLlmStatus as getSystemLlmStatus } from '../src/features/system/system.routes.js';
export async function configureRouter() {
    const router = Router();
    console.log('🔧 Configuring API routes...');
    try {
        router.post('/auth/global', postGlobalLogin);
        router.post('/auth/login', postStandardLogin);
        router.post('/auth/register', postRegister);
        router.get('/auth', authMiddleware, getAuthStatus);
        router.delete('/auth', authMiddleware, deleteAuthSession);
        console.log('✅ Registered auth routes');
        router.get('/prompts/:filename', promptApiRoutes.GET);
        router.get('/system/llm-status', getSystemLlmStatus);
        console.log('�o. Registered system diagnostics routes');
        router.get('/rate-limit/status', async (req, res) => {
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
            }
            catch (error) {
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
        router.post('/chat', chatApiRoutes.POST);
        router.post('/chat/persona', chatApiRoutes.POST_PERSONA);
        console.log('✅ Registered chat routes (public/private access)');
        router.post('/diagram', chatApiRoutes.POST);
        console.log('✅ Registered diagram routes (public/private access)');
        router.post('/stt', sttApiRoutes.POST);
        router.get('/stt/stats', sttApiRoutes.GET);
        console.log('✅ Registered STT routes (public/private access)');
        router.post('/tts', ttsApiRoutes.POST);
        router.get('/tts/voices', ttsApiRoutes.GET);
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
        router.get('/cost', authMiddleware, costApiRoutes.GET);
        router.post('/cost', authMiddleware, costApiRoutes.POST);
        console.log('✅ Registered strictly authenticated cost routes');
        router.get('/test', (req, res) => {
            const userInfo = req.user ? { id: req.user.id, authenticated: req.user.authenticated } : 'No user identified (public or token invalid/missing)';
            res.json({
                message: 'Router test endpoint is working!',
                timestamp: new Date().toISOString(),
                userContext: userInfo,
                note: "Access to this endpoint is first processed by optionalAuth, then rateLimiter.",
            });
        });
        console.log('✅ Added test route: GET /api/test');
    }
    catch (error) {
        console.error('❌ Error setting up API routes:', error);
        throw error;
    }
    return router;
}
//# sourceMappingURL=router.js.map