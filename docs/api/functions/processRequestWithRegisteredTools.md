# Function: processRequestWithRegisteredTools()

> **processRequestWithRegisteredTools**(`agentos`, `input`, `options?`): `AsyncGenerator`\<[`AgentOSResponse`](../type-aliases/AgentOSResponse.md), `void`, `undefined`\>

Defined in: [packages/agentos/src/api/runtime/processRequestWithRegisteredTools.ts:218](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/api/runtime/processRequestWithRegisteredTools.ts#L218)

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
