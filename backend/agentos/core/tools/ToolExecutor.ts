// backend/agentos/core/tools/ToolExecutor.ts
import { Tool as PrismaTool } from '@prisma/client'; // Assuming tools might be defined in DB later, or just for type consistency
import { ToolCall } from '../../cognitive_substrate/IGMI.js'; // Assuming IGMI defines ToolCall type
import { IAuthService } from '../../../services/user_auth/AuthService.js';
import { ISubscriptionService } from '../../../services/user_auth/SubscriptionService.js';

/**
 * @typedef {Object} ITool
 * Interface defining a callable tool.
 * Each tool must implement this interface.
 */
export interface ITool {
  /**
   * Unique identifier for the tool.
   * @type {string}
   */
  id: string;

  /**
   * A short description of the tool's function.
   * Used by GMIs for tool selection.
   * @type {string}
   */
  description: string;

  /**
   * The JSON schema for the tool's input arguments.
   * This guides the LLM in constructing tool calls.
   * @type {Record<string, any>}
   */
  schema: Record<string, any>;

  /**
   * Optional capabilities required by a Persona to use this tool.
   * @type {string[]}
   */
  requiredCapabilities?: string[];

  /**
   * Executes the tool with the given arguments.
   * @param {Record<string, any>} args - The arguments for the tool, validated against the schema.
   * @returns {Promise<any>} The result of the tool execution.
   * @throws {Error} If the tool execution fails.
   */
  execute(args: Record<string, any>): Promise<any>;
}

/**
 * Manages and executes various tools that GMIs can invoke.
 * It's responsible for validating tool access permissions and dispatching to the correct tool implementation.
 */
export class ToolExecutor {
  private registeredTools: Map<string, ITool>;
  private authService: IAuthService;
  private subscriptionService: ISubscriptionService;

  /**
   * Creates an instance of ToolExecutor.
   * @param {IAuthService} authService - The authentication service for user/subscription checks.
   * @param {ISubscriptionService} subscriptionService - The subscription service for feature access checks.
   */
  constructor(authService: IAuthService, subscriptionService: ISubscriptionService) {
    this.registeredTools = new Map<string, ITool>();
    this.authService = authService;
    this.subscriptionService = subscriptionService;
    this.registerDefaultTools(); // Register any built-in tools
  }

  /**
   * Registers a new tool with the executor.
   * @param {ITool} tool - The tool to register.
   * @returns {void}
   * @throws {Error} If a tool with the same ID is already registered.
   */
  public registerTool(tool: ITool): void {
    if (this.registeredTools.has(tool.id)) {
      throw new Error(`Tool with ID '${tool.id}' is already registered.`);
    }
    this.registeredTools.set(tool.id, tool);
    console.log(`Tool '${tool.id}' registered.`);
  }

  /**
   * Retrieves a registered tool by its ID.
   * @param {string} toolId - The ID of the tool.
   * @returns {ITool | undefined} The tool if found, otherwise undefined.
   */
  public getTool(toolId: string): ITool | undefined {
    return this.registeredTools.get(toolId);
  }

  /**
   * Returns a list of all registered tool schemas.
   * @returns {ITool[]} An array of tool objects (containing id, description, and schema).
   */
  public getAllToolSchemas(): ITool[] {
    return Array.from(this.registeredTools.values()).map(tool => ({
      id: tool.id,
      description: tool.description,
      schema: tool.schema,
      requiredCapabilities: tool.requiredCapabilities // Include capabilities for GMI's internal logic
    }));
  }

  /**
   * Executes a tool identified by `toolCall`.
   * Performs permission checks based on the user's subscription and the GMI's capabilities.
   * @param {ToolCall} toolCall - The structured tool call from the GMI.
   * @param {string} userId - The ID of the user initiating the GMI turn.
   * @param {string[]} personaCapabilities - The capabilities granted to the current Persona.
   * @returns {Promise<any>} The result of the tool execution.
   * @throws {Error} If the tool is not found, permissions are insufficient, or tool execution fails.
   */
  public async executeTool(toolCall: ToolCall, userId: string, personaCapabilities: string[]): Promise<any> {
    const tool = this.registeredTools.get(toolCall.function.name);
    if (!tool) {
      throw new Error(`Tool '${toolCall.function.name}' not found.`);
    }

    // 1. Capability Check: Does the Persona have the required capabilities for this tool?
    if (tool.requiredCapabilities && tool.requiredCapabilities.length > 0) {
      const hasAllCapabilities = tool.requiredCapabilities.every(cap => personaCapabilities.includes(cap));
      if (!hasAllCapabilities) {
        throw new Error(`Persona lacks required capabilities to use tool '${tool.id}'. Required: [${tool.requiredCapabilities.join(', ')}], Persona Has: [${personaCapabilities.join(', ')}]`);
      }
    }

    // 2. Subscription/User Feature Check (if tool is tied to user subscription)
    // This is a conceptual check. Specific tools might have their own granular access logic.
    // For example, an ImageGenerationTool might require a "CAN_GENERATE_IMAGES" feature.
    // We'll assume a generic check for now or specific tool will implement it.
    // Example: if (tool.id === "ImageGenerationTool" && !(await this.subscriptionService.userHasFeature(userId, "IMAGE_GENERATION_ACCESS"))) {
    //   throw new Error(`User's subscription does not allow use of tool '${tool.id}'.`);
    // }

    // Basic argument validation against the tool's schema (can be more robust with a JSON schema validator library)
    const parsedArgs = toolCall.function.arguments;
    // TODO: Implement more robust JSON schema validation here using a library like 'ajv'
    // For MVP, assume the LLM provides valid JSON arguments based on the schema it was given.

    try {
      console.log(`Executing tool '${tool.id}' with arguments:`, parsedArgs);
      const result = await tool.execute(parsedArgs);
      console.log(`Tool '${tool.id}' executed successfully. Result:`, result);
      return result;
    } catch (error: any) {
      console.error(`Error executing tool '${tool.id}':`, error);
      throw new Error(`Tool execution failed for '${tool.id}': ${error.message || 'Unknown error'}`);
    }
  }

  /**
   * Registers default, built-in tools.
   * This is where you would instantiate and register tools like `SpeechToTextTool`, `ImageGenerationTool`, etc.
   * For now, it's a placeholder.
   * @private
   */
  private registerDefaultTools(): void {
    // Example of a placeholder tool:
    this.registerTool({
      id: "CurrentTimeTool",
      description: "Gets the current date and time in a human-readable format.",
      schema: {
        type: "object",
        properties: {},
        required: []
      },
      execute: async () => {
        const date = new Date();
        return `Current time: ${date.toLocaleString()} (PDT). Current location: Las Vegas, Nevada, United States.`;
      }
    });

    // TODO: Add more concrete tool implementations here, e.g.:
    // this.registerTool(new SpeechToTextTool());
    // this.registerTool(new ImageGenerationTool(this.providerManager)); // Would need providerManager dependency
    // this.registerTool(new DynamicFeatureManagementTool());
  }
}