/**
 * @fileoverview Implements the ToolExecutor class, responsible for managing,
 * validating, and executing tools that conform to the ITool interface.
 *
 * This class handles:
 * - Registration of available tools.
 * - Listing tool schemas for discovery (e.g., by an LLM or GMI).
 * - Validating input arguments against a tool's JSON schema.
 * - Performing capability checks (as a preliminary step, to be enhanced by ToolPermissionManager).
 * - Invoking the `execute` method of an ITool instance.
 * - Handling and formatting tool execution results and errors.
 *
 * In a more mature system, some responsibilities (like advanced permissioning
 * and tool discovery/orchestration) might be delegated to specialized components
 * like ToolPermissionManager and ToolOrchestrator, as outlined in TOOLS.MD.
 * This refactored version focuses on robust execution and validation.
 *
 * @module backend/agentos/tools/ToolExecutor
 * @see ./ITool.ts for the ITool interface and related types.
 * @see ../cognitive_substrate/IGMI.ts for ToolCallRequest and UserContext.
 * @see ../../utils/errors.ts for GMIError.
 * @see ../../docs/TOOLS.MD for an overview of the tool system.
 */

import Ajv, { _ } from 'ajv'; // JSON Schema Validator
import addFormats from 'ajv-formats';

import {
  ITool,
  JSONSchemaObject,
  ToolExecutionResult,
  ToolExecutionContext,
} from './ITool';
import { ToolCallRequest, UserContext } from '../cognitive_substrate/IGMI';
import { IAuthService } from '../../services/user_auth/AuthService'; // Kept for now, role may shift
import { ISubscriptionService } from '../../services/user_auth/SubscriptionService'; // Kept for now, role may shift
import { GMIError, GMIErrorCode } from '../../utils/errors';
import { v4 as uuidv4 } from 'uuid';


/**
 * Represents the information required by the ToolExecutor to execute a tool.
 * This combines the LLM's tool call request with necessary contextual GMI/Persona information.
 *
 * @interface ToolExecutionRequestDetails
 * @property {ToolCallRequest} toolCallRequest - The raw request from the LLM/GMI.
 * @property {string} gmiId - The ID of the GMI initiating the call.
 * @property {string} personaId - The ID of the active Persona.
 * @property {string[]} personaCapabilities - Capabilities of the active Persona.
 * @property {UserContext} userContext - Context of the user associated with the GMI turn.
 * @property {string} [correlationId] - Optional ID for tracing this execution.
 */
export interface ToolExecutionRequestDetails {
  toolCallRequest: ToolCallRequest;
  gmiId: string;
  personaId: string;
  personaCapabilities: string[];
  userContext: UserContext;
  correlationId?: string;
}


/**
 * Manages a registry of tools and handles their secure execution, including
 * argument validation and capability checking.
 *
 * @class ToolExecutor
 */
export class ToolExecutor {
  private readonly registeredTools: Map<string, ITool>; // Tool name -> ITool instance
  private readonly authService?: IAuthService; // Optional: For more complex user/subscription checks
  private readonly subscriptionService?: ISubscriptionService; // Optional
  private readonly ajv: Ajv;

  /**
   * Creates an instance of ToolExecutor.
   * @param {IAuthService} [authService] - Optional authentication service for advanced permission checks.
   * @param {ISubscriptionService} [subscriptionService] - Optional subscription service for feature access checks.
   */
  constructor(authService?: IAuthService, subscriptionService?: ISubscriptionService) {
    this.registeredTools = new Map<string, ITool>();
    this.authService = authService;
    this.subscriptionService = subscriptionService;

    this.ajv = new Ajv({ allErrors: true, coerceTypes: true });
    addFormats(this.ajv); // Add standard formats like date-time, email, etc.

    this.registerDefaultTools();
    console.log(`ToolExecutor initialized with ${this.registeredTools.size} tool(s) initially registered.`);
  }

