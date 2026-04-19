# Function: buildMemoryContext()

> **buildMemoryContext**(`agent`, `allColonists?`): `string`

Defined in: [runtime/agent-memory.ts:185](https://github.com/framersai/paracosm/blob/4460134be69867eda5cc8dfb2df653cefb7431d1/src/runtime/agent-memory.ts#L185)

Build memory context lines for a agent's reaction prompt.
Returns a string block that gets injected into the prompt.

## Parameters

### agent

[`Agent`](../../engine/interfaces/Agent.md)

### allColonists?

[`Agent`](../../engine/interfaces/Agent.md)[]

Optional full agent list for resolving relationship names

## Returns

`string`
