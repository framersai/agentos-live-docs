# Interface: ToolOrchestratorConfig

Defined in: [packages/agentos/src/core/config/ToolOrchestratorConfig.ts:90](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/core/config/ToolOrchestratorConfig.ts#L90)

## Interface

ToolOrchestratorConfig

## Description

Configuration options for the ToolOrchestrator.
This interface allows for fine-tuning its operational parameters, default behaviors,
logging levels, and integration points with other system components.

## Properties

### customParameters?

> `optional` **customParameters**: `Record`\<`string`, `any`\>

Defined in: [packages/agentos/src/core/config/ToolOrchestratorConfig.ts:98](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/core/config/ToolOrchestratorConfig.ts#L98)

A flexible object to accommodate any other custom
parameters or settings that specific `ToolOrchestrator` implementations or extensions might require.
This allows for extensibility without modifying the core interface.

***

### defaultToolCallTimeoutMs?

> `optional` **defaultToolCallTimeoutMs**: `number`

Defined in: [packages/agentos/src/core/config/ToolOrchestratorConfig.ts:92](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/core/config/ToolOrchestratorConfig.ts#L92)

Default timeout in milliseconds (default: 30 seconds)
for a tool execution if the tool itself does not specify a more granular timeout or if the `ToolExecutor`
needs a fallback. (Note: Actual timeout enforcement is typically handled by the `ToolExecutor` or the tool implementation).

***

### globalDisabledTools?

> `optional` **globalDisabledTools**: `string`[]

Defined in: [packages/agentos/src/core/config/ToolOrchestratorConfig.ts:95](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/core/config/ToolOrchestratorConfig.ts#L95)

An array of tool names (`ITool.name`) or tool IDs (`ITool.id`)
that are globally disabled. These tools will not be registered or, if already present, will not be
executed, irrespective of other permission settings. This provides a system-wide mechanism to quickly
disable problematic or deprecated tools.

***

### hitl?

> `optional` **hitl**: [`ToolOrchestratorHITLConfig`](ToolOrchestratorHITLConfig.md)

Defined in: [packages/agentos/src/core/config/ToolOrchestratorConfig.ts:97](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/core/config/ToolOrchestratorConfig.ts#L97)

***

### logToolCalls?

> `optional` **logToolCalls**: `boolean`

Defined in: [packages/agentos/src/core/config/ToolOrchestratorConfig.ts:94](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/core/config/ToolOrchestratorConfig.ts#L94)

If true (default), detailed information about tool calls (including requests,
arguments, results, and any errors) will be logged by the orchestrator. This is highly beneficial for
debugging, auditing tool usage, and monitoring system behavior.

***

### maxConcurrentToolCalls?

> `optional` **maxConcurrentToolCalls**: `number`

Defined in: [packages/agentos/src/core/config/ToolOrchestratorConfig.ts:93](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/core/config/ToolOrchestratorConfig.ts#L93)

Maximum number of tool calls that the orchestrator, or more likely
the underlying `ToolExecutor`, will attempt to process concurrently. This helps in managing system resources
and preventing overload from too many simultaneous tool executions. (Conceptual for orchestrator, executor enforces).

***

### orchestratorId?

> `optional` **orchestratorId**: `string`

Defined in: [packages/agentos/src/core/config/ToolOrchestratorConfig.ts:91](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/core/config/ToolOrchestratorConfig.ts#L91)

An optional unique identifier for this ToolOrchestrator instance.
If not provided, one may be generated automatically (e.g., by the orchestrator's constructor).
This ID is useful for logging, debugging, and potentially for managing multiple orchestrator instances
in more complex or distributed setups.

***

### toolRegistrySettings?

> `optional` **toolRegistrySettings**: [`ToolRegistrySettings`](ToolRegistrySettings.md)

Defined in: [packages/agentos/src/core/config/ToolOrchestratorConfig.ts:96](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/core/config/ToolOrchestratorConfig.ts#L96)

Configuration settings that specifically govern
the behavior of the internal tool registry, such as dynamic registration allowance.
