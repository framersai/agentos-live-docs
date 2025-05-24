// File: backend/agentos/core/tools/ToolExecutor.ts
/**
 * @fileoverview Implements the ToolExecutor class, responsible for managing,
 * validating, and executing tools that conform to the ITool interface.
 *
 * This class handles:
 * - Registration of available tools.
 * - Validating input arguments against a tool's JSON schema using Ajv.
 * - Invoking the `execute` method of an ITool instance with proper context.
 * - Handling and formatting tool execution results and errors into a standardized `ToolExecutionResult`.
 *
 * The ToolExecutor is a key component in the tool invocation pipeline, ensuring that
 * tools are called correctly and their outputs are processed consistently.
 *
 * @module backend/agentos/core/tools/ToolExecutor
 * @see ./ITool.ts for the ITool interface and related types.
 * @see ../cognitive_substrate/IGMI.ts for ToolCallRequest and UserContext. (Path relative to core/tools)
 * @see ../../utils/errors.ts for GMIError. (Path relative to core/tools)
 */

import Ajv from 'ajv'; // Corrected: Default import
import addFormats from 'ajv-formats';
import { v4 as uuidv4 } from 'uuid';

import {
  ITool,
  JSONSchemaObject,
  ToolExecutionResult,
  ToolExecutionContext,
} from './ITool'; // Assumes ITool.ts is in the same directory
import { ToolCallRequest, UserContext } from '../cognitive_substrate/IGMI'; // Corrected path
import { IAuthService } from '../../services/user_auth/IAuthService'; // Corrected: Import interface from its own file
import { ISubscriptionService } from '../../services/user_auth/SubscriptionService'; // Path seems correct
import { GMIError, GMIErrorCode } from '../../utils/errors'; // Path seems correct


/**
 * Represents the detailed information required by the ToolExecutor to find, validate,
 * and execute a specific tool based on a request (typically from an LLM or GMI).
 *
 * @interface ToolExecutionRequestDetails
 * @property {ToolCallRequest} toolCallRequest - The raw tool call request, usually originating from an LLM,
 * containing the target tool's function name and stringified arguments.
 * @property {string} gmiId - The ID of the GMI (Generalized Mind Instance) initiating the tool call.
 * This provides context for logging and potentially for tool behavior.
 * @property {string} personaId - The ID of the active Persona within the GMI. This can be used for
 * permission checks or tailoring tool behavior.
 * @property {string[]} personaCapabilities - An array of capabilities associated with the active Persona.
 * Used for basic capability checking by the executor or more advanced checks by a `ToolPermissionManager`.
 * @property {UserContext} userContext - Contextual information about the end-user associated with the GMI turn.
 * Useful for personalization or user-specific permission logic.
 * @property {string} [correlationId] - An optional identifier for tracing this specific tool execution
 * across logs and system components. If not provided, one might be generated.
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
 * @class ToolExecutor
 * @description Manages a registry of `ITool` instances and handles their secure execution.
 * This includes validating input arguments against each tool's defined JSON schema and
 * invoking the tool's `execute` method with the appropriate `ToolExecutionContext`.
 * It is designed to be a robust and reliable component for integrating external
 * functionalities into the AgentOS ecosystem.
 */
export class ToolExecutor {
  /**
   * In-memory registry of available tools, mapping tool functional names (`ITool.name`) to their instances.
   * @private
   * @readonly
   * @type {Map<string, ITool>}
   */
  private readonly registeredTools: Map<string, ITool>;

  /**
   * Optional authentication service instance for advanced permission checks (currently conceptual within executor).
   * @private
   * @readonly
   * @type {IAuthService | undefined}
   */
  private readonly authService?: IAuthService;

  /**
   * Optional subscription service instance for feature access checks (currently conceptual within executor).
   * @private
   * @readonly
   * @type {ISubscriptionService | undefined}
   */
  private readonly subscriptionService?: ISubscriptionService;

