# Function: buildPendingExternalToolExecutionContext()

> **buildPendingExternalToolExecutionContext**(`pendingRequest`, `options?`): [`ToolExecutionContext`](../interfaces/ToolExecutionContext.md)

Defined in: [packages/agentos/src/api/runtime/resumeExternalToolRequestWithRegisteredTools.ts:104](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/runtime/resumeExternalToolRequestWithRegisteredTools.ts#L104)

Builds the `ToolExecutionContext` that a host should use when it wants to
execute a persisted external tool pause against AgentOS's registered tool
registry after restart.

## Parameters

### pendingRequest

[`AgentOSPendingExternalToolRequest`](../interfaces/AgentOSPendingExternalToolRequest.md)

### options?

[`PendingExternalToolExecutionOptions`](../interfaces/PendingExternalToolExecutionOptions.md) = `{}`

## Returns

[`ToolExecutionContext`](../interfaces/ToolExecutionContext.md)
