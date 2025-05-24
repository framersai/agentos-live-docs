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
import { AIModelProviderManager, AIModelProviderManagerConfig } from '../core/llm/providers/AIModelProviderManager';
import { PromptEngine, PromptEngineConfig } from '../core/llm/PromptEngine';
import { IToolOrchestrator } from '../tools/IToolOrchestrator';
import { ToolOrchestrator, ToolOrchestratorConfig } from '../tools/ToolOrchestrator';
import { IToolPermissionManager } from '../tools/permissions/IToolPermissionManager';
import { ToolPermissionManager, ToolPermissionManagerConfig } from '../tools/permissions/ToolPermissionManager';
import { IAuthService } from '../../services/user_auth/AuthService';
import { ISubscriptionService } from '../../services/user_auth/SubscriptionService';
import { IUtilityAI } from '../core/ai_utilities/IUtilityAI';
import { ConversationManager, ConversationManagerConfig } from '../core/conversation/ConversationManager';
import { ConversationContext } from '../core/conversation/ConversationContext';
import { PrismaClient } from '@prisma/client';
import { IPersonaDefinition } from '../cognitive_substrate/personas/IPersonaDefinition';
import { StreamingManager, StreamingManagerConfig } from '../core/streaming/StreamingManager';
import { GMIError, GMIErrorCode } from '../../utils/errors';

/**
 * Custom error class for errors originating from the AgentOS service facade.
 * This allows for specific error identification and handling related to the AgentOS API layer.
 *
 * @class AgentOSServiceError
 * @extends {GMIError}
 */
export class AgentOSServiceError extends GMIError {
  /**
   * Creates an instance of AgentOSServiceError.
   * @param {string} message - The human-readable error message.
   * @param {GMIErrorCode | string} code - A specific error code, ideally from `GMIErrorCode` or a related enum.
   * @param {any} [details] - Optional additional context, structured data, or the underlying error instance.
   */
  constructor(message: string, code: GMIErrorCode | string, details?: any) {
    super(message, code as GMIErrorCode, details); // Base GMIError handles general structure
    this.name = 'AgentOSServiceError'; // Specific name for this error type
    Object.setPrototypeOf(this, AgentOSServiceError.prototype); // Maintain prototype chain
  }
}

/**
 * Defines the comprehensive configuration for the entire AgentOS system.
 * This configuration is typically loaded at application startup and used to
 * initialize AgentOS and its dependent services. Each sub-configuration should
 * be clearly defined and validated.
 *
 * @interface AgentOSConfig
 * @property {GMIManagerConfig} gmiManagerConfig - Configuration for the GMIManager, including persona loading paths.
 * @property {AgentOSOrchestratorConfig} orchestratorConfig - Configuration for the AgentOSOrchestrator, like turn timeouts.
 * @property {PromptEngineConfig} promptEngineConfig - Configuration for the PromptEngine, including template paths and default settings.
 * @property {ToolOrchestratorConfig} toolOrchestratorConfig - Configuration for the ToolOrchestrator.
 * @property {ToolPermissionManagerConfig} toolPermissionManagerConfig - Configuration for the ToolPermissionManager.
 * @property {ConversationManagerConfig} conversationManagerConfig - Configuration for the ConversationManager, including persistence settings.
 * @property {StreamingManagerConfig} streamingManagerConfig - Configuration for the StreamingManager, e.g., buffer sizes.
 * @property {AIModelProviderManagerConfig} modelProviderManagerConfig - Configuration for AIModelProviderManager, detailing available LLM providers.
 * @property {string} defaultPersonaId - The ID of the default persona to use if none is specified by the user or session.
 * @property {PrismaClient} prisma - The Prisma client instance for database access, shared across services needing DB interaction.
 * @property {IAuthService} authService - Injected authentication service instance, responsible for user verification and session management.
 * @property {ISubscriptionService} subscriptionService - Injected subscription service instance, managing user entitlements and feature access.
 * @property {IUtilityAI} [utilityAIService] - Optional globally configured utility AI service.
 * Specific GMIs or Personas can also instantiate or be configured with their own IUtilityAI instances if needed.
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
  utilityAIService?: IUtilityAI;
}

/**
 * @class AgentOS
 * @implements {IAgentOS}
 * @description
 * The primary public-facing class for interacting with the AgentOS platform.
 * It provides a single, unified API service facade for processing user requests,
 * managing personas, and handling all agent-driven interactions in a streaming,
 * robust, and extensible manner. AgentOS orchestrates the underlying components
 * like GMIManager, AgentOSOrchestrator, and various core services, ensuring
 * that all interactions adhere to the defined architectural tenets.
 */
