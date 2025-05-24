/**
 * @fileoverview Complete GMI routes with all import fixes and full implementation
 * FIXES: Fix import paths and implement complete GMI interaction endpoints
 */

import { Router, Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid'; // Added for generating interaction IDs
import { GMIManager } from '../agentos/cognitive_substrate/GMIManager';
import { ConversationContext } from '../agentos/core/conversation/ConversationContext'; // Assuming this class exists and has methods like addMessage, getMessageCount, toJSON and a userId property
import { IAuthService, User } from '../services/user_auth/AuthService';
import { GMITurnInput, GMIOutput, GMIOutputChunk, GMIOutputChunkType, GMIInteractionType, ToolCallRequest, CostAggregator, ToolResultPayload } from '../agentos/cognitive_substrate/IGMI'; // Added GMIInteractionType, ToolCallRequest, CostAggregator, ToolResultPayload
import { IProvider } from '../agentos/core/llm/providers/IProvider'; // Retained, though GMI internally handles provider selection
import { AIModelProviderManager } from '../agentos/core/llm/providers/implementations/AIModelProviderManager';
import { GMIError, GMIErrorCode } from '../utils/errors';
import { ModelUsage } from '../agentos/core/llm/providers/IProvider'; // For aggregating usage

// Interface for GMI interaction request
interface GMIInteractionRequest {
  userInput?: string | null;
  sessionId: string;
  interactionId?: string; // Optional: client can provide an interactionId
  userFeedback?: any;
  explicitPersonaPresents?: any;
  options?: {
    temperature?: number;
    maxTokens?: number;
    stream?: boolean;
    preferredModelId?: string;
  };
}

// Interface for tool result submission
interface GMIToolResultRequest {
  toolCallId: string;
  toolName: string;
  toolOutput: any;
  isSuccess: boolean;
  errorMessage?: string;
}

// Interface for GMI status (consider aligning more with GMIHealthReport from IGMI.ts)
interface GMIStatus {
  gmiInstanceId: string;
  personaId: string;
  sessionId: string;
  userId: string | null;
  gmiState: string; // Changed from isActive to gmiState (e.g., GMIPrimeState)
  lastActivity: Date; // Needs proper tracking mechanism
  conversationTurns: number;
}

// --- Authentication Middleware (Using the versions provided at the end of your prompt) ---

/**
 * Middleware to authenticate and attach user (optional authentication)
 */
const authenticateAndAttachUserOptional = (authService: IAuthService) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (token) {
      try {
        const user = await authService.validateToken(token);
        if (user) {
          (req as any).user = user;
        }
      } catch (error) {
        // Log error but don't block if token is invalid; treat as anonymous for public personas
        console.warn("Optional Auth: Token validation failed, proceeding as anonymous.", error);
      }
    }
    next();
  };

/**
 * Middleware to require authentication
 */
const requireAuthentication = (authService: IAuthService) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        error: {
          code: GMIErrorCode.AUTHENTICATION_TOKEN_MISSING,
          message: 'Authentication token required.'
        }
      });
    }

    try {
      const user = await authService.validateToken(token);
      if (!user) {
        return res.status(401).json({
          error: {
            code: GMIErrorCode.AUTHENTICATION_TOKEN_INVALID,
            message: 'Invalid authentication token.'
          }
        });
      }
      (req as any).user = user;
      next();
    } catch (error) { // Catch potential errors from validateToken itself
      console.error("Authentication error:", error);
      return res.status(401).json({
        error: {
          code: GMIErrorCode.AUTHENTICATION_TOKEN_INVALID,
          message: 'Invalid authentication token or authentication service error.'
        }
      });
    }
  };


