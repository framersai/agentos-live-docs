# Function: isActionableToolCallRequestChunk()

> **isActionableToolCallRequestChunk**(`chunk`): `chunk is AgentOSActionableToolCallRequestChunk`

Defined in: [packages/agentos/src/api/types/AgentOSResponse.ts:268](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/api/types/AgentOSResponse.ts#L268)

Runtime type guard for tool-call request chunks that require the host to
call `handleToolResult(...)` to continue the turn.

## Parameters

### chunk

`unknown`

## Returns

`chunk is AgentOSActionableToolCallRequestChunk`
