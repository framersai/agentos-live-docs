# Function: isActionableToolCallRequestChunk()

> **isActionableToolCallRequestChunk**(`chunk`): `chunk is AgentOSActionableToolCallRequestChunk`

Defined in: [packages/agentos/src/api/types/AgentOSResponse.ts:268](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/types/AgentOSResponse.ts#L268)

Runtime type guard for tool-call request chunks that require the host to
call `handleToolResult(...)` to continue the turn.

## Parameters

### chunk

`unknown`

## Returns

`chunk is AgentOSActionableToolCallRequestChunk`
