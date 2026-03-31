# Function: isActionableToolCallRequestChunk()

> **isActionableToolCallRequestChunk**(`chunk`): `chunk is AgentOSActionableToolCallRequestChunk`

Defined in: [packages/agentos/src/api/types/AgentOSResponse.ts:268](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/types/AgentOSResponse.ts#L268)

Runtime type guard for tool-call request chunks that require the host to
call `handleToolResult(...)` to continue the turn.

## Parameters

### chunk

`unknown`

## Returns

`chunk is AgentOSActionableToolCallRequestChunk`
