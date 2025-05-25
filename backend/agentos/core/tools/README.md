# AgentOS Tool System Documentation 🛠️

## 1. Overview

The AgentOS Tool System is a foundational pillar of the platform, empowering Generative Mind Instances (GMIs) and other AI agents with the ability to interact with the external world, perform computations, retrieve information, and execute a wide array of specialized actions beyond their innate generative capabilities. This system allows agents to overcome the limitations of their training data and perform real-time, contextually relevant tasks.

**Core Principles**:

* **Interface-Driven Design**: All tools adhere to a common `ITool` interface, ensuring consistency, interoperability, and clear contracts for development and integration.
* **Schema-Validated Interactions**: Tool inputs and outputs are rigorously defined by JSON schemas. This enables LLMs to reliably construct valid tool calls and allows the system to validate arguments and results, enhancing robustness.
* **Permission-Controlled Execution**: Tool usage is governed by a sophisticated permission system. The `ToolPermissionManager` checks if a Persona possesses the necessary capabilities and if the user's subscription tier grants access to specific tool-related features.
* **Orchestrated Management**: A central `ToolOrchestrator` acts as the primary interface to the tool ecosystem. It manages tool registration, facilitates discovery by LLMs/GMIs, and coordinates the entire invocation pipeline, including permission checks and delegation to the `ToolExecutor`.
* **Extensibility and Modularity**: The system is designed for easy extension with new custom tools, promoting a rich and growing ecosystem of capabilities for agents.

This document provides a comprehensive guide to understanding, using, and developing tools within the AgentOS framework.

---

## 2. Core Components & Their Roles 🧩

The tool system is composed of several interconnected interfaces and classes:

### 2.1. `ITool` Interface
* **File**: `backend/agentos/core/tools/ITool.ts`
* **Purpose**: This is the fundamental contract that every tool within AgentOS must implement. It standardizes how tools declare their identity, purpose, input/output structures, required permissions, and execution logic.
* **Key Properties**:
    * `id: string`: A globally unique identifier for the tool (e.g., "web-search-tool-v1.2").
    * `name: string`: The functional name used by LLMs for invocation (e.g., "searchWeb"). Must be unique among tools available to an LLM.
    * `displayName: string`: A human-readable name (e.g., "Web Search").
    * `description: string`: A detailed explanation of the tool's function, crucial for LLM understanding.
    * `inputSchema: JSONSchemaObject`: JSON schema defining expected input arguments.
    * `outputSchema?: JSONSchemaObject`: Optional JSON schema for the tool's successful output.
    * `requiredCapabilities?: string[]`: Optional list of Persona capabilities needed to use the tool (e.g., `"capability:filesystem:read"`).
    * `category?: string`: Organizational category (e.g., "Data Analysis", "File System").
    * `version?: string`: Tool version string.
    * `hasSideEffects?: boolean`: Flag indicating if the tool modifies external state (default: `false`).
* **Key Methods**:
    * `execute(args: TInput, context: ToolExecutionContext): Promise<ToolExecutionResult<TOutput>>`: The core method containing the tool's operational logic.

### 2.2. `Tool` Abstract Class
* **File**: `backend/agentos/core/agents/tools/Tool.ts` (Note: Path relative to agents, but logically part of the tool system structure).
* **Purpose**: A recommended abstract base class that implements `ITool`. Concrete tool implementations should extend this class to inherit common functionality and ensure adherence to the `ITool` contract.
* **Features**:
    * Provides a constructor to initialize all standard `ITool` properties.
    * Declares the `execute` method as `public abstract`, forcing subclasses to provide their specific implementation.
    * Offers default (often no-op) implementations for optional `ITool` methods like `validateArgs` and `shutdown`.
    * Includes a `getDefinitionForLLM()` method to conveniently format the tool's essential information (`name`, `description`, `inputSchema`) into a `ToolDefinition` object suitable for LLM consumption.

### 2.3. `ToolDefinition` Type (Defined in `Tool.ts`)
* **Purpose**: Specifies the structure of information about a tool that is passed to Large Language Models. This enables LLMs to understand how to correctly format requests for tool execution (function calling).
* **Properties**:
    * `name: string`: The functional name of the tool.
    * `description: string`: A detailed description of the tool's functionality.
    * `parameters: JSONSchemaObject`: The JSON schema for the tool's input arguments (derived from `ITool.inputSchema`).