  /**
   * AJV (Another JSON Validator) instance used for validating tool input arguments against their schemas.
   * Configured with `allErrors: true` to report all validation failures and `coerceTypes: true` to allow
   * type coercion where appropriate (e.g., string to number if schema allows).
   * @private
   * @readonly
   * @type {Ajv}
   */
  private readonly ajv: Ajv;

  /**
   * Creates an instance of ToolExecutor.
   * Initializes the tool registry and the AJV schema validator.
   *
   * @constructor
   * @param {IAuthService} [authService] - Optional. An instance of an authentication service.
   * Primarily for future use in more complex, user-specific permission checks within the executor,
   * though most permission logic is intended for `ToolPermissionManager`.
   * @param {ISubscriptionService} [subscriptionService] - Optional. An instance of a subscription service.
   * Used similarly to `authService` for potential feature-based tool access control.
   */
  constructor(authService?: IAuthService, subscriptionService?: ISubscriptionService) {
    this.registeredTools = new Map<string, ITool>();
    this.authService = authService;
    this.subscriptionService = subscriptionService;

    this.ajv = new Ajv({ allErrors: true, coerceTypes: true });
    addFormats(this.ajv); // Adds support for formats like "date-time", "email", "uri", etc.

    this.registerDefaultTools(); // Register any built-in or example tools
    console.log(`ToolExecutor initialized. Initially registered tools: ${this.registeredTools.size}.`);
  }

  /**
   * Registers a tool with the executor, making it available for execution.
   * Tools are uniquely identified by their `name` property within the registry.
   *
   * @public
   * @param {ITool} tool - The tool instance to register. It must conform to the `ITool` interface.
   * @returns {void}
   * @throws {GMIError} If the provided tool is invalid (e.g., missing `id` or `name` - `GMIErrorCode.INVALID_ARGUMENT`),
   * or if a tool with the same `name` is already registered (`GMIErrorCode.ALREADY_EXISTS`).
   */
  public registerTool(tool: ITool): void {
    if (!tool || !tool.name || !tool.id) {
        throw new GMIError("Invalid tool object provided for registration: 'id' and 'name' are required.", GMIErrorCode.INVALID_ARGUMENT, { toolDetails: tool });
    }
    if (this.registeredTools.has(tool.name)) {
      throw new GMIError(`A tool with the name '${tool.name}' (ID: '${tool.id}') is already registered. The existing tool has ID: '${this.registeredTools.get(tool.name)?.id}'. Tool names must be unique within the executor.`, GMIErrorCode.ALREADY_EXISTS, { conflictingToolName: tool.name });
    }
    this.registeredTools.set(tool.name, tool);
    console.log(`ToolExecutor: Tool '${tool.name}' (ID: '${tool.id}', Version: ${tool.version || 'N/A'}) successfully registered.`);
  }

  /**
   * Retrieves a registered tool instance by its functional name.
   *
   * @public
   * @param {string} toolName - The `name` of the tool (as used in `ToolCallRequest.function.name`).
   * @returns {ITool | undefined} The `ITool` instance if found in the registry; otherwise, `undefined`.
   */
  public getTool(toolName: string): ITool | undefined {
    return this.registeredTools.get(toolName);
  }

  /**
   * Unregisters a tool from the executor by its functional name.
   * If the tool implements a `shutdown` method, it will be called.
   *
   * @public
   * @async
   * @param {string} toolName - The `name` of the tool to unregister.
   * @returns {Promise<boolean>} A promise resolving to `true` if the tool was found and successfully unregistered (including shutdown if applicable), `false` otherwise.
   */
  public async unregisterTool(toolName: string): Promise<boolean> {
    const tool = this.registeredTools.get(toolName);
    if (tool) {
      if (typeof tool.shutdown === 'function') {
        try {
          await tool.shutdown();
          console.log(`ToolExecutor: Tool '${toolName}' (ID: '${tool.id}') shutdown successfully during unregistration.`);
        } catch (shutdownError: any) {
          console.error(`ToolExecutor: Error during shutdown of tool '${toolName}' (ID: '${tool.id}') while unregistering: ${shutdownError.message}`, shutdownError);
          // Decide if unregistration should proceed despite shutdown error. For now, proceed.
        }
      }
      const deleted = this.registeredTools.delete(toolName);
      if (deleted) {
        console.log(`ToolExecutor: Tool '${toolName}' successfully unregistered.`);
      }
      return deleted;
    } else {
      console.warn(`ToolExecutor: Attempted to unregister tool '${toolName}', but it was not found in the registry.`);
      return false;
    }
  }

