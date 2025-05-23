// backend/agentos/api/AgentOS.ts

import { IAgentOS } from './interfaces/IAgentOS';
import { AgentOSInput, ProcessingOptions } from './types/AgentOSInput';
import { AgentOSResponse, AgentOSResponseChunkType, AgentOSFinalResponseChunk, AgentOSErrorChunk } from './types/AgentOSResponse';
import { AgentOSOrchestrator, AgentOSOrchestratorDependencies, AgentOSOrchestratorConfig } from './AgentOSOrchestrator'; // Assuming AgentOSOrchestrator will expose config and dependencies
import { GMIManager, GMIManagerConfig } from '../cognitive_substrate/GMIManager'; // For initialization
import { AIModelProviderManager } from '../core/llm/providers/AIModelProviderManager'; // For initialization
import { PromptEngine } from '../core/llm/PromptEngine'; // For initialization
import { ToolExecutor } from '../tools/ToolExecutor'; // For initialization
import { ToolOrchestrator } from '../tools/ToolOrchestrator'; // For initialization
import { ToolPermissionManager } from '../tools/permissions/ToolPermissionManager'; // For initialization
import { IAuthService } from '../../services/user_auth/AuthService'; // For initialization
import { ISubscriptionService } from '../../services/user_auth/SubscriptionService'; // For initialization
import { IUtilityAI } from '../core/ai_utilities/IUtilityAI'; // For initialization
import { LLMUtilityAI } from '../core/ai_utilities/LLMUtilityAI'; // Example implementation
import { ConversationManager } from '../core/conversation/ConversationManager'; // For managing conversations
import { PrismaClient } from '@prisma/client'; // Assuming Prisma is used for persistence

/**
 * @fileoverview Implements the main AgentOS class, serving as the public-facing
 * unified API for the entire AI agent platform. This class orchestrates interactions
 * by delegating to the `AgentOSOrchestrator` and managing core service dependencies.
 * @module backend/agentos/api/AgentOS
 */

/**
 * @typedef {Object} AgentOSConfig
 * Configuration options for the entire AgentOS system.
 * @property {GMIManagerConfig} gmiManagerConfig - Configuration specific to the GMIManager.
 * @property {AgentOSOrchestratorConfig} orchestratorConfig - Configuration for the AgentOSOrchestrator.
 * @property {any} promptEngineConfig - Configuration for the PromptEngine.
 * @property {any} toolExecutorConfig - Configuration for the ToolExecutor.
 * @property {any} toolPermissionManagerConfig - Configuration for the ToolPermissionManager.
 * @property {string} defaultPersonaId - The ID of the default persona to use if none is specified in input.
 * @property {PrismaClient} prisma - The Prisma client instance for database access.
 */
export interface AgentOSConfig {
  gmiManagerConfig: Pick<GMIManagerConfig, 'personaDefinitionPath'>; // Only need path here
  orchestratorConfig: AgentOSOrchestratorConfig;
  promptEngineConfig: any; // TODO: Replace with PromptEngineConfig type
  toolExecutorConfig: any; // TODO: Replace with ToolExecutorConfig type
  toolPermissionManagerConfig: any; // TODO: Replace with ToolPermissionManagerConfig type
  defaultPersonaId: string;
  prisma: PrismaClient;
  // External services to be injected
  authService: IAuthService;
  subscriptionService: ISubscriptionService;
  // Optional/Configured utility AI
  utilityAIService?: IUtilityAI;
}

/**
 * @class AgentOS
 * @implements {IAgentOS}
 * @description
 * The primary public-facing class for interacting with the AgentOS platform.
 * It provides a single, unified API for processing user requests, managing personas,
 * and handling agent-driven interactions. AgentOS acts as a high-level facade,
 * delegating complex orchestration to the `AgentOSOrchestrator` and managing
 * the lifecycle of core backend services.
 */
export class AgentOS implements IAgentOS {
  private initialized: boolean = false;
  private config!: AgentOSConfig;

