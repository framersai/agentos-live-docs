# Function: resumeExternalToolRequestWithRegisteredTools()

> **resumeExternalToolRequestWithRegisteredTools**(`agentos`, `pendingRequest`, `options?`): `AsyncGenerator`\<[`AgentOSResponse`](../type-aliases/AgentOSResponse.md), `void`, `undefined`\>

Defined in: [packages/agentos/src/api/runtime/resumeExternalToolRequestWithRegisteredTools.ts:259](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/runtime/resumeExternalToolRequestWithRegisteredTools.ts#L259)

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
