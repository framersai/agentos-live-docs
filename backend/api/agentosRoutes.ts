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
import { IAgentOS } from '../agentos/api/interfaces/IAgentOS';
import { AgentOSInput, UserFeedbackPayload } from '../agentos/api/types/AgentOSInput'; // ProcessingOptions removed as not used directly here
import { AgentOSResponse, AgentOSResponseChunkType, AgentOSErrorChunk } from '../agentos/api/types/AgentOSResponse';
import { GMIError, GMIErrorCode, createGMIErrorFromError } from '../utils/errors'; // Path relative to api/

/**
 * Creates and configures the Express Router for AgentOS API endpoints.
 * It sets up routes for processing requests, handling tool results, listing personas,
 * retrieving conversation history, and submitting user feedback.
 * All streaming endpoints use Server-Sent Events (SSE) for real-time communication.
 *
 * @function createAgentOSRoutes
 * @param {IAgentOS} agentOSService - An initialized instance of the AgentOS service, conforming to the `IAgentOS` interface.
 * This service instance will handle the core logic for all API requests.
 * @returns {Router} An Express.js Router instance with all AgentOS API routes defined and configured.
 * @throws {Error} If the `agentOSService` instance is not provided, as it is essential for route functionality.
 */
export function createAgentOSRoutes(agentOSService: IAgentOS): Router {
  if (!agentOSService) {
    // This is a critical setup error, indicating a problem with how the application is wired.
    throw new Error("AgentOS service instance (IAgentOS) is required to create agentOSRoutes.");
  }

  const router: Router = express.Router();

  /**
   * @route POST /api/agentos/process
   * @description Endpoint for processing a user request or initiating an agent task.
   * The request body must conform to the `AgentOSInput` interface.
   * Responses are streamed back to the client using Server-Sent Events (SSE), allowing for
   * real-time updates as the agent processes the input and generates output.
   *
   * @param {Request<{}, {}, AgentOSInput>} req - The Express request object. The request body is expected to be `AgentOSInput`.
   * @param {Response} res - The Express response object, which will be configured for SSE streaming.
   * @param {NextFunction} next - The Express next middleware function, used for passing errors to the centralized error handler.
   * @returns {Promise<void>} Does not return a value directly but manages the streaming response or calls `next(error)`.
   */
  router.post('/process', async (req: Request<{}, {}, AgentOSInput>, res: Response, next: NextFunction): Promise<void> => {
    try {
      const input: AgentOSInput = req.body;

      if (!input || !input.userId || !input.sessionId || (input.textInput === undefined && !input.visionInputs && !input.audioInput)) {
        const validationError = new GMIError(
          'Invalid input for /process: userId, sessionId, and at least one input modality (textInput, visionInputs, or audioInput) are required.',
          GMIErrorCode.VALIDATION_ERROR,
          { providedInput: input, missingFields: "userId, sessionId, or primary input" },
          undefined,
          400 // Bad Request
        );
        // Ensure next is called to pass control to an error handling middleware
        return next(validationError);
      }

      console.log(`[AgentOSRoutes][${new Date().toISOString()}] POST /process: Received request for User: ${input.userId}, Session: ${input.sessionId}, Persona: ${input.selectedPersonaId || 'default'}`);

      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('X-Accel-Buffering', 'no'); // Useful for Nginx to disable buffering for SSE
      res.setHeader('Connection', 'keep-alive');
      res.flushHeaders(); // Send headers immediately to establish the SSE connection

      const streamIdForClientLog = input.sessionId || input.conversationId || 'unknown-process-stream';

      const heartbeatInterval = setInterval(() => {
        if (!res.writableEnded) {
            try {
                res.write(`event: heartbeat\ndata: ${new Date().toISOString()}\n\n`);
            } catch (e: any) {
                console.error(`[AgentOSRoutes][${new Date().toISOString()}] POST /process: Error writing heartbeat for stream ${streamIdForClientLog}: ${e.message}`);
                clearInterval(heartbeatInterval);
                if(!res.writableEnded) res.end();
            }
        } else {
            clearInterval(heartbeatInterval);
        }
      }, 25000); // Send a heartbeat every 25 seconds

      res.on('close', () => {
        console.log(`[AgentOSRoutes][${new Date().toISOString()}] POST /process: Client disconnected for stream associated with session ${streamIdForClientLog}. Cleaning up heartbeat.`);
        clearInterval(heartbeatInterval);
        // NOTE: Consider notifying agentOSService to cancel/cleanup the underlying GMI stream if the client disconnects.
        // This requires agentOSService to expose such a method and the orchestrator to track active streams by client connection.
        // Example: if (agentOSService.cancelStream) agentOSService.cancelStream(streamIdFromProcessRequest);
        if(!res.writableEnded) res.end(); // Ensure response is ended if not already
      });

      const responseGenerator = agentOSService.processRequest(input);
      for await (const chunk of responseGenerator) {
        if (res.writableEnded) {
            console.warn(`[AgentOSRoutes][${new Date().toISOString()}] POST /process: Attempted to write to a closed response stream for session ${streamIdForClientLog}. Terminating stream processing for this request.`);
            break; 
        }
        try {
            res.write(`id: ${chunk.timestamp}\nevent: ${chunk.type}\ndata: ${JSON.stringify(chunk)}\n\n`);
        } catch (e: any) {
            console.error(`[AgentOSRoutes][${new Date().toISOString()}] POST /process: Error writing chunk to stream ${streamIdForClientLog}: ${e.message}`, chunk);
            clearInterval(heartbeatInterval); // Stop heartbeat on write error
            if(!res.writableEnded) res.end();
            break;
        }
      }
      
      if (!res.writableEnded) {
        try {
            res.write(`event: stream_end\ndata: ${JSON.stringify({ message: "AgentOS stream processing finished."})}\n\n`);
        } catch (e: any) {
            console.error(`[AgentOSRoutes][${new Date().toISOString()}] POST /process: Error writing stream_end event for ${streamIdForClientLog}: ${e.message}`);
        } finally {
            if (!res.writableEnded) res.end();
        }
      }
    } catch (error: unknown) {
      const gmiError = createGMIErrorFromError(
        error instanceof Error ? error : new Error(String(error)),
        GMIErrorCode.INTERNAL_SERVER_ERROR,
        { route: '/api/agentos/process', input: req.body },
        'An unexpected error occurred while processing the agent request.'
      );
      console.error(`[AgentOSRoutes][${new Date().toISOString()}] POST /process: Unhandled error:`, gmiError.message, gmiError.details);
      
      if (!res.headersSent) {
        return next(gmiError); // Pass to Express error handler
      } else if (!res.writableEnded) {
        // Attempt to send an error event over SSE if connection is still open
        try {
            const errorChunkForClient: AgentOSErrorChunk = {
                type: AgentOSResponseChunkType.ERROR,
                streamId: req.body?.sessionId || `error-stream-${Date.now()}`,
                gmiInstanceId: (gmiError.details as any)?.gmiInstanceId || 'N/A_Error',
                personaId: (gmiError.details as any)?.personaId || req.body?.selectedPersonaId || 'N/A_Error',
                isFinal: true,
                timestamp: new Date().toISOString(),
                code: gmiError.code.toString(),
                message: gmiError.message, // Send the original message for more detail if appropriate
                details: gmiError.details || { name: gmiError.name },
            };
            res.write(`event: ${AgentOSResponseChunkType.ERROR}\ndata: ${JSON.stringify(errorChunkForClient)}\n\n`);
        } catch (sseError: any) {
            console.error(`[AgentOSRoutes][${new Date().toISOString()}] POST /process: Failed to send error event over SSE after headers sent: ${sseError.message}`);
        } finally {
            if (!res.writableEnded) res.end();
        }
      }
    }
  });

  /**
   * @route POST /api/agentos/tool_result
   * @description Endpoint for submitting the result of a tool execution back to AgentOS.
   * This allows the agent to continue processing based on the tool's output.
   * The request body should contain `streamId`, `toolCallId`, `toolName`, `toolOutput`, `isSuccess`, and optionally `errorMessage`.
   * Responses are streamed back using SSE.
   *
   * @param {Request} req - Express request object.
   * @param {Response} res - Express response object, configured for SSE streaming.
   * @param {NextFunction} next - Express next middleware function for error handling.
   * @returns {Promise<void>}
   */
  router.post('/tool_result', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { streamId, toolCallId, toolName, toolOutput, isSuccess, errorMessage } = req.body;
    try {
      if (typeof streamId !== 'string' || typeof toolCallId !== 'string' || typeof toolName !== 'string' || typeof isSuccess !== 'boolean') {
        const validationError = new GMIError(
          'Invalid tool result input: streamId, toolCallId, toolName, and isSuccess (boolean) are required fields.',
          GMIErrorCode.VALIDATION_ERROR,
          { receivedBody: req.body },
          undefined, 400
        );
        return next(validationError);
      }
      console.log(`[AgentOSRoutes][${new Date().toISOString()}] POST /tool_result: Received result for Stream: ${streamId}, Tool: ${toolName}, CallID: ${toolCallId}, Success: ${isSuccess}`);

      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('X-Accel-Buffering', 'no');
      res.setHeader('Connection', 'keep-alive');
      res.flushHeaders();

      const heartbeatInterval = setInterval(() => {
        if (!res.writableEnded) {
            try {
                 res.write(`event: heartbeat\ndata: ${new Date().toISOString()}\n\n`);
            } catch (e: any) {
                console.error(`[AgentOSRoutes][${new Date().toISOString()}] POST /tool_result: Error writing heartbeat for stream ${streamId}: ${e.message}`);
                clearInterval(heartbeatInterval);
                if(!res.writableEnded) res.end();
            }
        } else {
            clearInterval(heartbeatInterval);
        }
      }, 25000);

      res.on('close', () => {
        console.log(`[AgentOSRoutes][${new Date().toISOString()}] POST /tool_result: Client disconnected for stream ${streamId}. Cleaning up heartbeat.`);
        clearInterval(heartbeatInterval);
        if(!res.writableEnded) res.end();
      });

      const responseGenerator = agentOSService.handleToolResult(streamId, toolCallId, toolName, toolOutput, isSuccess, errorMessage);
      for await (const chunk of responseGenerator) {
         if (res.writableEnded) { 
            console.warn(`[AgentOSRoutes][${new Date().toISOString()}] POST /tool_result: Attempted to write to a closed response stream for ${streamId}. Terminating response generation for this request.`);
            break;
        }
        try {
            res.write(`id: ${chunk.timestamp}\nevent: ${chunk.type}\ndata: ${JSON.stringify(chunk)}\n\n`);
        } catch (e: any) {
            console.error(`[AgentOSRoutes][${new Date().toISOString()}] POST /tool_result: Error writing chunk to stream ${streamId}: ${e.message}`, chunk);
            clearInterval(heartbeatInterval);
            if(!res.writableEnded) res.end();
            break;
        }
      }

      if (!res.writableEnded) {
        try {
            res.write(`event: stream_end\ndata: ${JSON.stringify({ message: "AgentOS tool result processing stream finished."})}\n\n`);
        } catch (e: any) {
            console.error(`[AgentOSRoutes][${new Date().toISOString()}] POST /tool_result: Error writing stream_end event for ${streamId}: ${e.message}`);
        } finally {
           if (!res.writableEnded) res.end();
        }
      }

    } catch (error: unknown) {
      const gmiError = createGMIErrorFromError(
        error instanceof Error ? error : new Error(String(error)),
        GMIErrorCode.TOOL_ERROR, // More specific than INTERNAL_SERVER_ERROR if error is from tool result handling logic
        { route: '/api/agentos/tool_result', body: req.body },
        'Failed to process tool result.'
      );
      console.error(`[AgentOSRoutes][${new Date().toISOString()}] POST /tool_result: Unhandled error:`, gmiError.message, gmiError.details);
      
       if (!res.headersSent) {
        return next(gmiError);
      } else if (!res.writableEnded){
        try {
             const errorChunkForClient: AgentOSErrorChunk = {
                type: AgentOSResponseChunkType.ERROR,
                streamId: streamId || `error-stream-tool_result-${Date.now()}`,
                gmiInstanceId: (gmiError.details as any)?.gmiInstanceId || 'N/A_Error',
                personaId: (gmiError.details as any)?.personaId || 'N/A_Error',
                isFinal: true,
                timestamp: new Date().toISOString(),
                code: gmiError.code.toString(),
                message: gmiError.message,
                details: gmiError.details || { name: gmiError.name },
            };
            res.write(`event: ${AgentOSResponseChunkType.ERROR}\ndata: ${JSON.stringify(errorChunkForClient)}\n\n`);
        } catch (sseError: any) {
            console.error(`[AgentOSRoutes][${new Date().toISOString()}] POST /tool_result: Failed to send error event over SSE after headers sent: ${sseError.message}`);
        } finally {
            if (!res.writableEnded) res.end();
        }
      }
    }
  });

  /**
   * @route GET /api/agentos/personas
   * @description Retrieves a list of available persona definitions.
   * This can be used by client applications to allow users to select an agent persona.
   * Optionally, a `userId` can be provided as a query parameter to filter personas
   * based on user-specific access rights or subscription tiers.
   *
   * @param {Request} req - Express request object. Supports `userId` as a query parameter.
   * @param {Response} res - Express response object.
   * @param {NextFunction} next - Express next middleware function for error handling.
   * @returns {Promise<void>} Sends a JSON array of partial persona definitions or calls `next(error)`.
   */
  router.get('/personas', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.query.userId as string | undefined;
      if (userId && typeof userId !== 'string') {
        return next(new GMIError('Invalid userId parameter: must be a string.', GMIErrorCode.VALIDATION_ERROR, { userId }, undefined, 400));
      }
      const personas = await agentOSService.listAvailablePersonas(userId);
      res.json(personas);
    } catch (error: unknown) {
       const gmiError = createGMIErrorFromError(
        error instanceof Error ? error : new Error(String(error)),
        GMIErrorCode.INTERNAL_SERVER_ERROR, // Could be more specific if agentOSService throws specific GMIError
        { route: '/api/agentos/personas', userId: req.query.userId },
        'Failed to retrieve the list of available personas.'
      );
      console.error(`[AgentOSRoutes][${new Date().toISOString()}] GET /personas: Error:`, gmiError.message, gmiError.details);
      return next(gmiError);
    }
  });

  /**
   * @route GET /api/agentos/conversation/:conversationId
   * @description Retrieves the history for a specific conversation, identified by `conversationId`.
   * A `userId` query parameter is required for authorization to ensure users can only access
   * conversations they are permitted to view.
   *
   * @param {Request<{conversationId: string}, {}, {}, {userId?: string}>} req - Express request object.
   * `conversationId` is a URL parameter. `userId` is an optional query parameter (but functionally required by the handler).
   * @param {Response} res - Express response object.
   * @param {NextFunction} next - Express next middleware function for error handling.
   * @returns {Promise<void>} Sends a JSON representation of the conversation history or calls `next(error)`.
   */
  router.get('/conversation/:conversationId', async (req: Request<{conversationId: string}, {}, {}, {userId?: string}>, res: Response, next: NextFunction): Promise<void> => {
    const { conversationId } = req.params;
    const userId = req.query.userId;

    try {
      if (!userId || typeof userId !== 'string') {
        return next(new GMIError('User ID (userId) query parameter is required and must be a string to fetch conversation history.', GMIErrorCode.VALIDATION_ERROR, { missingParam: 'userId', conversationId }, undefined, 400));
      }
      if (!conversationId) { // Should be caught by route definition, but good practice
        return next(new GMIError('Conversation ID path parameter is required.', GMIErrorCode.VALIDATION_ERROR, { missingParam: 'conversationId' }, undefined, 400));
      }

      const historyContext = await agentOSService.getConversationHistory(conversationId, userId);
      if (!historyContext) {
        // User might not have access, or conversation doesn't exist.
        return next(new GMIError(`Conversation history not found for ID '${conversationId}' or access denied for user '${userId}'.`, GMIErrorCode.RESOURCE_NOT_FOUND, { conversationId, userIdAttempted: userId }, undefined, 404));
      }
      res.json(historyContext.toJSON()); // Assuming ConversationContext has a toJSON method for serialization
    } catch (error: unknown) {
      const gmiError = createGMIErrorFromError(
        error instanceof Error ? error : new Error(String(error)),
        GMIErrorCode.INTERNAL_SERVER_ERROR, // Could be more specific if agentOSService throws specific GMIError
        { route: `/api/agentos/conversation/${conversationId}`, userId },
        'Failed to retrieve conversation history.'
      );
      console.error(`[AgentOSRoutes][${new Date().toISOString()}] GET /conversation/${conversationId}: Error:`, gmiError.message, gmiError.details);
      return next(gmiError);
    }
  });

  /**
   * @route POST /api/agentos/feedback
   * @description Allows users to submit feedback on an agent's performance or a specific interaction.
   * The request body must include `userId`, `sessionId`, `personaId`, and a `feedbackPayload` object.
   *
   * @param {Request<{}, {}, {userId: string, sessionId: string, personaId: string, feedbackPayload: UserFeedbackPayload}>} req - Express request.
   * @param {Response} res - Express response object.
   * @param {NextFunction} next - Express next middleware function for error handling.
   * @returns {Promise<void>} Sends a 202 Accepted response or calls `next(error)`.
   */
  router.post('/feedback', async (req: Request<{}, {}, {userId: string, sessionId: string, personaId: string, feedbackPayload: UserFeedbackPayload}>, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { userId, sessionId, personaId, feedbackPayload } = req.body;
      if (!userId || !sessionId || !personaId || !feedbackPayload || typeof feedbackPayload !== 'object') {
         return next(new GMIError(
          'Invalid feedback submission: userId, sessionId, personaId, and a valid feedbackPayload object are required.',
          GMIErrorCode.VALIDATION_ERROR,
          { receivedBody: req.body },
          undefined, 400
        ));
      }
      await agentOSService.receiveFeedback(userId, sessionId, personaId, feedbackPayload);
      res.status(202).json({ message: 'Feedback received successfully and has been queued for processing.' });
    } catch (error: unknown) {
      const gmiError = createGMIErrorFromError(
        error instanceof Error ? error : new Error(String(error)),
        GMIErrorCode.GMI_FEEDBACK_ERROR, // Specific error code for feedback issues
        { route: '/api/agentos/feedback', bodyPreview: { userId: req.body.userId, sessionId: req.body.sessionId, personaId: req.body.personaId } },
        'Failed to process user feedback submission.'
      );
      console.error(`[AgentOSRoutes][${new Date().toISOString()}] POST /feedback: Error:`, gmiError.message, gmiError.details);
      return next(gmiError);
    }
  });

  return router;
}