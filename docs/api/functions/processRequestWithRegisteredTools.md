# Function: processRequestWithRegisteredTools()

> **processRequestWithRegisteredTools**(`agentos`, `input`, `options?`): `AsyncGenerator`\<[`AgentOSResponse`](../type-aliases/AgentOSResponse.md), `void`, `undefined`\>

Defined in: [packages/agentos/src/api/runtime/processRequestWithRegisteredTools.ts:200](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/runtime/processRequestWithRegisteredTools.ts#L200)

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
