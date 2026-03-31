# Function: processRequestWithExternalTools()

> **processRequestWithExternalTools**(`agentos`, `input`, `executeToolCall`): `AsyncGenerator`\<[`AgentOSResponse`](../type-aliases/AgentOSResponse.md), `void`, `undefined`\>

Defined in: [packages/agentos/src/api/runtime/processRequestWithExternalTools.ts:103](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/runtime/processRequestWithExternalTools.ts#L103)

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
