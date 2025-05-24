/**
 * @fileoverview Defines the ITool interface, the core contract for any tool
 * that can be invoked within the AgentOS ecosystem, typically by a GMI.
 * This interface ensures that all tools provide necessary metadata for discovery,
 * schema validation, permission checking, and execution.
 *
 * @module backend/agentos/tools/ITool
 */

import { GMIError } from '../../utils/errors'; // Assuming a GMIError utility
import { UserContext } from '../cognitive_substrate/IGMI'; // For potential context pass-through

/**
 * Represents a JSON schema definition.
 * For simplicity, using Record<string, any>. In a production system,
 * this would ideally be a more specific type imported from a JSON schema library
 * (e.g., JSONSchema7 from 'json-schema').
 * @typedef {object} JSONSchemaObject
 */
export type JSONSchemaObject = Record<string, any>; // Replace with a proper JSON Schema type if available

/**
 * Defines the outcome of a tool's execution.
 *
 * @interface ToolExecutionResult
 * @property {boolean} success - Indicates whether the tool execution was successful.
 * @property {any} [output] - The output data from the tool if successful. The structure
 * should ideally conform to the tool's `outputSchema`.
 * @property {string} [error] - An error message if execution failed.
 * @property {string} [contentType="application/json"] - MIME type of the output, if not JSON (e.g., "text/plain", "image/png").
 * @property {Record<string, any>} [details] - Additional details or metadata about the execution or error.
 */
export interface ToolExecutionResult<TOutput = any> {
  success: boolean;
  output?: TOutput;
  error?: string;
  contentType?: string;
  details?: Record<string, any>;
}

/**
 * Defines the invocation context for a tool's execution.
 * This provides the tool with necessary information about the caller and environment.
 *
 * @interface ToolExecutionContext
 * @property {string} gmiId - The ID of the GMI invoking the tool.
 * @property {string} personaId - The ID of the active persona.
 * @property {UserContext} userContext - Contextual information about the user.
 * @property {string} [correlationId] - An optional ID to correlate this tool call with other operations or logs.
 * @property {Record<string, any>} [sessionData] - Ephemeral session data, potentially from GMI's working memory.
 */
export interface ToolExecutionContext {
  gmiId: string;
  personaId: string;
  userContext: UserContext;
  correlationId?: string;
  sessionData?: Record<string, any>;
}

/**
 * @interface ITool
 * @description The core interface that all tools within AgentOS must implement.
 * It provides a standardized way for tools to declare their capabilities,
 * input/output schemas, and execution logic.
 *
 * This interface is crucial for:
 * - Discovery: Allowing GMIs or a ToolOrchestrator to find available tools.
 * - LLM Interaction: Providing schemas and descriptions for LLMs to generate valid tool calls.
 * - Validation: Enabling robust validation of inputs and outputs.
 * - Execution: A consistent method to invoke the tool's functionality.
 * - Permissions: Declaring capabilities required to use the tool.
 */
export interface ITool<TInput extends Record<string, any> = any, TOutput = any> {
  /**
   * A unique identifier for the tool within the system (e.g., "web-search-engine", "code-interpreter-v2").
   * This ID is used for internal registration and management.
   * Should be kebab-case or snake_case.
   * @type {string}
   * @readonly
   */
  readonly id: string;

  /**
   * The functional name of the tool, as it should be used by an LLM in a tool call request
   * (e.g., "searchWeb", "executePythonCode"). This name must be unique among tools
   * made available to a given GMI/LLM.
   * @type {string}
   * @readonly
   */
  readonly name: string;

  /**
   * A concise, human-readable title or display name for the tool.
   * Used in UIs, logs, or when presenting tool options.
   * @type {string}
   * @readonly
   * @example "Web Search", "Python Code Interpreter"
   */
  readonly displayName: string;

  /**
   * A detailed description of what the tool does, its purpose, and when it should be used.
   * This description is critical for an LLM to understand the tool's capabilities and
   * decide when to invoke it. Should be clear, comprehensive, and provide usage guidance.
   * @type {string}
   * @readonly
   */
  readonly description: string;

