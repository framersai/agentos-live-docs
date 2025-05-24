# AgentOS Tool System Documentation 🛠️

## 1. Overview

The AgentOS Tool System is a foundational part of the platform, designed to empower Generative Mind Instances (GMIs) and other agents with the ability to interact with external systems, perform computations, fetch data, and execute a wide array of actions beyond their inherent generative capabilities.

**Core Principles**:

* **Interface-Driven Design**: Tools adhere to a common `ITool` interface, promoting consistency and interoperability.
* **Schema-Validated Interactions**: Tool inputs and outputs are defined by JSON schemas, ensuring clarity for LLMs and enabling robust validation.
* **Permission-Controlled Execution**: Tool usage is governed by a permission system, checking Persona capabilities and user subscription tiers.
* **Orchestrated Management**: A `ToolOrchestrator` serves as the central hub for tool registration, discovery, and invocation, working in concert with a `ToolExecutor` and `IToolPermissionManager`.
* **Extensibility**: The system is designed to be easily extensible with new tools.

This document outlines the key components, workflow, and best practices for developing and using tools within AgentOS.

---

## 2. Core Components & Their Roles 🧩

The tool system comprises several key interfaces and classes:

### 2.1. `ITool` Interface
* **File**: `backend/agentos/core/tools/ITool.ts`
* **Purpose**: The fundamental contract that every tool must implement.
* **Key Properties**:
    * `id: string`: Unique system-wide identifier (e.g., "web-search-tool-v1").
    * `name: string`: Functional name used by LLMs for invocation (e.g., "searchWeb"). Must be unique among tools available to an LLM.
    * `displayName: string`: Human-readable name (e.g., "Web Search").
    * `description: string`: Detailed explanation of the tool's function, for LLM understanding and user documentation.
    * `inputSchema: JSONSchemaObject`: JSON schema defining expected input arguments.
    * `outputSchema?: JSONSchemaObject`: Optional JSON schema for the tool's successful output.
    * `requiredCapabilities?: string[]`: Optional list of Persona capabilities needed to use the tool.
    * `category?: string`: Organizational category (e.g., "Data Analysis", "Communication").
    * `version?: string`: Tool version.
    * `hasSideEffects?: boolean`: Indicates if the tool modifies external state.
* **Key Methods**:
    * `execute(args: TInput, context: ToolExecutionContext): Promise<ToolExecutionResult<TOutput>>`: The core logic of the tool.

### 2.2. `Tool` Abstract Class
* **File**: `backend/agentos/core/agents/tools/Tool.ts`
* **Purpose**: A recommended abstract base class that implements `ITool`. Concrete tools should extend this class.
* **Features**:
    * Initializes all `ITool` properties via its constructor.
    * Declares `execute` as an abstract method, forcing subclasses to implement it.
    * Provides default implementations for `validateArgs` (basic) and `shutdown` (no-op).
    * Includes a `getDefinitionForLLM()` method to format tool information for LLMs.

### 2.3. `ToolDefinition` Type (in `Tool.ts`)
* **Purpose**: Defines the structure for describing a tool to an LLM.
* **Properties**:
    * `name: string`: Functional name.
    * `description: string`: Tool description.
    * `parameters: JSONSchemaObject`: Input schema (derived from `ITool.inputSchema`).

### 2.4. `ToolExecutionContext` Interface (in `ITool.ts`)
* **Purpose**: Provides context to a tool during its execution.
* **Properties**: `gmiId`, `personaId`, `userContext`, `correlationId?`, `sessionData?`.

### 2.5. `ToolExecutionResult` Interface (in `ITool.ts`)
* **Purpose**: Standardized format for the outcome of a tool's execution.
* **Properties**: `success: boolean`, `output?: TOutput`, `error?: string`, `contentType?`, `details?`.

### 2.6. `ToolExecutor` Class
* **File**: `backend/agentos/core/tools/ToolExecutor.ts`
* **Purpose**: Directly handles the validation of arguments against a tool's `inputSchema` (using Ajv) and invokes the `tool.execute()` method. It formats the outcome into a `ToolExecutionResult`.
* **Responsibilities**: Argument validation, execution invocation, basic error packaging.

### 2.7. `IToolPermissionManager` Interface & `ToolPermissionManager` Class
* **Files**: `backend/agentos/core/tools/IToolPermissionManager.ts`, `backend/agentos/core/tools/ToolPermissionManager.ts`
* **Purpose**: Manages and enforces permissions for tool usage.
* **Key Methods**:
    * `isExecutionAllowed(context: PermissionCheckContext): Promise<PermissionCheckResult>`: Checks if a tool call is authorized based on Persona capabilities, user subscription features (via `ISubscriptionService`), and other rules.
* **Key Types**:
    * `PermissionCheckContext`: Input for permission checks.
    * `PermissionCheckResult`: Output of permission checks.
    * `ToolPermissionManagerConfig`: Configuration for its behavior.

