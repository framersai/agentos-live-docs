# Function: buildPendingExternalToolExecutionContext()

> **buildPendingExternalToolExecutionContext**(`pendingRequest`, `options?`): [`ToolExecutionContext`](../interfaces/ToolExecutionContext.md)

Defined in: [packages/agentos/src/api/runtime/resumeExternalToolRequestWithRegisteredTools.ts:111](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/runtime/resumeExternalToolRequestWithRegisteredTools.ts#L111)

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
