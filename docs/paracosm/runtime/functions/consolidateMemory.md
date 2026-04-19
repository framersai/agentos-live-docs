# Function: consolidateMemory()

> **consolidateMemory**(`agent`): `void`

Defined in: [runtime/agent-memory.ts:59](https://github.com/framersai/paracosm/blob/4460134be69867eda5cc8dfb2df653cefb7431d1/src/runtime/agent-memory.ts#L59)

Consolidate short-term memories into long-term beliefs.
Called when short-term memory exceeds the threshold.
Keeps the most salient recent memories and summarizes older ones.

## Parameters

### agent

[`Agent`](../../engine/interfaces/Agent.md)

## Returns

`void`
