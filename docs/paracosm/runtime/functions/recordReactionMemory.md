# Function: recordReactionMemory()

> **recordReactionMemory**(`agent`, `reaction`, `eventTitle`, `eventCategory`, `outcome`, `turn`, `year`): `void`

Defined in: [runtime/agent-memory.ts:24](https://github.com/framersai/paracosm/blob/4460134be69867eda5cc8dfb2df653cefb7431d1/src/runtime/agent-memory.ts#L24)

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

### year

`number`

## Returns

`void`
