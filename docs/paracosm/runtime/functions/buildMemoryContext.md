# Function: buildMemoryContext()

> **buildMemoryContext**(`agent`, `allColonists?`, `timeUnitNoun?`): `string`

Defined in: [apps/paracosm/src/runtime/agent-memory.ts:185](https://github.com/framersai/paracosm/blob/4b7d109255db6541b63aff869511eecf9500ee08/src/runtime/agent-memory.ts#L185)

Build memory context lines for a agent's reaction prompt.
Returns a string block that gets injected into the prompt.

## Parameters

### agent

[`Agent`](../../engine/interfaces/Agent.md)

The agent whose memory to render

### allColonists?

[`Agent`](../../engine/interfaces/Agent.md)[]

Optional full agent list for resolving relationship names

### timeUnitNoun?

`string`

## Returns

`string`
