// File: backend/api/agentosRoutes.ts
/**
 * @fileoverview Defines Express routes for core AgentOS interactions,
 * such as processing chat turns and handling tool results. These routes
 * leverage the main AgentOS service facade and are protected by authentication.
 *
 * @module backend/api/agentosRoutes
 */

import { Router, Response } from 'express';
import { IAgentOS } from './interfaces/IAgentOS';
import { IAuthService } from '../services/user_auth/IAuthService';
import { AuthenticatedRequest, authenticateToken } from '../middleware/authenticateTokenMiddleware';
import { AgentOSInput } from './types/AgentOSInput';
import { AgentOSResponseChunkType, AgentOSErrorChunk } from './types/AgentOSResponse';
import { GMIError, GMIErrorCode } from '../utils/errors';

/**
 * DTO for handling tool results.
 * @interface ToolResultDto
 * @property {string} toolCallId - The ID of the original tool call.
 * @property {string} toolName - The name of the tool.
 * @property {any} toolOutput - The output from the tool.
 * @property {boolean} isSuccess - Whether the tool execution was successful.
 * @property {string} [errorMessage] - Error message if not successful.
 */
interface ToolResultDto {
  toolCallId?: string;
  toolName?: string;
  toolOutput: any;
  isSuccess: boolean;
  errorMessage?: string;
}


/**
 * Creates and configures the Express router for core AgentOS interactions.
 *
 * @param {IAgentOS} agentOS - The main AgentOS service facade instance.
 * @param {IAuthService} authService - The authentication service instance for middleware.
 * @returns {Router} The configured Express router.
 */
