# Function: buildMemoryContext()

> **buildMemoryContext**(`agent`, `allColonists?`): `string`

Defined in: [apps/paracosm/src/runtime/agent-memory.ts:185](https://github.com/framersai/paracosm/blob/eaaca6b88e64f96fe664d1ac64fc305b0bfc5ec9/src/runtime/agent-memory.ts#L185)

Build memory context lines for a agent's reaction prompt.
Returns a string block that gets injected into the prompt.

## Parameters

### agent

[`Agent`](../../engine/interfaces/Agent.md)

The agent whose memory to render

### allColonists?

[`Agent`](../../engine/interfaces/Agent.md)[]

Optional full agent list for resolving relationship names

## Returns

`string`
