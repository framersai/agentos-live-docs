# Function: consolidateMemory()

> **consolidateMemory**(`agent`): `void`

Defined in: [apps/paracosm/src/runtime/agent-memory.ts:59](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/runtime/agent-memory.ts#L59)

Consolidate short-term memories into long-term beliefs.
Called when short-term memory exceeds the threshold.
Keeps the most salient recent memories and summarizes older ones.

## Parameters

### agent

[`Agent`](../../engine/interfaces/Agent.md)

## Returns

`void`
