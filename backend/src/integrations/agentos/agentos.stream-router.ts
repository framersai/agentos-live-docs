import { Router } from 'express';
import type { Request, Response } from 'express';
import { agentosChatAdapterEnabled, processAgentOSChatRequest } from './agentos.chat-adapter.js';

/**
 * SSE router that mirrors the legacy /api/chat streaming behavior but backed by AgentOS.
 * Currently streams the final chunk only (since agentos chat adapter is call/response),
 * with a placeholder for incremental streaming once the agent orchestrator is wired up.
 */
export const createAgentOSStreamRouter = (): Router => {
  const router = Router();

  router.get('/stream', async (req: Request, res: Response) => {
    if (!agentosChatAdapterEnabled()) {
      res.status(503).json({ message: 'AgentOS streaming disabled', error: 'AGENTOS_DISABLED' });
      return;
    }

    const { userId, conversationId, mode } = req.query as Record<string, string>;
    let messages: Array<{ role: string; content: string }> = [];
    if (typeof req.query.messages === 'string') {
      try {
        messages = JSON.parse(req.query.messages);
      } catch {
        res.status(400).json({ message: 'Invalid messages payload.' });
        return;
      }
    }

    if (!userId || !conversationId || !mode || !Array.isArray(messages)) {
      res.status(400).json({ message: 'Missing agentOS streaming payload fields.' });
      return;
    }

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.flushHeaders();

    try {
      const result = await processAgentOSChatRequest({
        userId,
        conversationId,
        mode,
        messages,
      });

      res.write(`event: message\ndata: ${JSON.stringify(result)}\n\n`);
      res.write('event: done\ndata: {}\n\n');
      res.end();
    } catch (error: any) {
      res.write(`event: error\ndata: ${JSON.stringify({ message: error?.message ?? 'AgentOS error' })}\n\n`);
      res.end();
    }
  });

  return router;
};
