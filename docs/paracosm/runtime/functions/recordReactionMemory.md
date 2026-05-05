# Function: recordReactionMemory()

> **recordReactionMemory**(`agent`, `reaction`, `eventTitle`, `eventCategory`, `outcome`, `turn`, `time`): `void`

Defined in: [apps/paracosm/src/runtime/agent-memory.ts:24](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/runtime/agent-memory.ts#L24)

Record an agent's reaction as a persistent memory entry.
Called after each turn's reactions are generated.

## Parameters

### agent

[`Agent`](../../engine/interfaces/Agent.md)

### reaction

`AgentReaction`

### eventTitle

`string`

### eventCategory

`string`

### outcome

`string`

### turn

`number`

### time

`number`

## Returns

`void`
