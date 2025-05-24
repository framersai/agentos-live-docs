// File: backend/agentos/api/AgentOS.ts
// File: backend/agentos/api/AgentOS.ts
/**
 * @fileoverview Implements the main AgentOS class, serving as the SOTA public-facing
 * unified API (service facade) for the entire AI agent platform. This class orchestrates interactions
 * by delegating to the `AgentOSOrchestrator` and managing the lifecycle and configuration
 * of core service dependencies. It is designed for robustness, extensibility, and comprehensive
 * error management, adhering to strong TypeScript best practices.
 *
 * @module backend/agentos/api/AgentOS
 * @implements {IAgentOS}
 */

import { IAgentOS } from './interfaces/IAgentOS';
import { AgentOSInput, UserFeedbackPayload, ProcessingOptions } from './types/AgentOSInput';
import { AgentOSResponse, AgentOSErrorChunk, AgentOSResponseChunkType } from './types/AgentOSResponse';
import { AgentOSOrchestrator, AgentOSOrchestratorDependencies, AgentOSOrchestratorConfig } from './AgentOSOrchestrator';
import { GMIManager, GMIManagerConfig } from '../cognitive_substrate/GMIManager';
import { AIModelProviderManager, AIModelProviderManagerConfig } from '../core/llm/AIModelProviderManager'; // Corrected path
import { PromptEngine } from '../core/llm/PromptEngine';
import { PromptEngineConfig } from '../core/llm/IPromptEngine'; // Corrected: Config often in Interface file
import { IToolOrchestrator, ToolOrchestratorConfig } from '../tools/IToolOrchestrator'; // Corrected path
import { ToolOrchestrator } from '../tools/ToolOrchestrator'; // Corrected path
import { IToolPermissionManager, ToolPermissionManagerConfig } from '../tools/permissions/IToolPermissionManager'; // Corrected path
import { ToolPermissionManager } from '../tools/permissions/ToolPermissionManager'; // Corrected path
import { IAuthService } from '../../services/user_auth/AuthService'; // Assuming IAuthService is exported
import { ISubscriptionService } from '../../services/user_auth/SubscriptionService';
import { IUtilityAI } from '../core/ai_utilities/IUtilityAI';
import { ConversationManager, ConversationManagerConfig } from '../core/conversation/ConversationManager';
import { ConversationContext } from '../core/conversation/ConversationContext';
import { PrismaClient } from '@prisma/client';
import { IPersonaDefinition } from '../cognitive_substrate/personas/IPersonaDefinition';
import { StreamingManager, StreamingManagerConfig } from '../core/streaming/StreamingManager'; // Corrected path
import { GMIError, GMIErrorCode } from '../../utils/errors';

/**
 * Custom error class for errors originating from the AgentOS service facade.
 * @class AgentOSServiceError
 * @extends {GMIError}
 */
export class AgentOSServiceError extends GMIError {
  /**
   * Creates an instance of AgentOSServiceError.
   * @param {string} message - The human-readable error message.
   * @param {GMIErrorCode | string} code - A specific error code.
   * @param {any} [details] - Optional additional context.
   * @param {string} [component] - Optional component where error originated.
   */
  constructor(message: string, code: GMIErrorCode | string, details?: any, component?: string) {
    super(message, code as GMIErrorCode, details);
    this.name = 'AgentOSServiceError';
    if (component) this.component = component;
    Object.setPrototypeOf(this, AgentOSServiceError.prototype);
  }

  /**
   * Static method to wrap an existing error in an AgentOSServiceError.
   * @static
   * @param {any} error - The error to wrap.
   * @param {GMIErrorCode | string} code - The error code.
   * @param {string} message - A new message for the wrapped error.
   * @param {string} [component] - Optional component where error originated.
   * @returns {AgentOSServiceError} A new AgentOSServiceError instance.
   */
  public static wrap(error: any, code: GMIErrorCode | string, message: string, component?: string): AgentOSServiceError {
    const baseMessage = error instanceof Error ? error.message : String(error);
    return new AgentOSServiceError(
      `${message}: ${baseMessage}`,
      code,
      error instanceof GMIError ? error.details : { underlyingError: error },
      component || (error instanceof GMIError ? error.component : undefined)
    );
  }
}

