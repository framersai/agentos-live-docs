import { Router } from 'express';
import { agentosChatAdapterEnabled, processAgentOSChatRequest } from './agentos.chat-adapter.js';
import type { Request, Response, NextFunction } from 'express';
import { agentosService } from './agentos.integration.js';
import { agencyUsageService } from '../../features/agents/agencyUsage.service.js';
import extensionRoutes from './agentos.extensions.routes.js';

export const createAgentOSRouter = (): Router => {
  const router = Router();

  // CORS for all AgentOS endpoints (dev convenience)
  router.use((req: Request, res: Response, next: NextFunction) => {
    const origin = (req.headers.origin as string) || '*';
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');
    if (req.method === 'OPTIONS') {
      res.status(204).end();
      return;
    }
    next();
  });

  // Preflight for SSE endpoint (dev convenience)
  router.options('/stream', (req: Request, res: Response) => {
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');
    res.status(204).end();
  });

  // Streaming is handled by the dedicated AgentOS stream router. No mock endpoints here.

  router.post('/chat', async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      if (!agentosChatAdapterEnabled()) {
        return res.status(503).json({ message: 'AgentOS integration disabled', error: 'AGENTOS_DISABLED' });
      }

      const { userId, conversationId, mode, messages } = req.body ?? {};
      if (!userId || !conversationId || !mode || !Array.isArray(messages)) {
        return res.status(400).json({ message: 'Missing agentOS chat payload fields.' });
      }

      const result = await processAgentOSChatRequest({
        userId,
        conversationId,
        mode,
        messages,
      });

      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  });

  router.get('/personas', async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      if (!agentosChatAdapterEnabled()) {
        return res.status(503).json({ message: 'AgentOS integration disabled', error: 'AGENTOS_DISABLED' });
      }

      const parseMultiParam = (value: unknown): string[] => {
        if (!value) return [];
        const rawValues = Array.isArray(value) ? value : String(value).split(',');
        return rawValues
          .map((entry) => entry?.toString().trim().toLowerCase())
          .filter((entry): entry is string => Boolean(entry && entry.length > 0));
      };

      const userIdParam = req.query.userId;
      const userId = typeof userIdParam === 'string' && userIdParam.trim().length > 0 ? userIdParam : undefined;
      const requestedCapabilities = parseMultiParam(req.query.capability);
      const requestedTiers = parseMultiParam(req.query.tier);
      const searchTerm =
        typeof req.query.search === 'string' && req.query.search.trim().length > 0
          ? req.query.search.trim().toLowerCase()
          : undefined;

      const personas = await agentosService.listAvailablePersonas(userId);

      const filtered = personas.filter((persona: any) => {
        const normalizedCapabilities = Array.isArray(persona.allowedCapabilities)
          ? persona.allowedCapabilities
              .filter((cap: unknown): cap is string => typeof cap === 'string')
              .map((cap: string) => cap.toLowerCase())
          : [];

        if (
          requestedCapabilities.length > 0 &&
          !requestedCapabilities.every((capability) => normalizedCapabilities.includes(capability))
        ) {
          return false;
        }

        if (requestedTiers.length > 0) {
          const tierCandidates = [
            persona?.metadata?.tier,
            persona?.metadata?.subscriptionTier,
            persona?.tier,
            persona?.minSubscriptionTier,
            persona?.metadata?.accessTier,
          ]
            .map((tier: unknown) => (typeof tier === 'string' ? tier.trim().toLowerCase() : undefined))
            .filter((tier): tier is string => Boolean(tier && tier.length > 0));

          if (tierCandidates.length === 0 || !tierCandidates.some((tier) => requestedTiers.includes(tier))) {
            return false;
          }
        }

        if (searchTerm) {
          const haystack: string[] = [];
          if (typeof persona.displayName === 'string') haystack.push(persona.displayName);
          if (typeof persona.name === 'string') haystack.push(persona.name);
          if (typeof persona.description === 'string') haystack.push(persona.description);
          if (Array.isArray(persona.tags)) haystack.push(...persona.tags.map(String));
          if (Array.isArray(persona.traits)) haystack.push(...persona.traits.map(String));
          if (Array.isArray(persona.activationKeywords)) haystack.push(...persona.activationKeywords.map(String));

          const matchesSearch = haystack
            .map((entry) => entry.toLowerCase())
            .some((entry) => entry.includes(searchTerm));

          if (!matchesSearch) {
            return false;
          }
        }

        return true;
      });

      return res.status(200).json({ personas: filtered });
    } catch (error) {
      next(error);
    }
  });

  router.get('/workflows/definitions', async (_req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      if (!agentosChatAdapterEnabled()) {
        return res.status(503).json({ message: 'AgentOS integration disabled', error: 'AGENTOS_DISABLED' });
      }

      const definitions = await agentosService.listWorkflowDefinitions();
      return res.status(200).json({ definitions });
    } catch (error) {
      next(error);
    }
  });

  router.post('/workflows/start', async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      if (!agentosChatAdapterEnabled()) {
        return res.status(503).json({ message: 'AgentOS integration disabled', error: 'AGENTOS_DISABLED' });
      }

      const {
        definitionId,
        userId,
        conversationId,
        workflowId,
        context,
        roleAssignments,
        metadata,
      } = req.body ?? {};
      if (!definitionId || !userId) {
        return res.status(400).json({ message: 'definitionId and userId are required.' });
      }

      const normalizedAssignments =
        roleAssignments && typeof roleAssignments === 'object' ? roleAssignments : undefined;
      const seatCount =
        normalizedAssignments && Object.keys(normalizedAssignments).length > 0
          ? Object.keys(normalizedAssignments).length
          : 1;
      const reservation = await agencyUsageService.assertLaunchCapacity(userId, seatCount);

      const instance = await agentosService.startWorkflow({
        definitionId,
        userId,
        conversationId,
        workflowId,
        context,
        roleAssignments,
        metadata,
        agencyRequest: req.body?.agencyRequest,
      });
      await agencyUsageService.recordLaunch({
        userId,
        planId: reservation.planId,
        workflowDefinitionId: definitionId,
        agencyId: instance.agencyState?.agencyId ?? null,
        seats: seatCount,
        metadata: {
          workflowId: instance.workflowId,
          requestedConversationId: conversationId ?? null,
          agencyRequest: req.body?.agencyRequest ?? null,
        },
      });
      return res.status(201).json({ workflow: instance });
    } catch (error) {
      next(error);
    }
  });

  router.post('/workflows/cancel', async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      if (!agentosChatAdapterEnabled()) {
        return res.status(503).json({ message: 'AgentOS integration disabled', error: 'AGENTOS_DISABLED' });
      }
      const { workflowId, reason } = req.body ?? {};
      if (!workflowId) {
        return res.status(400).json({ message: 'workflowId is required.' });
      }
      const updated = await agentosService.cancelWorkflow(workflowId, reason);
      if (!updated) {
        return res.status(404).json({ message: 'Workflow not found.' });
      }
      return res.status(200).json({ workflow: updated });
    } catch (error) {
      next(error);
    }
  });

  // Add extension routes
  router.use(extensionRoutes);
  
  return router;
};
