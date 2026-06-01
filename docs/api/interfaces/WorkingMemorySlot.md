# Interface: WorkingMemorySlot

Defined in: [packages/agentos/src/cognition/memory/core/types.ts:352](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/core/types.ts#L352)

## Properties

### activationLevel

> **activationLevel**: `number`

Defined in: [packages/agentos/src/cognition/memory/core/types.ts:357](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/core/types.ts#L357)

0-1 activation level; determines if slot is "in focus".

***

### attentionWeight

> **attentionWeight**: `number`

Defined in: [packages/agentos/src/cognition/memory/core/types.ts:363](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/core/types.ts#L363)

How much attention is allocated to this slot (0-1).

***

### enteredAt

> **enteredAt**: `number`

Defined in: [packages/agentos/src/cognition/memory/core/types.ts:359](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/core/types.ts#L359)

When this trace entered working memory (Unix ms).

***

### rehearsalCount

> **rehearsalCount**: `number`

Defined in: [packages/agentos/src/cognition/memory/core/types.ts:361](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/core/types.ts#L361)

Maintenance rehearsal counter.

***

### slotId

> **slotId**: `string`

Defined in: [packages/agentos/src/cognition/memory/core/types.ts:353](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/core/types.ts#L353)

***

### traceId

> **traceId**: `string`

Defined in: [packages/agentos/src/cognition/memory/core/types.ts:355](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/core/types.ts#L355)

Reference to the underlying MemoryTrace (or a transient key).