  private agentOSOrchestrator!: AgentOSOrchestrator;
  private gmiManager!: GMIManager;
  private promptEngine!: PromptEngine;
  private toolExecutor!: ToolExecutor;
  private toolOrchestrator!: ToolOrchestrator; // Added ToolOrchestrator
  private toolPermissionManager!: ToolPermissionManager; // Added ToolPermissionManager
  private modelProviderManager!: AIModelProviderManager;
  private conversationManager!: ConversationManager; // For persistent conversation state
  private utilityAIService?: IUtilityAI;
  private authService!: IAuthService;
  private subscriptionService!: ISubscriptionService;
  private prisma!: PrismaClient;

  /**
   * Private constructor to enforce singleton-like initialization via `initialize` static method,
   * or to allow for explicit instantiation in testing setups.
   */
  constructor() {
    // Private constructor. Initialization should primarily happen via `initialize` method.
  }

  /**
   * Initializes the AgentOS system with all necessary configurations and dependencies.
   * This method must be called successfully before any other AgentOS operations.
   * It sets up the core components like GMI Manager, Orchestrator, Prompt Engine, and Tool System.
   *
   * @async
   * @param {AgentOSConfig} config - The comprehensive configuration object for AgentOS.
   * @returns {Promise<void>} A Promise that resolves once all components are initialized.
   * @throws {Error} If any critical dependency or configuration is missing or fails to initialize.
   */
  public async initialize(config: AgentOSConfig): Promise<void> {
    if (this.initialized) {
      console.warn('AgentOS already initialized. Skipping re-initialization.');
      return;
    }

    // Validate essential configurations
    if (!config.gmiManagerConfig || !config.gmiManagerConfig.personaDefinitionPath ||
      !config.orchestratorConfig || !config.defaultPersonaId || !config.prisma ||
      !config.authService || !config.subscriptionService) {
      throw new Error('AgentOS: Missing essential configuration parameters during initialization.');
    }

    this.config = config;
    this.authService = config.authService;
    this.subscriptionService = config.subscriptionService;
    this.prisma = config.prisma;

    console.log('AgentOS: Starting initialization...');

    // 1. Initialize core infrastructure components
    try {
      // Initialize AI Model Provider Manager first as others depend on it
      this.modelProviderManager = new AIModelProviderManager();
      // Assume ProviderConfiguration is handled outside or passed directly for modelProviderManager init
      await this.modelProviderManager.initialize(); // Loads providers, models etc.

      // Initialize Prompt Engine
      this.utilityAIService = config.utilityAIService || new LLMUtilityAI(this.modelProviderManager, this.prisma); // Default to LLMUtilityAI
      this.promptEngine = new PromptEngine();
      await this.promptEngine.initialize(this.config.promptEngineConfig, undefined, this.utilityAIService);

      // Initialize Tool Permission Manager
      this.toolPermissionManager = new ToolPermissionManager();
      await this.toolPermissionManager.initialize(this.config.toolPermissionManagerConfig);

      // Initialize Tool Executor
      this.toolExecutor = new ToolExecutor(this.toolPermissionManager); // ToolExecutor needs permission manager
      await this.toolExecutor.initialize(this.config.toolExecutorConfig);

      // Initialize Tool Orchestrator
      this.toolOrchestrator = new ToolOrchestrator(this.toolExecutor);
      await this.toolOrchestrator.initialize(); // No specific config needed yet

      // Initialize Conversation Manager (for persistent conversation context loading/saving)
      this.conversationManager = new ConversationManager(this.prisma);
      await this.conversationManager.initialize();

    } catch (error) {
      console.error('AgentOS: Failed to initialize core infrastructure components:', error);
      throw new Error(`AgentOS initialization failed at core infrastructure: ${(error as Error).message}`);
    }

    // 2. Initialize GMIManager (depends on PromptEngine, ModelProviderManager, ToolExecutor, AuthService, SubscriptionService)
    try {
      this.gmiManager = new GMIManager(
        this.config.gmiManagerConfig,
        this.subscriptionService,
        this.authService,
        this.prisma, // Pass Prisma client to GMIManager for GMI persistence
        this.modelProviderManager, // Pass ModelProviderManager directly
        this.promptEngine, // Pass PromptEngine directly
        this.toolExecutor, // Pass ToolExecutor directly
        this.conversationManager, // Pass ConversationManager directly
      );
      await this.gmiManager.loadAllPersonaDefinitions(); // Load all personas
    } catch (error) {
      console.error('AgentOS: Failed to initialize GMIManager or load persona definitions:', error);
      throw new Error(`AgentOS initialization failed at GMIManager: ${(error as Error).message}`);
    }

    // 3. Initialize AgentOSOrchestrator (depends on GMIManager and core infra components)
    try {
      const orchestratorDependencies: AgentOSOrchestratorDependencies = {
        gmiManager: this.gmiManager,
        toolOrchestrator: this.toolOrchestrator, // Orchestrator uses ToolOrchestrator
        conversationManager: this.conversationManager, // Orchestrator uses ConversationManager
        // Any other services Orchestrator needs directly, not just via GMI.
      };
      this.agentOSOrchestrator = new AgentOSOrchestrator();
      await this.agentOSOrchestrator.initialize(this.config.orchestratorConfig, orchestratorDependencies);
    } catch (error) {
      console.error('AgentOS: Failed to initialize AgentOSOrchestrator:', error);
      throw new Error(`AgentOS initialization failed at AgentOSOrchestrator: ${(error as Error).message}`);
    }

    this.initialized = true;
    console.log('AgentOS: All core components initialized successfully.');
  }

