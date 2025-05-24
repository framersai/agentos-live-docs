/**
 * @fileoverview Implements the ToolOrchestrator class, which serves as the central
 * hub for managing and executing tools within the AgentOS system.
 *
 * The ToolOrchestrator coordinates with the ToolPermissionManager to authorize
 * tool calls and with the ToolExecutor to perform the actual execution. It provides
 * a unified interface for GMIs to interact with the tool ecosystem.
 *
 * @module backend/agentos/tools/ToolOrchestrator
 * @see ./IToolOrchestrator.ts for the interface definition.
 * @see ./ITool.ts
 * @see ./IToolPermissionManager.ts
 * @see ./ToolExecutor.ts
 * @see ../config/ToolOrchestratorConfig.ts
 */

import { v4 as uuidv4 } from 'uuid';
import {
  IToolOrchestrator,
  ToolDefinitionForLLM,
} from './IToolOrchestrator';
import { ITool } from './ITool';
import { IToolPermissionManager, PermissionCheckContext } from './IToolPermissionManager';
import { ToolExecutor, ToolExecutionRequestDetails } from './ToolExecutor';
import { ToolOrchestratorConfig } from '../config/ToolOrchestratorConfig';
import { ToolCallResult, UserContext } from '../cognitive_substrate/IGMI';
import { GMIError, GMIErrorCode } from '../../utils/errors';

/**
 * @class ToolOrchestrator
 * @implements {IToolOrchestrator}
 * Central component for tool management, authorization, and execution routing.
 */
export class ToolOrchestrator implements IToolOrchestrator {
  public readonly orchestratorId: string;
  private config: ToolOrchestratorConfig;
  private permissionManager!: IToolPermissionManager;
  private toolExecutor!: ToolExecutor;
  private readonly toolRegistry: Map<string, ITool>; // Tool name -> ITool instance
  private isInitialized: boolean = false;

  // Default configuration values
  private static readonly DEFAULT_CONFIG: Required<Omit<ToolOrchestratorConfig, 'orchestratorId' | 'globalDisabledTools' | 'customParameters' | 'toolRegistrySettings'>> & { toolRegistrySettings: Required<NonNullable<ToolOrchestratorConfig['toolRegistrySettings']>>} = {
    defaultToolCallTimeoutMs: 30000,
    maxConcurrentToolCalls: 10,
    logToolCalls: true,
    toolRegistrySettings: {
        allowDynamicRegistration: true,
        persistRegistry: false,
    }
  };


  /**
   * Constructs a ToolOrchestrator instance.
   * Not operational until `initialize` is called.
   */
  constructor() {
    this.orchestratorId = `tool-orch-${uuidv4()}`;
    this.toolRegistry = new Map<string, ITool>();
    // Apply defaults, to be overridden by provided config in initialize
    this.config = {
        orchestratorId: this.orchestratorId,
        ...ToolOrchestrator.DEFAULT_CONFIG
    };
  }

  /**
   * @inheritdoc
   */
  public async initialize(
    config: ToolOrchestratorConfig | undefined,
    permissionManager: IToolPermissionManager,
    toolExecutor: ToolExecutor,
    initialTools?: ITool[],
  ): Promise<void> {
    if (this.isInitialized) {
      console.warn(`ToolOrchestrator (ID: ${this.orchestratorId}) already initialized. Re-initializing.`);
      // Consider shutting down existing registered tools if any
      await this.shutdownRegisteredTools();
      this.toolRegistry.clear();
    }

    this.config = {
        orchestratorId: this.orchestratorId,
        ...ToolOrchestrator.DEFAULT_CONFIG, // Apply defaults first
        ...config, // Override with provided config
        toolRegistrySettings: { // Deep merge for nested objects
            ...ToolOrchestrator.DEFAULT_CONFIG.toolRegistrySettings,
            ...config?.toolRegistrySettings,
        }
    };


    if (!permissionManager) throw new GMIError('IToolPermissionManager dependency is required.', GMIErrorCode.DEPENDENCY_ERROR, { orchestratorId: this.orchestratorId });
    if (!toolExecutor) throw new GMIError('ToolExecutor dependency is required.', GMIErrorCode.DEPENDENCY_ERROR, { orchestratorId: this.orchestratorId });

    this.permissionManager = permissionManager;
    this.toolExecutor = toolExecutor;

    if (initialTools && initialTools.length > 0) {
      for (const tool of initialTools) {
        await this.registerTool(tool); // Use the public method for consistency
      }
    }

    this.isInitialized = true;
    console.log(`ToolOrchestrator (ID: ${this.orchestratorId}) initialized successfully. Registered tools: ${this.toolRegistry.size}.`);
  }

