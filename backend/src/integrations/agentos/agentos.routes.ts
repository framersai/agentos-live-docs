import { Router } from 'express';
import { agentosChatAdapterEnabled, processAgentOSChatRequest } from './agentos.chat-adapter.js';
import type { Request, Response, NextFunction } from 'express';

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

  return router;
};
