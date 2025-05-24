// File: backend/agentos/core/tools/ToolOrchestrator.ts
/**
 * @fileoverview Implements the ToolOrchestrator class, which serves as the central
 * hub for managing, discovering, authorizing, and orchestrating the execution of tools
 * within the AgentOS system.
 *
 * The ToolOrchestrator acts as a facade over the `ToolPermissionManager` and `ToolExecutor`.
 * It provides a unified and simplified interface for higher-level components, such as GMIs
 * (Generalized Mind Instances) or the main AgentOS orchestrator, to interact with the tool ecosystem.
 *
 * Key Responsibilities:
 * - **Tool Registration**: Manages an internal registry of available `ITool` instances.
 * - **Tool Discovery**: Provides methods like `listAvailableTools()` to get tool definitions
 * suitable for LLM consumption (e.g., for function calling).
 * - **Permission Enforcement**: Collaborates with `IToolPermissionManager` to authorize tool calls
 * based on Persona capabilities, user subscriptions, or other defined policies.
 * - **Execution Delegation**: Delegates the actual tool execution (including argument validation)
 * to the `ToolExecutor`.
 * - **Result Formatting**: Standardizes and returns tool execution results (`ToolCallResult`).
 * - **Lifecycle Management**: Handles initialization and shutdown of itself and potentially registered tools.
 *
 * @module backend/agentos/core/tools/ToolOrchestrator
 * @see ./IToolOrchestrator.ts for the interface definition.
 * @see ./ITool.ts for the core tool contract.
 * @see ./IToolPermissionManager.ts for permission management.
 * @see ./ToolExecutor.ts for actual tool execution logic.
 * @see ../config/ToolOrchestratorConfig.ts for configuration options.
 * @see ../cognitive_substrate/IGMI.ts for GMI-related types like ToolCallResult.
 */

import { v4 as uuidv4 } from 'uuid';
import {
  IToolOrchestrator,
  ToolDefinitionForLLM,
} from './IToolOrchestrator';
import { ITool, ToolExecutionResult as CoreToolExecutionResult } from './ITool'; // Renamed to avoid conflict
import { IToolPermissionManager, PermissionCheckContext } from './IToolPermissionManager';
import { ToolExecutor, ToolExecutionRequestDetails } from './ToolExecutor';
import { ToolOrchestratorConfig } from '../config/ToolOrchestratorConfig'; // Corrected import path
import { ToolCallResult, UserContext } from '../cognitive_substrate/IGMI'; // Path seems correct
import { GMIError, GMIErrorCode, createGMIErrorFromError } from '../../utils/errors'; // Path seems correct

/**
 * @class ToolOrchestrator
 * @implements {IToolOrchestrator}
 * @description The central component responsible for the comprehensive management of tools,
 * including their registration, discovery, permission-based authorization, and the
 * orchestration of their execution. It acts as a facade, simplifying tool interactions
 * for higher-level system components like GMIs.
 */
export class ToolOrchestrator implements IToolOrchestrator {
  /**
   * A unique identifier for this ToolOrchestrator instance.
   * Useful for logging and debugging in systems with multiple orchestrators.
   * @public
   * @readonly
   * @type {string}
   */
  public readonly orchestratorId: string;

  /**
   * The configuration settings for this ToolOrchestrator instance.
   * @private
   * @type {Readonly<Required<ToolOrchestratorConfig>>}
   */
  private config!: Readonly<Required<ToolOrchestratorConfig>>; // Note: Full type after defaults

  /**
   * The permission manager instance used to authorize tool calls.
   * @private
   * @type {IToolPermissionManager}
   */
  private permissionManager!: IToolPermissionManager;

  /**
   * The tool executor instance responsible for the actual invocation of tool logic.
   * @private
   * @type {ToolExecutor}
   */
  private toolExecutor!: ToolExecutor;

  /**
   * An in-memory registry mapping tool functional names (`ITool.name`) to their `ITool` instances.
   * @private
   * @readonly
   * @type {Map<string, ITool>}
   */
  private readonly toolRegistry: Map<string, ITool>;

  /**
   * Flag indicating whether the orchestrator has been successfully initialized.
   * @private
   * @type {boolean}
   */
  private isInitialized: boolean = false;

