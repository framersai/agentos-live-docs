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
