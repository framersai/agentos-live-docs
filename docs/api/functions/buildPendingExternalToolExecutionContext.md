# Function: buildPendingExternalToolExecutionContext()

> **buildPendingExternalToolExecutionContext**(`pendingRequest`, `options?`): [`ToolExecutionContext`](../interfaces/ToolExecutionContext.md)

Defined in: [packages/agentos/src/api/runtime/resumeExternalToolRequestWithRegisteredTools.ts:111](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/runtime/resumeExternalToolRequestWithRegisteredTools.ts#L111)

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