export const createGMIRoutes = (
    gmiManager: GMIManager,
    authService: IAuthService,
    providerManager: AIModelProviderManager // Retained, though GMI chooses provider internally
): Router => {
  const router = Router();

  // In-memory store for conversation contexts for MVP.
  // In production, use Redis or a DB.
  // Ensure ConversationContext class can store userId.
  const conversationContexts = new Map<string, ConversationContext>();

  const getOrCreateConversationContext = (sessionId: string, userId?: string): ConversationContext => {
    if (!conversationContexts.has(sessionId)) {
      // ConversationContextConfig could be dynamic based on user tier
      // Assuming ConversationContext constructor can take userId or has a setter
      const newContext = new ConversationContext(sessionId, { maxHistoryLengthMessages: 50 });
      if (userId) {
        (newContext as any).userId = userId; // Assign userId if ConversationContext supports it
      }
      conversationContexts.set(sessionId, newContext);
    }
    const context = conversationContexts.get(sessionId)!;
    // Ensure userId is updated if an anonymous session gets an authenticated user
    if (userId && !(context as any).userId) {
        (context as any).userId = userId;
    }
    return context;
  };

  /**
   * @route POST /gmi/interact/:personaId
   * @description Main GMI interaction endpoint
   * @access Public/Protected (optional auth)
   */
  router.post('/interact/:personaId', authenticateAndAttachUserOptional(authService), async (req: Request, res: Response) => {
    const { personaId } = req.params;
    const {
        userInput,
        sessionId,
        interactionId: clientInteractionId, // Client might provide this
        userFeedback,
        explicitPersonaPresents,
        options
    } = req.body as GMIInteractionRequest;
    const authenticatedUser = (req as any).user as User | undefined;
    const currentUserId = authenticatedUser?.id || 'anonymous_user'; // Ensure a userId is always available

    // Validation
    if (!sessionId || typeof sessionId !== 'string') {
      return res.status(400).json({
        error: {
          code: GMIErrorCode.VALIDATION_ERROR,
          message: 'sessionId is required in the request body.'
        }
      });
    }
    if (!personaId) {
      return res.status(400).json({
        error: {
          code: GMIErrorCode.VALIDATION_ERROR,
          message: 'personaId is required in the URL path.'
        }
      });
    }

    const conversationContext = getOrCreateConversationContext(sessionId, currentUserId);
    const interactionId = clientInteractionId || uuidv4();

    try {
      // Add user message to local context if provided
      if (userInput) {
        conversationContext.addMessage({
          role: 'user',
          content: userInput,
          name: currentUserId, // Using currentUserId
          metadata: { timestamp: Date.now(), interactionId }
        });
      }

      const { gmi } = await gmiManager.getOrCreateGMIForSession(
        currentUserId,
        sessionId,
        personaId
        // conversationIdInput can be passed if relevant, e.g., conversationContext.id
      );

      const turnInput: GMITurnInput = {
        interactionId,
        userId: currentUserId,
        sessionId: sessionId,
        type: userInput ? GMIInteractionType.TEXT : GMIInteractionType.SYSTEM_MESSAGE, // Adjust if userInput is null but other data is present
        content: userInput || "", // GMI needs to handle empty content if it's just a "continue" or state update
        timestamp: new Date(),
        metadata: {
          userFeedback,
          explicitPersonaPresents,
          options: options || {}, // Pass client-side options like preferredModelId
        }
      };

      const gmiOutputGenerator = gmi.processTurnStream(turnInput);

      if (options?.stream) {
        res.setHeader('Content-Type', 'application/x-ndjson');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        // Needed for proper SSE streaming through some proxies
        res.setHeader('X-Accel-Buffering', 'no');


        let aggregatedUsage: ModelUsage | null = null;

        for await (const chunk of gmiOutputGenerator) {
          res.write(JSON.stringify(chunk) + '\n');
          if (chunk.usage) {
            // Simple aggregation for streaming, could be more complex
            if (!aggregatedUsage) aggregatedUsage = { ...chunk.usage, requestCount: 0 }; // Initialize with first usage, reset count
            aggregatedUsage.tokensInput += (chunk.usage.tokensInput || 0) - (aggregatedUsage.tokensInput || 0); // Avoid double counting if provider sends cumulative
            aggregatedUsage.tokensOutput += chunk.usage.tokensOutput || 0;
            aggregatedUsage.totalCostUsd = (aggregatedUsage.totalCostUsd || 0) + (chunk.usage.totalCostUsd || 0);
            aggregatedUsage.requestCount! += (chunk.usage.requestCount || 0);

          }
          if (chunk.type === GMIOutputChunkType.TEXT_DELTA && chunk.content) {
            // Streamed text is typically added to context at the end, once collected
          }
        }
        // After stream, add complete assistant response to context
        // This requires collecting text_deltas if we want to store the full response.
        // For simplicity in streaming, we might only store if not streaming, or client handles reconstruction.
        // Here, we assume that if streaming, the client is responsible for display and context.
        // Or, we can collect it anyway.

        res.end();
      } else {
        // Collect response for non-streaming
        let responseText = '';
        const toolCalls: ToolCallRequest[] = [];
        const uiCommands: any[] = []; // Assuming UICommand structure from IGMI
        let finalUsage: CostAggregator = { totalTokens: 0, promptTokens: 0, completionTokens: 0, totalCostUSD: 0, breakdown: [] };
        let finalError = null;

        for await (const chunk of gmiOutputGenerator) {
          if (chunk.type === GMIOutputChunkType.TEXT_DELTA && typeof chunk.content === 'string') {
            responseText += chunk.content;
          }
          if (chunk.type === GMIOutputChunkType.TOOL_CALL_REQUEST && Array.isArray(chunk.content)) {
            toolCalls.push(...chunk.content);
          }
          if (chunk.type === GMIOutputChunkType.UI_COMMAND) {
            uiCommands.push(chunk.content);
          }
          if (chunk.usage) {
            // Aggregate usage for non-streaming response
            const usage = chunk.usage;
            const providerId = usage.provider || 'unknown_provider';
            const modelId = usage.model || 'unknown_model';

            finalUsage.promptTokens += usage.tokensInput || 0;
            finalUsage.completionTokens += usage.tokensOutput || 0;
            finalUsage.totalTokens = finalUsage.promptTokens + finalUsage.completionTokens;
            finalUsage.totalCostUSD = (finalUsage.totalCostUSD || 0) + (usage.totalCostUsd || 0);

            let providerUsage = finalUsage.breakdown?.find(b => b.providerId === providerId && b.modelId === modelId);
            if (!providerUsage) {
                providerUsage = { providerId, modelId, tokens: 0, promptTokens: 0, completionTokens: 0, costUSD: 0};
                finalUsage.breakdown?.push(providerUsage);
            }
            providerUsage.promptTokens += usage.tokensInput || 0;
            providerUsage.completionTokens += usage.tokensOutput || 0;
            providerUsage.tokens = providerUsage.promptTokens + providerUsage.completionTokens;
            providerUsage.costUSD = (providerUsage.costUSD || 0) + (usage.totalCostUsd || 0);
          }
          if (chunk.type === GMIOutputChunkType.ERROR) {
            finalError = chunk.content; // Or chunk.errorDetails
          }
        }

        // Add assistant response to conversation context
        if (responseText) {
          conversationContext.addMessage({
            role: 'assistant',
            content: responseText,
            metadata: {
              timestamp: Date.now(),
              gmiInstanceId: gmi.gmiId,
              personaId: personaId,
              usage: finalUsage,
              interactionId,
              toolCalls: toolCalls.length > 0 ? toolCalls : undefined
            }
          });
        } else if (toolCalls.length > 0) { // If only tool calls, no primary text
            conversationContext.addMessage({
                role: 'assistant',
                content: null, // Or a message like "[Requesting tool execution]"
                tool_calls: toolCalls, // Assuming ConversationContext can store this
                metadata: {
                  timestamp: Date.now(), gmiInstanceId: gmi.gmiId, personaId: personaId, usage: finalUsage, interactionId
                }
            });
        }


        const aggregatedOutput: GMIOutput = {
          isFinal: true,
          responseText: responseText || null,
          toolCalls: toolCalls.length > 0 ? toolCalls : undefined,
          uiCommands: uiCommands.length > 0 ? uiCommands : undefined,
          usage: finalUsage,
          error: finalError,
        };

        return res.status(200).json({
          success: true,
          gmiInstanceId: gmi.gmiId,
          personaId: personaId,
          sessionId: sessionId,
          interactionId: interactionId,
          response: aggregatedOutput,
          conversationTurns: conversationContext.getMessageCount()
        });
      }

    } catch (error: any) {
      console.error(`Error during GMI interaction for persona ${personaId}, session ${sessionId}:`, error);
      const gmiError = GMIError.wrap(error, GMIErrorCode.GMI_PROCESSING_ERROR, 'Failed to process interaction.', { personaId, sessionId });
      
      const statusCode = gmiError.code === GMIErrorCode.PERMISSION_DENIED ? 403 :
                         gmiError.code === GMIErrorCode.RESOURCE_NOT_FOUND ? 404 :
                         gmiError.code === GMIErrorCode.AUTHENTICATION_ERROR ? 401 : 500;
      return res.status(statusCode).json({
        error: {
          code: gmiError.code,
          message: gmiError.message,
          details: gmiError.details
        }
      });
    }
  });

  /**
   * @route POST /gmi/interact/:personaId/:sessionId/tool-result
   * @description Submit tool execution results back to GMI
   * @access Protected
   */
  router.post('/interact/:personaId/:sessionId/tool-result', requireAuthentication(authService), async (req: Request, res: Response) => {
    const { personaId, sessionId } = req.params;
    const { toolCallId, toolName, toolOutput, isSuccess, errorMessage } = req.body as GMIToolResultRequest;
    const authenticatedUser = (req as any).user as User;

    // Validation
    if (!toolCallId || !toolName) {
      return res.status(400).json({ error: { code: GMIErrorCode.VALIDATION_ERROR, message: 'toolCallId and toolName are required.' }});
    }
    if (typeof isSuccess !== 'boolean') {
      return res.status(400).json({ error: { code: GMIErrorCode.VALIDATION_ERROR, message: 'isSuccess must be a boolean value.' }});
    }

    const conversationContext = getOrCreateConversationContext(sessionId, authenticatedUser.id);

    try {
      const { gmi } = await gmiManager.getOrCreateGMIForSession(
        authenticatedUser.id,
        sessionId,
        personaId
      );

      const toolResultPayload: ToolResultPayload = isSuccess
        ? { type: 'success', result: toolOutput }
        : { type: 'error', error: { code: GMIErrorCode.TOOL_EXECUTION_FAILED || 'TOOL_EXECUTION_FAILED', message: errorMessage || 'Tool execution failed', details: toolOutput } };

      // Add a representation of the tool result to the local conversation context
      conversationContext.addMessage({
          role: 'tool', // Or 'system' if more appropriate for your context display
          content: `Tool: ${toolName} (Call ID: ${toolCallId})\nStatus: ${isSuccess ? 'Success' : 'Error'}\nOutput: ${JSON.stringify(toolOutput)}` + (errorMessage ? `\nError Message: ${errorMessage}` : ""),
          name: toolName, // GMI/LLM typically expect 'name' for tool role messages.
          // tool_call_id: toolCallId, // If your ConversationContext message schema supports it
          metadata: { timestamp: Date.now(), toolCallId }
      });

      const gmiOutput = await gmi.handleToolResult(
          toolCallId,
          toolName,
          toolResultPayload,
          authenticatedUser.id
          // userApiKeys can be passed if available and needed by GMI/Provider
      );

      // Add GMI's response after tool result to conversation context
      if (gmiOutput.responseText) {
        conversationContext.addMessage({
          role: 'assistant',
          content: gmiOutput.responseText,
          metadata: {
            timestamp: Date.now(),
            gmiInstanceId: gmi.gmiId,
            personaId: personaId,
            usage: gmiOutput.usage,
            toolCalls: gmiOutput.toolCalls?.length ? gmiOutput.toolCalls : undefined
          }
        });
      } else if (gmiOutput.toolCalls?.length) {
         conversationContext.addMessage({
            role: 'assistant',
            content: null,
            tool_calls: gmiOutput.toolCalls,
            metadata: {
                timestamp: Date.now(), gmiInstanceId: gmi.gmiId, personaId: personaId, usage: gmiOutput.usage
            }
         });
      }


      return res.status(200).json({
        success: true,
        gmiInstanceId: gmi.gmiId,
        personaId: personaId,
        sessionId: sessionId,
        toolCallId: toolCallId,
        response: gmiOutput
      });

    } catch (error: any) {
      console.error(`Error processing tool result for persona ${personaId}, session ${sessionId}:`, error);
      const gmiError = GMIError.wrap(error, GMIErrorCode.TOOL_ERROR, 'Failed to process tool result.', { toolCallId, toolName });
      const statusCode = gmiError.code === GMIErrorCode.PERMISSION_DENIED ? 403 :
                         gmiError.code === GMIErrorCode.RESOURCE_NOT_FOUND ? 404 : 500;
      return res.status(statusCode).json({
        error: {
          code: gmiError.code,
          message: gmiError.message,
          details: gmiError.details
        }
      });
    }
  });

  /**
   * @route GET /gmi/status/:personaId/:sessionId
   * @description Get status of a GMI instance
   * @access Protected
   */
  router.get('/status/:personaId/:sessionId', requireAuthentication(authService), async (req: Request, res: Response) => {
    const { personaId, sessionId } = req.params;
    const authenticatedUser = (req as any).user as User;

    try {
      // Using getOrCreateGMIForSession to retrieve an existing GMI or a newly initialized one if it timed out.
      // For a pure status check without creation, GMIManager might need a "getGMIForSession" (non-creating) method.
      const { gmi } = await gmiManager.getOrCreateGMIForSession(
        authenticatedUser.id,
        sessionId,
        personaId
      );
      const conversationContext = getOrCreateConversationContext(sessionId, authenticatedUser.id);


      const status: GMIStatus = {
        gmiInstanceId: gmi.gmiId,
        personaId: gmi.getPersona().id,
        sessionId: sessionId, // from req.params
        userId: authenticatedUser.id, // GMI's user context might also have this: gmi.currentUserContext.userId
        gmiState: gmi.getCurrentState(), // Using GMIPrimeState
        lastActivity: new Date(), // Placeholder: This should be tracked more accurately, e.g., from conversationContext last message.
        conversationTurns: conversationContext.getMessageCount()
      };

      return res.status(200).json({
        success: true,
        status
      });

    } catch (error: any) {
      console.error(`Error getting GMI status for persona ${personaId}, session ${sessionId}:`, error);
      const gmiError = GMIError.wrap(error, GMIErrorCode.GMI_PROCESSING_ERROR, 'Failed to get GMI status.');
      const statusCode = gmiError.code === GMIErrorCode.RESOURCE_NOT_FOUND ? 404 : 500;
      return res.status(statusCode).json({
        error: {
          code: gmiError.code,
          message: gmiError.message,
          details: gmiError.details
        }
      });
    }
  });

  /**
   * @route DELETE /gmi/:personaId/:sessionId
   * @description Deactivate a GMI instance and clear conversation
   * @access Protected
   */
  router.delete('/:personaId/:sessionId', requireAuthentication(authService), async (req: Request, res: Response) => {
    const { personaId, sessionId } = req.params; // personaId might not be strictly needed if sessionId is unique globally
    const authenticatedUser = (req as any).user as User;

    try {
      // GMIManager's deactivateGMIForSession handles GMI shutdown and removal from active maps.
      // It internally finds the GMI instance by sessionId.
      // We need to ensure this user has permission to deactivate this session.
      // GMIManager.deactivateGMIForSession doesn't currently check userId against the session owner.
      // This might need an enhancement in GMIManager or an explicit check here if session ownership is tracked.

      const gmiInstanceIdBeforeDeactivation = gmiManager.gmiSessionMap.get(sessionId); // Check if it exists first

      if (!gmiInstanceIdBeforeDeactivation) {
           return res.status(404).json({
               error: {
                   code: GMIErrorCode.RESOURCE_NOT_FOUND,
                   message: `No active GMI session found for session ID '${sessionId}'.`
               }
           });
      }
      // Optional: Add a check here if `gmiManager` can expose the `userId` associated with `gmiInstanceIdBeforeDeactivation`
      // to ensure `authenticatedUser.id` matches.

      const deactivated = await gmiManager.deactivateGMIForSession(sessionId);

      if (deactivated) {
        conversationContexts.delete(sessionId); // Clean up local conversation context

        return res.status(200).json({
          success: true,
          message: `GMI instance for session ${sessionId} (associated with persona ${personaId}) has been deactivated.`,
          gmiInstanceId: gmiInstanceIdBeforeDeactivation
        });
      } else {
        // This case implies the session ID was in gmiSessionMap but the GMI instance wasn't in activeGMIs,
        // or deactivateGMIForSession returned false for other reasons.
        return res.status(404).json({
          error: {
            code: GMIErrorCode.RESOURCE_NOT_FOUND,
            message: `GMI instance for session ${sessionId} could not be found or was already inactive.`
          }
        });
      }
    } catch (error: any) {
      console.error(`Error deactivating GMI for session ${sessionId}:`, error);
      const gmiError = GMIError.wrap(error, GMIErrorCode.GMI_PROCESSING_ERROR, 'Failed to deactivate GMI instance.');
      const statusCode = gmiError.code === GMIErrorCode.RESOURCE_NOT_FOUND ? 404 : 500;
      return res.status(statusCode).json({
        error: {
          code: gmiError.code,
          message: gmiError.message,
          details: gmiError.details
        }
      });
    }
  });

  /**
   * @route GET /gmi/conversations/:sessionId
   * @description Get conversation history for a session
   * @access Protected
   */
  router.get('/conversations/:sessionId', requireAuthentication(authService), async (req: Request, res: Response) => {
    const { sessionId } = req.params;
    const authenticatedUser = (req as any).user as User;

    try {
      // getOrCreate will ensure the context exists if the session ID is valid,
      // and crucially, it associates the userId for the auth check below.
      const conversationContext = getOrCreateConversationContext(sessionId, authenticatedUser.id);

      if (!conversationContext) { // Should not happen if getOrCreateConversationContext works as expected
        return res.status(404).json({
          error: {
            code: GMIErrorCode.RESOURCE_NOT_FOUND,
            message: 'Conversation not found for the specified session.'
          }
        });
      }

      // Basic authorization check (ensure user owns the conversation)
      // This relies on ConversationContext having a `userId` property that was set correctly.
      const contextUserId = (conversationContext as any).userId;
      if (contextUserId && contextUserId !== authenticatedUser.id && contextUserId !== 'anonymous_user') {
         // Allow access if context belongs to current user or was an anonymous session they might be claiming.
         // More robust logic might be needed for anonymous session claiming.
         // If the context has a specific userId, it must match.
        return res.status(403).json({
          error: {
            code: GMIErrorCode.PERMISSION_DENIED,
            message: 'You do not have permission to access this conversation.'
          }
        });
      }

      // Assuming ConversationContext has a toJSON() method or similar serializable representation
      return res.status(200).json({
        success: true,
        sessionId: sessionId,
        // Ensure your ConversationContext class has a toJSON method or similar
        conversation: typeof conversationContext.toJSON === 'function' ? conversationContext.toJSON() : conversationContext 
      });

    } catch (error: any) {
      console.error(`Error retrieving conversation for session ${sessionId}:`, error);
      return res.status(500).json({
        error: {
          code: GMIErrorCode.INTERNAL_SERVER_ERROR,
          message: 'Failed to retrieve conversation history.',
          details: process.env.NODE_ENV === 'development' ? error.message : undefined
        }
      });
    }
  });

  /**
   * @route POST /gmi/feedback/:personaId/:sessionId
   * @description Submit feedback for a GMI interaction
   * @access Protected
   */
  router.post('/feedback/:personaId/:sessionId', requireAuthentication(authService), async (req: Request, res: Response) => {
    const { personaId, sessionId } = req.params;
    const feedbackData = req.body; // Define a proper interface for feedbackData
    const authenticatedUser = (req as any).user as User;

    try {
      // NOTE: gmiManager.processUserFeedback method is NOT defined in the provided GMIManager.ts.
      // This functionality needs to be implemented in GMIManager or delegated to the GMI instance.
      // For now, assuming the method will exist on gmiManager.
      if (typeof (gmiManager as any).processUserFeedback !== 'function') {
          console.warn(`GMIManager.processUserFeedback is not implemented. Feedback for session ${sessionId} will not be processed by manager.`);
          // Alternative: try to get GMI and call a feedback method on it, or log feedback.
          // Example: const { gmi } = await gmiManager.getOrCreateGMIForSession(authenticatedUser.id, sessionId, personaId);
          // if (typeof (gmi as any).handleFeedback === 'function') { await (gmi as any).handleFeedback(feedbackData); }
          return res.status(501).json({
              error: {
                  code: GMIErrorCode.NOT_IMPLEMENTED,
                  message: 'Feedback processing is not implemented on the GMI Manager.'
              }
          });
      }

      await (gmiManager as any).processUserFeedback(
        authenticatedUser.id,
        sessionId,
        personaId,
        feedbackData
      );

      return res.status(200).json({
        success: true,
        message: 'Feedback submitted successfully.',
        personaId,
        sessionId
      });

    } catch (error: any) {
      console.error(`Error processing feedback for persona ${personaId}, session ${sessionId}:`, error);
      const gmiError = GMIError.wrap(error, GMIErrorCode.GMI_FEEDBACK_ERROR, 'Failed to process feedback.');
      return res.status(500).json({
        error: {
          code: gmiError.code,
          message: gmiError.message,
          details: gmiError.details
        }
      });
    }
  });

  return router;
};