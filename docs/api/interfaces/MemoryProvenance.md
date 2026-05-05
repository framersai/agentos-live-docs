# Interface: MemoryProvenance

Defined in: [packages/agentos/src/memory/core/types.ts:45](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/core/types.ts#L45)

## Properties

### confidence

> **confidence**: `number`

Defined in: [packages/agentos/src/memory/core/types.ts:52](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/core/types.ts#L52)

0-1 confidence we have in this memory's accuracy.

***

### contradictedBy?

> `optional` **contradictedBy**: `string`[]

Defined in: [packages/agentos/src/memory/core/types.ts:57](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/core/types.ts#L57)

IDs of other traces that contradict this one.

***

### lastVerifiedAt?

> `optional` **lastVerifiedAt**: `number`

Defined in: [packages/agentos/src/memory/core/types.ts:55](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/core/types.ts#L55)

***

### sourceId?

> `optional` **sourceId**: `string`

Defined in: [packages/agentos/src/memory/core/types.ts:48](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/core/types.ts#L48)

Back-reference to originating conversation, tool call, etc.

***

### sourceTimestamp

> **sourceTimestamp**: `number`

Defined in: [packages/agentos/src/memory/core/types.ts:50](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/core/types.ts#L50)

Timestamp of the original source information.

***

### sourceType

> **sourceType**: [`MemorySourceType`](../type-aliases/MemorySourceType.md)

Defined in: [packages/agentos/src/memory/core/types.ts:46](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/core/types.ts#L46)

***

### verificationCount

> **verificationCount**: `number`

Defined in: [packages/agentos/src/memory/core/types.ts:54](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/core/types.ts#L54)

How many times this memory has been externally confirmed.