  /**
   * Processes a user request or initiates an agent task. This is the primary method
   * for interacting with AgentOS, designed to be streaming-first. It returns an
   * async generator that yields chunks of response as the agent processes the input,
   * performs actions, and generates output.
   *
   * It delegates the actual processing and streaming logic to the `AgentOSOrchestrator`.
   *
   * @async
   * @generator
   * @param {AgentOSInput} input - The comprehensive input for the current turn.
   * @yields {AgentOSResponse} - A stream of `AgentOSResponse` chunks.
   * @returns {AsyncGenerator<AgentOSResponse, void, void>} An async generator.
   * @throws {Error} If AgentOS is not initialized or a critical error prevents stream initiation.
   */
  public async *processRequest(input: AgentOSInput): AsyncGenerator<AgentOSResponse> {
    if (!this.initialized) {
      console.error('AgentOS: Attempted to process request before initialization.');
      const errorChunk: AgentOSErrorChunk = {
        type: AgentOSResponseChunkType.ERROR,
        streamId: input.sessionId, // Use sessionId as fallback for streamId
        gmiInstanceId: 'uninitialized',
        personaId: input.selectedPersonaId || this.config.defaultPersonaId,
        isFinal: true,
        timestamp: new Date().toISOString(),
        code: 'NOT_INITIALIZED',
        message: 'AgentOS is not initialized. Please call initialize() first.',
      };
      yield errorChunk;
      return;
    }

    const effectivePersonaId = input.selectedPersonaId || this.config.defaultPersonaId;
    const conversationId = input.conversationId || input.sessionId; // Use session ID as default conversation ID

    try {
      console.log(`AgentOS: Processing request for user ${input.userId}, session ${input.sessionId}, persona ${effectivePersonaId}, conversation ${conversationId}.`);
      for await (const chunk of this.agentOSOrchestrator.orchestrateTurn({
        ...input,
        selectedPersonaId: effectivePersonaId,
        conversationId: conversationId,
      })) {
        yield chunk;
      }
    } catch (error) {
      console.error(`AgentOS: Error during processRequest for stream ${input.sessionId}:`, error);
      const errorChunk: AgentOSErrorChunk = {
        type: AgentOSResponseChunkType.ERROR,
        streamId: input.sessionId,
        gmiInstanceId: 'unknown', // GMI instance might not have been fully established
        personaId: effectivePersonaId,
        isFinal: true,
        timestamp: new Date().toISOString(),
        code: 'PROCESS_REQUEST_ERROR',
        message: `An unexpected error occurred: ${(error as Error).message}`,
        details: (error instanceof Error) ? error.stack : String(error),
      };
      yield errorChunk;
    }
  }