  /**
   * Default configuration values for the ToolOrchestrator.
   * These are applied if not overridden by the user-provided configuration during initialization.
   * @private
   * @static
   * @readonly
   */
  private static readonly DEFAULT_CONFIG: Required<ToolOrchestratorConfig> = {
    orchestratorId: '', // Will be overridden by instance specific ID
    defaultToolCallTimeoutMs: 30000,
    maxConcurrentToolCalls: 10,
    logToolCalls: true,
    globalDisabledTools: [],
    toolRegistrySettings: {
        allowDynamicRegistration: true,
        persistRegistry: false,
        persistencePath: undefined,
    },
    customParameters: {},
  };

  /**
   * Constructs a ToolOrchestrator instance.
   * The orchestrator is not operational and tools cannot be used until the `initialize`
   * method has been successfully called.
   */
  constructor() {
    this.orchestratorId = `tool-orch-${uuidv4()}`;
    this.toolRegistry = new Map<string, ITool>();
    // Initialize with defaults; will be properly set in initialize()
    this.config = { ...ToolOrchestrator.DEFAULT_CONFIG, orchestratorId: this.orchestratorId };
  }

  /**
   * @inheritdoc
   * Initializes the ToolOrchestrator with its configuration, essential dependencies
   * (Permission Manager, Tool Executor), and an optional set of initial tools to register.
   * This method must be called before the orchestrator can be used.
   *
   * @param {ToolOrchestratorConfig | undefined} config - Optional configuration settings. If undefined, default values will be used.
   * @param {IToolPermissionManager} permissionManager - An instance of the tool permission manager.
   * @param {ToolExecutor} toolExecutor - An instance of the tool executor.
   * @param {ITool[]} [initialTools] - An optional array of `ITool` instances to register at startup.
   * @returns {Promise<void>}
   * @throws {GMIError} if essential dependencies are missing (`GMIErrorCode.DEPENDENCY_ERROR`) or if configuration is invalid.
   */
  public async initialize(
    config: ToolOrchestratorConfig | undefined,
    permissionManager: IToolPermissionManager,
    toolExecutor: ToolExecutor,
    initialTools?: ITool[],
  ): Promise<void> {
    if (this.isInitialized) {
      console.warn(`ToolOrchestrator (ID: ${this.orchestratorId}): Attempting to re-initialize an already initialized instance. Existing tools will be cleared and re-registered if provided.`);
      await this.shutdownRegisteredTools(); // Gracefully shutdown existing tools before clearing
      this.toolRegistry.clear();
    }

    // Merge provided config with defaults, ensuring nested objects are also merged.
    const baseConfig = { ...ToolOrchestrator.DEFAULT_CONFIG, orchestratorId: this.orchestratorId };
    this.config = Object.freeze({
        ...baseConfig,
        ...(config || {}),
        toolRegistrySettings: {
            ...baseConfig.toolRegistrySettings,
            ...(config?.toolRegistrySettings || {}),
        }
    });

    if (!permissionManager) {
      throw new GMIError('IToolPermissionManager dependency is required for ToolOrchestrator initialization.', GMIErrorCode.DEPENDENCY_ERROR, { orchestratorId: this.orchestratorId, missingDependency: 'IToolPermissionManager' });
    }
    if (!toolExecutor) {
      throw new GMIError('ToolExecutor dependency is required for ToolOrchestrator initialization.', GMIErrorCode.DEPENDENCY_ERROR, { orchestratorId: this.orchestratorId, missingDependency: 'ToolExecutor' });
    }

    this.permissionManager = permissionManager;
    this.toolExecutor = toolExecutor;

    if (initialTools && initialTools.length > 0) {
      console.log(`ToolOrchestrator (ID: ${this.orchestratorId}): Registering ${initialTools.length} initial tools...`);
      for (const tool of initialTools) {
        try {
          await this.registerTool(tool); // Uses the public registration method for consistency and validation.
        } catch (registrationError: any) {
            // Log the error but continue initializing other tools/orchestrator parts.
            console.error(`ToolOrchestrator (ID: ${this.orchestratorId}): Failed to register initial tool '${tool.name || tool.id}': ${registrationError.message}`, registrationError);
        }
      }
    }

    this.isInitialized = true;
    console.log(`ToolOrchestrator (ID: ${this.orchestratorId}) initialized successfully. Configuration applied. Registered tools: ${this.toolRegistry.size}.`);
  }

  /**
   * Ensures the ToolOrchestrator has been initialized before performing operations.
   * @private
   * @throws {GMIError} if the orchestrator is not initialized (`GMIErrorCode.NOT_INITIALIZED`).
   */
  private ensureInitialized(): void {
    if (!this.isInitialized) {
      throw new GMIError(
        `ToolOrchestrator (ID: ${this.orchestratorId}) is not initialized. Please call the initialize() method.`,
        GMIErrorCode.NOT_INITIALIZED,
        { component: 'ToolOrchestrator' }
      );
    }
  }

