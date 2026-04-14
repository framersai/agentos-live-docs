# Function: processRequestWithExternalTools()

> **processRequestWithExternalTools**(`agentos`, `input`, `executeToolCall`): `AsyncGenerator`\<[`AgentOSResponse`](../type-aliases/AgentOSResponse.md), `void`, `undefined`\>

Defined in: [packages/agentos/src/api/runtime/processRequestWithExternalTools.ts:103](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/api/runtime/processRequestWithExternalTools.ts#L103)

Runs a full `AgentOS.processRequest(...)` turn and automatically resumes any
actionable external tool pauses through `handleToolResult(...)`.

Actionable external tool calls are executed in emitted order. When a pause
contains multiple actionable tool calls, the helper batches their results and
resumes the stream once through `handleToolResults(...)` when available.

## Parameters

### agentos

`Pick`\<`IAgentOS`, `"processRequest"` \| `"handleToolResult"`\> & `Partial`\<`Pick`\<`IAgentOS`, `"handleToolResults"`\>\>

### input

[`AgentOSInput`](../interfaces/AgentOSInput.md)

### executeToolCall

[`AgentOSExternalToolHandler`](../type-aliases/AgentOSExternalToolHandler.md)

## Returns

`AsyncGenerator`\<[`AgentOSResponse`](../type-aliases/AgentOSResponse.md), `void`, `undefined`\>
