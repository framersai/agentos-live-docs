/**
 * @file backend/api/gmiRoutes.ts
 * @module backend/api/gmiRoutes
 * @version 1.2.4
 *
 * @description
 * This module defines the Express router for Generalized Mind Instance (GMI) or Agent interactions.
 * It handles core functionalities such as initiating conversations, processing user turns (text input),
 * submitting tool execution results back to the GMI, retrieving GMI status, managing conversation context,
 * and processing user feedback for interactions.
 * Routes support streaming and non-streaming responses. Authentication is handled flexibly.
 * This version includes targeted fixes for TypeScript errors and method call signatures.
 *
 * Key Dependencies: (Same as previous version)
 */

import { Router, Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { GMIManager } from '../agentos/cognitive_substrate/GMIManager';
import { ConversationContext, ConversationContextConfig } from '../agentos/core/conversation/ConversationContext';
import { ConversationMessage, MessageRole } from '../agentos/core/conversation/ConversationMessage';
import { IAuthService, AuthTokenPayload } from '../services/user_auth/IAuthService';
import { User } from '../services/user_auth/User';
import {
  GMITurnInput,
  GMIOutput,
  GMIOutputChunk,
  GMIOutputChunkType,
  GMIInteractionType,
  ToolCallRequest,
  CostAggregator,
  ToolResultPayload,
  IGMI,
} from '../agentos/cognitive_substrate/IGMI';
import { AIModelProviderManager } from '../agentos/core/llm/providers/AIModelProviderManager';
import { GMIError, GMIErrorCode, ErrorFactory, createGMIErrorFromError } from '../utils/errors';
import { ModelUsage } from '../agentos/core/llm/providers/IProvider';
import { AuthenticatedRequest } from '../middleware/authenticateTokenMiddleware';

/**
 * @typedef ConversationMessageInput
 * @description Defines the type for data used to create a new conversation message.
 * Omits `id` and `timestamp` as these are auto-generated.
 */
type ConversationMessageInput = Omit<ConversationMessage, 'id' | 'timestamp'>;

/**
 * @interface GMIInteractionRequest
 * @description Defines the expected structure for the request body of a GMI interaction.
 * @property {string | null | undefined} [userInput] - The textual input from the user. Can be omitted if no direct user text.
 * @property {string} sessionId - A unique identifier for the user's session.
 * @property {string} [interactionId] - Optional client-provided ID for this interaction.
 * @property {any} [userFeedback] - Optional user feedback on a previous response.
 * @property {any} [explicitPersonaPresents] - Optional data to shape persona state.
 * @property {object} [options] - Optional parameters for GMI response generation.
 */
interface GMIInteractionRequest {
  userInput?: string | null;
  sessionId: string;
  interactionId?: string;
  userFeedback?: any;
  explicitPersonaPresents?: any;
  options?: {
    temperature?: number;
    maxTokens?: number;
    stream?: boolean;
    preferredModelId?: string;
  };
}

/**
 * @interface GMIToolResultRequest
 * @description Defines the structure for submitting tool execution results to the GMI.
 * @property {string} toolCallId - ID of the tool call this result is for.
 * @property {string} toolName - Name of the executed tool.
 * @property {any} toolOutput - Output/result from the tool.
 * @property {boolean} isSuccess - Whether the tool execution was successful.
 * @property {string} [errorMessage] - Error message if `isSuccess` is false.
 */
interface GMIToolResultRequest {
  toolCallId: string;
  toolName: string;
  toolOutput: any;
  isSuccess: boolean;
  errorMessage?: string;
}

/**
 * @interface GMIStatus
 * @description Defines the structure for representing a GMI instance's status.
 * @property {string} gmiInstanceId - Unique ID of the GMI instance.
 * @property {string} personaId - ID of the persona embodied by the GMI.
 * @property {string} sessionId - Session ID associated with this GMI.
 * @property {string | null} userId - ID of the user, or null for anonymous.
 * @property {string} gmiState - Current operational state of the GMI.
 * @property {Date} lastActivity - Timestamp of the last significant activity.
 * @property {number} conversationTurns - Number of turns in the current conversation.
 */
interface GMIStatus {
  gmiInstanceId: string;
  personaId: string;
  sessionId: string;
  userId: string | null;
  gmiState: string;
  lastActivity: Date;
  conversationTurns: number;
}

// --- Authentication Middleware ---
const authenticateAndAttachUserOptional = (authService: IAuthService) =>
  async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
    req.user = undefined;
    if (token) {
      try {
        const userPayload: AuthTokenPayload | null = await authService.validateToken(token);
        if (userPayload) req.user = userPayload;
      } catch (error) { console.warn(`[GmiRoutes OptionalAuth] Token validation error: ${(error as Error).message}`); }
    }
    return next();
  };