export class AgentOS implements IAgentOS {
  private initialized: boolean = false;
  private config!: Readonly<AgentOSConfig>; // Runtime config is immutable post-initialization

  // Core managed components, initialized in order of dependency
  private modelProviderManager!: AIModelProviderManager;
  private utilityAIService?: IUtilityAI; // Can be global or GMI-specific
  private promptEngine!: PromptEngine;
  private toolPermissionManager!: IToolPermissionManager;
  private toolOrchestrator!: IToolOrchestrator;
  private conversationManager!: ConversationManager;
  private streamingManager!: StreamingManager;
  private gmiManager!: GMIManager;
  private agentOSOrchestrator!: AgentOSOrchestrator;

  // Injected external services (interfaces defined, concrete implementations provided via config)
  private authService!: IAuthService;
  private subscriptionService!: ISubscriptionService;
  private prisma!: PrismaClient; // Shared Prisma client

  /**
   * Constructs an AgentOS instance.
   * Note: The instance is not operational until `initialize()` is successfully called.
   * This constructor performs no significant setup; all initialization logic is deferred
   * to the asynchronous `initialize` method to allow for complex, potentially async setup tasks.
   */
  constructor() {
    // Minimal constructor
  }

  /**
   * Initializes the AgentOS system with all necessary configurations and dependencies.
   * This method must be called successfully before any other AgentOS operations.
   * It sets up the core components in a specified order to ensure dependencies are met.
   * The order of initialization is critical:
   * 1. Basic services (ModelProviderManager, potentially UtilityAI).
   * 2. Core GMI support services (PromptEngine, ToolPermissionManager, ToolOrchestrator, ConversationManager, StreamingManager).
   * 3. GMI Management (GMIManager).
   * 4. Top-level Orchestration (AgentOSOrchestrator).
   *
   * @public
   * @async
   * @param {AgentOSConfig} config - The comprehensive configuration object for AgentOS.
   * @returns {Promise<void>} A Promise that resolves once all components are initialized.
   * @throws {AgentOSServiceError} If any critical dependency or configuration is missing, invalid,
   * or if any sub-component fails to initialize.
   */
  public async initialize(config: AgentOSConfig): Promise<void> {
    if (this.initialized) {
      console.warn('AgentOS (Service Facade) is already initialized. Attempting to re-initialize may lead to unexpected behavior or resource leaks if not handled properly. Consider a full shutdown and restart if re-configuration is needed.');
      // For production systems, re-initialization might be disallowed or require a specific state.
      return;
    }

    this.validateConfiguration(config);
    this.config = Object.freeze({ ...config }); // Ensure runtime config is immutable

    // Assign injected services
    this.authService = this.config.authService;
    this.subscriptionService = this.config.subscriptionService;
    this.prisma = this.config.prisma;
    this.utilityAIService = this.config.utilityAIService; // Global utility AI, if provided

    console.log('AgentOS (Service Facade): Initialization sequence started...');

    try {
      this.modelProviderManager = new AIModelProviderManager();
      await this.modelProviderManager.initialize(this.config.modelProviderManagerConfig);
      console.log('AgentOS: AIModelProviderManager initialized.');

      this.promptEngine = new PromptEngine();
      // The PromptEngine can use the global utilityAIService if available and configured to do so.
      await this.promptEngine.initialize(this.config.promptEngineConfig, this.utilityAIService);
      console.log('AgentOS: PromptEngine initialized.');

      this.toolPermissionManager = new ToolPermissionManager();
      await this.toolPermissionManager.initialize(this.config.toolPermissionManagerConfig);
      console.log('AgentOS: ToolPermissionManager initialized.');

      this.toolOrchestrator = new ToolOrchestrator(this.toolPermissionManager);
      await this.toolOrchestrator.initialize(this.config.toolOrchestratorConfig);
      console.log('AgentOS: ToolOrchestrator initialized.');

      this.conversationManager = new ConversationManager();
      await this.conversationManager.initialize(
        this.config.conversationManagerConfig,
        this.utilityAIService, // Pass the global utilityAI
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
        this.utilityAIService, // GMIs can also use this global utilityAI
        this.toolOrchestrator
        // Optional IRetrievalAugmentor would be passed here if part of AgentOSConfig
      );
      await this.gmiManager.initialize();
      console.log('AgentOS: GMIManager initialized.');

      const orchestratorDependencies: AgentOSOrchestratorDependencies = {
        gmiManager: this.gmiManager,
        toolOrchestrator: this.toolOrchestrator,
        conversationManager: this.conversationManager,
        streamingManager: this.streamingManager,
        authService: this.authService, // Pass auth for orchestrator-level checks if needed
        subscriptionService: this.subscriptionService, // Pass subscription for orchestrator-level checks
      };
      this.agentOSOrchestrator = new AgentOSOrchestrator();
      await this.agentOSOrchestrator.initialize(this.config.orchestratorConfig, orchestratorDependencies);
      console.log('AgentOS: AgentOSOrchestrator initialized.');

    } catch (error: unknown) {
      const err = error instanceof GMIError ? error : new GMIError(
        error instanceof Error ? error.message : 'Unknown initialization error',
        GMIErrorCode.INITIALIZATION_FAILED,
        error
      );
      console.error('AgentOS: Critical failure during core component initialization:', err);
      throw new AgentOSServiceError(
        `AgentOS initialization failed: ${err.message}`,
        err.code,
        { component: err.component || 'AgentOSInitialization', underlyingError: err }
      );
    }

    this.initialized = true;
    console.log('AgentOS (Service Facade): All core components initialized successfully. System is operational.');
  }

