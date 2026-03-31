# Function: resumeExternalToolRequestWithRegisteredTools()

> **resumeExternalToolRequestWithRegisteredTools**(`agentos`, `pendingRequest`, `options?`): `AsyncGenerator`\<[`AgentOSResponse`](../type-aliases/AgentOSResponse.md), `void`, `undefined`\>

Defined in: [packages/agentos/src/api/runtime/resumeExternalToolRequestWithRegisteredTools.ts:275](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/runtime/resumeExternalToolRequestWithRegisteredTools.ts#L275)

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