  /**
   * Registers a new tool with the executor. Tools are registered by their `name` property.
   *
   * @param {ITool} tool - The tool instance to register.
   * @throws {GMIError} If a tool with the same `name` is already registered or if the tool is invalid.
   * @returns {void}
   */
  public registerTool(tool: ITool): void {
    if (!tool || !tool.name || !tool.id) {
        throw new GMIError("Invalid tool provided for registration: missing name or id.", GMIErrorCode.INVALID_ARGUMENT, { tool });
    }
    if (this.registeredTools.has(tool.name)) {
      throw new GMIError(`Tool with name '${tool.name}' (ID: '${tool.id}') is already registered. Existing tool ID: '${this.registeredTools.get(tool.name)?.id}'. Tool names must be unique.`, GMIErrorCode.ALREADY_EXISTS, { toolName: tool.name });
    }
    this.registeredTools.set(tool.name, tool);
    console.log(`Tool '${tool.name}' (ID: '${tool.id}', Version: ${tool.version || 'N/A'}) registered.`);
  }

  /**
   * Retrieves a registered tool by its functional name.
   *
   * @param {string} toolName - The `name` of the tool (used in `ToolCallRequest`).
   * @returns {ITool | undefined} The tool instance if found, otherwise undefined.
   */
  public getTool(toolName: string): ITool | undefined {
    return this.registeredTools.get(toolName);
  }

  /**
   * Unregisters a tool by its functional name.
   * @param {string} toolName - The name of the tool to unregister.
   * @returns {boolean} True if the tool was found and unregistered, false otherwise.
   */
  public unregisterTool(toolName: string): boolean {
    const success = this.registeredTools.delete(toolName);
    if (success) {
        console.log(`Tool '${toolName}' unregistered.`);
    } else {
        console.warn(`Attempted to unregister tool '${toolName}', but it was not found.`);
    }
    return success;
  }

  /**
   * Returns a list of definitions for all registered tools.
   * This information is suitable for providing to an LLM or GMI for tool discovery and selection.
   *
   * @returns {Array<Pick<ITool, 'name' | 'description' | 'inputSchema' | 'outputSchema' | 'displayName' | 'category' | 'requiredCapabilities'>>}
   * An array of tool definitions.
   */
  public listAvailableTools(): Array<Pick<ITool, 'name' | 'description' | 'inputSchema' | 'outputSchema' | 'displayName' | 'category' | 'requiredCapabilities'>> {
    return Array.from(this.registeredTools.values()).map(tool => ({
      name: tool.name,
      displayName: tool.displayName,
      description: tool.description,
      inputSchema: tool.inputSchema,
      outputSchema: tool.outputSchema, // Include output schema if available
      category: tool.category,
      requiredCapabilities: tool.requiredCapabilities,
    }));
  }

