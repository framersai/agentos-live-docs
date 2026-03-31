# Interface: ToolRegistrySettings

Defined in: [packages/agentos/src/core/config/ToolOrchestratorConfig.ts:28](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/core/config/ToolOrchestratorConfig.ts#L28)

## Interface

ToolRegistrySettings

## Description

Defines settings specific to the tool registry behavior within the ToolOrchestrator.
These settings control how tools are managed, whether they can be added dynamically,
and conceptual aspects of persistence.

## Properties

### allowDynamicRegistration?

> `optional` **allowDynamicRegistration**: `boolean`

Defined in: [packages/agentos/src/core/config/ToolOrchestratorConfig.ts:29](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/core/config/ToolOrchestratorConfig.ts#L29)

If true (default), tools can be registered or
unregistered with the orchestrator after its initial initialization. If false, the set of
available tools is fixed once the orchestrator is initialized.

***

### persistencePath?

> `optional` **persistencePath**: `string`

Defined in: [packages/agentos/src/core/config/ToolOrchestratorConfig.ts:31](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/core/config/ToolOrchestratorConfig.ts#L31)

Optional. If `persistRegistry` is true, this string could specify
the path, URI, or identifier for the persisted storage location or configuration. (Conceptual).

***

### persistRegistry?

> `optional` **persistRegistry**: `boolean`

Defined in: [packages/agentos/src/core/config/ToolOrchestratorConfig.ts:30](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/core/config/ToolOrchestratorConfig.ts#L30)

If true (default: false), this conceptually indicates that the tool
registry's state (e.g., list of dynamically registered tools, their versions) should be persisted
to a durable store (e.g., database, configuration file). The actual persistence mechanism
would be implemented within the ToolOrchestrator or a dedicated registry service.
(Note: The current ToolOrchestrator uses an in-memory map).