  /**
   * @inheritdoc
   * Registers a tool with the orchestrator, making it available for discovery and execution.
   * The tool's `name` is used as the primary key in the registry and must be unique.
   *
   * @param {ITool} tool - The tool instance to register. Must conform to `ITool`.
   * @returns {Promise<void>}
   * @throws {GMIError}
   * - If dynamic tool registration is disabled by configuration (`GMIErrorCode.OPERATION_NOT_ALLOWED`).
   * - If the provided tool object is invalid (e.g., missing `id` or `name`) (`GMIErrorCode.INVALID_ARGUMENT`).
   * - If a tool with the same `name` is already registered (`GMIErrorCode.ALREADY_EXISTS`).
   */
  public async registerTool(tool: ITool): Promise<void> {
    this.ensureInitialized();
    if (!this.config.toolRegistrySettings.allowDynamicRegistration) {
      throw new GMIError("Dynamic tool registration is currently disabled by configuration.", GMIErrorCode.OPERATION_NOT_ALLOWED, { toolName: tool?.name, orchestratorId: this.orchestratorId });
    }
    if (!tool || typeof tool.name !== 'string' || !tool.name.trim() || typeof tool.id !== 'string' || !tool.id.trim()) {
      throw new GMIError("Invalid tool object provided for registration: 'id' and 'name' properties are required and must be non-empty strings.", GMIErrorCode.INVALID_ARGUMENT, { receivedTool: tool });
    }
    if (this.toolRegistry.has(tool.name)) {
      throw new GMIError(`A tool with the name '${tool.name}' (attempted ID: '${tool.id}') is already registered. The existing tool has ID: '${this.toolRegistry.get(tool.name)?.id}'. Tool names must be unique.`, GMIErrorCode.ALREADY_EXISTS, { toolName: tool.name, existingToolId: this.toolRegistry.get(tool.name)?.id });
    }
    if (this.config.globalDisabledTools?.includes(tool.name) || this.config.globalDisabledTools?.includes(tool.id)) {
        console.warn(`ToolOrchestrator (ID: ${this.orchestratorId}): Tool '${tool.name}' (ID: '${tool.id}') is listed as globally disabled. It will be registered but may not be executable if checks are enforced later.`);
        // Depending on policy, could throw an error here or allow registration but prevent execution.
    }
    this.toolRegistry.set(tool.name, tool);
    console.log(`ToolOrchestrator (ID: ${this.orchestratorId}): Tool '${tool.name}' (ID: '${tool.id}', Version: ${tool.version || 'N/A'}) successfully registered.`);
  }

  /**
   * @inheritdoc
   * Unregisters a tool from the orchestrator using its functional name.
   * If the tool implements a `shutdown` method, it will be called prior to removal.
   *
   * @param {string} toolName - The functional name (`ITool.name`) of the tool to unregister.
   * @returns {Promise<boolean>} `true` if the tool was found and successfully unregistered, `false` otherwise.
   * @throws {GMIError} If dynamic tool unregistration is disabled by configuration (`GMIErrorCode.OPERATION_NOT_ALLOWED`).
   */
  public async unregisterTool(toolName: string): Promise<boolean> {
    this.ensureInitialized();
    if (!this.config.toolRegistrySettings.allowDynamicRegistration) {
      throw new GMIError("Dynamic tool unregistration is currently disabled by configuration.", GMIErrorCode.OPERATION_NOT_ALLOWED, { toolName, orchestratorId: this.orchestratorId });
    }
    const tool = this.toolRegistry.get(toolName);
    if (tool && typeof tool.shutdown === 'function') {
        try {
            console.log(`ToolOrchestrator (ID: ${this.orchestratorId}): Calling shutdown for tool '${toolName}' during unregistration...`);
            await tool.shutdown();
        } catch(shutdownError: any) {
            console.error(`ToolOrchestrator (ID: ${this.orchestratorId}): Error during shutdown of tool '${toolName}' (ID: '${tool.id}') while unregistering: ${shutdownError.message}`, shutdownError);
            // Log error but continue with unregistration.
        }
    }
    const success = this.toolRegistry.delete(toolName);
    if (success) {
      console.log(`ToolOrchestrator (ID: ${this.orchestratorId}): Tool '${toolName}' successfully unregistered.`);
    } else {
      console.warn(`ToolOrchestrator (ID: ${this.orchestratorId}): Attempted to unregister tool '${toolName}', but it was not found in the registry.`);
    }
    return success;
  }