  /**
   * Executes a specified tool based on a ToolExecutionRequestDetails.
   * This method orchestrates capability checking, argument validation, and tool invocation.
   *
   * @param {ToolExecutionRequestDetails} requestDetails - The details of the tool execution request.
   * @returns {Promise<ToolExecutionResult>} A promise that resolves with the result of the tool execution.
   * The result object will indicate success or failure and contain output or error information.
   */
  public async executeTool(requestDetails: ToolExecutionRequestDetails): Promise<ToolExecutionResult> {
    const { toolCallRequest, gmiId, personaId, personaCapabilities, userContext, correlationId } = requestDetails;
    const toolName = toolCallRequest.function.name;
    const tool = this.registeredTools.get(toolName);

    if (!tool) {
      const errorMsg = `Tool '${toolName}' not found.`;
      console.error(`ToolExecutor: ${errorMsg}`);
      return { success: false, error: errorMsg, details: { toolName } };
    }

    // 1. Capability Check (Preliminary - to be enhanced by ToolPermissionManager)
    // This basic check remains here for now but could be delegated.
    if (tool.requiredCapabilities && tool.requiredCapabilities.length > 0) {
      const hasAllCapabilities = tool.requiredCapabilities.every(cap => personaCapabilities.includes(cap));
      if (!hasAllCapabilities) {
        const errorMsg = `Persona (ID: ${personaId}) lacks required capabilities for tool '${tool.name}'. Required: [${tool.requiredCapabilities.join(', ')}], Persona Has: [${personaCapabilities.join(', ')}]`;
        console.warn(`ToolExecutor: Capability check failed - ${errorMsg}`);
        return { success: false, error: errorMsg, details: { toolName: tool.name, requiredCapabilities: tool.requiredCapabilities, personaCapabilities }};
      }
    }

    // 2. User-level Permission/Subscription Checks (Conceptual - to be enhanced by ToolPermissionManager)
    // if (this.authService && this.subscriptionService) {
    //   // Example: const canAccess = await this.permissionManager.canUserExecuteTool(userContext.userId, tool.id);
    //   // if (!canAccess) return { success: false, error: `User '${userContext.userId}' is not authorized to use tool '${tool.name}'.` };
    // }

    // 3. Argument Validation using JSON Schema
    const validate = this.ajv.compile(tool.inputSchema);
    const parsedArgs = toolCallRequest.function.arguments; // LLM usually provides JSON string, but GMI might pre-parse. Assuming object here.

    if (!validate(parsedArgs)) {
      const errorMsg = `Invalid arguments for tool '${tool.name}'. Validation failed.`;
      const validationErrors = validate.errors?.map(err => ({
          path: err.instancePath || err.schemaPath,
          message: err.message,
          params: err.params,
        }));
      console.warn(`ToolExecutor: Argument validation failed for '${tool.name}'. Errors:`, validationErrors);
      return { success: false, error: errorMsg, details: { toolName: tool.name, validationErrors } };
    }

    // 4. Construct Tool Execution Context
    const executionContext: ToolExecutionContext = {
      gmiId,
      personaId,
      userContext,
      correlationId: correlationId || `tool-exec-${uuidv4()}`,
      // sessionData: await this.workingMemory.getScopedSessionDataForTool(tool.id) // Example advanced context
    };

    // 5. Execute the Tool
    try {
      console.log(`ToolExecutor: Executing tool '${tool.name}' (ID: '${tool.id}') with args:`, parsedArgs, `Context:`, { gmiId, personaId, userId: userContext.userId });
      const startTime = Date.now();
      const result = await tool.execute(parsedArgs, executionContext); // Pass validated args
      const durationMs = Date.now() - startTime;
      console.log(`ToolExecutor: Tool '${tool.name}' executed. Success: ${result.success}, Duration: ${durationMs}ms. Output preview:`, result.output ? JSON.stringify(result.output).substring(0,100) + '...' : 'N/A');
      
      // Optional: Validate output against tool.outputSchema if defined
      if(tool.outputSchema && result.success && result.output) {
        const validateOutput = this.ajv.compile(tool.outputSchema);
        if(!validateOutput(result.output)) {
            const errorMsg = `Tool '${tool.name}' produced output that failed schema validation.`;
            const validationErrors = validateOutput.errors?.map(err => ({ path: err.instancePath, message: err.message }));
            console.warn(`ToolExecutor: Output validation failed for '${tool.name}'. Errors:`, validationErrors);
            // Decide how to handle: return success with warning, or mark as failure?
            // For now, return success but include validation failure in details.
            return { ...result, details: { ...(result.details || {}), outputValidationErrors: validationErrors, warning: errorMsg }};
        }
      }
      return result;

    } catch (error: any) {
      const execErrorMsg = `Tool execution failed for '${tool.name}'.`;
      console.error(`ToolExecutor: ${execErrorMsg}`, error);
      if (error instanceof GMIError) {
        return { success: false, error: `${execErrorMsg}: ${error.message}`, details: { toolName: tool.name, errorCode: error.code, errorDetails: error.details } };
      }
      return { success: false, error: `${execErrorMsg}: ${error.message || 'Unknown execution error'}`, details: { toolName: tool.name, rawError: error.toString() } };
    }
  }