  /**
   * Returns an array of definitions for all currently registered tools.
   * This list is suitable for providing to an LLM or GMI for tool discovery,
   * enabling them to understand available functionalities and their invocation schemas.
   *
   * @public
   * @returns {Array<Pick<ITool, 'name' | 'description' | 'inputSchema' | 'outputSchema' | 'displayName' | 'category' | 'requiredCapabilities'>>}
   * An array of objects, where each object contains key descriptive properties of a registered tool.
   */
  public listAvailableTools(): Array<Pick<ITool, 'name' | 'description' | 'inputSchema' | 'outputSchema' | 'displayName' | 'category' | 'requiredCapabilities'>> {
    return Array.from(this.registeredTools.values()).map(tool => ({
      name: tool.name,
      displayName: tool.displayName,
      description: tool.description,
      inputSchema: tool.inputSchema,
      outputSchema: tool.outputSchema,
      category: tool.category,
      requiredCapabilities: tool.requiredCapabilities,
    }));
  }

  /**
   * Executes a specified tool based on the details provided in a `ToolExecutionRequestDetails` object.
   * This method orchestrates the core steps of tool invocation:
   * 1. Retrieval of the tool from the registry.
   * 2. Preliminary capability checking (though comprehensive permissioning is typically handled by `ToolPermissionManager`).
   * 3. Validation of input arguments against the tool's `inputSchema` using AJV.
   * 4. Invocation of the tool's `execute` method with the validated arguments and execution context.
   * 5. Optional validation of the tool's output against its `outputSchema`.
   * 6. Formatting and returning the `ToolExecutionResult`.
   *
   * @public
   * @async
   * @param {ToolExecutionRequestDetails} requestDetails - An object containing all necessary details for the tool execution.
   * @returns {Promise<ToolExecutionResult>} A promise that resolves with the `ToolExecutionResult` object,
   * indicating the success or failure of the execution and providing output or error details.
   */
  public async executeTool(requestDetails: ToolExecutionRequestDetails): Promise<ToolExecutionResult> {
    const { toolCallRequest, gmiId, personaId, personaCapabilities, userContext, correlationId } = requestDetails;
    const toolName = toolCallRequest.function.name;
    const tool = this.registeredTools.get(toolName);

    const logContext = `ToolExecutor (GMI: ${gmiId}, Persona: ${personaId}, Tool: ${toolName}, CallID: ${toolCallRequest.id || 'N/A'})`;

    if (!tool) {
      const errorMsg = `Tool '${toolName}' not found in registry.`;
      console.error(`${logContext}: ${errorMsg}`);
      return { success: false, error: errorMsg, details: { toolName, searchedRegistry: true } };
    }

    // Basic capability check (can be augmented by a dedicated PermissionManager)
    if (tool.requiredCapabilities && tool.requiredCapabilities.length > 0) {
      const hasAllCapabilities = tool.requiredCapabilities.every(cap => personaCapabilities.includes(cap));
      if (!hasAllCapabilities) {
        const errorMsg = `Persona lacks required capabilities. Required: [${tool.requiredCapabilities.join(', ')}], Persona Has: [${personaCapabilities.join(', ')}]`;
        console.warn(`${logContext}: Capability check failed - ${errorMsg}`);
        return { success: false, error: errorMsg, details: { toolName: tool.name, requiredCapabilities: tool.requiredCapabilities, personaCapabilities }};
      }
    }

    // Argument Validation (ensure arguments is an object, even if empty)
    const toolArgs = toolCallRequest.function.arguments || {};
    if (typeof toolArgs !== 'object' || toolArgs === null) {
        const errorMsg = `Invalid arguments type for tool '${tool.name}'. Expected object, got ${typeof toolArgs}.`;
        console.warn(`${logContext}: ${errorMsg} Args:`, toolCallRequest.function.arguments);
        return { success: false, error: errorMsg, details: { toolName: tool.name, receivedArgs: toolCallRequest.function.arguments } };
    }
    
    const validate = this.ajv.compile(tool.inputSchema);
    if (!validate(toolArgs)) {
      const errorMsg = `Invalid arguments for tool '${tool.name}'. Validation failed against input schema.`;
      const validationErrors = validate.errors?.map(err => ({
        path: err.instancePath || err.schemaPath, // Provides context for the error
        message: err.message,
        params: err.params,
      })) || [{ message: "Unknown validation error." }];
      console.warn(`${logContext}: Argument validation failed. Errors:`, JSON.stringify(validationErrors, null, 2));
      return { success: false, error: errorMsg, details: { toolName: tool.name, validationErrors, providedArgs: toolArgs } };
    }

    const executionContext: ToolExecutionContext = {
      gmiId,
      personaId,
      userContext,
      correlationId: correlationId || `tool-exec-${uuidv4()}`,
    };

    try {
      console.log(`${logContext}: Executing with validated args:`, toolArgs);
      const startTime = Date.now();
      // Type assertion for toolArgs based on TInput of the tool.
      // This assumes that TInput of ITool corresponds to the structure validated by inputSchema.
      const result = await tool.execute(toolArgs as any, executionContext);
      const durationMs = Date.now() - startTime;
      
      if (result.success) {
        console.log(`${logContext}: Execution successful. Duration: ${durationMs}ms. Output preview:`, result.output ? JSON.stringify(result.output).substring(0,150) + '...' : 'N/A');
      } else {
        console.warn(`${logContext}: Execution reported failure. Duration: ${durationMs}ms. Error: ${result.error}`, result.details);
      }
      
      // Optional: Validate output against tool.outputSchema if defined
      if (tool.outputSchema && result.success && result.output !== undefined) {
        const validateOutput = this.ajv.compile(tool.outputSchema);
        if (!validateOutput(result.output)) {
          const outputErrorMsg = `Tool '${tool.name}' produced output that failed schema validation.`;
          const outputValidationErrors = validateOutput.errors?.map(err => ({ path: err.instancePath, message: err.message, params: err.params }));
          console.warn(`${logContext}: Output validation failed. Errors:`, JSON.stringify(outputValidationErrors, null, 2));
          // Return success=true but with a warning and details about output validation failure.
          // Alternatively, could mark success=false if output schema adherence is critical.
          return { 
            ...result, 
            details: { 
              ...(result.details || {}), 
              outputValidationWarning: outputErrorMsg,
              outputValidationErrors 
            }
          };
        }
      }
      return result;

    } catch (error: any) { // Catch unexpected errors from tool.execute() itself
      const execErrorMsg = `Critical unhandled error during execution of tool '${tool.name}'.`;
      console.error(`${logContext}: ${execErrorMsg}`, error);
      const gmiErr = createGMIErrorFromError(error, GMIErrorCode.TOOL_EXECUTION_FAILED, { toolName: tool.name }, execErrorMsg);
      return { 
        success: false, 
        error: gmiErr.message, 
        details: { 
            toolName: tool.name, 
            errorCode: gmiErr.code, 
            errorDetails: gmiErr.details, 
            rawError: error.toString(),
            stack: error.stack 
        } 
      };
    }
  }

