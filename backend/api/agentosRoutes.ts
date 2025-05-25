// File: backend/api/agentosRoutes.ts
/**
 * @fileoverview Comprehensive AgentOS API routes implementation for the Voice Chat Assistant.
 * This module provides the complete HTTP interface to the AgentOS system, including
 * real-time streaming chat interactions, tool result handling, persona management,
 * conversation history access, user feedback collection, and system status checks.
 *
 * Key Features:
 * - Server-Sent Events (SSE) streaming for real-time AI interactions.
 * - JWT authentication integration with comprehensive authorization.
 * - Robust error handling with standardized error responses.
 * - Tool execution result processing for extended AI capabilities.
 * - Persona management for different AI assistant personalities.
 * - Conversation history persistence and retrieval.
 * - User feedback collection for continuous improvement.
 * - Comprehensive request validation and security measures.
 * - Rate limiting to prevent abuse.
 * - Detailed logging for monitoring and debugging.
 *
 * @module backend/api/agentosRoutes
 * @requires express
 * @requires ../agentos/api/interfaces/IAgentOS
 * @requires ../services/user_auth/IAuthService
 * @requires ../agentos/api/types/AgentOSInput
 * @requires ../agentos/api/types/AgentOSResponse
 * @requires ../middleware/jwtAuthMiddleware
 * @requires ../utils/errors
 * @author Voice Chat Assistant Team
 * @version 1.0.1
 */

import express, { Router, Request, Response, NextFunction } from 'express';
import { body, query, param, validationResult, ValidationChain } from 'express-validator';
import rateLimit from 'express-rate-limit';
import { IAgentOS } from '../agentos/api/interfaces/IAgentOS';
import { IAuthService } from '../services/user_auth/IAuthService';
import { AgentOSInput, UserFeedbackPayload, ProcessingOptions, VisionInputData, AudioInputData } from '../agentos/api/types/AgentOSInput';
import { AgentOSResponseChunkType, AgentOSErrorChunk } from '../agentos/api/types/AgentOSResponse';
import { GMIError, GMIErrorCode, createGMIErrorFromError } from '../utils/errors';
import { createJwtAuthMiddleware, AuthenticatedRequest } from '../middleware/jwtAuthMiddleware';
import { IPersonaDefinition } from '../agentos/cognitive_substrate/personas/IPersonaDefinition';
import { ConversationContext } from '../agentos/core/conversation/ConversationContext';

/**
 * @interface AgentOSApiErrorResponse
 * @description Interface for standardized API error responses used throughout AgentOS endpoints.
 * Ensures consistent error structure and helps with client-side error handling.
 */
interface AgentOSApiErrorResponse {
  error: {
    code: string; // GMIErrorCode or other specific codes
    message: string;
    details?: Record<string, any>;
    timestamp: string;
    requestId?: string;
  };
}

/**
 * @interface AgentOSSuccessResponse
 * @description Interface for successful AgentOS API responses.
 * Provides consistent structure for successful operations across all endpoints.
 * @template T - The type of data included in the response
 */
interface AgentOSSuccessResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  timestamp: string;
  requestId?: string;
}

/**
 * Validation middleware for processing express-validator results in AgentOS routes.
 * Returns standardized error responses for invalid input data.
 *
 * @function handleAgentOSValidationErrors
 * @param {Request} req - Express request object containing validation results
 * @param {Response} res - Express response object for sending error responses
 * @param {NextFunction} next - Express next function to continue middleware chain
 * @returns {void | Response} Either continues to next middleware or returns validation error
 */
const handleAgentOSValidationErrors = (req: Request, res: Response, next: NextFunction): void | Response => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const validationErrors = errors.array().reduce((acc: Record<string, string>, error: any) => {
      // Use 'path' for express-validator v6+, 'param' for older versions if needed
      const field = error.path || error.param || 'unknown_field';
      acc[field] = error.msg;
      return acc;
    }, {});

    const errorResponse: AgentOSApiErrorResponse = {
      error: {
        code: GMIErrorCode.VALIDATION_ERROR, // Standardized error code
        message: 'Request validation failed. Please check your input data.',
        details: { validationErrors, providedInput: { body: req.body, query: req.query, params: req.params } },
        timestamp: new Date().toISOString(),
        requestId: req.headers['x-request-id'] as string || `val-${Date.now()}`,
      },
    };
    return res.status(400).json(errorResponse);
  }
  next();
};

/**
 * Rate limiting configurations for AgentOS endpoints.
 * Designed to prevent abuse while allowing legitimate AI interaction patterns.
 *
 * @namespace agentOSRateLimits
 */