  /**
   * Registers some default, built-in tools as examples.
   * In a real application, tools would be registered dynamically or at startup.
   * @private
   */
  private registerDefaultTools(): void {
    // Example 1: CurrentTimeTool
    const currentTimeTool: ITool<{ timezone?: string }, { currentTime: string; timezone: string; iso: string }> = {
      id: "system-current-time-tool-v1",
      name: "getCurrentTime",
      displayName: "Current Time Service",
      description: "Gets the current date and time, optionally for a specific timezone (IANA format like 'America/New_York'). Defaults to server's local time if no timezone provided.",
      inputSchema: {
        type: "object",
        properties: {
          timezone: { type: "string", description: "Optional: IANA timezone string (e.g., 'America/Los_Angeles', 'Europe/London').", format: "time-zone" }, // requires ajv-formats
        },
        additionalProperties: false,
      },
      outputSchema: {
        type: "object",
        properties: {
            currentTime: { type: "string", description: "The current time formatted as a locale string." },
            timezone: { type: "string", description: "The timezone used for the calculation." },
            iso: { type: "string", format: "date-time", description: "The current time in ISO 8601 format."}
        },
        required: ["currentTime", "timezone", "iso"]
      },
      category: "System Utilities",
      version: "1.0.0",
      hasSideEffects: false,
      execute: async (args, context) => {
        try {
          const tz = args.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
          // Validate timezone if possible using a library, or catch error from Date.toLocaleString
          let date;
          try {
            date = new Date();
            const localTime = date.toLocaleString("en-US", { timeZone: tz }); // Check if timezone is valid
            // If toLocaleString doesn't throw for bad tz, it uses default. This is tricky.
            // A proper timezone library would be better for validation.
          } catch (tzError) {
             return { success: false, error: `Invalid timezone provided: ${args.timezone}`};
          }
          
          return {
            success: true,
            output: {
              currentTime: new Date().toLocaleString("en-US", { timeZone: tz }),
              timezone: tz,
              iso: new Date().toISOString(),
            },
            contentType: "application/json"
          };
        } catch (e: any) {
          return { success: false, error: `Error getting current time: ${e.message}` };
        }
      }
    };
    this.registerTool(currentTimeTool);

    // Example 2: Simple Echo Tool (useful for testing arguments)
     const echoTool: ITool<{message: string; prefix?: string}, {echoedMessage: string}> = {
        id: "system-echo-tool-v1",
        name: "echoMessage",
        displayName: "Echo Service",
        description: "Echoes back a message, optionally with a prefix. Useful for testing tool calls and argument passing.",
        inputSchema: {
            type: "object",
            properties: {
                message: { type: "string", description: "The message to echo." },
                prefix: { type: "string", description: "Optional prefix to add to the echoed message." }
            },
            required: ["message"]
        },
        outputSchema: {
            type: "object",
            properties: {
                echoedMessage: { type: "string", description: "The message, echoed back, with prefix if provided."}
            },
            required: ["echoedMessage"]
        },
        category: "Testing Utilities",
        version: "1.0.0",
        hasSideEffects: false,
        execute: async (args, context) => {
            const echoed = (args.prefix || "") + args.message;
            // console.log(`Echo tool in GMI ${context.gmiId} for user ${context.userContext.userId} echoed: ${echoed}`);
            return { success: true, output: { echoedMessage: echoed } };
        }
    };
    this.registerTool(echoTool);
  }

  /**
   * Gracefully shuts down all registered tools that implement the optional `shutdown` method.
   * @async
   * @returns {Promise<void[]>} A promise that resolves when all tool shutdowns are complete.
   */
  public async shutdownAllTools(): Promise<void[]> {
    console.log("ToolExecutor: Shutting down all registered tools...");
    const shutdownPromises: Promise<void>[] = [];
    for (const tool of this.registeredTools.values()) {
      if (typeof tool.shutdown === 'function') {
        shutdownPromises.push(
          tool.shutdown().catch(err => {
            console.error(`ToolExecutor: Error shutting down tool '${tool.name}' (ID: '${tool.id}'):`, err);
            // Optionally rethrow or collect errors
          })
        );
      }
    }
    return Promise.all(shutdownPromises);
  }
}