import { Router } from 'express';
import type { Request, Response } from 'express';
import type { AgentOSInput, AgentOSResponse } from '@framers/agentos';
import { agentosChatAdapterEnabled, processAgentOSChatRequest } from './agentos.chat-adapter.js';

type StreamHandler = (input: AgentOSInput, onChunk: (chunk: AgentOSResponse) => Promise<void> | void) => Promise<void>;

interface AgentOSStreamIntegration {
  processThroughAgentOSStream: StreamHandler;
}

export const createAgentOSStreamRouter = (integration: AgentOSStreamIntegration): Router => {
  const router = Router();

  router.get('/stream', async (req: Request, res: Response) => {
    if (!agentosChatAdapterEnabled()) {
      res.status(503).json({ message: 'AgentOS streaming disabled', error: 'AGENTOS_DISABLED' });
      return;
    }

    const { userId, conversationId, mode, model } = req.query as Record<string, string>;
    let messages: Array<{ role: string; content: string }> = [];
    if (typeof req.query.messages === 'string') {
      try {
        messages = JSON.parse(req.query.messages);
      } catch {
        res.status(400).json({ message: 'Invalid messages payload.' });
        return;
      }
    }

    let workflowRequest: unknown;
    if (typeof req.query.workflowRequest === 'string') {
      try {
        workflowRequest = JSON.parse(req.query.workflowRequest);
      } catch {
        res.status(400).json({ message: 'Invalid workflowRequest payload.' });
        return;
      }
    }

    let agencyRequest: unknown;
    if (typeof req.query.agencyRequest === 'string') {
      try {
        agencyRequest = JSON.parse(req.query.agencyRequest);
      } catch {
        res.status(400).json({ message: 'Invalid agencyRequest payload.' });
        return;
      }
    }

    let userApiKeys: Record<string, string> | undefined;
    if (typeof req.query.apiKeys === 'string') {
      try {
        const parsed = JSON.parse(req.query.apiKeys);
        if (parsed && typeof parsed === 'object') {
          userApiKeys = parsed as Record<string, string>;
        }
      } catch {
        res.status(400).json({ message: 'Invalid apiKeys payload.' });
        return;
      }
    }

    if (!userId || !conversationId || !mode || !Array.isArray(messages)) {
      res.status(400).json({ message: 'Missing agentOS streaming payload fields.' });
      return;
    }

    const lastUserMessage = [...messages].reverse().find((msg) => msg.role === 'user')?.content ?? null;

    const agentosInput: AgentOSInput = {
      userId,
      sessionId: conversationId,
      conversationId,
      selectedPersonaId: mode,
      textInput: lastUserMessage ?? null,
      options: {
        streamUICommands: true,
      },
    };
    if (userApiKeys) {
      agentosInput.userApiKeys = userApiKeys;
    }

    if (workflowRequest && typeof workflowRequest === 'object') {
      (agentosInput as any).workflowRequest = workflowRequest;
    }

    if (agencyRequest && typeof agencyRequest === 'object') {
      (agentosInput as any).agencyRequest = agencyRequest;
    }

    if (typeof model === 'string' && model.trim().length > 0) {
      (agentosInput as any).options = { ...((agentosInput as any).options || {}), overrideModelId: model };
    }

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    if (typeof res.flushHeaders === 'function') {
      res.flushHeaders();
    }

    let emittedText = false;

    try {
      await integration.processThroughAgentOSStream(agentosInput, async (chunk: any) => {
        if (chunk?.type === 'text_delta' && typeof chunk.textDelta === 'string' && chunk.textDelta.trim().length > 0) {
          emittedText = true;
        } else if (chunk?.type === 'final_response') {
          const text = (typeof chunk.finalResponseText === 'string' ? chunk.finalResponseText : '')
            || (typeof chunk.content === 'string' ? chunk.content : '');
          if (text.trim().length > 0) emittedText = true;
        }
        res.write('data: ' + JSON.stringify(chunk) + '\n\n');
        const flush = (res as any).flush;
        if (typeof flush === 'function') {
          flush.call(res);
        }
      });

      if (!emittedText) {
        // Fallback to a single-shot chat response (real LLM if configured)
        try {
          const result = await processAgentOSChatRequest({
            userId,
            conversationId,
            mode,
            messages,
          });
          const fallbackChunk: any = {
            type: 'final_response',
            streamId: conversationId,
            gmiInstanceId: mode,
            personaId: mode,
            isFinal: true,
            timestamp: new Date().toISOString(),
            finalResponseText: result.content || '',
            usage: result.usage
              ? {
                  promptTokens: (result.usage as any).prompt_tokens ?? 0,
                  completionTokens: (result.usage as any).completion_tokens ?? 0,
                  totalTokens: (result.usage as any).total_tokens ?? 0,
                }
              : undefined,
            metadata: { modelId: result.model },
          };
          res.write('data: ' + JSON.stringify(fallbackChunk) + '\n\n');
        } catch (fallbackError: any) {
          // Log the actual error
          console.warn('[AgentOS Stream] Fallback chat request failed:', fallbackError.message || fallbackError);
          // Send error response with helpful message
          const errorChunk = {
            type: 'final_response',
            streamId: conversationId,
            gmiInstanceId: mode,
            personaId: mode,
            isFinal: true,
            timestamp: new Date().toISOString(),
            finalResponseText: `⚠️ AgentOS processing completed but no response was generated.\n\n**Possible causes:**\n- No LLM provider configured (check OPENAI_API_KEY or ANTHROPIC_API_KEY in backend .env)\n- Agency requests require workflow start endpoint (not yet wired - only first seat GMI responds)\n- Backend error: ${fallbackError.message || 'Unknown error'}\n\n**Next steps:**\n1. Check backend logs for errors\n2. Verify LLM provider keys are set\n3. For agency mode: use /workflows/start endpoint (not yet wired to this UI)`,
          } as any;
          res.write('data: ' + JSON.stringify(errorChunk) + '\n\n');
        }
      }

      res.write('event: done\ndata: {}\n\n');
      res.end();
    } catch (error: any) {
      res.write('event: error\ndata: ' + JSON.stringify({ message: error?.message ?? 'AgentOS error' }) + '\n\n');
      res.end();
    }
  });

  return router;
};

