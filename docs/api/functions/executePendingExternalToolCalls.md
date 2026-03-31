# Function: executePendingExternalToolCalls()

> **executePendingExternalToolCalls**(`agentos`, `pendingRequest`, `options?`): `Promise`\<[`AgentOSToolResultInput`](../interfaces/AgentOSToolResultInput.md)[]\>

Defined in: [packages/agentos/src/api/runtime/resumeExternalToolRequestWithRegisteredTools.ts:252](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/runtime/resumeExternalToolRequestWithRegisteredTools.ts#L252)

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