  /**
   * @inheritdoc
   * Retrieves a registered tool instance by its functional name.
   *
   * @param {string} toolName - The `name` property of the tool to retrieve.
   * @returns {Promise<ITool | undefined>} The `ITool` instance if found; otherwise, `undefined`.
   */
  public async getTool(toolName: string): Promise<ITool | undefined> {
    this.ensureInitialized();
    return this.toolRegistry.get(toolName);
  }

  /**
   * @inheritdoc
   * Lists tools available for use, formatted for LLM consumption.
   * This method can filter tools based on the provided context, such as Persona capabilities
   * and user permissions, by consulting the `IToolPermissionManager`.
   *
   * @param {object} [context] - Optional context for filtering the list of tools.
   * @param {string} [context.personaId] - ID of the requesting Persona.
   * @param {string[]} [context.personaCapabilities] - Capabilities of the Persona.
   * @param {UserContext} [context.userContext] - The user's context.
   * @returns {Promise<ToolDefinitionForLLM[]>} A list of tool definitions suitable for an LLM.
   */
  public async listAvailableTools(context?: {
    personaId?: string;
    personaCapabilities?: string[];
    userContext?: UserContext;
  }): Promise<ToolDefinitionForLLM[]> {
    this.ensureInitialized();
    const availableToolsLLM: ToolDefinitionForLLM[] = [];

    for (const tool of this.toolRegistry.values()) {
      if (this.config.globalDisabledTools?.includes(tool.name) || this.config.globalDisabledTools?.includes(tool.id)) {
        if (this.config.logToolCalls) console.log(`ToolOrchestrator: Tool '${tool.name}' skipped from listing as it's globally disabled.`);
        continue;
      }

      // If full context for permission check is provided, use it.
      if (context && context.personaId && context.userContext && context.personaCapabilities) {
        const permissionContext: PermissionCheckContext = {
          tool,
          personaId: context.personaId,
          personaCapabilities: context.personaCapabilities,
          userContext: context.userContext,
          // gmiId could be part of a broader context if available
        };
        try {
            const permissionResult = await this.permissionManager.isExecutionAllowed(permissionContext);
            if (!permissionResult.isAllowed) {
                if (this.config.logToolCalls) console.log(`ToolOrchestrator: Tool '${tool.name}' not listed for persona '${context.personaId}' due to permission: ${permissionResult.reason}`);
                continue; // Skip tools not allowed for this context
            }
        } catch(permError: any) {
            console.error(`ToolOrchestrator: Error checking permission for tool '${tool.name}': ${permError.message}. Excluding from list.`, permError);
            continue;
        }
      }
      // If no context, or partial context, all non-disabled tools are listed.
      // A more sophisticated approach might require full context for any listing.

      availableToolsLLM.push({
        name: tool.name,
        description: tool.description,
        inputSchema: tool.inputSchema, // LLMs often call this 'parameters'
        // outputSchema: tool.outputSchema, // Less commonly used by LLMs for function defs but good for documentation
      });
    }
    return availableToolsLLM;
  }