const agentOSRateLimits = {
  /**
   * Strict rate limiting for resource-intensive operations like chat processing.
   */
  chatProcessing: rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 30, // Max 30 requests per minute per user/IP
    message: {
      error: {
        code: GMIErrorCode.RATE_LIMIT_EXCEEDED,
        message: 'Chat processing rate limit exceeded. Please wait a moment before sending more messages.',
        details: { limit: 30, window: '1 minute' },
        timestamp: new Date().toISOString(),
      },
    } as AgentOSApiErrorResponse,
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    keyGenerator: (req: Request) => (req as AuthenticatedRequest).user?.userId || req.ip,
    handler: (req, res, _next, options) => {
        // Log the rate limit event
        console.warn(`Rate limit exceeded for chat processing: User/IP ${(req as AuthenticatedRequest).user?.userId || req.ip}`);
        const errorResponse = options.message as AgentOSApiErrorResponse;
        errorResponse.error.requestId = req.headers['x-request-id'] as string || `rl-${Date.now()}`;
        errorResponse.error.timestamp = new Date().toISOString(); // Ensure fresh timestamp
        res.status(options.statusCode).json(errorResponse);
    }
  }),

  /**
   * Moderate rate limiting for general AgentOS operations.
   */
  general: rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 100, // Max 100 requests per 5 minutes per user/IP
    message: {
      error: {
        code: GMIErrorCode.RATE_LIMIT_EXCEEDED,
        message: 'Too many requests to AgentOS. Please slow down and try again shortly.',
        details: { limit: 100, window: '5 minutes' },
        timestamp: new Date().toISOString(),
      },
    } as AgentOSApiErrorResponse,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req: Request) => (req as AuthenticatedRequest).user?.userId || req.ip,
    handler: (req, res, _next, options) => {
        console.warn(`Rate limit exceeded for general operations: User/IP ${(req as AuthenticatedRequest).user?.userId || req.ip}`);
        const errorResponse = options.message as AgentOSApiErrorResponse;
        errorResponse.error.requestId = req.headers['x-request-id'] as string || `rl-${Date.now()}`;
        errorResponse.error.timestamp = new Date().toISOString();
        res.status(options.statusCode).json(errorResponse);
    }
  }),
};

/**
 * Validation rules for AgentOS chat processing requests (`/process`).
 * Ensures core data for interaction is present and reasonably formatted.
 *
 * @constant {ValidationChain[]} chatProcessValidation
 */
const chatProcessValidation: ValidationChain[] = [
  // textInput is optional if visionInputs or audioInput is present
  body('textInput')
    .optional({ nullable: true }) // Allow null
    .isString().withMessage('Text input, if provided, must be a string.')
    .isLength({ min: 0, max: 20000 }).withMessage('Text input must be between 0 and 20,000 characters.') // Allow empty string if other inputs present
    .trim(),

  body('sessionId')
    .optional()
    .isString().withMessage('Session ID, if provided, must be a string.')
    .isLength({ min: 1, max: 128 }).withMessage('Session ID must be between 1 and 128 characters.'),

  body('selectedPersonaId')
    .optional()
    .isString().withMessage('Persona ID, if provided, must be a string.')
    .isLength({ min: 1, max: 100 }).withMessage('Persona ID must be between 1 and 100 characters.'),

  body('conversationId')
    .optional()
    .isString().withMessage('Conversation ID, if provided, must be a string.')
    .isUUID().withMessage('Conversation ID must be a valid UUID v4.'),

  body('settings')
    .optional()
    .isObject().withMessage('Settings, if provided, must be an object.'),
  // Further validation for specific settings fields can be added here, e.g., settings.temperature
  body('settings.temperature')
    .optional()
    .isFloat({min: 0, max: 2.0}).withMessage('Temperature, if set, must be a float between 0 and 2.0.'),
  body('settings.maxTokens')
    .optional()
    .isInt({min: 1, max: 8192}).withMessage('Max tokens, if set, must be an integer between 1 and 8192.'),


  body('visionInputs')
    .optional()
    .isArray({ min:0, max: 5 }).withMessage('Vision inputs, if provided, must be an array with 0 to 5 items.'),
  body('visionInputs.*.type') // Validate each item in the array
    .if(body('visionInputs').exists({checkNull: false})) // only run if visionInputs array exists and is not null
    .isIn(['image_url', 'base64']).withMessage('Each vision input type must be "image_url" or "base64".'),
  body('visionInputs.*.data')
    .if(body('visionInputs').exists({checkNull: false}))
    .isString().withMessage('Each vision input data must be a string.')
    .isLength({ min: 10, max: 10 * 1024 * 1024 }) // Max 10MB for base64 or URL length
    .withMessage('Vision input data string is too short or too long (max 10MB).'),

  body('audioInput')
    .optional()
    .isObject().withMessage('Audio input, if provided, must be an object.'),
  body('audioInput.type')
    .if(body('audioInput').exists({checkNull: false}))
    .isIn(['audio_url', 'base64', 'transcription']).withMessage('Audio input type must be "audio_url", "base64", or "transcription".'),
  body('audioInput.data')
    .if(body('audioInput').exists({checkNull: false}))
    .isString().withMessage('Audio input data must be a string.')
    .isLength({ min: 1, max: 25 * 1024 * 1024 }) // Max 25MB for audio data
    .withMessage('Audio input data string is too short or too long (max 25MB).'),


  // Custom validation to ensure at least one form of primary input is provided
  body().custom((value, { req }) => {
    const { textInput, visionInputs, audioInput } = req.body as AgentOSInput;
    if (
        (textInput === null || textInput === undefined || textInput.trim() === "") &&
        (!visionInputs || visionInputs.length === 0) &&
        (!audioInput || !audioInput.data)
    ) {
      throw new Error('At least one input (textInput, non-empty visionInputs, or audioInput with data) must be provided.');
    }
    return true;
  }),
];

