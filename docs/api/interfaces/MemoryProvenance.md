# Interface: MemoryProvenance

Defined in: [packages/agentos/src/memory/core/types.ts:37](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/core/types.ts#L37)

## Properties

### confidence

> **confidence**: `number`

Defined in: [packages/agentos/src/memory/core/types.ts:44](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/core/types.ts#L44)

0-1 confidence we have in this memory's accuracy.

***

### contradictedBy?

> `optional` **contradictedBy**: `string`[]

Defined in: [packages/agentos/src/memory/core/types.ts:49](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/core/types.ts#L49)

IDs of other traces that contradict this one.

***

### lastVerifiedAt?

> `optional` **lastVerifiedAt**: `number`

Defined in: [packages/agentos/src/memory/core/types.ts:47](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/core/types.ts#L47)

***

### sourceId?

> `optional` **sourceId**: `string`

Defined in: [packages/agentos/src/memory/core/types.ts:40](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/core/types.ts#L40)

Back-reference to originating conversation, tool call, etc.

***

### sourceTimestamp

> **sourceTimestamp**: `number`

Defined in: [packages/agentos/src/memory/core/types.ts:42](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/core/types.ts#L42)

Timestamp of the original source information.

***

### sourceType

> **sourceType**: [`MemorySourceType`](../type-aliases/MemorySourceType.md)

Defined in: [packages/agentos/src/memory/core/types.ts:38](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/core/types.ts#L38)

***

### verificationCount

> **verificationCount**: `number`

Defined in: [packages/agentos/src/memory/core/types.ts:46](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/core/types.ts#L46)

How many times this memory has been externally confirmed.
