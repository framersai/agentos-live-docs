# Function: createRegisteredExternalToolHandler()

> **createRegisteredExternalToolHandler**(`agentos`, `input`, `options?`): [`AgentOSExternalToolHandler`](../type-aliases/AgentOSExternalToolHandler.md)

Defined in: [packages/agentos/src/api/runtime/processRequestWithRegisteredTools.ts:129](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/runtime/processRequestWithRegisteredTools.ts#L129)

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