  /**
   * Ensures the orchestrator is initialized.
   * @private
   */
  private ensureInitialized(): void {
    if (!this.isInitialized) {
      throw new GMIError(`ToolOrchestrator (ID: ${this.orchestratorId}) is not initialized.`, GMIErrorCode.NOT_INITIALIZED);
    }
  }

  /**
   * @inheritdoc
   */
  public async registerTool(tool: ITool): Promise<void> {
    this.ensureInitialized();
    if (!this.config.toolRegistrySettings?.allowDynamicRegistration) {
      throw new GMIError("Dynamic tool registration is disabled by configuration.", GMIErrorCode.OPERATION_NOT_ALLOWED, { toolName: tool.name });
    }
    if (!tool || !tool.name || !tool.id) {
      throw new GMIError("Invalid tool provided for registration: missing name or id.", GMIErrorCode.INVALID_ARGUMENT, { tool });
    }
    if (this.toolRegistry.has(tool.name)) {
      throw new GMIError(`Tool with name '${tool.name}' (ID: '${tool.id}') is already registered. Tool names must be unique.`, GMIErrorCode.ALREADY_EXISTS, { toolName: tool.name });
    }
    if (this.config.globalDisabledTools?.includes(tool.name) || this.config.globalDisabledTools?.includes(tool.id)) {
        console.warn(`ToolOrchestrator (ID: ${this.orchestratorId}): Tool '${tool.name}' (ID: '${tool.id}') is globally disabled and cannot be registered or will not be executable.`);
        // Decide whether to throw an error or just warn and not make it executable
        // For now, let it be registered but processToolCall will check globalDisabledTools.
    }
    this.toolRegistry.set(tool.name, tool);
    console.log(`ToolOrchestrator (ID: ${this.orchestratorId}): Tool '${tool.name}' (ID: '${tool.id}') registered.`);
  }

  /**
   * @inheritdoc
   */
  public async unregisterTool(toolName: string): Promise<boolean> {
    this.ensureInitialized();
    if (!this.config.toolRegistrySettings?.allowDynamicRegistration) {
      throw new GMIError("Dynamic tool unregistration is disabled by configuration.", GMIErrorCode.OPERATION_NOT_ALLOWED, { toolName });
    }
    const tool = this.toolRegistry.get(toolName);
    if (tool && typeof tool.shutdown === 'function') {
        try {
            await tool.shutdown();
        } catch(e: any) {
            console.error(`ToolOrchestrator (ID: ${this.orchestratorId}): Error during shutdown of tool '${toolName}' while unregistering: ${e.message}`, e);
        }
    }
    const success = this.toolRegistry.delete(toolName);
    if (success) {
      console.log(`ToolOrchestrator (ID: ${this.orchestratorId}): Tool '${toolName}' unregistered.`);
    }
    return success;
  }

  /**
   * @inheritdoc
   */
  public async getTool(toolName: string): Promise<ITool | undefined> {
    this.ensureInitialized();
    return this.toolRegistry.get(toolName);
  }