  /**
   * Validates the provided AgentOSConfig to ensure all critical sub-configurations and
   * service instances are present.
   * @private
   * @param {AgentOSConfig} config - The configuration object to validate.
   * @throws {AgentOSServiceError} If essential configuration parameters are missing.
   */
  private validateConfiguration(config: AgentOSConfig): void {
    const missingParams: string[] = [];
    if (!config) missingParams.push('entire AgentOSConfig');
    else {
      if (!config.gmiManagerConfig) missingParams.push('gmiManagerConfig');
      if (!config.orchestratorConfig) missingParams.push('orchestratorConfig');
      if (!config.promptEngineConfig) missingParams.push('promptEngineConfig');
      if (!config.toolOrchestratorConfig) missingParams.push('toolOrchestratorConfig');
      if (!config.toolPermissionManagerConfig) missingParams.push('toolPermissionManagerConfig');
      if (!config.conversationManagerConfig) missingParams.push('conversationManagerConfig');
      if (!config.streamingManagerConfig) missingParams.push('streamingManagerConfig');
      if (!config.modelProviderManagerConfig) missingParams.push('modelProviderManagerConfig');
      if (typeof config.defaultPersonaId !== 'string' || !config.defaultPersonaId) missingParams.push('defaultPersonaId (must be non-empty string)');
      if (!config.prisma) missingParams.push('prisma (PrismaClient instance)');
      if (!config.authService) missingParams.push('authService (IAuthService instance)');
      if (!config.subscriptionService) missingParams.push('subscriptionService (ISubscriptionService instance)');
    }

    if (missingParams.length > 0) {
      const message = `AgentOS Configuration Error: Missing essential parameters: ${missingParams.join(', ')}.`;
      console.error(message);
      throw new AgentOSServiceError(message, GMIErrorCode.CONFIG_ERROR, { missingParameters: missingParams });
    }
    // Further deep validation of sub-config properties can be added here.
  }

  /**
   * Ensures that AgentOS has been properly initialized before any operational methods are called.
   * This is a critical guard to prevent runtime errors due to uninitialized state.
   * @private
   * @throws {AgentOSServiceError} If the service is not initialized.
   */
  private ensureInitialized(): void {
    if (!this.initialized) {
      throw new AgentOSServiceError(
        'AgentOS Service is not initialized. Please call and await the initialize() method before attempting operations.',
        GMIErrorCode.NOT_INITIALIZED,
        { serviceName: 'AgentOS', operationAttempted: 'unknown (ensureInitialized check failed)' }
      );
    }
  }