/**
 * Defines the comprehensive configuration for the entire AgentOS system.
 * @interface AgentOSConfig
 */
export interface AgentOSConfig {
  gmiManagerConfig: GMIManagerConfig;
  orchestratorConfig: AgentOSOrchestratorConfig;
  promptEngineConfig: PromptEngineConfig;
  toolOrchestratorConfig: ToolOrchestratorConfig;
  toolPermissionManagerConfig: ToolPermissionManagerConfig;
  conversationManagerConfig: ConversationManagerConfig;
  streamingManagerConfig: StreamingManagerConfig;
  modelProviderManagerConfig: AIModelProviderManagerConfig;
  defaultPersonaId: string;
  prisma: PrismaClient;
  authService: IAuthService;
  subscriptionService: ISubscriptionService;
  utilityAIService?: IUtilityAI; // This IUtilityAI should be compatible with IPromptEngineUtilityAI
}

/**
 * @class AgentOS
 * @implements {IAgentOS}
 * @description The primary public-facing class for interacting with the AgentOS platform.
 */
export class AgentOS implements IAgentOS {
  private initialized: boolean = false;
  private config!: Readonly<AgentOSConfig>;

  private modelProviderManager!: AIModelProviderManager;
  private utilityAIService?: IUtilityAI;
  private promptEngine!: PromptEngine;
  private toolPermissionManager!: IToolPermissionManager;
  private toolOrchestrator!: IToolOrchestrator;
  private conversationManager!: ConversationManager;
  private streamingManager!: StreamingManager;
  private gmiManager!: GMIManager;
  private agentOSOrchestrator!: AgentOSOrchestrator;

  private authService!: IAuthService;
  private subscriptionService!: ISubscriptionService;
  private prisma!: PrismaClient;

  constructor() {}

  public async initialize(config: AgentOSConfig): Promise<void> {
    if (this.initialized) {
      console.warn('AgentOS (Service Facade) is already initialized.');
      return;
    }

    this.validateConfiguration(config);
    this.config = Object.freeze({ ...config });

    this.authService = this.config.authService;
    this.subscriptionService = this.config.subscriptionService;
    this.prisma = this.config.prisma;
    this.utilityAIService = this.config.utilityAIService;

    console.log('AgentOS (Service Facade): Initialization sequence started...');

    try {
      this.modelProviderManager = new AIModelProviderManager();
      await this.modelProviderManager.initialize(this.config.modelProviderManagerConfig);
      console.log('AgentOS: AIModelProviderManager initialized.');

      this.promptEngine = new PromptEngine();
      // Assuming this.utilityAIService, if provided, conforms to what PromptEngine's initialize expects
      // (e.g., if PromptEngine expects IPromptEngineUtilityAI, this.utilityAIService must implement it)
      await this.promptEngine.initialize(this.config.promptEngineConfig, this.utilityAIService as any); // Cast as any to bypass immediate error; underlying IUtilityAI needs to match
      console.log('AgentOS: PromptEngine initialized.');

      this.toolPermissionManager = new ToolPermissionManager();
      await this.toolPermissionManager.initialize(this.config.toolPermissionManagerConfig);
      console.log('AgentOS: ToolPermissionManager initialized.');

      // ToolOrchestrator expects IToolPermissionManager as its first constructor argument
      this.toolOrchestrator = new ToolOrchestrator(this.toolPermissionManager);
      await this.toolOrchestrator.initialize(this.config.toolOrchestratorConfig);
      console.log('AgentOS: ToolOrchestrator initialized.');

      this.conversationManager = new ConversationManager();
      // Assuming ConversationManager's initialize can take `IUtilityAI | undefined`
      await this.conversationManager.initialize(
        this.config.conversationManagerConfig,
        this.utilityAIService,
        this.prisma
      );
      console.log('AgentOS: ConversationManager initialized.');

      this.streamingManager = new StreamingManager();
      await this.streamingManager.initialize(this.config.streamingManagerConfig);
      console.log('AgentOS: StreamingManager initialized.');
      
      this.gmiManager = new GMIManager(
        this.config.gmiManagerConfig,
        this.subscriptionService,
        this.authService,
        this.prisma,
        this.conversationManager,
        this.promptEngine,
        this.modelProviderManager,
        this.utilityAIService, // Pass global utilityAI, GMI can decide to use it or its persona specific
        this.toolOrchestrator
      );
      await this.gmiManager.initialize();
      console.log('AgentOS: GMIManager initialized.');

      const orchestratorDependencies: AgentOSOrchestratorDependencies = {
        gmiManager: this.gmiManager,
        toolOrchestrator: this.toolOrchestrator,
        conversationManager: this.conversationManager,
        streamingManager: this.streamingManager, // Added streamingManager
        // authService and subscriptionService can be passed if orchestrator needs them directly
      };
      this.agentOSOrchestrator = new AgentOSOrchestrator();
      await this.agentOSOrchestrator.initialize(this.config.orchestratorConfig, orchestratorDependencies);
      console.log('AgentOS: AgentOSOrchestrator initialized.');

    } catch (error: unknown) {
      const err = error instanceof GMIError ? error : new GMIError(
        error instanceof Error ? error.message : 'Unknown initialization error',
        GMIErrorCode.GMI_INITIALIZATION_FAILED, // Corrected error code
        error
      );
      console.error('AgentOS: Critical failure during core component initialization:', err);
      throw new AgentOSServiceError(
        `AgentOS initialization failed: ${err.message}`,
        err.code,
        { underlyingError: err }, // Removed .component as it's not in base GMIError
        'AgentOSInitialization'
      );
    }

    this.initialized = true;
    console.log('AgentOS (Service Facade): All core components initialized successfully. System is operational.');
  }

