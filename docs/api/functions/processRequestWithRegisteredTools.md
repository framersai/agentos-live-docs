# Function: processRequestWithRegisteredTools()

> **processRequestWithRegisteredTools**(`agentos`, `input`, `options?`): `AsyncGenerator`\<[`AgentOSResponse`](../type-aliases/AgentOSResponse.md), `void`, `undefined`\>

Defined in: [packages/agentos/src/api/runtime/processRequestWithRegisteredTools.ts:200](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/runtime/processRequestWithRegisteredTools.ts#L200)

Runs a full `AgentOS.processRequest(...)` turn and executes any actionable
external tool pauses against AgentOS's registered tools automatically.
Missing tool names can optionally fall back to `externalTools` or
`fallbackExternalToolHandler`.

## Parameters

### agentos

`RegisteredToolRuntime`

### input

[`AgentOSInput`](../interfaces/AgentOSInput.md)

### options?

[`RegisteredExternalToolExecutionOptions`](../interfaces/RegisteredExternalToolExecutionOptions.md) = `{}`

## Returns

`AsyncGenerator`\<[`AgentOSResponse`](../type-aliases/AgentOSResponse.md), `void`, `undefined`\>