  /** @inheritdoc */
  public async *processRequest(input: AgentOSInput): AsyncGenerator<AgentOSResponse, void, undefined> {
    this.ensureInitialized();

    // Placeholder for robust authentication and authorization logic
    // Example:
    // try {
    //   const user = await this.authService.validateSessionAndGetUser(input.sessionId, input.userId); // Or token from headers
    //   if (!user) {
    //     throw new AgentOSServiceError('User not authenticated or session invalid.', GMIErrorCode.AUTHENTICATION_ERROR);
    //   }
    //   // Optional: Check specific capability based on user's subscription for this persona
    //   const canAccessPersona = await this.subscriptionService.userCanAccessPersona(user.id, input.selectedPersonaId || this.config.defaultPersonaId);
    //   if (!canAccessPersona) {
    //      throw new AgentOSServiceError(`User ${user.id} does not have permission to access persona ${input.selectedPersonaId || this.config.defaultPersonaId}.`, GMIErrorCode.PERMISSION_DENIED);
    //   }
    // } catch (authError: any) {
    //   // Yield error and terminate
    // }

    const effectivePersonaId = input.selectedPersonaId || this.config.defaultPersonaId;
    const conversationId = input.conversationId || input.sessionId; // Default conversation ID to session ID if not provided

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
          GMIErrorCode.PROCESSING_ERROR,
          error
      );
      console.error(`AgentOS Service: Error during processRequest for user '${input.userId}', session '${input.sessionId}':`, gmiError);
      