/**
 * Validation rules for tool result submission (`/tool_result`).
 *
 * @constant {ValidationChain[]} toolResultValidation
 */
const toolResultValidation: ValidationChain[] = [
  body('streamId')
    .notEmpty().withMessage('Stream ID is required.')
    .isString().withMessage('Stream ID must be a string.')
    .isLength({ min: 1, max: 128 }).withMessage('Stream ID must be between 1 and 128 characters.'),

  body('toolCallId')
    .notEmpty().withMessage('Tool call ID is required.')
    .isString().withMessage('Tool call ID must be a string.')
    .isLength({ min: 1, max: 100 }).withMessage('Tool call ID must be between 1 and 100 characters.'),

  body('toolName')
    .notEmpty().withMessage('Tool name is required.')
    .isString().withMessage('Tool name must be a string.')
    .isLength({ min: 1, max: 100 }).withMessage('Tool name must be between 1 and 100 characters.'), // Increased max length

  body('isSuccess')
    .exists({ checkNull: false, checkFalsy: false }).withMessage('Success status (isSuccess) is required.')
    .isBoolean().withMessage('Success status (isSuccess) must be a boolean.'),

  body('toolOutput')
    .optional({nullable: true}) // Allow toolOutput to be explicitly null or not present
    .custom((value) => {
      if (value === undefined) return true; // Optional, so undefined is fine.
      // Tool output can be any JSON-serializable type.
      try {
        JSON.stringify(value); // Attempt to serialize
        return true;
      } catch {
        throw new Error('Tool output must be JSON serializable if provided.');
      }
    }),

  body('errorMessage')
    .optional({ nullable: true })
    .isString().withMessage('Error message, if provided, must be a string.')
    .isLength({ max: 5000 }).withMessage('Error message cannot exceed 5000 characters.'),

  // Conditional validation: if isSuccess is false, errorMessage should ideally be present
  body().custom((value, { req }) => {
    const { isSuccess, errorMessage } = req.body;
    if (isSuccess === false && (errorMessage === undefined || errorMessage === null || String(errorMessage).trim() === '')) {
      // This is a recommendation rather than a strict validation failure, could be a warning.
      // For strictness, uncomment:
      // throw new Error('If tool execution failed (isSuccess: false), an errorMessage is highly recommended.');
    }
    return true;
  }),
];


/**
 * Creates and configures the complete AgentOS router with all its endpoints.
 * This function serves as the main factory for the AgentOS API system,
 * integrating authentication, validation, rate limiting, streaming, and core AgentOS functionality.
 *
 * @function createAgentOSRoutes
 * @param {IAgentOS} agentOSService - An initialized instance of the AgentOS service.
 * @param {IAuthService} authService - An initialized instance of the authentication service for JWT validation.
 * @returns {Router} A fully configured Express router containing all AgentOS endpoints.
 * @throws {Error} If `agentOSService` or `authService` are not provided or are invalid,
 * indicating a critical setup failure.
 *
 * @example
 * ```typescript
 * // In your main server setup file (e.g., server.ts or app.ts)
 * // Assuming agentOSService and authService are already initialized:
 * const agentOSRouter = createAgentOSRoutes(agentOSServiceInstance, authServiceInstance);
 * app.use('/api/v1/agentos', agentOSRouter); // Mount the AgentOS routes
 * ```
 */
