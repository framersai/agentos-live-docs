// agentos/server/routes/chat.ts
import { Express, Request, Response, NextFunction } from 'express';
import { AgentOS } from '../../api/AgentOS';
import { AgentOSServerConfig } from '../config/ServerConfig';
import { AgentOSInput } from '../../api/types/AgentOSInput';
import { logger } from '../utils/logger';

export function setupChatRoutes(
  app: Express,
  basePath: string,
  agentOS: AgentOS,
  config: AgentOSServerConfig
): void {
  // Process message (streaming via Server-Sent Events)
  app.post(`${basePath}/chat/stream`, async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const input: AgentOSInput = {
        userId,
        sessionId: req.body.sessionId || `session_${Date.now()}`,
        textInput: req.body.textInput,
        visionInputs: req.body.visionInputs,
        audioInput: req.body.audioInput,
        selectedPersonaId: req.body.selectedPersonaId,
        userApiKeys: req.body.userApiKeys,
        conversationId: req.body.conversationId,
        options: req.body.options,
      };

      // Set up Server-Sent Events
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Cache-Control',
      });

      let streamEnded = false;
      const cleanup = () => {
        if (!streamEnded) {
          streamEnded = true;
          res.write('event: end\ndata: {}\n\n');
          res.end();
        }
      };

      req.on('close', cleanup);
      req.on('aborted', cleanup);

      try {
        for await (const chunk of agentOS.processRequest(input)) {
          if (streamEnded) break;
          
          res.write(`event: chunk\n`);
          res.write(`data: ${JSON.stringify(chunk)}\n\n`);
          
          if (chunk.isFinal) {
            cleanup();
            break;
          }
        }
      } catch (error) {
        if (!streamEnded) {
          res.write(`event: error\n`);
          res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
          cleanup();
        }
      }
    } catch (error) {
      logger.error('Error in chat stream:', error);
      next(error);
    }
  });

  // Process message (non-streaming)
  app.post(`${basePath}/chat/message`, async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const input: AgentOSInput = {
        userId,
        sessionId: req.body.sessionId || `session_${Date.now()}`,
        textInput: req.body.textInput,
        visionInputs: req.body.visionInputs,
        audioInput: req.body.audioInput,
        selectedPersonaId: req.body.selectedPersonaId,
        userApiKeys: req.body.userApiKeys,
        conversationId: req.body.conversationId,
        options: req.body.options,
      };

      const chunks = [];
      for await (const chunk of agentOS.processRequest(input)) {
        chunks.push(chunk);
        if (chunk.isFinal) break;
      }

      res.json({
        success: true,
        data: {
          chunks,
          finalResponse: chunks[chunks.length - 1],
        },
      });
    } catch (error) {
      logger.error('Error in chat message:', error);
      next(error);
    }
  });

  // Handle tool result
  app.post(`${basePath}/chat/tool-result`, async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        streamId,
        toolCallId,
        toolName,
        toolOutput,
        isSuccess,
        errorMessage,
      } = req.body;

      if (!streamId || !toolCallId || !toolName) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields: streamId, toolCallId, toolName',
        });
      }

      const chunks = [];
      for await (const chunk of agentOS.handleToolResult(
        streamId,
        toolCallId,
        toolName,
        toolOutput,
        isSuccess,
        errorMessage
      )) {
        chunks.push(chunk);
        if (chunk.isFinal) break;
      }

      res.json({
        success: true,
        data: {
          chunks,
          finalResponse: chunks[chunks.length - 1],
        },
      });
    } catch (error) {
      logger.error('Error handling tool result:', error);
      next(error);
    }
  });
}