  /**
   * @inheritdoc
   * Processes a tool call request. It validates permissions via `IToolPermissionManager`,
   * then delegates argument validation and execution to `ToolExecutor`.
   * The final result is formatted as `ToolCallResult` for the GMI.
   *
   * @param {ToolExecutionRequestDetails} requestDetails - Comprehensive details for the tool call.
   * @returns {Promise<ToolCallResult>} The result of the tool call, formatted for GMI consumption.
   */
  public async processToolCall(requestDetails: ToolExecutionRequestDetails): Promise<ToolCallResult> {
    this.ensureInitialized();
    const { toolCallRequest, gmiId, personaId, personaCapabilities, userContext, correlationId } = requestDetails;
    const toolName = toolCallRequest.function.name;
    const llmProvidedCallId = toolCallRequest.id; // ID from the LLM's tool_call object

    const logPrefix = `ToolOrchestrator (ID: ${this.orchestratorId}, GMI: ${gmiId}, Persona: ${personaId}, LLMCallID: ${llmProvidedCallId}, Tool: ${toolName}):`;

    if (this.config.logToolCalls) {
      console.log(`${logPrefix} Received tool call request. Args:`, toolCallRequest.function.arguments);
    }

    const tool = this.toolRegistry.get(toolName);
    if (!tool) {
      const errorMsg = `Tool '${toolName}' not found in orchestrator registry.`;
      console.error(`${logPrefix} ${errorMsg}`);
      return { tool_call_id: llmProvidedCallId, toolName, output: null, isError: true, errorDetails: { message: errorMsg, code: GMIErrorCode.TOOL_NOT_FOUND } };
    }
    
    if (this.config.globalDisabledTools?.includes(tool.name) || this.config.globalDisabledTools?.includes(tool.id)) {
      const errorMsg = `Attempted to execute globally disabled tool '${toolName}' (ID: '${tool.id}').`;
      console.warn(`${logPrefix} ${errorMsg}`);
      return { tool_call_id: llmProvidedCallId, toolName, output: null, isError: true, errorDetails: { message: errorMsg, code: GMIErrorCode.TOOL_PERMISSION_DENIED } };
    }

    const permissionContext: PermissionCheckContext = { tool, personaId, personaCapabilities, userContext, gmiId };
    let permissionResult: PermissionCheckResult;
    try {
        permissionResult = await this.permissionManager.isExecutionAllowed(permissionContext);
    } catch (permError: any) {
        const errorMsg = `Error during permission check for tool '${toolName}'.`;
        console.error(`${logPrefix} ${errorMsg}`, permError);
        const wrappedError = createGMIErrorFromError(permError, GMIErrorCode.PERMISSION_DENIED, permissionContext, errorMsg);
        return { tool_call_id: llmProvidedCallId, toolName, output: null, isError: true, errorDetails: { message: wrappedError.message, code: wrappedError.code, details: wrappedError.details } };
    }

    if (!permissionResult.isAllowed) {
      const errorMsg = permissionResult.reason || `Permission denied by ToolPermissionManager for tool '${toolName}'.`;
      console.warn(`${logPrefix} ${errorMsg}`, permissionResult.details);
      return { tool_call_id: llmProvidedCallId, toolName, output: null, isError: true, errorDetails: { message: errorMsg, code: GMIErrorCode.PERMISSION_DENIED, details: permissionResult.details } };
    }

    if (this.config.logToolCalls) {
        console.log(`${logPrefix} Permissions granted for tool '${toolName}'. Proceeding to executor.`);
    }

    // Execution request details are already structured for ToolExecutor
    let coreExecutionResult: CoreToolExecutionResult;
    try {
      coreExecutionResult = await this.toolExecutor.executeTool(requestDetails);
    } catch (executorPipelineError: any) {
      // This catches unexpected errors from ToolExecutor's own pipeline, not errors from the tool's execute method (which are in coreExecutionResult.error)
      const errorMsg = `Unexpected error within ToolExecutor pipeline while processing '${toolName}'.`;
      console.error(`${logPrefix} ${errorMsg}`, executorPipelineError);
      const wrappedError = createGMIErrorFromError(executorPipelineError, GMIErrorCode.TOOL_EXECUTION_FAILED, requestDetails, errorMsg);
      return { tool_call_id: llmProvidedCallId, toolName, output: null, isError: true, errorDetails: { message: wrappedError.message, code: wrappedError.code, details: wrappedError.details } };
    }

    if (this.config.logToolCalls) {
        const outputPreview = coreExecutionResult.output ? JSON.stringify(coreExecutionResult.output).substring(0, 200) + (JSON.stringify(coreExecutionResult.output).length > 200 ? '...' : '') : 'N/A';
        console.log(`${logPrefix} Tool '${toolName}' execution completed by executor. Success: ${coreExecutionResult.success}. Output Preview: ${outputPreview}. Error: ${coreExecutionResult.error || 'N/A'}`);
    }

    // Map CoreToolExecutionResult to ToolCallResult for GMI
    return {
      tool_call_id: llmProvidedCallId, // This is the ID from the LLM request
      toolName: toolName, // Name of the tool that was called
      output: coreExecutionResult.success ? coreExecutionResult.output : null, // Output from the tool
      isError: !coreExecutionResult.success,
      errorDetails: !coreExecutionResult.success ? {
          message: coreExecutionResult.error || `Tool '${toolName}' failed.`,
          details: coreExecutionResult.details, // Additional details from executor/tool
          // code: GMIErrorCode.TOOL_EXECUTION_ERROR, // Could map internal tool error codes here
      } : undefined,
      // contentType: coreExecutionResult.contentType, // If ToolCallResult needs this
    };
  }

