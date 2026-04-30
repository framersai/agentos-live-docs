# Interface: MemoryProvenance

Defined in: [packages/agentos/src/memory/core/types.ts:44](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/core/types.ts#L44)

## Properties

### confidence

> **confidence**: `number`

Defined in: [packages/agentos/src/memory/core/types.ts:51](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/core/types.ts#L51)

0-1 confidence we have in this memory's accuracy.

***

### contradictedBy?

> `optional` **contradictedBy**: `string`[]

Defined in: [packages/agentos/src/memory/core/types.ts:56](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/core/types.ts#L56)

IDs of other traces that contradict this one.

***

### lastVerifiedAt?

> `optional` **lastVerifiedAt**: `number`

Defined in: [packages/agentos/src/memory/core/types.ts:54](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/core/types.ts#L54)

***

### sourceId?

> `optional` **sourceId**: `string`

Defined in: [packages/agentos/src/memory/core/types.ts:47](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/core/types.ts#L47)

Back-reference to originating conversation, tool call, etc.

***

### sourceTimestamp

> **sourceTimestamp**: `number`

Defined in: [packages/agentos/src/memory/core/types.ts:49](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/core/types.ts#L49)

Timestamp of the original source information.

***

### sourceType

> **sourceType**: [`MemorySourceType`](../type-aliases/MemorySourceType.md)

Defined in: [packages/agentos/src/memory/core/types.ts:45](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/core/types.ts#L45)

***

### verificationCount

> **verificationCount**: `number`

Defined in: [packages/agentos/src/memory/core/types.ts:53](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/core/types.ts#L53)

How many times this memory has been externally confirmed.
