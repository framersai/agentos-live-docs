# Function: resumeExternalToolRequestWithRegisteredTools()

> **resumeExternalToolRequestWithRegisteredTools**(`agentos`, `pendingRequest`, `options?`): `AsyncGenerator`\<[`AgentOSResponse`](../type-aliases/AgentOSResponse.md), `void`, `undefined`\>

Defined in: [packages/agentos/src/api/runtime/resumeExternalToolRequestWithRegisteredTools.ts:275](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/runtime/resumeExternalToolRequestWithRegisteredTools.ts#L275)

Executes all pending registered tool calls from a persisted external-tool
pause and immediately resumes the AgentOS stream on the caller's behalf.
Missing tool names can optionally fall back to `externalTools` or
`fallbackExternalToolHandler`.

## Parameters

### agentos

`RegisteredToolExecutionRuntime`

### pendingRequest

[`AgentOSPendingExternalToolRequest`](../interfaces/AgentOSPendingExternalToolRequest.md)

### options?

[`ResumeExternalToolRequestWithRegisteredToolsOptions`](../interfaces/ResumeExternalToolRequestWithRegisteredToolsOptions.md) = `{}`

## Returns

`AsyncGenerator`\<[`AgentOSResponse`](../type-aliases/AgentOSResponse.md), `void`, `undefined`\>