  /**
   * @inheritdoc
   * Checks the health of the ToolOrchestrator and its key dependencies (Permission Manager, Executor).
   *
   * @returns {Promise<{ isHealthy: boolean; details?: any }>} An object indicating overall health and details from components.
   */
  public async checkHealth(): Promise<{ isHealthy: boolean; details?: any }> {
    this.ensureInitialized();
    let pmHealth = { isHealthy: true, details: "ToolPermissionManager health not explicitly checked or no checkHealth method." };
    if(this.permissionManager && typeof (this.permissionManager as any).checkHealth === 'function') {
        try { pmHealth = await (this.permissionManager as any).checkHealth(); }
        catch (e: any) { pmHealth = {isHealthy: false, details: `Failed to get ToolPermissionManager health: ${e.message}`}; }
    }

    let execHealth = { isHealthy: true, details: "ToolExecutor health not explicitly checked or no checkHealth method." };
    if(this.toolExecutor && typeof (this.toolExecutor as any).checkHealth === 'function') {
        try { execHealth = await (this.toolExecutor as any).checkHealth(); }
        catch (e: any) { execHealth = {isHealthy: false, details: `Failed to get ToolExecutor health: ${e.message}`}; }
    }

    const isOverallHealthy = this.isInitialized && pmHealth.isHealthy && execHealth.isHealthy;

    return {
      isHealthy: isOverallHealthy,
      details: {
        orchestratorId: this.orchestratorId,
        status: this.isInitialized ? 'INITIALIZED' : 'NOT_INITIALIZED',
        registeredToolCount: this.toolRegistry.size,
        configSnapshot: { // Expose non-sensitive parts of config
            logToolCalls: this.config.logToolCalls,
            allowDynamicRegistration: this.config.toolRegistrySettings.allowDynamicRegistration,
            globalDisabledToolsCount: this.config.globalDisabledTools.length,
        },
        permissionManagerStatus: pmHealth,
        toolExecutorStatus: execHealth,
      },
    };
  }
  
  /**
   * Shuts down all registered tools that implement the `shutdown` method.
   * This is typically called as part of the orchestrator's own shutdown sequence.
   * @private
   * @async
   */
  private async shutdownRegisteredTools(): Promise<void> {
     console.log(`ToolOrchestrator (ID: ${this.orchestratorId}): Shutting down registered tools...`);
     // Prefer using ToolExecutor's bulk shutdown if available and it manages tool instances
     if (this.toolExecutor && typeof this.toolExecutor.shutdownAllTools === 'function') {
        try {
            await this.toolExecutor.shutdownAllTools();
            console.log(`ToolOrchestrator (ID: ${this.orchestratorId}): ToolExecutor completed shutdownAllTools.`);
        } catch (e: any) {
            console.error(`ToolOrchestrator (ID: ${this.orchestratorId}): Error during ToolExecutor.shutdownAllTools: ${e.message}`, e);
        }
     } else {
         // Manual shutdown if executor doesn't have a bulk method or if orchestrator owns tool instances directly
         for (const tool of this.toolRegistry.values()) {
             if (typeof tool.shutdown === 'function') {
                 try {
                     await tool.shutdown();
                 } catch (e: any) {
                     console.error(`ToolOrchestrator (ID: ${this.orchestratorId}): Error shutting down tool '${tool.name}' (ID: '${tool.id}'): ${e.message}`);
                 }
             }
         }
         console.log(`ToolOrchestrator (ID: ${this.orchestratorId}): Manual shutdown attempt for registered tools complete.`);
     }
  }

  /**
   * @inheritdoc
   * Gracefully shuts down the ToolOrchestrator. This involves shutting down any
   * registered tools that require cleanup and clearing the internal tool registry.
   * Dependencies like `IToolPermissionManager` and `ToolExecutor` are assumed to be managed
   * externally if they were injected.
   */
  public async shutdown(): Promise<void> {
    if (!this.isInitialized) {
      console.log(`ToolOrchestrator (ID: ${this.orchestratorId}): Shutdown called, but orchestrator was not initialized or already shut down.`);
      return;
    }
    console.log(`ToolOrchestrator (ID: ${this.orchestratorId}): Initiating shutdown sequence...`);
    
    await this.shutdownRegisteredTools();
    this.toolRegistry.clear();
    
    // If this orchestrator "owned" the permissionManager or toolExecutor instances
    // (i.e., created them itself), it should call their shutdown methods here.
    // Assuming they are injected, their lifecycle is managed externally.

    this.isInitialized = false; // Mark as uninitialized
    console.log(`ToolOrchestrator (ID: ${this.orchestratorId}) shutdown complete. Registry cleared.`);
  }
}