### 2.8. `IToolOrchestrator` Interface & `ToolOrchestrator` Class
* **Files**: `backend/agentos/core/tools/IToolOrchestrator.ts`, `backend/agentos/core/tools/ToolOrchestrator.ts`
* **Purpose**: Acts as the central coordinator for the entire tool subsystem.
* **Responsibilities**:
    * Tool Registration: Manages an internal registry of available `ITool` instances.
    * Tool Discovery: Provides methods like `listAvailableTools()` to get `ToolDefinitionForLLM` objects suitable for LLM consumption.
    * Orchestrating Execution: When a GMI requests a tool call, the `ToolOrchestrator` uses the `IToolPermissionManager` to authorize the call and then delegates to the `ToolExecutor` to run the tool.
* **Key Types**:
    * `ToolDefinitionForLLM`: Standardized tool description for LLMs.

### 2.9. `ToolOrchestratorConfig` Interface
* **File**: `backend/agentos/config/ToolOrchestratorConfig.ts`
* **Purpose**: Defines configuration options for the `ToolOrchestrator`.
* **Properties**: `defaultToolCallTimeoutMs`, `maxConcurrentToolCalls`, `logToolCalls`, `globalDisabledTools`, `toolRegistrySettings`.

---

## 3. Workflow of a Tool Call 🔄

A typical tool call initiated by a GMI (or an agent) flows through the system as follows:

1.  **GMI Decision**: The GMI, based on its reasoning and the current context, decides to use a tool.
2.  **Tool Call Request**: The GMI (or the LLM it uses) generates a `ToolCallRequest` (defined in `IGMI.ts`), specifying the tool's `name` and `arguments`.
3.  **Orchestration Entry**: This request, along with contextual information (`gmiId`, `personaId`, `personaCapabilities`, `userContext`), is packaged into `ToolExecutionRequestDetails` and sent to `ToolOrchestrator.processToolCall()`.
4.  **Permission Check**: The `ToolOrchestrator` retrieves the `ITool` instance from its registry. It then calls `IToolPermissionManager.isExecutionAllowed()` with a `PermissionCheckContext`.
5.  **Authorization**: The `ToolPermissionManager` checks:
    * If the Persona has the `tool.requiredCapabilities`.
    * If the user's subscription tier (via `ISubscriptionService`) grants access to any `FeatureFlag`s associated with the tool in `ToolPermissionManagerConfig`.
6.  **Execution (if permitted)**:
    * The `ToolOrchestrator` passes the `ToolExecutionRequestDetails` to the `ToolExecutor.executeTool()`.
    * The `ToolExecutor` validates the `toolCallRequest.function.arguments` against the `tool.inputSchema` using Ajv.
    * If validation passes, the `ToolExecutor` calls the specific `tool.execute(parsedArgs, executionContext)` method.
7.  **Result Handling**:
    * The tool's `execute` method returns a `Promise<ToolExecutionResult>`.
    * The `ToolExecutor` returns this result.
    * The `ToolOrchestrator` takes the `ToolExecutionResult` and formats it into a `ToolCallResult` (defined in `IGMI.ts`), which includes the original `toolCallId`.
8.  **Feedback to GMI**: The `ToolCallResult` is sent back to the GMI, which then processes the tool's output to continue its reasoning or formulate a response.

---

## 4. Defining and Registering a New Tool ✍️

To add a new tool to AgentOS:

1.  **Implement `ITool`**:
    * It's highly recommended to create a new class that extends the abstract `Tool` class (from `backend/agentos/core/agents/tools/Tool.ts`).
    * Provide all required properties in the constructor (ID, name, display name, description, input schema).
    * The `name` property must be unique and suitable for LLM function calling.
    * The `description` must be clear and comprehensive for the LLM.
    * The `inputSchema` must be a valid JSON Schema object detailing all expected parameters, their types, and whether they are required.

    ```typescript
    // Example: src/tools/MyCustomTool.ts
    import { Tool, ToolDefinition, ToolExecutionContext, ToolExecutionResult } from '../../core/agents/tools/Tool';
    import { JSONSchemaObject } from '../../core/tools/ITool'; // Path depends on ITool.ts location

    interface MyToolInput {
      param1: string;
      param2?: number;
    }

    interface MyToolOutput {
      result: string;
      processedValue: number;
    }

    export class MyCustomTool extends Tool<MyToolInput, MyToolOutput> {
      constructor() {
        super({
          id: "my-custom-tool-v1",
          name: "myCustomFunction", // Name for LLM
          displayName: "My Custom Tool",
          description: "This tool performs a custom action based on param1 and optional param2.",
          inputSchema: {
            type: "object",
            properties: {
              param1: { type: "string", description: "The first required parameter." },
              param2: { type: "number", description: "An optional second parameter." }
            },
            required: ["param1"]
          } as JSONSchemaObject, // Cast if your schema type is more specific
          outputSchema: {
            type: "object",
            properties: {
              result: { type: "string" },
              processedValue: { type: "number" }
            },
            required: ["result", "processedValue"]
          } as JSONSchemaObject,
          category: "Custom Utilities",
          hasSideEffects: false,
        });
      }

      public async execute(args: MyToolInput, context: ToolExecutionContext): Promise<ToolExecutionResult<MyToolOutput>> {
        try {
          // Your tool's logic here
          const outputValue = (args.param1 || "").toUpperCase() + " - " + (args.param2 || 0);
          return {
            success: true,
            output: { result: "Success!", processedValue: (args.param2 || 0) * 2 }
          };
        } catch (error: any) {
          return {
            success: false,
            error: `MyCustomTool failed: ${error.message}`,
            details: { stack: error.stack }
          };
        }
      }
    }
    ```