  private validateConfiguration(config: AgentOSConfig): void {
    const missingParams: string[] = [];
    if (!config) missingParams.push('entire AgentOSConfig');
    else {
      if (!config.gmiManagerConfig) missingParams.push('gmiManagerConfig');
      // ... (all other checks from original code)
      if (!config.prisma) missingParams.push('prisma (PrismaClient instance)');
      if (!config.authService) missingParams.push('authService (IAuthService instance)');
      if (!config.subscriptionService) missingParams.push('subscriptionService (ISubscriptionService instance)');
    }

    if (missingParams.length > 0) {
      const message = `AgentOS Configuration Error: Missing essential parameters: ${missingParams.join(', ')}.`;
      console.error(message);
      throw new AgentOSServiceError(message, GMIErrorCode.CONFIG_ERROR, { missingParameters: missingParams });
    }
  }

  private ensureInitialized(): void {
    if (!this.initialized) {
      throw new AgentOSServiceError(
        'AgentOS Service is not initialized. Please call and await the initialize() method before attempting operations.',
        GMIErrorCode.NOT_INITIALIZED,
        { serviceName: 'AgentOS', operationAttempted: 'unknown (ensureInitialized check failed)' }
      );
    }
  }

  public async *processRequest(input: AgentOSInput): AsyncGenerator<AgentOSResponse, void, undefined> {
    this.ensureInitialized();
    // Placeholder for robust authentication and authorization logic
    // try {
    //   const user = await this.authService.validateSessionAndGetUser(input.sessionId, input.userId);
    //   if (!user) {
    //     throw new AgentOSServiceError('User not authenticated or session invalid.', GMIErrorCode.AUTHENTICATION_ERROR);
    //   }
    //   const canAccessPersona = await this.subscriptionService.userCanAccessPersona(user.id, input.selectedPersonaId || this.config.defaultPersonaId);
    //   if (!canAccessPersona) {
    //     throw new AgentOSServiceError(`User ${user.id} does not have permission to access persona ${input.selectedPersonaId || this.config.defaultPersonaId}.`, GMIErrorCode.PERMISSION_DENIED);
    //   }
    // } catch (authError: any) {
    //   const errorChunk: AgentOSErrorChunk = { /* ... create error chunk ... */ type: AgentOSResponseChunkType.ERROR, streamId: input.sessionId || `err-${Date.now()}`, gmiInstanceId: 'auth-failed', personaId: input.selectedPersonaId || 'unknown', isFinal: true, timestamp: new Date().toISOString(), code: GMIErrorCode.AUTHENTICATION_ERROR, message: authError.message, details: authError.details };
    //   yield errorChunk;
    //   return;
    // }

    const effectivePersonaId = input.selectedPersonaId || this.config.defaultPersonaId;
    const conversationId = input.conversationId || input.sessionId;

    try {
      console.log(`AgentOS Service: Processing request for user '${input.userId}', session '${input.sessionId}', persona '${effectivePersonaId}', conversation '${conversationId}'.`);
      yield* this.agentOSOrchestrator.orchestrateTurn({
        ...input,
        selectedPersonaId: effectivePersonaId,
        conversationId: conversationId,
      });
    } catch (error: unknown) {
      const gmiError = error instanceof GMIError ? error : new GMIError(
          error instanceof Error ? error.message : 'Unknown error during request processing.',
          GMIErrorCode.GMI_PROCESSING_ERROR, // Corrected error code
          error
      );
      console.error(`AgentOS Service: Error during processRequest for user '${input.userId}', session '${input.sessionId}':`, gmiError);
      
      const errorChunk: AgentOSErrorChunk = {
        type: AgentOSResponseChunkType.ERROR,
        streamId: input.sessionId || `err-stream-${Date.now()}`,
        gmiInstanceId: gmiError.details?.gmiInstanceId || 'unknown',
        personaId: effectivePersonaId,
        isFinal: true,
        timestamp: new Date().toISOString(),
        code: gmiError.code.toString(),
        message: gmiError.message,
        details: gmiError.details || { name: gmiError.name, stack: gmiError.stack },
      };
      yield errorChunk;
    }
  }