  /**
   * Handles the result of a tool execution. This method is called by the external
   * system (e.g., a webhook receiver or a dedicated tool execution service) after
   * a tool invoked by an agent has completed. It feeds the result back into the
   * relevant GMI instance for continued processing.
   *
   * @async
   * @generator
   * @param {string} streamId - The original stream ID associated with the tool call.
   * @param {string} toolCallId - The unique ID of the specific tool call whose result is provided.
   * @param {string} toolName - The name of the tool that was executed.
   * @param {any} toolOutput - The raw output or result from the tool execution.
   * @param {boolean} isSuccess - Indicates whether the tool execution was successful.
   * @param {string} [errorMessage] - An optional error message if `isSuccess` is false.
   * @yields {AgentOSResponse} - A stream of `AgentOSResponse` chunks representing
   * the agent's continued thought process and response.
   * @returns {AsyncGenerator<AgentOSResponse, void, void>} An async generator.
   * @throws {Error} If AgentOS is not initialized or the streamId is invalid.
   */
  public async *handleToolResult(
    streamId: string,
    toolCallId: string,
    toolName: string,
    toolOutput: any,
    isSuccess: boolean,
    errorMessage?: string,
  ): AsyncGenerator<AgentOSResponse> {
    if (!this.initialized) {
      console.error('AgentOS: Attempted to handle tool result before initialization.');
      const errorChunk: AgentOSErrorChunk = {
        type: AgentOSResponseChunkType.ERROR,
        streamId: streamId,
        gmiInstanceId: 'uninitialized',
        personaId: 'unknown',
        isFinal: true,
        timestamp: new Date().toISOString(),
        code: 'NOT_INITIALIZED',
        message: 'AgentOS is not initialized. Cannot process tool result.',
      };
      yield errorChunk;
      return;
    }

    try {
      console.log(`AgentOS: Handling tool result for stream ${streamId}, tool call ${toolCallId} (${toolName}). Success: ${isSuccess}`);
      for await (const chunk of this.agentOSOrchestrator.orchestrateToolResult(
        streamId,
        toolCallId,
        toolName,
        toolOutput,
        isSuccess,
        errorMessage,
      )) {
        yield chunk;
      }
    } catch (error) {
      console.error(`AgentOS: Error during handleToolResult for stream ${streamId}:`, error);
      const errorChunk: AgentOSErrorChunk = {
        type: AgentOSResponseChunkType.ERROR,
        streamId: streamId,
        gmiInstanceId: 'unknown',
        personaId: 'unknown',
        isFinal: true,
        timestamp: new Date().toISOString(),
        code: 'HANDLE_TOOL_RESULT_ERROR',
        message: `An unexpected error occurred while processing tool result: ${(error as Error).message}`,
        details: (error instanceof Error) ? error.stack : String(error),
      };
      yield errorChunk;
    }
  }

  /**
   * Retrieves a list of all available persona definitions (agents) configured in the system.
   * This method delegates to the `GMIManager` to access the loaded persona definitions.
   *
   * @async
   * @param {string} [userId] - Optional. If provided, the list might be filtered
   * based on user permissions or subscription tiers (handled by GMIManager).
   * @returns {Promise<Partial<IPersonaDefinition>[]>} A promise that resolves to an array of
   * `IPersonaDefinition` objects, with sensitive details omitted.
   * @throws {Error} If AgentOS is not initialized.
   */
  public async listAvailablePersonas(userId?: string): Promise<Partial<IPersonaDefinition>[]> {
    if (!this.initialized) {
      throw new Error('AgentOS is not initialized. Cannot list personas.');
    }
    console.log(`AgentOS: Listing available personas for user: ${userId || 'anonymous'}`);
    // GMIManager is responsible for filtering by subscription tier if needed.
    return this.gmiManager.listAvailablePersonas(userId);
  }

