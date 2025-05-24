// File: backend/api/agentOSRoutes.ts
/**
 * @fileoverview Defines the Express.js routes for interacting with the AgentOS service.
 * This module sets up endpoints for processing agent requests, handling tool results,
 * listing personas, and other core AgentOS functionalities. It acts as the primary
 * HTTP interface to the AgentOS system.
 *
 * @module backend/api/agentOSRoutes
 * @requires express
 * @requires ./AgentOS - The main AgentOS service implementation.
 * @requires ./interfaces/IAgentOS - The contract for the AgentOS service.
 * @requires ./types/AgentOSInput - Type definitions for agent inputs.
 * @requires ./types/AgentOSResponse - Type definitions for agent responses.
 * @requires ../utils/errors - For GMIError and error handling.
 */

import express, { Router, Request, Response, NextFunction } from 'express';
import { IAgentOS } from '../agentos/api/interfaces/IAgentOS' // Corrected: Path to interface
import { AgentOSInput, UserFeedbackPayload, ProcessingOptions } from '../agentos/api/types/AgentOSInput'; // Corrected: Path to types
import { AgentOSResponse, AgentOSResponseChunkType, AgentOSErrorChunk } from '../agentos/api/types/AgentOSResponse'; // Corrected: Path to types
import { GMIError, GMIErrorCode, createGMIErrorFromError } from '../utils/errors'; // Corrected: Path based on common structure

/**
 * Creates and configures the Express Router for AgentOS API endpoints.
 *
 * @param {IAgentOS} agentOSService - An initialized instance of the AgentOS service (implementing IAgentOS).
 * @returns {Router} An Express.js Router instance with AgentOS routes defined.
 * @throws {Error} If `agentOSService` is not provided.
 */