2.  **Register the Tool**:
    * Tool instances need to be registered with the `ToolOrchestrator`. This is typically done during the orchestrator's initialization by passing an array of `ITool` instances.
    * If `allowDynamicRegistration` is enabled in `ToolOrchestratorConfig`, tools can also be registered or unregistered at runtime using `toolOrchestrator.registerTool(new MyCustomTool())`.

---

## 5. LLM Interaction 🤖

For LLMs to effectively use tools (via function/tool calling):

* The `ToolOrchestrator.listAvailableTools()` method provides a list of `ToolDefinitionForLLM` objects. This list is what should be passed to the LLM in its prompt.
* **Crucial for LLM**:
    * `name`: Must be precise and match what the LLM will output.
    * `description`: Must clearly explain what the tool does, when to use it, and what it achieves. The LLM heavily relies on this to make decisions.
    * `parameters` (from `inputSchema`): Must accurately define all input arguments, their types, and if they are required. Descriptions for each parameter are also vital.

Poorly defined descriptions or schemas will lead to the LLM misusing tools or failing to provide correct arguments.

---

## 6. Configuration ⚙️

* **`ToolOrchestratorConfig`** (`backend/agentos/config/ToolOrchestratorConfig.ts`):
    * `logToolCalls`: Set to `true` for easier debugging of tool interactions.
    * `globalDisabledTools`: Useful for quickly disabling tools system-wide.
    * `toolRegistrySettings.allowDynamicRegistration`: Controls if tools can be added/removed after startup.
* **`ToolPermissionManagerConfig`** (`backend/agentos/core/tools/IToolPermissionManager.ts`):
    * `strictCapabilityChecking`: Enforces that Personas must have all capabilities listed in a tool's `requiredCapabilities`.
    * `toolToSubscriptionFeatures`: Maps tools to specific `FeatureFlag`s that a user's subscription must grant access to.

---

## 7. Best Practices for Tool Development ⭐

* **Idempotency**: Design tools to be idempotent whenever possible (i.e., calling them multiple times with the same inputs yields the same result without unintended additional side effects).
* **Clear Schemas**: Invest time in well-defined JSON schemas for inputs and outputs. Use descriptions for all properties.
* **Robust Error Handling**: Within a tool's `execute` method, catch specific errors and return them in the `ToolExecutionResult.error` field with helpful `details`. Avoid letting unexpected exceptions bubble up.
* **Security**:
    * Be extremely cautious with tools that have side effects (`hasSideEffects: true`), especially those executing code, accessing files, or calling external APIs with write permissions.
    * Validate and sanitize all inputs thoroughly, even after schema validation.
    * Leverage `requiredCapabilities` and work with the `ToolPermissionManager` to ensure only authorized Personas/users can access sensitive tools.
* **Single Responsibility**: Aim for tools that perform a specific, well-defined task. Avoid overly complex tools that try to do too much.
* **Contextual Awareness**: Use the `ToolExecutionContext` if the tool needs information about the user, persona, or session to perform its task correctly.
* **Documentation**: Besides the `description` for the LLM, maintain good internal documentation for complex tools.

---

## 8. Future Enhancements (Conceptual) 🚀

* **Tool Versioning**: More sophisticated handling of multiple tool versions.
* **Dynamic Tool Loading**: Loading tools from external plugins or modules at runtime.
* **Tool Usage Analytics**: Tracking tool usage, success/failure rates, and performance.
* **Advanced Permission Scopes**: More granular permission controls beyond simple capability strings.
* **Tool Chaining DSL**: A higher-level way for GMIs or developers to define sequences or graphs of tool calls.
* **Automatic Schema Generation**: Utilities to help generate JSON schemas from TypeScript interfaces for tool inputs/outputs.

This tool system provides a powerful and extensible way to enhance the capabilities of AI agents within AgentOS.