      const errorChunk: AgentOSErrorChunk = {
        type: AgentOSResponseChunkType.ERROR,
        streamId: input.sessionId || `err-stream-${Date.now()}`, // Ensure streamId is present
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

  /** @inheritdoc */
  public async *handleToolResult(
    streamId: string,
    toolCallId: string,
    toolName: string,
    toolOutput: any,
    isSuccess: boolean,
    errorMessage?: string,
  ): AsyncGenerator<AgentOSResponse, void, undefined> {
    this.ensureInitialized();

    // Placeholder for auth: e.g., ensure the entity submitting this tool result is authorized for the streamId
    // This might involve checking an API key used by the tool execution environment or the original user session.

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

  /** @inheritdoc */
  public async listAvailablePersonas(userId?: string): Promise<Partial<IPersonaDefinition>[]> {
    this.ensureInitialized();
    // Authentication/Authorization Note:
    // The GMIManager's listAvailablePersonas method is responsible for applying
    // any necessary filtering based on the provided userId and their subscription tier,
    // using the ISubscriptionService instance it holds.
    console.log(`AgentOS Service: Listing available personas. Requester UserID: ${userId || 'anonymous/system (full list)'}.`);
    return this.gmiManager.listAvailablePersonas(userId);
  }

  /** @inheritdoc */
  public async getConversationHistory(conversationId: string, userId: string): Promise<ConversationContext | null> {
    this.ensureInitialized();
    
    // Authorization Check: Ensure the requesting user has permission to access this conversation.
    // This is a critical security and privacy measure.
    // A robust implementation would involve consulting the AuthService or a dedicated permission manager.
    // Example: if (!(await this.authService.userCanAccessConversation(userId, conversationId))) {
    //   console.warn(`AgentOS Service: User '${userId}' attempted to access conversation '${conversationId}' without permission.`);
    //   return null; // Or throw an authorization error
    // }
    console.log(`AgentOS Service: Retrieving conversation history for ID '${conversationId}', requested by user '${userId}'.`);

    const context = await this.conversationManager.getConversation(conversationId);
    
    // Basic ownership check - refine with proper roles/permissions if conversations can be shared.
    if (context) {
        if (context.userId === userId) {
            return context;
        } else if (!context.userId && !userId ) { 
            // This case is for fully anonymous conversations, if supported.
            // Generally, even "anonymous" conversations should have some session-based owner.
            // Explicitly allowing this case if designed for it.
            return context;
        } else {
            console.warn(`AgentOS Service: User '${userId}' is not authorized to access conversation '${conversationId}' (owner: '${context.userId || 'anonymous/unassigned'}').`);
            return null; // Access denied
        }
    }
    return null; // Conversation not found
  }

  /** @inheritdoc */
  public async receiveFeedback(userId: string, sessionId: string, personaId: string, feedbackPayload: UserFeedbackPayload): Promise<void> {
    this.ensureInitialized();

    // Authorization check: Ensure userId is valid and potentially authorized to give feedback for this session/persona.
    // Example: if (!await this.authService.isUserValid(userId)) {
    //   throw new AgentOSServiceError('Invalid user ID provided for feedback.', GMIErrorCode.AUTHENTICATION_ERROR);
    // }
    console.log(`AgentOS Service: Receiving feedback for UserID: '${userId}', SessionID: '${sessionId}', PersonaID: '${personaId}'. Payload:`, JSON.stringify(feedbackPayload));
    
    try {
      // Delegate to GMIManager or a dedicated FeedbackService.
      // GMIManager might then route it to the relevant GMI instance if active, or log for asynchronous processing.
      // This method's implementation in GMIManager or GMI would handle the actual adaptation logic.
      // For now, this is a conceptual placeholder for the routing of feedback.
      // await this.gmiManager.processUserFeedback(userId, sessionId, personaId, feedbackPayload); 
      console.info(`AgentOS Service: Feedback received for ${personaId} from ${userId}. (Conceptual processing - further implementation needed in GMI/FeedbackEngine)`);
      // Example: await this.feedbackProcessingService.submit(userId, sessionId, personaId, feedbackPayload);
    } catch (error: unknown) {
        const gmiError = error instanceof GMIError ? error : new GMIError(
          error instanceof Error ? error.message : 'Unknown error processing feedback.',
          GMIErrorCode.FEEDBACK_ERROR,
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

  /** @inheritdoc */
  public async shutdown(): Promise<void> {
    if (!this.initialized) {
      console.warn('AgentOS Service is not initialized; shutdown call is a no-op.');
      return;
    }
    console.log('AgentOS Service: Initiating graceful shutdown sequence...');

    try {
      // Shutdown components in reverse order of dependency or based on their nature
      // Orchestrator first to stop new turn processing
      if (this.agentOSOrchestrator?.shutdown) { // Check if method exists
        await this.agentOSOrchestrator.shutdown();
        console.log('AgentOS: AgentOSOrchestrator shut down.');
      }
      // GMIManager to deactivate GMIs
      if (this.gmiManager?.shutdown) {
        await this.gmiManager.shutdown();
        console.log('AgentOS: GMIManager shut down.');
      }
      // ConversationManager to save any pending data
      if (this.conversationManager?.shutdown) {
        await this.conversationManager.shutdown();
        console.log('AgentOS: ConversationManager shut down.');
      }
      // Other services
      if (this.toolOrchestrator && typeof (this.toolOrchestrator as any).shutdown === 'function') {
        await (this.toolOrchestrator as any).shutdown();
        console.log('AgentOS: ToolOrchestrator shut down.');
      }
      if (this.modelProviderManager?.shutdown) {
        await this.modelProviderManager.shutdown();
        console.log('AgentOS: AIModelProviderManager shut down.');
      }
      // Note: Prisma client disconnection is typically handled at the application's main exit point (e.g., in server.ts).
      // Services like AuthService, SubscriptionService might not have complex shutdown logic if they are stateless
      // and rely on Prisma for state.

      console.log('AgentOS Service: Graceful shutdown complete. All managed components have been shut down.');
    } catch (error: unknown) {
       const gmiError = error instanceof GMIError ? error : new GMIError(
          error instanceof Error ? error.message : 'Unknown error during shutdown.',
          GMIErrorCode.SHUTDOWN_ERROR,
          error
        );
      console.error('AgentOS Service: Error during shutdown sequence:', gmiError);
      // Even if an error occurs, attempt to mark as uninitialized.
      throw new AgentOSServiceError(
        `AgentOS shutdown sequence encountered an error: ${gmiError.message}`,
        gmiError.code,
        gmiError.details || { name: gmiError.name }
      );
    } finally {
        this.initialized = false; // Mark as uninitialized regardless of shutdown errors to prevent further use.
    }
  }
}