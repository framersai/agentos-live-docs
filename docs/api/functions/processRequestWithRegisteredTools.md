# Function: processRequestWithRegisteredTools()

> **processRequestWithRegisteredTools**(`agentos`, `input`, `options?`): `AsyncGenerator`\<[`AgentOSResponse`](../type-aliases/AgentOSResponse.md), `void`, `undefined`\>

Defined in: [packages/agentos/src/api/runtime/processRequestWithRegisteredTools.ts:200](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/runtime/processRequestWithRegisteredTools.ts#L200)

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
