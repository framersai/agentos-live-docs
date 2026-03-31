# Function: createRegisteredExternalToolHandler()

> **createRegisteredExternalToolHandler**(`agentos`, `input`, `options?`): [`AgentOSExternalToolHandler`](../type-aliases/AgentOSExternalToolHandler.md)

Defined in: [packages/agentos/src/api/runtime/processRequestWithRegisteredTools.ts:129](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/runtime/processRequestWithRegisteredTools.ts#L129)

Creates an external-tool handler that executes AgentOS-registered tools with
the correct live-turn execution context, then optionally falls back to a
host-provided external tool registry or dynamic callback.

## Parameters

### agentos

`Pick`\<`IAgentOS`, `"getToolOrchestrator"`\> & `Partial`\<`Pick`\<`IAgentOS`, `"getExternalToolRegistry"`\>\>

### input

[`AgentOSInput`](../interfaces/AgentOSInput.md)

### options?

[`RegisteredExternalToolExecutionOptions`](../interfaces/RegisteredExternalToolExecutionOptions.md) = `{}`

## Returns

[`AgentOSExternalToolHandler`](../type-aliases/AgentOSExternalToolHandler.md)
