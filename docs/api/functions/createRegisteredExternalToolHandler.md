# Function: createRegisteredExternalToolHandler()

> **createRegisteredExternalToolHandler**(`agentos`, `input`, `options?`): [`AgentOSExternalToolHandler`](../type-aliases/AgentOSExternalToolHandler.md)

Defined in: [packages/agentos/src/api/runtime/processRequestWithRegisteredTools.ts:111](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/runtime/processRequestWithRegisteredTools.ts#L111)

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
