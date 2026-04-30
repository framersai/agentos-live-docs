# Function: consolidateMemory()

> **consolidateMemory**(`agent`): `void`

Defined in: [apps/paracosm/src/runtime/agent-memory.ts:59](https://github.com/framersai/paracosm/blob/eaaca6b88e64f96fe664d1ac64fc305b0bfc5ec9/src/runtime/agent-memory.ts#L59)

Consolidate short-term memories into long-term beliefs.
Called when short-term memory exceeds the threshold.
Keeps the most salient recent memories and summarizes older ones.

## Parameters

### agent

[`Agent`](../../engine/interfaces/Agent.md)

## Returns

`void`
