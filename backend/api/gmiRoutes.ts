// backend/api/gmiRoutes.ts

import { Router, Request, Response, NextFunction } from 'express';
import { GMIManager } from '../cognitive_substrate/GMIManager';
import { ConversationContext } from '../core/conversation/ConversationContext';
import { IAuthService, User } from '../services/user_auth/AuthService'; // User might be Omit<User, 'passwordHash'>
import { GMITurnInput } from '../cognitive_substrate/IGMI';
import { IProvider } from '../core/llm/providers/IProvider'; // For passing the provider
import { AIModelProviderManager } from '../core/llm/providers/AIModelProviderManager'; // To get a provider

// Middleware to authenticate and attach user (similar to authRoutes)
// This should be a shared middleware if possible.
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


export const createGMIRoutes = (
    gmiManager: GMIManager,
    authService: IAuthService,
    providerManager: AIModelProviderManager // To select appropriate provider based on context/tier
): Router => {
  const router = Router();

  // In-memory store for conversation contexts for MVP.
  // In production, use Redis or a DB.
  const conversationContexts = new Map<string, ConversationContext>();

  const getOrCreateConversationContext = (sessionId: string): ConversationContext => {
    if (!conversationContexts.has(sessionId)) {
      // TODO: ConversationContextConfig could be dynamic based on user tier
      const newContext = new ConversationContext(sessionId, { maxHistoryLengthMessages: 50 });
      // newContext.initialize({ utilityAI: someUtilityAIService }); // If context needs utilityAI
      conversationContexts.set(sessionId, newContext);
    }
    return conversationContexts.get(sessionId)!;
  };


  router.post('/interact/:personaId', authenticateAndAttachUserOptional(authService), async (req: Request, res: Response) => {
    const { personaId } = req.params;
    const { userInput, sessionId, userFeedback, explicitPersonaPresents } = req.body; // sessionId is crucial
    const authenticatedUser = (req as any).user as Omit<User, 'passwordHash'> | undefined;

    if (!sessionId || typeof sessionId !== 'string') {
        return res.status(400).json({ message: 'sessionId is required in the request body.' });
    }
    if (userInput === undefined || userInput === null) { // userInput can be null (e.g. GMI acting on tool result or proactively)
        // For now, require some input or a trigger type
        // return res.status(400).json({ message: 'userInput is required.'});
    }

    const conversationContext = getOrCreateConversationContext(sessionId);
    if (userInput) { // Add user message to context if provided
        conversationContext.addMessage({
            role: 'user', // Assuming MessageRole.USER = 'user'
            content: userInput,
            name: authenticatedUser?.id || 'anonymous_user',
            metadata: { timestamp: Date.now() }
        });
    }


    try {
      // Determine which LLM provider to use based on user tier, persona preference, etc.
      // This is a simplified selection for MVP.
      const userTierId = authenticatedUser?.subscriptionTierId;
      const personaDef = gmiManager.getPersonaDefinition(personaId);

      let providerIdToUse: string | undefined;
      if (personaDef?.modelTargetPreferences && personaDef.modelTargetPreferences.length > 0) {
          // TODO: More sophisticated selection based on userTierId and persona.costSavingStrategy
          providerIdToUse = personaDef.modelTargetPreferences[0].providerId || providerManager.getDefaultProvider()?.providerId;
      } else {
          providerIdToUse = providerManager.getDefaultProvider()?.providerId;
      }

      if (!providerIdToUse) {
        console.error("GMI Routes: Could not determine a provider to use.");
        return res.status(500).json({message: "Internal configuration error: No suitable AI model provider found."});
      }
      const llmProvider = providerManager.getProvider(providerIdToUse);
      if (!llmProvider) {
        console.error(`GMI Routes: Provider '${providerIdToUse}' not found in ProviderManager.`);
        return res.status(500).json({message: `Internal configuration error: AI model provider '${providerIdToUse}' not available.`});
      }


      const gmi = await gmiManager.getOrCreateGMIForPersona(
        sessionId,
        authenticatedUser?.id || null,
        personaId,
        conversationContext,
        authenticatedUser as User | undefined // Cast because full User might be needed by some checks
      );

      const turnInput: GMITurnInput = {
        userInput: userInput || null,
        conversationContext,
        llmProvider, // Pass the resolved provider
        // availableTools: load tools based on persona gmi.currentPersona.toolIds
        userFeedback,
        explicitPersonaPresents
      };

      const gmiOutput = await gmi.processTurn(turnInput);
      return res.status(200).json(gmiOutput);

    } catch (error: any) {
      console.error(`Error during GMI interaction for persona ${personaId}, session ${sessionId}:`, error);
      if (error.message.includes('does not have access') || error.message.includes('requires authentication')) {
        return res.status(403).json({ message: error.message });
      }
      if (error.message.includes('not found or not loaded')) {
        return res.status(404).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Failed to process interaction with GMI.' });
    }
  });
  
  // TODO: Add route for GMI handling tool results, if orchestrator doesn't handle it internally
  // router.post('/interact/:personaId/:sessionId/tool-result', ...)


  return router;
};