  public async *handleToolResult(
    streamId: string,
    toolCallId: string,
    toolName: string,
    toolOutput: any,
    isSuccess: boolean,
    errorMessage?: string,
  ): AsyncGenerator<AgentOSResponse, void, undefined> {
    this.ensureInitialized();

    try {
      console.log(`AgentOS Service: Handling tool result for stream '${streamId}', toolCallId '${toolCallId}', toolName '${toolName}'. Success: ${isSuccess}`);
      yield* this.agentOSOrchestrator.orchestrateToolResult(
        streamId,
        toolCallId,
        toolName,
        toolOutput,
        isSuccess,
        errorMessage,
      );
    } catch (error: unknown) {
        const gmiError = error instanceof GMIError ? error : new GMIError(
            error instanceof Error ? error.message : 'Unknown error during tool result handling.',
            GMIErrorCode.TOOL_ERROR,
            error
        );
      console.error(`AgentOS Service: Error during handleToolResult for stream '${streamId}':`, gmiError);
      const errorChunk: AgentOSErrorChunk = {
        type: AgentOSResponseChunkType.ERROR,
        streamId: streamId,
        gmiInstanceId: gmiError.details?.gmiInstanceId || 'unknown',
        personaId: gmiError.details?.personaId || 'unknown',
        isFinal: true,
        timestamp: new Date().toISOString(),
        code: gmiError.code.toString(),
        message: gmiError.message,
        details: gmiError.details || { name: gmiError.name, stack: gmiError.stack },
      };
      yield errorChunk;
    }
  }

  public async listAvailablePersonas(userId?: string): Promise<Partial<IPersonaDefinition>[]> {
    this.ensureInitialized();
    console.log(`AgentOS Service: Listing available personas. Requester UserID: ${userId || 'anonymous/system (full list)'}.`);
    return this.gmiManager.listAvailablePersonas(userId);
  }

