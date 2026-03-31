# Function: executePendingExternalToolCall()

> **executePendingExternalToolCall**(`agentos`, `pendingRequest`, `toolCall`, `options?`): `Promise`\<[`AgentOSToolResultInput`](../interfaces/AgentOSToolResultInput.md)\>

Defined in: [packages/agentos/src/api/runtime/resumeExternalToolRequestWithRegisteredTools.ts:149](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/runtime/resumeExternalToolRequestWithRegisteredTools.ts#L149)

Executes one pending external tool call through AgentOS's registered tool
registry using the correct resume-time execution context, then optionally
falls back to a host-provided external tool registry or dynamic callback.

## Parameters

### agentos

`Pick`\<`IAgentOS`, `"getToolOrchestrator"`\> & `Partial`\<`Pick`\<`IAgentOS`, `"getExternalToolRegistry"`\>\>

### pendingRequest

[`AgentOSPendingExternalToolRequest`](../interfaces/AgentOSPendingExternalToolRequest.md)

### toolCall

[`ToolCallRequest`](../interfaces/ToolCallRequest.md)

### options?

[`PendingExternalToolExecutionOptions`](../interfaces/PendingExternalToolExecutionOptions.md) = `{}`

## Returns

`Promise`\<[`AgentOSToolResultInput`](../interfaces/AgentOSToolResultInput.md)\>
