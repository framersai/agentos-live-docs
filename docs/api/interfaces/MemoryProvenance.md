# Interface: MemoryProvenance

Defined in: [packages/agentos/src/cognition/memory/core/types.ts:67](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/core/types.ts#L67)

## Properties

### confidence

> **confidence**: `number`

Defined in: [packages/agentos/src/cognition/memory/core/types.ts:74](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/core/types.ts#L74)

0-1 confidence we have in this memory's accuracy.

***

### contradictedBy?

> `optional` **contradictedBy**: `string`[]

Defined in: [packages/agentos/src/cognition/memory/core/types.ts:79](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/core/types.ts#L79)

IDs of other traces that contradict this one.

***

### lastVerifiedAt?

> `optional` **lastVerifiedAt**: `number`

Defined in: [packages/agentos/src/cognition/memory/core/types.ts:77](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/core/types.ts#L77)

***

### sourceId?

> `optional` **sourceId**: `string`

Defined in: [packages/agentos/src/cognition/memory/core/types.ts:70](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/core/types.ts#L70)

Back-reference to originating conversation, tool call, etc.

***

### sourceTimestamp

> **sourceTimestamp**: `number`

Defined in: [packages/agentos/src/cognition/memory/core/types.ts:72](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/core/types.ts#L72)

Timestamp of the original source information.

***

### sourceType

> **sourceType**: [`MemorySourceType`](../type-aliases/MemorySourceType.md)

Defined in: [packages/agentos/src/cognition/memory/core/types.ts:68](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/core/types.ts#L68)

***

### verificationCount

> **verificationCount**: `number`

Defined in: [packages/agentos/src/cognition/memory/core/types.ts:76](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/core/types.ts#L76)

How many times this memory has been externally confirmed.
