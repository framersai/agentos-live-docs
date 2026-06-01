# Function: buildRegisteredExternalToolExecutionContext()

> **buildRegisteredExternalToolExecutionContext**(`input`, `context`, `options?`): [`ToolExecutionContext`](../interfaces/ToolExecutionContext.md)

Defined in: [packages/agentos/src/api/runtime/processRequestWithRegisteredTools.ts:68](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/runtime/processRequestWithRegisteredTools.ts#L68)

Builds the `ToolExecutionContext` for a host-managed external tool call that
should execute against AgentOS's registered tool registry during a live
`processRequest(...)` stream.

## Parameters

### input

[`AgentOSInput`](../interfaces/AgentOSInput.md)

### context

`Pick`\<[`AgentOSExternalToolHandlerContext`](../interfaces/AgentOSExternalToolHandlerContext.md), `"requestChunk"` \| `"toolCall"`\>

### options?

[`RegisteredExternalToolExecutionOptions`](../interfaces/RegisteredExternalToolExecutionOptions.md) = `{}`

## Returns

[`ToolExecutionContext`](../interfaces/ToolExecutionContext.md)