### 2.4. `ToolExecutionContext` Interface (Defined in `ITool.ts`)
* **Purpose**: Provides essential contextual information to a tool during its execution.
* **Properties**:
    * `gmiId: string`: ID of the GMI invoking the tool.
    * `personaId: string`: ID of the active Persona.
    * `userContext: UserContext`: Contextual information about the user (e.g., ID, preferences).
    * `correlationId?: string`: Optional ID for tracing and correlating operations.
    * `sessionData?: Record<string, any>`: Optional ephemeral session data.

### 2.5. `ToolExecutionResult` Interface (Defined in `ITool.ts`)
* **Purpose**: A standardized structure for returning the outcome of a tool's execution.
* **Properties**:
    * `success: boolean`: `true` if execution was successful, `false` otherwise.
    * `output?: TOutput`: The data produced by the tool (if successful).
    * `error?: string`: A human-readable error message (if execution failed).
    * `contentType?: string`: MIME type of the output (defaults to "application/json").
    * `details?: Record<string, any>`: Additional metadata or error details.

### 2.6. `ToolExecutor` Class
* **File**: `backend/agentos/core/tools/ToolExecutor.ts`
* **Purpose**: Responsible for the direct execution of tools. It validates input arguments against the tool's `inputSchema` using the Ajv library and then calls the tool's `execute` method.
* **Key Responsibilities**:
    * Maintaining a registry of `ITool` instances.
    * Performing JSON schema validation of tool arguments.
    * Invoking the `tool.execute()` method with the validated arguments and `ToolExecutionContext`.
    * Handling exceptions from tool execution and packaging results/errors into `ToolExecutionResult`.
    * Registering default/example tools.

### 2.7. `IToolPermissionManager` Interface & `ToolPermissionManager` Class
* **Files**: `backend/agentos/core/tools/IToolPermissionManager.ts`, `backend/agentos/core/tools/ToolPermissionManager.ts`
* **Purpose**: Centralizes the logic for authorizing tool usage.
* **Key Methods**:
    * `isExecutionAllowed(context: PermissionCheckContext): Promise<PermissionCheckResult>`: Determines if a tool call is permitted by checking Persona capabilities against `tool.requiredCapabilities` and verifying user subscription features (via `ISubscriptionService`) against `toolToSubscriptionFeatures` mapping in its configuration.
* **Key Associated Types**:
    * `PermissionCheckContext`: Contains all necessary information (tool, persona, user) for a permission decision.
    * `PermissionCheckResult`: The outcome of the permission check (`isAllowed`, `reason`).
    * `ToolPermissionManagerConfig`: Configuration including `strictCapabilityChecking` and `toolToSubscriptionFeatures`.

### 2.8. `IToolOrchestrator` Interface & `ToolOrchestrator` Class
* **Files**: `backend/agentos/core/tools/IToolOrchestrator.ts`, `backend/agentos/core/tools/ToolOrchestrator.ts`
* **Purpose**: Serves as the primary facade and central coordinator for all tool-related operations within AgentOS.
* **Key Responsibilities**:
    * **Tool Registration & Management**: Maintains an internal registry of `ITool` instances. Supports dynamic registration if configured.
    * **Tool Discovery**: Implements `listAvailableTools()` to provide LLM-consumable `ToolDefinitionForLLM` objects, respecting permissions if context is provided.
    * **Orchestrating Execution**: When `processToolCall()` is invoked (typically by a GMI or higher-level orchestrator), it:
        1.  Retrieves the target `ITool` from its registry.
        2.  Consults the `IToolPermissionManager` to authorize the call.
        3.  If authorized, delegates the execution (including argument validation) to the `ToolExecutor`.
        4.  Receives the `ToolExecutionResult` from the executor.
        5.  Formats this into a `ToolCallResult` (as defined in `IGMI.ts`) and returns it to the caller.
    * **Lifecycle Management**: Handles its own initialization and shutdown, including shutting down registered tools.

### 2.9. `ToolOrchestratorConfig` Interface
* **File**: `backend/agentos/config/ToolOrchestratorConfig.ts`
* **Purpose**: Defines configuration options for the `ToolOrchestrator`.
* **Key Properties**: `orchestratorId?`, `defaultToolCallTimeoutMs?`, `maxConcurrentToolCalls?`, `logToolCalls?`, `globalDisabledTools?`, `toolRegistrySettings?`.

---

## 3. Workflow of a Tool Call 🔄

The sequence of operations when an agent decides to use a tool is as follows:

1.  **Agent Decision**: An agent (e.g., a GMI driven by an LLM) determines that a tool is needed to fulfill the current request or goal.
2.  **Request Formulation**: The agent/LLM generates a `ToolCallRequest` (see `IGMI.ts`), which includes:
    * `id`: A unique ID for this specific call request (generated by the LLM).
    * `function.name`: The functional name of the tool to be invoked (must match `ITool.name`).
    * `function.arguments`: A JSON string (or pre-parsed object by the time it reaches `ToolExecutor`) representing the arguments for the tool, conforming to its `inputSchema`.
3.  **Orchestration Request**: This `ToolCallRequest`, along with essential context (`gmiId`, `personaId`, `personaCapabilities`, `userContext`), is packaged into `ToolExecutionRequestDetails` and passed to `ToolOrchestrator.processToolCall()`.
4.  **Tool Retrieval**: The `ToolOrchestrator` looks up the `ITool` instance in its registry using `toolCallRequest.function.name`. If not found, an error is returned.
5.  **Permission Check**: The `ToolOrchestrator` creates a `PermissionCheckContext` and calls `IToolPermissionManager.isExecutionAllowed()`. The `ToolPermissionManager`:
    * Verifies if the calling Persona possesses all capabilities listed in `tool.requiredCapabilities`.
    * Checks if the user's subscription (via `ISubscriptionService`) grants access to any `FeatureFlag`s specifically mapped to this tool in its configuration.
    * Returns a `PermissionCheckResult`. If not allowed, the orchestrator returns an error `ToolCallResult`.
6.  **Execution Delegation (if permitted)**:
    * The `ToolOrchestrator` passes the `ToolExecutionRequestDetails` to `ToolExecutor.executeTool()`.
    * The `ToolExecutor`:
        * Validates `toolCallRequest.function.arguments` against the `tool.inputSchema` using Ajv. If invalid, an error `ToolExecutionResult` is returned.
        * Constructs a `ToolExecutionContext`.
        * Invokes the `tool.execute(parsedArgs, executionContext)` method.
7.  **Result Processing**:
    * The specific `ITool` implementation performs its task and returns a `Promise<ToolExecutionResult>`. This result includes a `success` flag, `output` data (on success), or an `error` message (on failure).
    * The `ToolExecutor` receives this result.
    * The `ToolOrchestrator` receives the `CoreToolExecutionResult` from the executor and transforms it into a `ToolCallResult` (as defined in `IGMI.ts`), ensuring the `tool_call_id` from the original LLM request is included for correlation.
8.  **Feedback to Agent**: The `ToolCallResult` is returned to the agent/GMI, which then uses the tool's output (or error information) to continue its reasoning process or formulate a response to the user.

---

## 4. Defining and Registering a New Tool ✍️

Developing and integrating a new tool into AgentOS involves these primary steps:

1.  **Implement the `ITool` Interface**:
    * Create a new TypeScript class for your tool. It is **strongly recommended** to extend the abstract `Tool` class found in `backend/agentos/core/agents/tools/Tool.ts`.
    * In your tool's constructor, call `super()` with an object containing all the required properties from the `ITool` interface:
        * `id`: A unique, versioned string (e.g., "my-company-email-sender-v1.0").
        * `name`: The LLM-callable function name (e.g., "sendEmail").
        * `displayName`: A human-friendly name (e.g., "Email Sending Service").
        * `description`: A clear, detailed description for the LLM and for documentation. Explain parameters and expected outcomes.
        * `inputSchema`: A valid `JSONSchemaObject` defining all input parameters, their types (string, number, boolean, object, array), descriptions, and whether they are required. Use nested objects for complex parameters.
        * `outputSchema` (optional but recommended): A `JSONSchemaObject` for the successful output structure.
        * `requiredCapabilities` (optional): An array of capability strings if access to this tool should be restricted.
        * `category` (optional): e.g., "Communication", "Data Processing".
        * `version` (optional): e.g., "1.0.2".
        * `hasSideEffects` (optional): `true` if the tool modifies external state (e.g., sends email, writes to DB). Defaults to `false`.
    * Implement the `public abstract async execute(args: TInput, context: ToolExecutionContext): Promise<ToolExecutionResult<TOutput>>` method. This is where your tool's core logic resides.
        * Perform the tool's action using the provided `args` and `context`.
        * Handle any internal errors gracefully.
        * Return a `ToolExecutionResult` object:
            * Set `success: true` and populate `output` upon successful completion.
            * Set `success: false` and provide an `error` message and optionally `details` upon failure.
    * Optionally, override `validateArgs` for custom validation beyond JSON schema, or `shutdown` for resource cleanup.

    ```typescript
    // Example: backend/agentos/core/tools/implementations/SampleCalculatorTool.ts
    import { Tool, ToolDefinition, ToolExecutionContext, ToolExecutionResult, JSONSchemaObject } from '../../agents/tools/Tool'; // Adjust path as needed

    interface CalculatorInput {
      operation: 'add' | 'subtract' | 'multiply' | 'divide';
      operand1: number;
      operand2: number;
    }

    interface CalculatorOutput {
      result: number;
      details: string;
    }

    export class SampleCalculatorTool extends Tool<CalculatorInput, CalculatorOutput> {
      constructor() {
        super({
          id: "sample-calculator-v1.0",
          name: "calculateNumericalExpression",
          displayName: "Simple Calculator",
          description: "Performs basic arithmetic operations (add, subtract, multiply, divide) on two numbers.",
          inputSchema: {
            type: "object",
            properties: {
              operation: { type: "string", enum: ["add", "subtract", "multiply", "divide"], description: "The arithmetic operation to perform." },
              operand1: { type: "number", description: "The first number." },
              operand2: { type: "number", description: "The second number." }
            },
            required: ["operation", "operand1", "operand2"]
          } as JSONSchemaObject,
          outputSchema: {
            type: "object",
            properties: {
              result: { type: "number", description: "The result of the calculation." },
              details: {type: "string", description: "A string describing the operation performed."}
            },
            required: ["result", "details"]
          } as JSONSchemaObject,
          category: "Utilities",
          version: "1.0.0",
          hasSideEffects: false,
        });
      }

      public async execute(args: CalculatorInput, context: ToolExecutionContext): Promise<ToolExecutionResult<CalculatorOutput>> {
        let resultValue: number;
        try {
          switch (args.operation) {
            case "add": resultValue = args.operand1 + args.operand2; break;
            case "subtract": resultValue = args.operand1 - args.operand2; break;
            case "multiply": resultValue = args.operand1 * args.operand2; break;
            case "divide":
              if (args.operand2 === 0) {
                return { success: false, error: "Cannot divide by zero.", details: { operation: args.operation, operands: [args.operand1, args.operand2] } };
              }
              resultValue = args.operand1 / args.operand2;
              break;
            default:
              // Should be caught by schema validation, but good to have a fallback
              return { success: false, error: `Invalid operation: ${args.operation}` };
          }
          return {
            success: true,
            output: { result: resultValue, details: `${args.operand1} ${args.operation} ${args.operand2} = ${resultValue}` }
          };
        } catch (e: any) {
          return { success: false, error: `Calculation error: ${e.message}`, details: { stack: e.stack } };
        }
      }
    }
    ```

2.  **Register the Tool with `ToolOrchestrator`**:
    * Typically, tools are instantiated and registered when the `ToolOrchestrator` itself is initialized. This is done by passing an array of `ITool` instances to `toolOrchestrator.initialize(..., ..., ..., [new MyCustomTool()])`.
    * If `allowDynamicRegistration` is `true` in the `ToolOrchestratorConfig`, you can also register tools at runtime:
        `await toolOrchestrator.registerTool(new MyCustomTool());`

---

## 5. LLM Interaction & Tool Definitions 🤖

For an LLM to effectively use tools (e.g., via OpenAI's function calling or Anthropic's tool use features), it needs clear and accurate definitions of the available tools.

* The `ToolOrchestrator.listAvailableTools()` method returns an array of `ToolDefinitionForLLM` objects. This is the structure that should be formatted and provided to the LLM in its system prompt or as part of the API call options.
* A `ToolDefinitionForLLM` includes:
    * `name: string`: The exact function name the LLM must use.
    * `description: string`: The LLM relies heavily on this to understand what the tool does, its parameters, and when it's appropriate to use it. **This description should be crafted for the LLM, not just for humans.**
    * `inputSchema: JSONSchemaObject` (referred to as `parameters` by OpenAI): This schema tells the LLM the names, types, descriptions, and requirement status of each argument for the tool.

**Best Practices for LLM Tool Definitions**:
* **Clarity and Conciseness**: Descriptions should be unambiguous and to the point.
* **Parameter Descriptions**: Each property in the `inputSchema.properties` should have a clear `description` explaining what it is and any constraints or expected formats.
* **Required Parameters**: Clearly mark required parameters in the `inputSchema.required` array.
* **Enum for Choices**: If a parameter accepts a fixed set of string values, use `enum` in its schema definition.
* **Iterate**: Test how the LLM interprets your tool descriptions and schemas, and refine them based on its behavior.