  /**
   * @inheritdoc
   */
  public async listAvailableTools(context?: {
    personaId?: string;
    personaCapabilities?: string[];
    userContext?: UserContext;
  }): Promise<ToolDefinitionForLLM[]> {
    this.ensureInitialized();
    const availableTools: ToolDefinitionForLLM[] = [];

    for (const tool of this.toolRegistry.values()) {
      if (this.config.globalDisabledTools?.includes(tool.name) || this.config.globalDisabledTools?.includes(tool.id)) {
        continue; // Skip globally disabled tools
      }

      // If context is provided, check permissions
      if (context && context.personaId && context.userContext && context.personaCapabilities) {
        const permissionContext: PermissionCheckContext = {
          tool,
          personaId: context.personaId,
          personaCapabilities: context.personaCapabilities,
          userContext: context.userContext,
          // gmiId can be added if available and needed by permission manager
        };
        const permissionResult = await this.permissionManager.isExecutionAllowed(permissionContext);
        if (!permissionResult.isAllowed) {
          continue; // Skip tools not allowed for this context
        }
      }

      availableTools.push({
        name: tool.name,
        description: tool.description,
        inputSchema: tool.inputSchema,
        outputSchema: tool.outputSchema,
      });
    }
    return availableTools;
  }

  /**
   * @inheritdoc
   */
  public async processToolCall(requestDetails: ToolExecutionRequestDetails): Promise<ToolCallResult> {
    this.ensureInitialized();
    const { toolCallRequest, gmiId, personaId, personaCapabilities, userContext } = requestDetails;
    const toolName = toolCallRequest.function.name;
    const toolCallId = toolCallRequest.id; // From LLM

    const logPrefix = `ToolOrchestrator (ID: ${this.orchestratorId}, GMI: ${gmiId}, CallID: ${toolCallId}):`;

    if (this.config.logToolCalls) {
      console.log(`${logPrefix} Received tool call request for '${toolName}' with args:`, toolCallRequest.function.arguments);
    }

    const tool = this.toolRegistry.get(toolName);
    if (!tool) {
      const errorMsg = `Tool '${toolName}' not found in registry.`;
      console.error(`${logPrefix} ${errorMsg}`);
      return { toolCallId, toolName, isError: true, errorDetails: { message: errorMsg, code: GMIErrorCode.TOOL_NOT_FOUND }, output: null };
    }
    
    if (this.config.globalDisabledTools?.includes(tool.name) || this.config.globalDisabledTools?.includes(tool.id)) {
      const errorMsg = `Tool '${toolName}' (ID: '${tool.id}') is globally disabled.`;
      console.warn(`${logPrefix} ${errorMsg}`);
      return { toolCallId, toolName, isError: true, errorDetails: { message: errorMsg, code: GMIErrorCode.TOOL_DISABLED }, output: null };
    }

    // 1. Check Permissions
    const permissionContext: PermissionCheckContext = {
      tool,
      personaId,
      personaCapabilities,
      userContext,
      gmiId,
    };
    const permissionResult = await this.permissionManager.isExecutionAllowed(permissionContext);

    if (!permissionResult.isAllowed) {
      const errorMsg = permissionResult.reason || `Permission denied for tool '${toolName}'.`;
      console.warn(`${logPrefix} ${errorMsg}`, permissionResult.details);
      return { toolCallId, toolName, isError: true, errorDetails: { message: errorMsg, code: GMIErrorCode.PERMISSION_DENIED, details: permissionResult.details }, output: null };
    }

    // 2. Execute via ToolExecutor (which handles schema validation)
    // The ToolExecutor expects ToolExecutionRequestDetails. We pass it through.
    let executionResult: ToolExecutionResult;
    try {
      executionResult = await this.toolExecutor.executeTool(requestDetails);
    } catch (executorError: any) {
        // This catch is for unexpected errors from ToolExecutor itself, not tool's own errors handled within ToolExecutionResult
        const errorMsg = `Unexpected error during tool execution pipeline for '${toolName}'.`;
        console.error(`${logPrefix} ${errorMsg}`, executorError);
        return { toolCallId, toolName, isError: true, errorDetails: { message: errorMsg, code: GMIErrorCode.TOOL_EXECUTION_FAILED, details: executorError.toString() }, output: null };
    }


    // 3. Format and Return Result
    if (this.config.logToolCalls) {
        console.log(`${logPrefix} Tool '${toolName}' execution result: Success: ${executionResult.success}, Output:`, executionResult.output ? JSON.stringify(executionResult.output).substring(0,100) + '...' : 'N/A', `Error: ${executionResult.error || 'N/A'}`);
    }

    if (!executionResult.success) {
      return {
        toolCallId,
        toolName,
        isError: true,
        errorDetails: { message: executionResult.error || `Tool '${toolName}' failed without a specific error message.`, details: executionResult.details },
        output: null, // Or executionResult.output if partial results are possible on failure
      };
    }

    return {
      toolCallId,
      toolName,
      output: executionResult.output, // The actual output from the tool
      isError: false,
      // contentType: executionResult.contentType, // If ToolCallResult supports contentType
    };
  }