export const createAgentOSRoutes = (agentOS: IAgentOS, authService: IAuthService): Router => {
  const router = Router();

  /**
   * @route POST /agentos/chat/turn
   * @description Processes a single turn in a chat interaction with an AgentOS GMI.
   * Streams back AgentOSResponse chunks. Requires authentication.
   * @access Protected
   * @body {AgentOSInput} input - The comprehensive input for the agent turn.
   * @returns {ReadableStream<AgentOSResponse>} A stream of response chunks.
   * @throws {400} If input validation fails.
   * @throws {401/403} If authentication/authorization fails.
   * @throws {500/503} For server-side errors or if AgentOS service is unavailable.
   */
  router.post('/chat/turn', authenticateToken(authService), async (req: AuthenticatedRequest, res: Response) => {
    const userInput = req.body as AgentOSInput;
    const authenticatedUser = req.user!; // Middleware ensures user is present

    // Validate input structure (basic check, use Zod/Joi for thorough validation in P2)
    if (!userInput || typeof userInput !== 'object') {
      return res.status(400).json({ error: { code: GMIErrorCode.VALIDATION_ERROR, message: 'Invalid request body: AgentOSInput expected.' }});
    }

    // Ensure critical fields from authenticated user are used, overriding any potentially spoofed ones in body.
    const turnInput: AgentOSInput = {
      ...userInput,
      userId: authenticatedUser.userId, // Enforce userId from authenticated token
      sessionId: userInput.sessionId || authenticatedUser.sessionId, // Use provided sessionId or fallback to token's sessionId
    };
    
    // Add a try-catch around the streaming setup to handle immediate errors
    try {
        console.log(`AgentOSRoutes: /chat/turn initiated by user ${turnInput.userId}, session ${turnInput.sessionId}`);
        res.setHeader('Content-Type', 'application/x-ndjson'); // Or 'text/event-stream'
        res.setHeader('Transfer-Encoding', 'chunked');
        res.flushHeaders(); // Send headers immediately for streaming

        for await (const chunk of agentOS.processRequest(turnInput)) {
            res.write(JSON.stringify(chunk) + '\n');
             // Add a small delay or flush mechanism if needed for specific client behaviors,
             // but typically Node.js handles buffering for res.write.
             // await new Promise(resolve => setTimeout(resolve, 10)); // Optional: to simulate slower streams or help some clients
        }
    } catch (error: any) {
        console.error(`AgentOSRoutes: Error initiating stream for /chat/turn for user ${turnInput.userId}:`, error);
        // If headers not sent, send error status. If already sent, log and end response.
        if (!res.headersSent) {
            const errCode = error instanceof GMIError ? error.code : GMIErrorCode.INTERNAL_SERVER_ERROR;
            res.status(error.statusCode || 500).json({ error: { code: errCode, message: error.message, details: error.details } });
        } else {
            // Attempt to send an error chunk if stream started
            const errorChunk: AgentOSErrorChunk = {
                type: AgentOSResponseChunkType.ERROR,
                streamId: turnInput.sessionId || 'unknown-stream',
                gmiInstanceId: 'unknown',
                personaId: turnInput.selectedPersonaId || 'unknown',
                isFinal: true,
                timestamp: new Date().toISOString(),
                code: GMIErrorCode.STREAM_ERROR,
                message: `Stream interrupted by server error: ${error.message}`,
            };
            res.write(JSON.stringify(errorChunk) + '\n');
        }
    } finally {
        if (!res.writableEnded) {
            res.end();
        }
    }
  });

  /**
   * @route POST /agentos/chat/tool_result
   * @description Submits the result of a tool execution back to AgentOS for continued processing.
   * Streams back AgentOSResponse chunks. Requires authentication.
   * @access Protected
   * @body {ToolResultDto & { streamId: string }} toolResultData - The tool result and the original stream ID.
   * @returns {ReadableStream<AgentOSResponse>} A stream of response chunks.
   * @throws {400} If input validation fails.
   * @throws {401/403} If authentication/authorization fails.
   * @throws {500/503} For server-side errors or if AgentOS service is unavailable.
   */
  router.post('/chat/tool_result', authenticateToken(authService), async (req: AuthenticatedRequest, res: Response) => {
    const { streamId, toolCallId, toolName, toolOutput, isSuccess, errorMessage } = req.body as ToolResultDto & { streamId?: string };
    // const authenticatedUser = req.user!; // User context for authorization if needed

    if (!streamId || !toolCallId || !toolName) {
      return res.status(400).json({ error: { code: GMIErrorCode.VALIDATION_ERROR, message: 'streamId, toolCallId, and toolName are required for tool results.' }});
    }
    if (typeof isSuccess !== 'boolean') {
        return res.status(400).json({ error: { code: GMIErrorCode.VALIDATION_ERROR, message: 'isSuccess (boolean) is required for tool results.' }});
    }

    try {
        console.log(`AgentOSRoutes: /chat/tool_result for stream ${streamId}, toolCallId ${toolCallId}`);
        res.setHeader('Content-Type', 'application/x-ndjson');
        res.setHeader('Transfer-Encoding', 'chunked');
        res.flushHeaders();

        for await (const chunk of agentOS.handleToolResult(streamId, toolCallId, toolName, toolOutput, isSuccess, errorMessage)) {
            res.write(JSON.stringify(chunk) + '\n');
        }
    } catch (error: any) {
        console.error(`AgentOSRoutes: Error initiating stream for /chat/tool_result for stream ${streamId}:`, error);
        if (!res.headersSent) {
            const errCode = error instanceof GMIError ? error.code : GMIErrorCode.INTERNAL_SERVER_ERROR;
            res.status(error.statusCode || 500).json({ error: { code: errCode, message: error.message, details: error.details } });
        } else {
            const errorChunk: AgentOSErrorChunk = {
                type: AgentOSResponseChunkType.ERROR,
                streamId: streamId,
                gmiInstanceId: 'unknown',
                personaId: 'unknown',
                isFinal: true,
                timestamp: new Date().toISOString(),
                code: GMIErrorCode.STREAM_ERROR,
                message: `Stream interrupted by server error processing tool result: ${error.message}`,
            };
            res.write(JSON.stringify(errorChunk) + '\n');
        }
    } finally {
         if (!res.writableEnded) {
            res.end();
        }
    }
  });

  return router;
};