  /**
   * The JSON schema defining the structure and types of the input arguments object
   * that this tool expects. This schema is used by the LLM to construct valid arguments
   * and by the ToolExecutor for validation before execution.
   * @see https://json-schema.org/
   * @type {JSONSchemaObject}
   * @readonly
   */
  readonly inputSchema: JSONSchemaObject;

  /**
   * Optional: The JSON schema defining the structure and types of the output object
   * that this tool will produce upon successful execution.
   * This helps in validating the tool's output and provides clarity for consumers of the tool's result.
   * @type {JSONSchemaObject}
   * @optional
   * @readonly
   */
  readonly outputSchema?: JSONSchemaObject;

  /**
   * Optional: An array of capability strings that the active Persona (or GMI) must possess
   * to be authorized to use this tool. If empty or undefined, the tool might be generally available
   * or rely on other permission mechanisms.
   * @type {string[]}
   * @optional
   * @readonly
   * @example ["capability:web_search", "capability:execute_code_unsafe"]
   */
  readonly requiredCapabilities?: string[];

  /**
   * Optional: A category or group to which this tool belongs (e.g., "data_analysis", "communication", "file_system").
   * Useful for organizing tools and for filtering.
   * @type {string}
   * @optional
   * @readonly
   */
  readonly category?: string;

  /**
   * Optional: Version of the tool (e.g., "1.0.0", "2.1-beta").
   * @type {string}
   * @optional
   * @readonly
   */
  readonly version?: string;

  /**
   * Optional: Indicates if the tool might have side effects (e.g., writing to a database, sending an email).
   * Defaults to `false`. LLMs might be more cautious with tools having side effects.
   * @type {boolean}
   * @optional
   * @readonly
   */
  readonly hasSideEffects?: boolean;

  /**
   * Executes the tool's core logic with the provided arguments.
   *
   * @async
   * @param {TInput} args - The arguments for the tool, which should have been validated
   * against `inputSchema` by the caller (e.g., ToolExecutor).
   * @param {ToolExecutionContext} context - The execution context providing information about
   * the GMI, user, and session.
   * @returns {Promise<ToolExecutionResult<TOutput>>} A promise that resolves with an object
   * containing the execution result (output or error).
   * @throws {GMIError | Error} While tools should ideally return errors within the `ToolExecutionResult`,
   * critical or unexpected failures during execution might still throw. It's recommended
   * that tools catch their own internal errors and package them into the `ToolExecutionResult`.
   *
   * @example
   * async execute(args: { query: string }, context: ToolExecutionContext): Promise<ToolExecutionResult<{ searchResults: any[] }>> {
   * try {
   * // ... perform web search using args.query ...
   * // const results = await searchProvider.search(args.query);
   * return { success: true, output: { searchResults: results } };
   * } catch (e: any) {
   * return { success: false, error: `Web search failed: ${e.message}`, details: e };
   * }
   * }
   */
  execute(args: TInput, context: ToolExecutionContext): Promise<ToolExecutionResult<TOutput>>;

  /**
   * Optional: Validates the input arguments against the tool's `inputSchema`.
   * While the ToolExecutor might perform validation, tools can provide their own
   * more specific or nuanced validation logic if needed.
   *
   * @param {Record<string, any>} args - The arguments to validate.
   * @returns {{ isValid: boolean; errors?: any[] }} An object indicating if validation passed,
   * and an array of validation errors if it failed.
   * @optional
   */
  validateArgs?(args: Record<string, any>): { isValid: boolean; errors?: any[] };

  /**
   * Optional: A method to gracefully shut down or clean up resources used by the tool,
   * if any (e.g., close database connections, stop background processes).
   * Called by the system when the tool or the ToolExecutor is being shut down.
   * @async
   * @returns {Promise<void>}
   * @optional
   */
  shutdown?(): Promise<void>;
}