  /**
   * @inheritdoc
   */
  public async checkHealth(): Promise<{ isHealthy: boolean; details?: any }> {
    this.ensureInitialized();
    let executorHealth = { isHealthy: true, details: "ToolExecutor health not explicitly checked by orchestrator's basic health check." };
    if(this.toolExecutor && typeof (this.toolExecutor as any).checkHealth === 'function') { // Basic check if ToolExecutor has health method
        try {
            executorHealth = await (this.toolExecutor as any).checkHealth();
        } catch (e) {
            executorHealth = {isHealthy: false, details: "Failed to get ToolExecutor health."};
        }
    }
     let permissionManagerHealth = { isHealthy: true, details: "ToolPermissionManager health not explicitly checked by orchestrator's basic health check." };
     // Add similar check for permissionManager if it gets a health check method


    const isHealthy = this.isInitialized && executorHealth.isHealthy && permissionManagerHealth.isHealthy;

    return {
      isHealthy,
      details: {
        orchestratorId: this.orchestratorId,
        status: this.isInitialized ? 'Initialized' : 'Not Initialized',
        registeredToolCount: this.toolRegistry.size,
        config: this.config, // Be mindful of exposing sensitive parts of config
        toolExecutorStatus: executorHealth,
        permissionManagerStatus: permissionManagerHealth,
      },
    };
  }

  /**
   * Shuts down registered tools that have a shutdown method.
   * @private
   */
  private async shutdownRegisteredTools(): Promise<void> {
     if (this.toolExecutor && typeof this.toolExecutor.shutdownAllTools === 'function') {
        await this.toolExecutor.shutdownAllTools();
    } else {
        // Manual shutdown if executor doesn't have a bulk method
        for (const tool of this.toolRegistry.values()) {
            if (typeof tool.shutdown === 'function') {
                try {
                    await tool.shutdown();
                } catch (e: any) {
                    console.error(`ToolOrchestrator (ID: ${this.orchestratorId}): Error shutting down tool '${tool.name}': ${e.message}`);
                }
            }
        }
    }
  }


  /**
   * @inheritdoc
   */
  public async shutdown(): Promise<void> {
    if (!this.isInitialized) {
      console.log(`ToolOrchestrator (ID: ${this.orchestratorId}): Shutdown called but not initialized.`);
      return;
    }
    console.log(`ToolOrchestrator (ID: ${this.orchestratorId}): Shutting down...`);
    await this.shutdownRegisteredTools();
    this.toolRegistry.clear();
    // Shutdown dependencies if orchestrator "owns" them.
    // For now, assuming executor and permissionManager lifecycles are managed externally if passed in.
    this.isInitialized = false;
    console.log(`ToolOrchestrator (ID: ${this.orchestratorId}) shut down.`);
  }
}