export function createAgentOSRoutes(
  agentOSService: IAgentOS,
  authService: IAuthService
): Router {
  if (!agentOSService || typeof agentOSService.processRequest !== 'function') {
    throw new Error('A valid IAgentOS service instance is required to create AgentOS routes.');
  }
  if (!authService || typeof authService.verifyToken !== 'function') {
    throw new Error('A valid IAuthService instance is required for AgentOS route authentication.');
  }

  const router: Router = express.Router();
  const requireAuth = createJwtAuthMiddleware(authService); // Create authentication middleware instance

  // =============================================================================
  // CORE AGENTOS INTERACTION ENDPOINTS
  // =============================================================================

  /**
   * @route POST /api/v1/agentos/process
   * @description Process user input through the AgentOS system with real-time streaming response.
   * This is the primary endpoint for AI interactions, supporting text, vision, and audio inputs.
   * Responses are streamed using Server-Sent Events (SSE).
   * @access Private (Requires Authentication via JWT Bearer token)
   * @rateLimit agentOSRateLimits.chatProcessing (e.g., 30 requests/minute)
   * @validation Uses `chatProcessValidation` rules.
   * @streaming SSE with heartbeat and robust client disconnect handling.
   *
   * @requestBody {AgentOSInput} The comprehensive input for the agent interaction.
   * @response {stream} `text/event-stream`
   * - event: `connection` - data: { message: string, requestId: string, timestamp: string }
   * - event: `heartbeat` - data: { timestamp: string, requestId: string }
   * - event: `text_delta` | `system_progress` | etc. (AgentOSResponseChunkType) - data: AgentOSResponse (JSON string)
   * - event: `stream_end` - data: { message: string, requestId: string, totalChunks: number, timestamp: string }
   * - event: `error` (if stream-level error occurs) - data: AgentOSErrorChunk (JSON string)
   */
  router.post('/process',
    requireAuth,
    agentOSRateLimits.chatProcessing,
    chatProcessValidation,
    handleAgentOSValidationErrors,
    async (req: AuthenticatedRequest, res: Response, _next: NextFunction): Promise<void> => {
      const requestId = req.headers['x-request-id'] as string || `process-${Date.now()}-${uuidv4().substring(0,8)}`;
      res.locals.requestId = requestId; // Make it available for logging

      try {
        const userId = req.user!.userId; // Assured by requireAuth
        const {
          textInput,
          sessionId: clientSessionId, // Renamed to avoid conflict with internal sessionId
          selectedPersonaId,
          conversationId,
          settings,
          visionInputs,
          audioInput,
          userFeedback, // Although less common on initial process, good to have
        } = req.body as AgentOSInput;

        // Construct the full AgentOSInput object
        const input: AgentOSInput = {
          userId,
          sessionId: clientSessionId || `session-${userId}-${Date.now()}`, // Generate if not provided
          textInput: textInput || null, // Ensure null if empty, not undefined
          visionInputs: visionInputs || [],
          audioInput: audioInput, // Can be undefined
          selectedPersonaId: selectedPersonaId || undefined, // Let service handle default
          conversationId: conversationId || undefined,
          userFeedback: userFeedback,
          userApiKeys: (req as AuthenticatedRequest).user?.apiKeys, // Pass user's API keys if available from auth
          options: {
            ...(settings as ProcessingOptions), // Cast settings to ProcessingOptions
            debugMode: (settings as ProcessingOptions)?.debugMode || process.env.NODE_ENV === 'development',
            // Add any other relevant options derived from request or user context
            // e.g., clientInfo for logging or context
            customFlags: {
                ...(settings as ProcessingOptions)?.customFlags,
                clientUserAgent: req.headers['user-agent'],
                clientIpAddress: req.ip,
            }
          },
        };

        if (config.logActivity) console.log(`[AgentOSRoutes][${requestId}] POST /process - User: ${userId}, Session: ${input.sessionId}, Persona: ${input.selectedPersonaId || 'default'}`);

        // SSE Headers
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.setHeader('X-Accel-Buffering', 'no'); // For Nginx proxy compatibility
        res.flushHeaders(); // Send headers immediately

        const sendSse = (id: string, event: string, data: object) => {
            if (res.writableEnded) return;
            try {
                res.write(`id: ${id}\nevent: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
            } catch (e) {
                console.error(`[AgentOSRoutes][${requestId}] Error writing to SSE stream:`, e);
                if (!res.writableEnded) res.end();
            }
        };

        sendSse(Date.now().toString(), 'connection', { message: 'AgentOS stream connected.', requestId, timestamp: new Date().toISOString() });

        const heartbeatInterval = setInterval(() => {
          if (res.writableEnded) { clearInterval(heartbeatInterval); return; }
          sendSse(Date.now().toString(), 'heartbeat', { timestamp: new Date().toISOString(), requestId });
        }, 25000); // Heartbeat every 25 seconds

        req.on('close', () => {
          if (config.logActivity) console.log(`[AgentOSRoutes][${requestId}] Client disconnected (SSE /process). Session: ${input.sessionId}`);
          clearInterval(heartbeatInterval);
          // AgentOSService's generator should handle this gracefully, no explicit cancellation needed here unless resource intensive
          if (!res.writableEnded) res.end();
        });

        let chunkCount = 0;
        try {
          for await (const chunk of agentOSService.processRequest(input)) {
            if (res.writableEnded) break;
            chunkCount++;
            sendSse(chunk.timestamp || Date.now().toString(), chunk.type, { ...chunk, requestId, chunkIndex: chunkCount });
            if (chunk.isFinal || chunk.type === AgentOSResponseChunkType.ERROR) {
                if (config.logActivity) console.log(`[AgentOSRoutes][${requestId}] Final/Error chunk sent. Type: ${chunk.type}`);
                break; // Exit loop after final or error chunk from service
            }
          }
        } catch (processingError: any) {
            console.error(`[AgentOSRoutes][${requestId}] Error during agentOSService.processRequest stream:`, processingError);
            const gmiError = createGMIErrorFromError(processingError, GMIErrorCode.GMI_PROCESSING_ERROR, { inputPreview: input.textInput?.substring(0,50) }, "Core AgentOS processing stream failed");
            const errorChunk: AgentOSErrorChunk = {
                type: AgentOSResponseChunkType.ERROR, streamId: input.sessionId, gmiInstanceId: 'processing-error',
                personaId: input.selectedPersonaId || 'unknown', isFinal: true, timestamp: new Date().toISOString(),
                code: gmiError.code, message: gmiError.message, details: gmiError.details,
            };
            sendSse(Date.now().toString(), AgentOSResponseChunkType.ERROR, {...errorChunk, requestId, chunkIndex: ++chunkCount});
        }

        if (!res.writableEnded) {
            sendSse(Date.now().toString(), 'stream_end', { message: 'AgentOS processing stream finished.', requestId, totalChunks: chunkCount, timestamp: new Date().toISOString() });
            res.end();
        }
        clearInterval(heartbeatInterval);

      } catch (error: unknown) { // Catch setup errors before streaming starts
        const gmiError = createGMIErrorFromError(error, GMIErrorCode.INTERNAL_SERVER_ERROR, { route: '/process', requestId }, 'Failed to initiate AgentOS processing stream.');
        // If headers not sent, pass to global error handler
        if (!res.headersSent) {
            return _next(gmiError);
        } else if (!res.writableEnded) {
            // Headers sent, try to send error over SSE then end
            console.error(`[AgentOSRoutes][${requestId}] Critical setup error after headers sent for /process:`, gmiError);
             try {
                const errorChunk: AgentOSErrorChunk = {
                    type: AgentOSResponseChunkType.ERROR, streamId: req.body?.sessionId || 'setup-error-stream', gmiInstanceId: 'setup-error',
                    personaId: req.body?.selectedPersonaId || 'unknown', isFinal: true, timestamp: new Date().toISOString(),
                    code: gmiError.code, message: gmiError.message, details: gmiError.details,
                };
                res.write(`id: ${Date.now()}\nevent: ${AgentOSResponseChunkType.ERROR}\ndata: ${JSON.stringify({...errorChunk, requestId})}\n\n`);
            } catch (sseError) {
                console.error(`[AgentOSRoutes][${requestId}] Failed to send setup error via SSE:`, sseError);
            }
            res.end();
        }
      }
    }
  );

  /**
   * @route POST /api/v1/agentos/tool_result
   * @description Submit tool execution results back to AgentOS for continued processing.
   * The AI's response continues via SSE.
   * @access Private (Requires Authentication)
   * @rateLimit agentOSRateLimits.general
   * @validation Uses `toolResultValidation`.
   * @streaming SSE for continued AI response.
   */
  router.post('/tool_result',
    requireAuth,
    agentOSRateLimits.general,
    toolResultValidation,
    handleAgentOSValidationErrors,
    async (req: AuthenticatedRequest, res: Response, _next: NextFunction): Promise<void> => {
      const requestId = req.headers['x-request-id'] as string || `tool_res-${Date.now()}-${uuidv4().substring(0,8)}`;
      res.locals.requestId = requestId;

      try {
        const userId = req.user!.userId; // Assured by requireAuth
        const { streamId, toolCallId, toolName, toolOutput, isSuccess, errorMessage } = req.body;

        if (config.logActivity) console.log(`[AgentOSRoutes][${requestId}] POST /tool_result - User: ${userId}, Stream: ${streamId}, Tool: ${toolName}, CallID: ${toolCallId}, Success: ${isSuccess}`);

        // SSE Setup (similar to /process)
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.setHeader('X-Accel-Buffering', 'no');
        res.flushHeaders();

        const sendSse = (id: string, event: string, data: object) => {
            if (res.writableEnded) return;
            try {
                res.write(`id: ${id}\nevent: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
            } catch (e) {
                console.error(`[AgentOSRoutes][${requestId}] Error writing to SSE stream (tool_result):`, e);
                if (!res.writableEnded) res.end();
            }
        };

        sendSse(Date.now().toString(), 'connection', { message: 'AgentOS tool result stream connected.', requestId, timestamp: new Date().toISOString() });

        const heartbeatInterval = setInterval(() => {
          if (res.writableEnded) { clearInterval(heartbeatInterval); return; }
          sendSse(Date.now().toString(), 'heartbeat', { timestamp: new Date().toISOString(), requestId });
        }, 25000);

        req.on('close', () => {
          if (config.logActivity) console.log(`[AgentOSRoutes][${requestId}] Client disconnected (SSE /tool_result). Stream: ${streamId}`);
          clearInterval(heartbeatInterval);
          if (!res.writableEnded) res.end();
        });

        let chunkCount = 0;
        try {
          const responseGenerator = agentOSService.handleToolResult(
            streamId, toolCallId, toolName, toolOutput, isSuccess, errorMessage
          );
          for await (const chunk of responseGenerator) {
            if (res.writableEnded) break;
            chunkCount++;
            sendSse(chunk.timestamp || Date.now().toString(), chunk.type, { ...chunk, requestId, chunkIndex: chunkCount });
            if (chunk.isFinal || chunk.type === AgentOSResponseChunkType.ERROR) {
                if (config.logActivity) console.log(`[AgentOSRoutes][${requestId}] Final/Error chunk sent for tool result. Type: ${chunk.type}`);
                break;
            }
          }
        } catch (processingError: any) {
            console.error(`[AgentOSRoutes][${requestId}] Error during agentOSService.handleToolResult stream:`, processingError);
            const gmiError = createGMIErrorFromError(processingError, GMIErrorCode.TOOL_ERROR, {streamId, toolCallId, toolName}, "Core AgentOS tool result processing stream failed");
             const errorChunk: AgentOSErrorChunk = {
                type: AgentOSResponseChunkType.ERROR, streamId, gmiInstanceId: 'tool-result-error',
                personaId: 'unknown', isFinal: true, timestamp: new Date().toISOString(),
                code: gmiError.code, message: gmiError.message, details: gmiError.details,
            };
            sendSse(Date.now().toString(), AgentOSResponseChunkType.ERROR, {...errorChunk, requestId, chunkIndex: ++chunkCount});
        }

        if (!res.writableEnded) {
            sendSse(Date.now().toString(), 'stream_end', { message: 'AgentOS tool result processing stream finished.', requestId, totalChunks: chunkCount, timestamp: new Date().toISOString() });
            res.end();
        }
        clearInterval(heartbeatInterval);

      } catch (error: unknown) { // Catch setup errors before streaming
        const gmiError = createGMIErrorFromError(error, GMIErrorCode.INTERNAL_SERVER_ERROR, { route: '/tool_result', requestId }, 'Failed to initiate AgentOS tool result processing.');
        if (!res.headersSent) {
            return _next(gmiError);
        } else if (!res.writableEnded) {
            console.error(`[AgentOSRoutes][${requestId}] Critical setup error after headers sent for /tool_result:`, gmiError);
            try {
                const errorChunk: AgentOSErrorChunk = {
                    type: AgentOSResponseChunkType.ERROR, streamId: req.body?.streamId || 'setup-error-stream', gmiInstanceId: 'setup-error',
                    personaId: 'unknown', isFinal: true, timestamp: new Date().toISOString(),
                    code: gmiError.code, message: gmiError.message, details: gmiError.details,
                };
                res.write(`id: ${Date.now()}\nevent: ${AgentOSResponseChunkType.ERROR}\ndata: ${JSON.stringify({...errorChunk, requestId})}\n\n`);
            } catch (sseError) {
                 console.error(`[AgentOSRoutes][${requestId}] Failed to send setup error via SSE (tool_result):`, sseError);
            }
            res.end();
        }
      }
    }
  );


  // =============================================================================
  // PERSONA MANAGEMENT ENDPOINTS
  // =============================================================================

  /**
   * @route GET /api/v1/agentos/personas
   * @description Retrieve list of available AI personas for user selection.
   * Results may be filtered based on user's access level.
   * @access Private (Requires Authentication)
   * @rateLimit agentOSRateLimits.general
   */
  router.get('/personas',
    requireAuth,
    agentOSRateLimits.general,
    async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
      const requestId = req.headers['x-request-id'] as string || `personas-${Date.now()}`;
      try {
        const userId = req.user!.userId; // Assured by requireAuth
        if (config.logActivity) console.log(`[AgentOSRoutes][${requestId}] GET /personas - User: ${userId}`);

        const personas: Partial<IPersonaDefinition>[] = await agentOSService.listAvailablePersonas(userId);
        const response: AgentOSSuccessResponse<Partial<IPersonaDefinition>[]> = {
          success: true,
          message: 'Available personas retrieved successfully.',
          data: personas,
          timestamp: new Date().toISOString(),
          requestId,
        };
        res.status(200).json(response);
      } catch (error) {
        const gmiError = createGMIErrorFromError(error, GMIErrorCode.PERSONA_LOAD_ERROR, { route: '/personas', requestId }, 'Failed to retrieve available personas.');
        next(gmiError);
      }
    }
  );

  /**
   * @route GET /api/v1/agentos/personas/:personaId
   * @description Get detailed information about a specific AI persona.
   * @access Private (Requires Authentication)
   * @rateLimit agentOSRateLimits.general
   * @validation `personaId` path parameter.
   */
  router.get('/personas/:personaId',
    requireAuth,
    agentOSRateLimits.general,
    [
      param('personaId').isString().withMessage('Persona ID must be a string.')
        .isLength({ min: 1, max: 100 }).withMessage('Persona ID must be between 1 and 100 characters.')
    ],
    handleAgentOSValidationErrors,
    async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
      const requestId = req.headers['x-request-id'] as string || `persona_detail-${Date.now()}`;
      try {
        const userId = req.user!.userId;
        const { personaId } = req.params;
        if (config.logActivity) console.log(`[AgentOSRoutes][${requestId}] GET /personas/${personaId} - User: ${userId}`);

        // Assuming IAgentOS has a method like getPersonaDetails
        const personaDetails = await (agentOSService as any).getPersonaDetails(personaId, userId) as IPersonaDefinition | null;

        if (!personaDetails) {
          throw new GMIError(`Persona with ID '${personaId}' not found or access denied.`, GMIErrorCode.RESOURCE_NOT_FOUND, { personaId });
        }

        const response: AgentOSSuccessResponse<IPersonaDefinition> = {
          success: true,
          message: 'Persona details retrieved successfully.',
          data: personaDetails,
          timestamp: new Date().toISOString(),
          requestId,
        };
        res.status(200).json(response);
      } catch (error) {
        const gmiError = createGMIErrorFromError(error, GMIErrorCode.PERSONA_LOAD_ERROR, { route: `/personas/${req.params.personaId}`, personaId: req.params.personaId, requestId }, 'Failed to retrieve persona details.');
        next(gmiError);
      }
    }
  );


  // =============================================================================
  // CONVERSATION MANAGEMENT ENDPOINTS
  // =============================================================================

  /**
   * @route GET /api/v1/agentos/conversations/:conversationId
   * @description Retrieve conversation history for a specific conversation ID.
   * @access Private (Requires Authentication)
   * @rateLimit agentOSRateLimits.general
   * @validation `conversationId` path parameter. Optional query params for pagination.
   */
  router.get('/conversations/:conversationId',
    requireAuth,
    agentOSRateLimits.general,
    [
      param('conversationId').isUUID().withMessage('Valid Conversation ID (UUID) is required.'),
      query('limit').optional().isInt({ min: 1, max: 200 }).withMessage('Limit must be an integer between 1 and 200.'),
      query('beforeMessageId').optional().isString().isLength({min:1, max:100}).withMessage('beforeMessageId must be a valid message ID string.'),
    ],
    handleAgentOSValidationErrors,
    async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
      const requestId = req.headers['x-request-id'] as string || `conv_hist-${Date.now()}`;
      try {
        const userId = req.user!.userId;
        const { conversationId } = req.params;
        const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 50;
        const beforeMessageId = req.query.beforeMessageId as string | undefined;

        if (config.logActivity) console.log(`[AgentOSRoutes][${requestId}] GET /conversations/${conversationId} - User: ${userId}, Limit: ${limit}, Before: ${beforeMessageId}`);

        // Assuming IAgentOS has a method like getConversationHistory
        const conversationHistory = await (agentOSService as any).getConversationHistory(conversationId, userId, { limit, beforeMessageId }) as ConversationContext | null;

        if (!conversationHistory) {
          throw new GMIError(`Conversation '${conversationId}' not found or access denied.`, GMIErrorCode.RESOURCE_NOT_FOUND, { conversationId });
        }
        const response: AgentOSSuccessResponse<any> = { // Define a ConversationHistoryResponse type
          success: true,
          message: 'Conversation history retrieved successfully.',
          data: conversationHistory.toJSON(), // Use toJSON if available on ConversationContext
          timestamp: new Date().toISOString(),
          requestId,
        };
        res.status(200).json(response);
      } catch (error) {
        const gmiError = createGMIErrorFromError(error, GMIErrorCode.GMI_CONTEXT_ERROR, { route: `/conversations/${req.params.conversationId}`, conversationId: req.params.conversationId, requestId }, 'Failed to retrieve conversation history.');
        next(gmiError);
      }
    }
  );

  /**
   * @route GET /api/v1/agentos/conversations
   * @description Get list of user's conversations with pagination and filtering.
   * @access Private (Requires Authentication)
   * @rateLimit agentOSRateLimits.general
   */
  router.get('/conversations',
    requireAuth,
    agentOSRateLimits.general,
    [
      query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be an integer between 1 and 100.'),
      query('offset').optional().isInt({ min: 0 }).withMessage('Offset must be a non-negative integer.'),
      query('personaId').optional().isString().isLength({min:1, max:100}).withMessage('personaId must be a valid string.'),
      // Add other filters like date range if needed
    ],
    handleAgentOSValidationErrors,
    async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
        const requestId = req.headers['x-request-id'] as string || `conv_list-${Date.now()}`;
        try {
            const userId = req.user!.userId;
            const { limit = 20, offset = 0, personaId } = req.query;
            const options = {
                limit: parseInt(limit as string, 10),
                offset: parseInt(offset as string, 10),
                personaId: personaId as string | undefined,
            };
            if (config.logActivity) console.log(`[AgentOSRoutes][${requestId}] GET /conversations - User: ${userId}, Options:`, options);

            // Assuming IAgentOS has a method `listUserConversations`
            const result = await (agentOSService as any).listUserConversations(userId, options) as { conversations: any[], totalCount: number, hasMore: boolean };

            const response: AgentOSSuccessResponse = {
                success: true,
                message: 'User conversations retrieved.',
                data: result,
                timestamp: new Date().toISOString(),
                requestId,
            };
            res.status(200).json(response);
        } catch (error) {
            const gmiError = createGMIErrorFromError(error, GMIErrorCode.DATABASE_ERROR, { route: '/conversations', requestId }, 'Failed to list user conversations.');
            next(gmiError);
        }
    }
);


  // =============================================================================
  // FEEDBACK AND ANALYTICS ENDPOINTS
  // =============================================================================
  /**
   * @route POST /api/v1/agentos/feedback
   * @description Submit user feedback about AI interactions.
   * @access Private (Requires Authentication)
   * @rateLimit agentOSRateLimits.general
   * @validation Feedback payload.
   */
  router.post('/feedback',
    requireAuth,
    agentOSRateLimits.general,
    [
      body('sessionId').isString().notEmpty().withMessage('Session ID is required.'),
      body('personaId').isString().notEmpty().withMessage('Persona ID is required.'),
      body('feedbackPayload').isObject().withMessage('Feedback payload object is required.'),
      body('feedbackPayload.rating').optional().isNumeric().isIn([1,2,3,4,5]).withMessage('Rating must be 1-5 if provided.'),
      body('feedbackPayload.text').optional().isString().isLength({max: 2000}).withMessage('Feedback text too long.'),
      body('feedbackPayload.targetMessageId').optional().isString().withMessage('targetMessageId must be a string.'),
    ],
    handleAgentOSValidationErrors,
    async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
      const requestId = req.headers['x-request-id'] as string || `feedback-${Date.now()}`;
      try {
        const userId = req.user!.userId;
        const { sessionId, personaId, feedbackPayload } = req.body as { sessionId: string, personaId: string, feedbackPayload: UserFeedbackPayload };
        if (config.logActivity) console.log(`[AgentOSRoutes][${requestId}] POST /feedback - User: ${userId}, Session: ${sessionId}`);

        await agentOSService.receiveFeedback(userId, sessionId, personaId, feedbackPayload);

        const response: AgentOSSuccessResponse<{ acknowledged: boolean }> = {
          success: true,
          message: 'Feedback received successfully.',
          data: { acknowledged: true },
          timestamp: new Date().toISOString(),
          requestId,
        };
        res.status(202).json(response); // 202 Accepted
      } catch (error) {
        const gmiError = createGMIErrorFromError(error, GMIErrorCode.GMI_FEEDBACK_ERROR, { route: '/feedback', requestId }, 'Failed to process feedback.');
        next(gmiError);
      }
    }
  );

  // =============================================================================
  // SYSTEM STATUS AND HEALTH ENDPOINTS (Example)
  // =============================================================================
  /**
   * @route GET /api/v1/agentos/health
   * @description Public health check for the AgentOS service.
   * @access Public
   */
  router.get('/health', (_req: Request, res: Response) => {
    // More detailed health can be provided by agentOSService.getSystemStatus() if needed
    res.status(200).json({
      status: 'UP',
      message: 'AgentOS service is operational.',
      timestamp: new Date().toISOString(),
      version: process.env.APP_VERSION || '1.0.0' // Example version
    });
  });

  // Global Error Handler for this router (catches errors from route handlers)
  router.use((error: any, req: Request, res: Response, next: NextFunction) => {
    const requestId = res.locals.requestId || req.headers['x-request-id'] as string || `err-${Date.now()}`;
    
    // Log the error with context
    console.error(`[AgentOSRoutes][ErrorHandler][${requestId}] Unhandled error for ${req.method} ${req.originalUrl}:`, {
      message: error.message,
      code: error.code,
      details: error.details,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined, // Only show stack in dev
      userId: (req as AuthenticatedRequest).user?.userId,
    });

    if (res.headersSent) {
      // If headers already sent (e.g., during SSE), delegate to default Express handler
      // or try to gracefully end the stream if possible (though it's tricky here)
      if (!res.writableEnded) {
          console.error(`[AgentOSRoutes][ErrorHandler][${requestId}] Headers already sent, attempting to end response.`);
          res.end();
      }
      return next(error); // Let Express handle it if it can
    }

    const gmiError = error instanceof GMIError
      ? error
      : createGMIErrorFromError(error, GMIErrorCode.INTERNAL_SERVER_ERROR, { originalErrorName: error.name }, 'An unexpected internal error occurred.');

    const errorResponse: AgentOSApiErrorResponse = {
      error: {
        code: gmiError.code.toString(),
        message: gmiError.message,
        details: process.env.NODE_ENV === 'development' || gmiError.isOperational ? gmiError.details : undefined,
        timestamp: new Date().toISOString(),
        requestId,
      },
    };

    res.status(gmiError.recommendedHttpStatusCode || 500).json(errorResponse);
  });

  return router;
}