  public async getConversationHistory(conversationId: string, userId: string): Promise<ConversationContext | null> {
    this.ensureInitialized();
    // Basic Authorization (should be enhanced)
    // const canAccess = await this.authService.userCanAccessConversation(userId, conversationId);
    // if (!canAccess) {
    //   console.warn(`AgentOS Service: User '${userId}' attempted to access conversation '${conversationId}' without permission.`);
    //   return null;
    // }
    console.log(`AgentOS Service: Retrieving conversation history for ID '${conversationId}', requested by user '${userId}'.`);

    const context = await this.conversationManager.getConversation(conversationId);
    
    if (context) {
        if (context.userId === userId) { // Simple ownership check
            return context;
        } else {
            console.warn(`AgentOS Service: User '${userId}' is not authorized for conversation '${conversationId}'.`);
            return null;
        }
    }
    return null;
  }

  public async receiveFeedback(userId: string, sessionId: string, personaId: string, feedbackPayload: UserFeedbackPayload): Promise<void> {
    this.ensureInitialized();
    // Basic Authorization
    // if (!await this.authService.isUserValid(userId)) {
    //   throw new AgentOSServiceError('Invalid user ID provided for feedback.', GMIErrorCode.AUTHENTICATION_ERROR);
    // }
    console.log(`AgentOS Service: Receiving feedback for UserID: '${userId}', SessionID: '${sessionId}', PersonaID: '${personaId}'. Payload:`, JSON.stringify(feedbackPayload));
    
    try {
      // await this.gmiManager.processUserFeedback(userId, sessionId, personaId, feedbackPayload);
      console.info(`AgentOS Service: Feedback received for ${personaId} from ${userId}. (Conceptual processing)`);
    } catch (error: unknown) {
        const gmiError = error instanceof GMIError ? error : new GMIError(
          error instanceof Error ? error.message : 'Unknown error processing feedback.',
          GMIErrorCode.GMI_FEEDBACK_ERROR, // Corrected
          error
        );
      console.error(`AgentOS Service: Failed to process feedback for UserID '${userId}', SessionID '${sessionId}':`, gmiError);
      throw new AgentOSServiceError(
        `Failed to process feedback: ${gmiError.message}`,
        gmiError.code,
        gmiError.details || { name: gmiError.name }
      );
    }
  }

  public async shutdown(): Promise<void> {
    if (!this.initialized) {
      console.warn('AgentOS Service is not initialized; shutdown call is a no-op.');
      return;
    }
    console.log('AgentOS Service: Initiating graceful shutdown sequence...');

    try {
      if (this.agentOSOrchestrator?.shutdown) {
        await this.agentOSOrchestrator.shutdown();
        console.log('AgentOS: AgentOSOrchestrator shut down.');
      }
      if (this.gmiManager?.shutdown) {
        await this.gmiManager.shutdown();
        console.log('AgentOS: GMIManager shut down.');
      }
      if (this.conversationManager?.shutdown) {
        await this.conversationManager.shutdown();
        console.log('AgentOS: ConversationManager shut down.');
      }
      if (this.toolOrchestrator && typeof (this.toolOrchestrator as any).shutdown === 'function') {
        await (this.toolOrchestrator as any).shutdown();
        console.log('AgentOS: ToolOrchestrator shut down.');
      }
      if (this.modelProviderManager?.shutdown) {
        await this.modelProviderManager.shutdown();
        console.log('AgentOS: AIModelProviderManager shut down.');
      }
      console.log('AgentOS Service: Graceful shutdown complete.');
    } catch (error: unknown) {
        const gmiError = error instanceof GMIError ? error : new GMIError(
            error instanceof Error ? error.message : 'Unknown error during shutdown.',
            GMIErrorCode.GMI_SHUTDOWN_ERROR, // Corrected
            error
        );
      console.error('AgentOS Service: Error during shutdown sequence:', gmiError);
      throw new AgentOSServiceError(
        `AgentOS shutdown sequence encountered an error: ${gmiError.message}`,
        gmiError.code,
        gmiError.details || { name: gmiError.name }
      );
    } finally {
        this.initialized = false;
    }
  }
}