  /**
   * Registers some default, built-in tools as examples.
   * In a production application, tools would typically be registered dynamically
   * based on configuration or plugins.
   * @private
   */
  private registerDefaultTools(): void {
    // Example 1: CurrentTimeTool (from previous implementation, adapted)
    const currentTimeTool: ITool<{ timezone?: string }, { currentTime: string; timezoneUsed: string; isoTimestamp: string }> = {
      id: "system-current-time-tool-v1.1",
      name: "getCurrentDateTime", // More descriptive name
      displayName: "Current Date & Time Service",
      description: "Gets the current date and time, optionally for a specific IANA timezone (e.g., 'America/New_York', 'Europe/London'). Defaults to the server's local timezone if no timezone is provided or if the provided one is invalid.",
      inputSchema: {
        type: "object",
        properties: {
          timezone: { type: "string", description: "Optional: IANA timezone string (e.g., 'America/Los_Angeles', 'Europe/London').", format: "time-zone" },
        },
        additionalProperties: false,
      } as JSONSchemaObject,
      outputSchema: {
        type: "object",
        properties: {
          currentTime: { type: "string", description: "The current date and time formatted as a locale string (e.g., '5/24/2025, 11:43:58 AM')." },
          timezoneUsed: { type: "string", description: "The IANA timezone that was used for the calculation." },
          isoTimestamp: { type: "string", format: "date-time", description: "The current date and time in ISO 8601 format (UTC)."}
        },
        required: ["currentTime", "timezoneUsed", "isoTimestamp"]
      } as JSONSchemaObject,
      category: "System Utilities",
      version: "1.1.0",
      hasSideEffects: false,
      execute: async (args: { timezone?: string }, context: ToolExecutionContext): Promise<ToolExecutionResult<{ currentTime: string; timezoneUsed: string; isoTimestamp: string }>> => {
        try {
          let effectiveTimezone = args.timezone;
          const serverDefaultTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

          if (effectiveTimezone) {
            // Basic validation attempt for IANA timezone format
            try {
              // Test if the timezone is valid by trying to use it.
              // This isn't perfect as some invalid strings might still resolve to GMT by some engines.
              new Date().toLocaleString("en-US", { timeZone: effectiveTimezone });
            } catch (tzError) {
              console.warn(`ToolExecutor[getCurrentDateTime]: Invalid timezone '${args.timezone}' provided by GMI ${context.gmiId}. Falling back to server default: ${serverDefaultTimezone}. Error: ${(tzError as Error).message}`);
              effectiveTimezone = serverDefaultTimezone;
            }
          } else {
            effectiveTimezone = serverDefaultTimezone;
          }
          
          const currentDate = new Date();
          return {
            success: true,
            output: {
              currentTime: currentDate.toLocaleString("en-US", { timeZone: effectiveTimezone, hour12: true, year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' }),
              timezoneUsed: effectiveTimezone,
              isoTimestamp: currentDate.toISOString(),
            },
            contentType: "application/json"
          };
        } catch (e: any) { // Catch errors from Date/Intl operations if any
          return { success: false, error: `Error getting current time: ${e.message}`, details: { stack: e.stack } };
        }
      }
    };
    this.registerTool(currentTimeTool);
  }

  /**
   * Gracefully shuts down all registered tools that implement the optional `shutdown` method.
   * This is typically called when the ToolExecutor itself is being shut down.
   *
   * @public
   * @async
   * @returns {Promise<void>} A promise that resolves when all tool shutdown attempts are complete.
   * Errors during individual tool shutdowns are logged but do not stop other tools from shutting down.
   */
  public async shutdownAllTools(): Promise<void> {
    console.log(`ToolExecutor: Initiating shutdown for ${this.registeredTools.size} registered tools...`);
    const shutdownPromises: Promise<void>[] = [];
    for (const tool of this.registeredTools.values()) {
      if (typeof tool.shutdown === 'function') {
        shutdownPromises.push(
          tool.shutdown().catch(err => { // Ensure individual errors don't stop all shutdowns
            console.error(`ToolExecutor: Error shutting down tool '${tool.name}' (ID: '${tool.id}'):`, err);
          })
        );
      }
    }
    try {
        await Promise.allSettled(shutdownPromises);
        console.log("ToolExecutor: All tool shutdown procedures completed.");
    } catch (e) {
        // This catch is unlikely to be hit due to Promise.allSettled and individual catches,
        // but included for robustness.
        console.error("ToolExecutor: Unexpected error during Promise.allSettled for tool shutdowns:", e);
    }
  }
}