import { Router } from 'express';
import { agentosChatAdapterEnabled, processAgentOSChatRequest } from './agentos.chat-adapter.js';
import type { Request, Response, NextFunction } from 'express';
import { agentosService } from './agentos.integration.js';

export const createAgentOSRouter = (): Router => {
  const router = Router();

  router.post('/chat', async (req: Request, res: Response, next: NextFunction) => {
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

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  });

  router.get('/personas', async (req: Request, res: Response, next: NextFunction) => {
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

      res.status(200).json({ personas: filtered });
    } catch (error) {
      next(error);
    }
  });

  router.get('/workflows/definitions', async (_req: Request, res: Response, next: NextFunction) => {
    try {
      if (!agentosChatAdapterEnabled()) {
        return res.status(503).json({ message: 'AgentOS integration disabled', error: 'AGENTOS_DISABLED' });
      }

      const definitions = await agentosService.listWorkflowDefinitions();
      res.status(200).json({ definitions });
    } catch (error) {
      next(error);
    }
  });

  router.post('/workflows/start', async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!agentosChatAdapterEnabled()) {
        return res.status(503).json({ message: 'AgentOS integration disabled', error: 'AGENTOS_DISABLED' });
      }

      const { definitionId, userId, conversationId, workflowId, context, roleAssignments, metadata } = req.body ?? {};
      if (!definitionId || !userId) {
        return res.status(400).json({ message: 'definitionId and userId are required.' });
      }

      const instance = await agentosService.startWorkflow({
        definitionId,
        userId,
        conversationId,
        workflowId,
        context,
        roleAssignments,
        metadata,
      });
      res.status(201).json({ workflow: instance });
    } catch (error) {
      next(error);
    }
  });

  router.post('/workflows/cancel', async (req: Request, res: Response, next: NextFunction) => {
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
      res.status(200).json({ workflow: updated });
    } catch (error) {
      next(error);
    }
  });

  return router;
};