export function createAgentOSRoutes(agentOSService: IAgentOS): Router {
  if (!agentOSService) {
    throw new Error("AgentOS service instance is required to create agentOSRoutes.");
  }

  const router: Router = express.Router();

  /**
   * @route POST /api/agentos/process
   * @description Processes a user request or initiates an agent task.
   * Expects an AgentOSInput object in the request body.
   * Streams AgentOSResponse chunks back to the client.
   * Uses Server-Sent Events (SSE) for streaming.
   *
   * @param {Request<{}, {}, AgentOSInput>} req - Express request object. Body should conform to AgentOSInput.
   * @param {Response} res - Express response object, used for SSE streaming.
   * @param {NextFunction} next - Express next middleware function for error handling.
   * @returns {void} - Does not return directly, streams responses or calls next(error).
   */
  router.post('/process', async (req: Request<{}, {}, AgentOSInput>, res: Response, next: NextFunction): Promise<void> => {
    try {
      const input: AgentOSInput = req.body;

      // Basic input validation (more comprehensive validation should be in AgentOSInput or a validation layer)
      if (!input || !input.userId || !input.sessionId || (input.textInput === undefined && !input.visionInputs && !input.audioInput)) {
        const validationError = new GMIError(
          'Invalid input: userId, sessionId, and at least one input modality (text, vision, audio) are required.',
          GMIErrorCode.VALIDATION_ERROR,
          { providedInput: input },
          undefined,
          400
        );
        return next(validationError); // Pass to error handler
      }

      console.log(`[AgentOSRoutes] /process: Received request for user ${input.userId}, session ${input.sessionId}`);

      // Setup SSE headers
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      res.flushHeaders(); // Send headers immediately

      const streamIdForClientLog = input.sessionId || 'unknown-stream'; // For logging client-side

      // Heartbeat to keep connection alive if no data is sent for a while
      const heartbeatInterval = setInterval(() => {
        if (!res.writableEnded) {
            res.write(`event: heartbeat\ndata: ${new Date().toISOString()}\n\n`);
        } else {
            clearInterval(heartbeatInterval);
        }
      }, 25000); // Every 25 seconds

      res.on('close', () => {
        console.log(`[AgentOSRoutes] /process: Client disconnected for stream associated with session ${streamIdForClientLog}`);
        clearInterval(heartbeatInterval);
        // TODO: Implement stream cancellation/cleanup logic in AgentOS or Orchestrator if client disconnects.
        // For example: agentOSService.cancelStream(streamIdFromProcessRequest);
        res.end();
      });

      // Process the request and stream chunks
      const responseGenerator = agentOSService.processRequest(input);
      for await (const chunk of responseGenerator) {
        if (res.writableEnded) { // Check if client disconnected
            console.warn(`[AgentOSRoutes] /process: Attempted to write to a closed response stream for session ${streamIdForClientLog}. Terminating stream processing.`);
            // TODO: Ensure underlying GMI/Orchestrator stream is also cancelled/cleaned up.
            break;
        }
        res.write(`id: ${chunk.timestamp}\nevent: ${chunk.type}\ndata: ${JSON.stringify(chunk)}\n\n`);
      }
      
      if (!res.writableEnded) {
        res.write(`event: stream_end\ndata: {"message": "Stream finished."}\n\n`);
        res.end();
      }

    } catch (error: unknown) {
      console.error(`[AgentOSRoutes] /process: Error during request processing:`, error);
      // Ensure that the error is an instance of GMIError or wrapped into one
      const gmiError = createGMIErrorFromError(
        error instanceof Error ? error : new Error(String(error)),
        GMIErrorCode.INTERNAL_SERVER_ERROR,
        { route: '/process' },
        'Failed to process agent request.'
      );
      // If headers not sent, use standard error middleware. Otherwise, try to send an error event if stream open.
      if (!res.headersSent) {
        return next(gmiError);
      } else if (!res.writableEnded) {
        try {
            const errorChunk: AgentOSErrorChunk = {
                type: AgentOSResponseChunkType.ERROR,
                streamId: req.body?.sessionId || 'error-stream',
                gmiInstanceId: 'N/A',
                personaId: req.body?.selectedPersonaId || 'N/A',
                isFinal: true,
                timestamp: new Date().toISOString(),
                code: gmiError.code.toString(),
                message: gmiError.message,
                details: gmiError.details || { name: gmiError.name },
            };
            res.write(`event: ${AgentOSResponseChunkType.ERROR}\ndata: ${JSON.stringify(errorChunk)}\n\n`);
        } catch (sseError) {
            console.error(`[AgentOSRoutes] /process: Failed to send error event over SSE:`, sseError);
        } finally {
            if (!res.writableEnded) res.end();
        }
      }
    }
  });

  /**
   * @route POST /api/agentos/tool_result
   * @description Submits the result of a tool execution back to AgentOS for continued processing.
   * Expects streamId, toolCallId, toolName, toolOutput, isSuccess, and optionally errorMessage.
   * Streams AgentOSResponse chunks back.
   *
   * @param {Request} req - Express request object.
   * @param {Response} res - Express response object for SSE.
   * @param {NextFunction} next - Express next middleware function.
   * @returns {void}
   */
  router.post('/tool_result', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { streamId, toolCallId, toolName, toolOutput, isSuccess, errorMessage } = req.body;

      if (!streamId || !toolCallId || !toolName || typeof isSuccess !== 'boolean') {
        const validationError = new GMIError(
          'Invalid tool result input: streamId, toolCallId, toolName, and isSuccess are required.',
          GMIErrorCode.VALIDATION_ERROR,
          { receivedBody: req.body },
          undefined,
          400
        );
        return next(validationError);
      }
      console.log(`[AgentOSRoutes] /tool_result: Received result for stream ${streamId}, tool ${toolName}, call ${toolCallId}`);

      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      res.flushHeaders();

      const heartbeatInterval = setInterval(() => {
        if (!res.writableEnded) {
            res.write(`event: heartbeat\ndata: ${new Date().toISOString()}\n\n`);
        } else {
            clearInterval(heartbeatInterval);
        }
      }, 25000);

      res.on('close', () => {
        console.log(`[AgentOSRoutes] /tool_result: Client disconnected for stream ${streamId}`);
        clearInterval(heartbeatInterval);
        res.end();
      });

      const responseGenerator = agentOSService.handleToolResult(streamId, toolCallId, toolName, toolOutput, isSuccess, errorMessage);
      for await (const chunk of responseGenerator) {
         if (res.writableEnded) { 
            console.warn(`[AgentOSRoutes] /tool_result: Attempted to write to a closed response stream for ${streamId}.`);
            break;
        }
        res.write(`id: ${chunk.timestamp}\nevent: ${chunk.type}\ndata: ${JSON.stringify(chunk)}\n\n`);
      }

      if (!res.writableEnded) {
        res.write(`event: stream_end\ndata: {"message": "Tool result processing stream finished."}\n\n`);
        res.end();
      }

    } catch (error: unknown) {
      console.error(`[AgentOSRoutes] /tool_result: Error processing tool result:`, error);
      const gmiError = createGMIErrorFromError(
        error instanceof Error ? error : new Error(String(error)),
        GMIErrorCode.TOOL_ERROR,
        { route: '/tool_result', body: req.body },
        'Failed to process tool result.'
      );
       if (!res.headersSent) {
        return next(gmiError);
      } else if (!res.writableEnded) {
        try {
             const errorChunk: AgentOSErrorChunk = {
                type: AgentOSResponseChunkType.ERROR,
                streamId: req.body?.streamId || 'error-stream-tool_result',
                gmiInstanceId: 'N/A',
                personaId: 'N/A', // Persona ID might not be readily available here without more context
                isFinal: true,
                timestamp: new Date().toISOString(),
                code: gmiError.code.toString(),
                message: gmiError.message,
                details: gmiError.details || { name: gmiError.name },
            };
            res.write(`event: ${AgentOSResponseChunkType.ERROR}\ndata: ${JSON.stringify(errorChunk)}\n\n`);
        } catch (sseError) {
            console.error(`[AgentOSRoutes] /tool_result: Failed to send error event over SSE:`, sseError);
        } finally {
            if (!res.writableEnded) res.end();
        }
      }
    }
  });

  /**
   * @route GET /api/agentos/personas
   * @description Lists all available personas, potentially filtered by user context.
   * @param {Request} req - Express request object. Query param `userId` can be used for filtering.
   * @param {Response} res - Express response object.
   * @param {NextFunction} next - Express next middleware function.
   */
  router.get('/personas', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.query.userId as string | undefined; // Assuming userId might be passed for filtering
      const personas = await agentOSService.listAvailablePersonas(userId);
      res.json(personas);
    } catch (error: unknown) {
      console.error(`[AgentOSRoutes] /personas: Error listing personas:`, error);
      return next(createGMIErrorFromError(
        error instanceof Error ? error : new Error(String(error)),
        GMIErrorCode.INTERNAL_SERVER_ERROR,
        { route: '/personas' },
        'Failed to list available personas.'
      ));
    }
  });

  /**
   * @route GET /api/agentos/conversation/:conversationId
   * @description Retrieves the history for a specific conversation.
   * Requires `userId` as a query parameter for authorization.
   * @param {Request<{conversationId: string}, {}, {}, {userId: string}>} req - Express request. `conversationId` from params, `userId` from query.
   * @param {Response} res - Express response object.
   * @param {NextFunction} next - Express next middleware function.
   */
  router.get('/conversation/:conversationId', async (req: Request<{conversationId: string}, {}, {}, {userId?: string}>, res: Response, next: NextFunction) => {
    try {
      const { conversationId } = req.params;
      const userId = req.query.userId;

      if (!userId) {
        return next(new GMIError('User ID is required to fetch conversation history.', GMIErrorCode.VALIDATION_ERROR, { missingParam: 'userId' }, undefined, 400));
      }
      if (!conversationId) {
        return next(new GMIError('Conversation ID is required.', GMIErrorCode.VALIDATION_ERROR, { missingParam: 'conversationId' }, undefined, 400));
      }

      const history = await agentOSService.getConversationHistory(conversationId, userId);
      if (!history) {
        return next(new GMIError(`Conversation history not found for ID '${conversationId}' or access denied.`, GMIErrorCode.RESOURCE_NOT_FOUND, { conversationId, userId }, undefined, 404));
      }
      res.json(history.toJSON()); // Assuming ConversationContext has a toJSON method
    } catch (error: unknown) {
      console.error(`[AgentOSRoutes] /conversation/:conversationId : Error fetching history:`, error);
       return next(createGMIErrorFromError(
        error instanceof Error ? error : new Error(String(error)),
        GMIErrorCode.INTERNAL_SERVER_ERROR,
        { route: `/conversation/${req.params.conversationId}` },
        'Failed to retrieve conversation history.'
      ));
    }
  });

  /**
   * @route POST /api/agentos/feedback
   * @description Submits user feedback for a specific interaction.
   * Expects `userId`, `sessionId`, `personaId`, and `feedbackPayload` in the request body.
   * @param {Request<{}, {}, {userId: string, sessionId: string, personaId: string, feedbackPayload: UserFeedbackPayload}>} req - Express request.
   * @param {Response} res - Express response object.
   * @param {NextFunction} next - Express next middleware function.
   */
  router.post('/feedback', async (req: Request<{}, {}, {userId: string, sessionId: string, personaId: string, feedbackPayload: UserFeedbackPayload}>, res: Response, next: NextFunction) => {
    try {
      const { userId, sessionId, personaId, feedbackPayload } = req.body;
      if (!userId || !sessionId || !personaId || !feedbackPayload) {
         return next(new GMIError(
          'Invalid feedback submission: userId, sessionId, personaId, and feedbackPayload are required.',
          GMIErrorCode.VALIDATION_ERROR,
          { receivedBody: req.body },
          undefined,
          400
        ));
      }
      await agentOSService.receiveFeedback(userId, sessionId, personaId, feedbackPayload);
      res.status(202).json({ message: 'Feedback received successfully and queued for processing.' });
    } catch (error: unknown) {
      console.error(`[AgentOSRoutes] /feedback: Error processing feedback:`, error);
      return next(createGMIErrorFromError(
        error instanceof Error ? error : new Error(String(error)),
        GMIErrorCode.GMI_FEEDBACK_ERROR,
        { route: '/feedback', body: req.body },
        'Failed to process user feedback.'
      ));
    }
  });

  return router;
}