const requireAuthentication = (authService: IAuthService) =>
  async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
    if (!token) return next(ErrorFactory.authentication('Auth token required.', {}, GMIErrorCode.AUTHENTICATION_TOKEN_MISSING));
    try {
      const userPayload: AuthTokenPayload | null = await authService.validateToken(token);
      if (!userPayload) return next(ErrorFactory.authentication('Invalid or expired auth token.', {}, GMIErrorCode.AUTHENTICATION_TOKEN_INVALID));
      req.user = userPayload;
      return next();
    } catch (serviceError) {
      console.error("[GmiRoutes RequireAuth] Token validation service error:", serviceError);
      return next(ErrorFactory.internal('Auth token validation failed server-side.', serviceError));
    }
  };

/**
 * Creates and configures the Express router for GMI (Generalized Mind Instance) related operations.
 * @function createGMIRoutes
 * (JSDoc content as previously defined)
 */
export const createGMIRoutes = (
    gmiManager: GMIManager,
    authService: IAuthService,
    providerManager: AIModelProviderManager
): Router => {
  const router = Router();
  const conversationContexts = new Map<string, ConversationContext>();

  const getOrCreateConversationContext = (sessionId: string, userId?: string, gmiInstanceId?: string, activePersonaId?: string): ConversationContext => {
    if (!conversationContexts.has(sessionId)) {
      const contextConfig: ConversationContextConfig = {
        maxHistoryLengthMessages: 50,
        userId: userId,
        gmiInstanceId: gmiInstanceId,
        activePersonaId: activePersonaId,
      };
      const newContext = new ConversationContext(sessionId, contextConfig);
      conversationContexts.set(sessionId, newContext);
    }
    const context = conversationContexts.get(sessionId)!;
    if (userId && context.userId !== userId && !context.userId?.startsWith('anonymous_')) {
        (context as { userId: string | undefined }).userId = userId;
    }
    return context;
  };

  /**
   * @route POST /api/v1/gmi/interact/:personaId
   * @description Main endpoint for user interaction with a GMI.
   * (JSDoc content as previously defined)
   */
  router.post('/interact/:personaId', authenticateAndAttachUserOptional(authService), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { personaId } = req.params;
    const { userInput, sessionId, interactionId: clientInteractionId, userFeedback, explicitPersonaPresents, options } = req.body as GMIInteractionRequest;
    const authenticatedUserPayload = req.user;
    const currentUserId = authenticatedUserPayload?.userId || `anonymous_${sessionId}`;

    if (!sessionId || !personaId) return next(ErrorFactory.validation('sessionId and personaId are required.'));

    let gmiInstanceIdForContext: string | undefined;

    try {
      const { gmi } = await gmiManager.getOrCreateGMIForSession(currentUserId, sessionId, personaId);
      gmiInstanceIdForContext = gmi.gmiId;
      const conversationContext = getOrCreateConversationContext(sessionId, currentUserId, gmi.gmiId, personaId);
      const interactionId = clientInteractionId || uuidv4();

      const finalUserInputForMessage: string | null = userInput ?? null;
      if (typeof finalUserInputForMessage === 'string') { // Only add if actual string content
        const userMessagePayload: ConversationMessageInput = {
          role: MessageRole.USER,
          content: finalUserInputForMessage,
          name: authenticatedUserPayload?.username || currentUserId,
          metadata: { timestamp: Date.now(), interactionId, userId: currentUserId }
        };
        conversationContext.addMessage(userMessagePayload);
      }

      const turnInput: GMITurnInput = {
        interactionId, userId: currentUserId, sessionId,
        type: (userInput && userInput.trim() !== '') ? GMIInteractionType.TEXT : GMIInteractionType.SYSTEM_MESSAGE,
        content: userInput || "",
        timestamp: new Date(),
        metadata: { userFeedback, explicitPersonaPresents, clientOptions: options || {} }
      };

      const gmiOutputGenerator = gmi.processTurnStream(turnInput);

      if (options?.stream) {
        res.setHeader('Content-Type', 'application/x-ndjson');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.setHeader('X-Accel-Buffering', 'no');
        let streamedTextContent = "";
        for await (const chunk of gmiOutputGenerator) {
          res.write(JSON.stringify(chunk) + '\n');
          if (chunk.type === GMIOutputChunkType.TEXT_DELTA && typeof chunk.content === 'string') {
            streamedTextContent += chunk.content;
          }
        }
        if (streamedTextContent) {
            const assistantMessagePayload: ConversationMessageInput = {
                role: MessageRole.ASSISTANT,
                content: streamedTextContent,
                metadata: { timestamp: Date.now(), interactionId, gmiInstanceId: gmi.gmiId, personaId }
            };
            conversationContext.addMessage(assistantMessagePayload);
        }
        return res.end();
      } else {
        let responseText: string | null = null;
        const toolCalls: ToolCallRequest[] = [];
        const uiCommands: any[] = [];
        let aggregatedUsage: CostAggregator = { totalTokens: 0, promptTokens: 0, completionTokens: 0, totalCostUSD: 0, breakdown: [] };
        let finalErrorDetails: any = null;

        for await (const chunk of gmiOutputGenerator) {
          if (chunk.type === GMIOutputChunkType.TEXT_DELTA && typeof chunk.content === 'string') responseText = (responseText || "") + chunk.content;
          else if (chunk.type === GMIOutputChunkType.TOOL_CALL_REQUEST && Array.isArray(chunk.content)) toolCalls.push(...chunk.content);
          else if (chunk.type === GMIOutputChunkType.UI_COMMAND) uiCommands.push(chunk.content);
          else if (chunk.type === GMIOutputChunkType.ERROR) finalErrorDetails = chunk.content || chunk.errorDetails;

          if (chunk.usage) {
            const usage = chunk.usage as ModelUsage;
            aggregatedUsage.promptTokens += usage.promptTokens || 0;
            aggregatedUsage.completionTokens += usage.completionTokens || 0;
            aggregatedUsage.totalCostUSD = (aggregatedUsage.totalCostUSD || 0) + (usage.costUSD || 0);
          }
        }
        aggregatedUsage.totalTokens = aggregatedUsage.promptTokens + aggregatedUsage.completionTokens;

        if (responseText !== null || toolCalls.length > 0) {
            const assistantMessagePayload: ConversationMessageInput = {
                role: MessageRole.ASSISTANT,
                content: responseText ?? null, // Explicitly ensure null if responseText is null
                tool_calls: toolCalls.length > 0 ? toolCalls : undefined,
                metadata: { timestamp: Date.now(), interactionId, gmiInstanceId: gmi.gmiId, personaId, usage: aggregatedUsage }
            };
            conversationContext.addMessage(assistantMessagePayload);
        }

        const finalOutput: GMIOutput = { isFinal: true, responseText, toolCalls: toolCalls.length ? toolCalls : undefined, uiCommands: uiCommands.length ? uiCommands : undefined, usage: aggregatedUsage, error: finalErrorDetails };
        if (finalErrorDetails) {
            const message = typeof finalErrorDetails === 'string' ? finalErrorDetails : (finalErrorDetails?.message || "GMI processing resulted in an error state.");
            const code = finalErrorDetails?.code || GMIErrorCode.GMI_PROCESSING_ERROR;
            return next(new GMIError(message, code, finalErrorDetails));
        }

        return res.status(200).json({ success: true, gmiInstanceId: gmi.gmiId, personaId, sessionId, interactionId, response: finalOutput, conversationTurns: conversationContext.getAllMessages().length });
      }
    } catch (error) {
      return next(createGMIErrorFromError(error as Error, GMIErrorCode.GMI_PROCESSING_ERROR, undefined, 'Failed to process GMI interaction.'));
    }
  });

  /**
   * @route POST /api/v1/gmi/interact/:personaId/:sessionId/tool-result
   * @description Submits tool execution results back to the GMI.
   * @access Protected
   */
  router.post('/interact/:personaId/:sessionId/tool-result', requireAuthentication(authService), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { personaId, sessionId } = req.params;
    const { toolCallId, toolName, toolOutput, isSuccess, errorMessage } = req.body as GMIToolResultRequest;
    const authenticatedUserPayload = req.user!;

    if (!toolCallId || !toolName || typeof isSuccess !== 'boolean') return next(ErrorFactory.validation('toolCallId, toolName, and isSuccess are required.'));

    let gmiInstanceIdForContext: string | undefined;
    try {
      const { gmi } = await gmiManager.getOrCreateGMIForSession(authenticatedUserPayload.userId, sessionId, personaId);
      gmiInstanceIdForContext = gmi.gmiId;
      const conversationContext = getOrCreateConversationContext(sessionId, authenticatedUserPayload.userId, gmi.gmiId, personaId);

      const toolResultPayload: ToolResultPayload = isSuccess ? { type: 'success', result: toolOutput } : { type: 'error', error: { code: GMIErrorCode.TOOL_EXECUTION_FAILED, message: errorMessage || `Tool '${toolName}' failed.`, details: toolOutput }};

      const toolMessagePayload: ConversationMessageInput = {
          role: MessageRole.TOOL,
          content: JSON.stringify(toolOutput),
          name: toolName,
          tool_call_id: toolCallId,
          metadata: { timestamp: Date.now(), userId: authenticatedUserPayload.userId, isSuccess, originalErrorMessage: !isSuccess ? errorMessage : undefined }
      };
      conversationContext.addMessage(toolMessagePayload);

      const gmiResponseAfterTool: GMIOutput = await gmi.handleToolResult(toolCallId, toolName, toolResultPayload, authenticatedUserPayload.userId);
      if (gmiResponseAfterTool.responseText !== null || gmiResponseAfterTool.toolCalls?.length) {
        const assistantMessagePayload: ConversationMessageInput = {
            role: MessageRole.ASSISTANT,
            content: gmiResponseAfterTool.responseText ?? null, // Explicitly null if undefined
            tool_calls: gmiResponseAfterTool.toolCalls?.length ? gmiResponseAfterTool.toolCalls : undefined,
            metadata: { timestamp: Date.now(), gmiInstanceId: gmi.gmiId, personaId, usage: gmiResponseAfterTool.usage }
        };
        conversationContext.addMessage(assistantMessagePayload);
      }
      return res.status(200).json({ success: true, gmiInstanceId: gmi.gmiId, response: gmiResponseAfterTool });
    } catch (error) {
      // Corrected ErrorFactory call for line 387 (now ~412)
      return next(createGMIErrorFromError(error as Error, GMIErrorCode.TOOL_ERROR, { toolName, toolCallId }, 'Failed to process tool result.'));
    }
  });

  /**
   * @route GET /api/v1/gmi/status/:personaId/:sessionId
   * @description Retrieves status of a GMI instance.
   * @access Protected
   */
  router.get('/status/:personaId/:sessionId', requireAuthentication(authService), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { personaId, sessionId } = req.params;
    const authenticatedUserPayload = req.user!;
    try {
      const { gmi } = await gmiManager.getOrCreateGMIForSession(authenticatedUserPayload.userId, sessionId, personaId);
      const conversationContext = getOrCreateConversationContext(sessionId, authenticatedUserPayload.userId, gmi.gmiId, personaId);
      // TODO: IGMI interface needs to define `getLastActivityTimestamp()`. Using fallback.
      // This assumes IGMI instance might have 'lastActivityTimestamp' or 'lastInteractedAt' properties.
      const lastGMIActivity = (gmi as any).lastActivityTimestamp || (gmi as any).lastInteractedAt || new Date(0);
      const lastMessage = conversationContext.getLastMessage(); // Method from ConversationContext.ts

      const status: GMIStatus = {
        gmiInstanceId: gmi.gmiId,
        personaId: gmi.getPersona().id, // Assumes getPersona() on IGMI
        sessionId,
        userId: authenticatedUserPayload.userId,
        gmiState: gmi.getCurrentState(), // Assumes getCurrentState() on IGMI
        lastActivity: lastMessage ? new Date(lastMessage.timestamp) : lastGMIActivity,
        conversationTurns: conversationContext.getAllMessages().length // Uses getAllMessages from ConversationContext.ts
      };
      return res.status(200).json({ success: true, status });
    } catch (error) {
      return next(error);
    }
  });

  /**
   * @route DELETE /api/v1/gmi/:personaId/:sessionId
   * @description Deactivates a GMI instance. This action will stop the GMI's processing for the session
   * and clean up associated in-memory resources like the conversation context.
   * @access Protected
   * @middleware requireAuthentication - Ensures that only authenticated users can attempt to deactivate sessions.
   * Further authorization (e.g., ensuring the user owns the session) should be handled within `gmiManager.deactivateGMIForSession`.
   * @param {string} req.params.personaId - The ID of the persona associated with the GMI session (primarily for contextual routing, session ID is key).
   * @param {string} req.params.sessionId - The unique identifier of the GMI session to be deactivated.
   * @response {200} OK - If the GMI session was successfully found and deactivated. Includes a success message.
   * @response {404} Not Found - If no active GMI session is found for the given `sessionId`, or if the session was already inactive.
   * @response {500} Internal Server Error - For unexpected errors during the deactivation process.
   */
  router.delete('/:personaId/:sessionId', requireAuthentication(authService), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { personaId, sessionId } = req.params; // personaId is mostly for context here.
    const authenticatedUserPayload = req.user!;
    try {
      const gmiInstanceIdBeforeDeactivation = gmiManager.gmiSessionMap.get(sessionId);
      if (!gmiInstanceIdBeforeDeactivation) {
        return next(ErrorFactory.notFound(`No active GMI session found for ID '${sessionId}'. Nothing to deactivate.`));
      }

      // The user provided GMIManager.deactivateGMIForSession(sessionId: string)
      // It does NOT take userId for an ownership check within the manager.
      // An ownership check should ideally happen here before calling, or GMIManager should be enhanced.
      // For now, we proceed based on the provided signature.
      // TODO: Enhance security by verifying user ownership of the session/GMI instance before deactivation.
      // This might involve GMIManager exposing GMI details or a dedicated method.
      const deactivated = await gmiManager.deactivateGMIForSession(sessionId);

      if (deactivated) {
        conversationContexts.delete(sessionId); // Clean up in-memory context
        console.log(`[GMIRoutes] GMI for session ${sessionId} (User: ${authenticatedUserPayload.userId}) deactivated successfully.`);
        return res.status(200).json({ success: true, message: `GMI session ${sessionId} deactivated.` });
      } else {
        // This means deactivateGMIForSession returned false, implying it was already inactive or not found in active map.
        return next(ErrorFactory.notFound(`GMI session ${sessionId} was already inactive or could not be found for deactivation.`));
      }
    } catch (error) {
      console.error(`[GMIRoutes] Error during DELETE /gmi/${personaId}/${sessionId} for user ${authenticatedUserPayload.userId}:`, error);
      return next(error); // Pass to global error handler
    }
  });

  /**
   * @route GET /api/v1/gmi/conversations/:sessionId
   * @description Retrieves the conversation history for a specific session.
   * Ensures that the authenticated user has permission to access the requested conversation.
   * @access Protected
   * @middleware requireAuthentication
   * @param {string} req.params.sessionId - The ID of the session whose conversation history is requested.
   * @response {200} OK - Returns the conversation data (e.g., list of messages, metadata).
   * @response {403} Forbidden - If the authenticated user does not have permission to access this conversation.
   * @response {404} Not Found - If no conversation context is found for the session ID.
   * @response {500} Internal Server Error.
   */
  router.get('/conversations/:sessionId', requireAuthentication(authService), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { sessionId } = req.params;
    const authenticatedUserPayload = req.user!;
    try {
      // Attempt to get GMI details to pass to context creation, if relevant for context config
      const gmiInstanceId = gmiManager.gmiSessionMap.get(sessionId);
      let activePersonaId: string | undefined;
      if (gmiInstanceId) {
          const gmi = gmiManager.activeGMIs.get(gmiInstanceId);
          activePersonaId = gmi?.getPersona().id;
      }

      const conversationContext = getOrCreateConversationContext(sessionId, authenticatedUserPayload.userId, gmiInstanceId, activePersonaId);
      const contextUserId = conversationContext.userId; // Using getter from ConversationContext

      // Authorization check: Ensure the requesting user owns or has access to this conversation.
      // The logic `!contextUserId.startsWith('anonymous_')` assumes anonymous sessions can be "claimed" by first auth user.
      // This might need refinement for stricter multi-user scenarios.
      if (!contextUserId || (contextUserId !== authenticatedUserPayload.userId && !contextUserId.startsWith('anonymous_'))) {
        return next(ErrorFactory.permissionDenied('You do not have permission to access this conversation history.'));
      }

      const conversationData = typeof conversationContext.toJSON === 'function'
        ? conversationContext.toJSON()
        : { messages: conversationContext.getAllMessages(), metadata: conversationContext.getAllMetadata() }; // Fallback serialization

      return res.status(200).json({ success: true, sessionId, conversation: conversationData });
    } catch (error) {
      return next(error);
    }
  });

  /**
   * @route POST /api/v1/gmi/feedback/:personaId/:sessionId
   * @description Submits user feedback for a specific GMI interaction or session.
   * @access Protected
   * @middleware requireAuthentication
   * @param {string} req.params.personaId - The ID of the AI persona associated with the interaction.
   * @param {string} req.params.sessionId - The session ID where the interaction occurred.
   * @body {any} feedbackData - The structured feedback payload (e.g., rating, comments, corrections).
   * The exact structure should be defined by the feedback system.
   * @response {200} OK - Feedback submitted successfully.
   * @response {400} Bad Request - If `feedbackData` is missing or invalid.
   * @response {404} Not Found - If the GMI session is not found or not accessible by the user.
   * @response {501} Not Implemented - If feedback processing logic is not available on the GMI or GMIManager.
   * @response {500} Internal Server Error.
   */
  router.post('/feedback/:personaId/:sessionId', requireAuthentication(authService), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { personaId, sessionId } = req.params;
    const feedbackData = req.body; // Consider defining a stricter DTO: interface FeedbackPayloadDto {...}
    const authenticatedUserPayload = req.user!;

    if (!feedbackData || Object.keys(feedbackData).length === 0) {
      return next(ErrorFactory.validation("Feedback data payload cannot be empty."));
    }

    try {
      // TODO: GMIManager should ideally have a `getGMI(gmiInstanceId: string, userId: string): Promise<IGMI | null>`
      // that also performs an ownership check. For now, fetching GMI then checking userId manually.
      const gmiInstanceId = gmiManager.gmiSessionMap.get(sessionId);
      if (!gmiInstanceId) {
        return next(ErrorFactory.notFound(`No active GMI session found for ID '${sessionId}' to submit feedback.`));
      }
      const gmi = gmiManager.activeGMIs.get(gmiInstanceId);

      // Check GMI existence and ownership (assuming GMI instance has a 'userId' property or method)
      if (!gmi || ((gmi as any).userId && (gmi as any).userId !== authenticatedUserPayload.userId && !(gmi as any).userId?.startsWith('anonymous_'))) {
          return next(ErrorFactory.notFound(`No GMI session found for ID '${sessionId}' accessible by user '${authenticatedUserPayload.userId}'.`));
      }

      // Attempt to process feedback through the GMI instance or manager
      if (typeof (gmi as any).processFeedback === 'function') {
        await (gmi as any).processFeedback(feedbackData, authenticatedUserPayload.userId);
      } else if (typeof (gmiManager as any).processUserFeedback === 'function') { // Fallback to manager method
        await (gmiManager as any).processUserFeedback(authenticatedUserPayload.userId, sessionId, personaId, feedbackData);
      } else {
         // If no specific feedback processing method exists, log it and inform client.
         console.log("User feedback received and logged (no specific GMI/Manager .processFeedback method found):", { userId: authenticatedUserPayload.userId, sessionId, personaId, feedbackData });
         return next(new GMIError('Feedback has been logged, but real-time agent processing for this feedback is not currently available.', GMIErrorCode.NOT_IMPLEMENTED, undefined, undefined, 501));
      }
      return res.status(200).json({ success: true, message: 'Feedback submitted successfully.' });
    } catch (error) {
      return next(createGMIErrorFromError(error as Error, GMIErrorCode.GMI_FEEDBACK_ERROR, undefined, 'Failed to process user feedback.'));
    }
  });

  return router;
};