  /**
   * Retrieves the full conversation history for a given conversation ID from the persistence layer.
   *
   * @async
   * @param {string} conversationId - The unique ID of the conversation.
   * @param {string} userId - The ID of the user associated with the conversation (for ownership check).
   * @returns {Promise<any | null>} A promise that resolves to the `ConversationContext` object
   * or `null` if the conversation is not found or the user lacks permission.
   * @throws {Error} If AgentOS is not initialized.
   */
  public async getConversationHistory(conversationId: string, userId: string): Promise<any | null> {
    if (!this.initialized) {
      throw new Error('AgentOS is not initialized. Cannot retrieve conversation history.');
    }
    console.log(`AgentOS: Retrieving conversation history for ID: ${conversationId}, user: ${userId}`);
    // Delegate to ConversationManager for loading persistent history
    return this.conversationManager.loadConversation(conversationId, userId);
  }

  /**
   * Allows the system to receive and process explicit user feedback outside of a direct
   * turn interaction. This delegates to the GMI Manager, which will then relay to the
   * relevant GMI instance for adaptation.
   *
   * @async
   * @param {string} userId - The ID of the user providing feedback.
   * @param {string} sessionId - The ID of the session the feedback relates to.
   * @param {string} personaId - The ID of the persona being given feedback about.
   * @param {any} feedbackPayload - The structured feedback payload.
   * @returns {Promise<void>} A promise that resolves when the feedback has been processed.
   * @throws {Error} If AgentOS is not initialized or an error occurs during feedback processing.
   */
  public async receiveFeedback(userId: string, sessionId: string, personaId: string, feedbackPayload: any): Promise<void> {
    if (!this.initialized) {
      throw new Error('AgentOS is not initialized. Cannot receive feedback.');
    }
    console.log(`AgentOS: Receiving feedback for user ${userId}, session ${sessionId}, persona ${personaId}`);
    // This will instruct the GMIManager to locate the GMI and apply the feedback.
    // The GMIManager or the GMI itself will interact with the AdaptationEngine.
    try {
      await this.gmiManager.processUserFeedback(userId, sessionId, personaId, feedbackPayload);
    } catch (error) {
      console.error(`AgentOS: Failed to process feedback for user ${userId}, session ${sessionId}:`, error);
      throw new Error(`Failed to process feedback: ${(error as Error).message}`);
    }
  }

  /**
   * Shuts down the AgentOS system and releases all its resources.
   * This method should be called gracefully upon application shutdown to
   * ensure proper cleanup of open connections, active GMI instances, and
   * any other system resources.
   *
   * @async
   * @returns {Promise<void>} A promise that resolves when all resources are released.
   */
  public async shutdown(): Promise<void> {
    if (!this.initialized) {
      console.warn('AgentOS is not initialized, nothing to shut down.');
      return;
    }
    console.log('AgentOS: Initiating shutdown...');

    // Gracefully shut down components in reverse order of initialization
    try {
      // Orchestrator might have active streams to close
      if (this.agentOSOrchestrator && typeof this.agentOSOrchestrator.shutdown === 'function') {
        await this.agentOSOrchestrator.shutdown();
      }
      // GMIManager to close active GMI instances and save state if needed
      if (this.gmiManager && typeof this.gmiManager.shutdown === 'function') {
        await this.gmiManager.shutdown();
      }
      // Tool Orchestrator (if it holds resources)
      if (this.toolOrchestrator && typeof this.toolOrchestrator.shutdown === 'function') {
        await this.toolOrchestrator.shutdown();
      }
      // Tool Executor (if it holds resources)
      if (this.toolExecutor && typeof this.toolExecutor.shutdown === 'function') {
        await this.toolExecutor.shutdown();
      }
      // Model Provider Manager (e.g., closing HTTP clients)
      if (this.modelProviderManager && typeof this.modelProviderManager.shutdown === 'function') {
        await this.modelProviderManager.shutdown();
      }
      // Prisma Client (if directly managed here, often managed by the app's entry point)
      if (this.prisma && typeof this.prisma.$disconnect === 'function') {
        await this.prisma.$disconnect();
      }

      console.log('AgentOS: Shutdown complete. All resources released.');
      this.initialized = false;
    } catch (error) {
      console.error('AgentOS: Error during shutdown:', error);
      // Even if an error occurs, try to mark as uninitialized.
      this.initialized = false;
      throw new Error(`AgentOS shutdown failed: ${(error as Error).message}`);
    }
  }
}