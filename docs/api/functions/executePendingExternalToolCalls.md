# Function: executePendingExternalToolCalls()

> **executePendingExternalToolCalls**(`agentos`, `pendingRequest`, `options?`): `Promise`\<[`AgentOSToolResultInput`](../interfaces/AgentOSToolResultInput.md)[]\>

Defined in: [packages/agentos/src/api/runtime/resumeExternalToolRequestWithRegisteredTools.ts:236](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/runtime/resumeExternalToolRequestWithRegisteredTools.ts#L236)

Executes all tool calls from a persisted external-tool pause, in order,
through AgentOS's registered tool registry.

## Parameters

### agentos

`Pick`\<`IAgentOS`, `"getToolOrchestrator"`\> & `Partial`\<`Pick`\<`IAgentOS`, `"getExternalToolRegistry"`\>\>

### pendingRequest

[`AgentOSPendingExternalToolRequest`](../interfaces/AgentOSPendingExternalToolRequest.md)

### options?

[`PendingExternalToolExecutionOptions`](../interfaces/PendingExternalToolExecutionOptions.md) = `{}`

## Returns

`Promise`\<[`AgentOSToolResultInput`](../interfaces/AgentOSToolResultInput.md)[]\>