---

## 6. Configuration ⚙️

Key configuration files influence the tool system:

* **`backend/agentos/config/ToolOrchestratorConfig.ts` (`ToolOrchestratorConfig`)**:
    * `logToolCalls`: (Default: `true`) Essential for debugging. Set to `false` in production for performance if logs are too verbose.
    * `globalDisabledTools`: A list of tool `name`s or `id`s to disable system-wide.
    * `toolRegistrySettings.allowDynamicRegistration`: (Default: `true`) Controls if tools can be added/removed after the orchestrator starts.
* **`backend/agentos/core/tools/IToolPermissionManager.ts` (`ToolPermissionManagerConfig`)**:
    * `strictCapabilityChecking`: (Default: `true`) If `true`, a Persona must have *all* capabilities listed in a tool's `requiredCapabilities`.
    * `toolToSubscriptionFeatures`: Maps tool `id`s or `name`s to arrays of `FeatureFlag` strings. The `ToolPermissionManager` uses this with `ISubscriptionService` to check if a user's plan grants access.

---

## 7. Best Practices for Tool Development ⭐

* **Single Responsibility Principle**: Design tools that perform one specific, well-defined task. Avoid creating monolithic tools that try to do too many unrelated things.
* **Idempotency**: Where feasible, make tools idempotent. This means calling a tool multiple times with the same input should produce the same result or state change without unintended cumulative effects.
* **Clear and Robust Schemas**: Invest significant effort in designing comprehensive and accurate JSON schemas for both `inputSchema` and `outputSchema`. Use descriptions for all properties.
* **Thorough Error Handling**: Within each tool's `execute` method:
    * Anticipate potential failure points.
    * Catch specific exceptions.
    * Return a `ToolExecutionResult` with `success: false`, a clear `error` message, and relevant `details` (e.g., error codes, context). Avoid letting raw exceptions propagate out of `execute` if possible.
* **Security is Paramount**:
    * **Input Sanitization/Validation**: Always assume inputs (even if schema-validated) could be crafted maliciously. Sanitize inputs if they are used in system commands, database queries, or API calls.
    * **Principle of Least Privilege**: Tools should only have the minimum permissions necessary to perform their function.
    * **Side Effects (`hasSideEffects: true`)**: Clearly flag tools that modify external state. The system (or GMI) might require user confirmation before executing such tools.
    * **Secrets Management**: Never hardcode API keys or sensitive credentials within tool code. Use environment variables or a secure secrets management system, accessed via the `ToolExecutionContext` or injected configuration if absolutely necessary and handled securely.
* **Contextual Awareness**: Leverage the `ToolExecutionContext` (e.g., `userContext`, `personaId`) if the tool's behavior needs to adapt based on the user or the calling agent.
* **Comprehensive Documentation**:
    * The `description` field in `ITool` is for the LLM.
    * Maintain separate, detailed developer documentation for complex tools, explaining their internal logic, dependencies, and potential failure modes.
* **Testability**: Design tools to be easily testable in isolation. Mock dependencies and use unit/integration tests.
* **Performance**: Be mindful of the performance implications of your tool, especially if it involves network requests or heavy computation. Implement timeouts and efficient resource usage. Report execution duration if relevant.

---

## 8. Future Enhancements & Considerations 🚀

* **Tool Versioning**: Implement more sophisticated strategies for managing and selecting between different versions of a tool.
* **Dynamic Tool Discovery & Loading**: Allow the system to discover and load tools from external plugins, modules, or a remote registry at runtime.
* **Tool Usage Analytics & Monitoring**: Integrate robust logging and metrics for tracking tool usage frequency, success/failure rates, execution times, and costs.
* **Advanced Permission Scopes**: Introduce more granular permission controls beyond simple capability strings, possibly integrating with a more comprehensive RBAC/ABAC system.
* **Tool Chaining & Composition**: Develop higher-level mechanisms or DSLs for defining and executing sequences or graphs of tool calls (workflows).
* **Standardized Error Codes for Tools**: Define a common set of error codes that tools can use within their `ToolExecutionResult.details` for more consistent error handling by consuming systems.
* **Automatic Schema Generation**: Utilities to help generate JSON schemas from TypeScript interfaces for tool inputs/outputs, reducing boilerplate.

By adhering to these guidelines and leveraging the provided components, developers can build a powerful and reliable ecosystem of tools that significantly extend the capabilities of AgentOS.