# Interface: SearchOptions

Defined in: [packages/agentos/src/memory/AgentMemory.ts:86](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/AgentMemory.ts#L86)

## Properties

### limit?

> `optional` **limit**: `number`

Defined in: [packages/agentos/src/memory/AgentMemory.ts:88](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/AgentMemory.ts#L88)

Maximum results. Default: 10.

***

### minConfidence?

> `optional` **minConfidence**: `number`

Defined in: [packages/agentos/src/memory/AgentMemory.ts:94](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/AgentMemory.ts#L94)

Minimum confidence. Default: 0.

***

### policy?

> `optional` **policy**: [`MemoryRetrievalPolicy`](MemoryRetrievalPolicy.md)

Defined in: [packages/agentos/src/memory/AgentMemory.ts:96](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/AgentMemory.ts#L96)

Shared retrieval policy surface.

***

### tags?

> `optional` **tags**: `string`[]

Defined in: [packages/agentos/src/memory/AgentMemory.ts:92](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/AgentMemory.ts#L92)

Tags filter.

***

### types?

> `optional` **types**: [`MemoryType`](../type-aliases/MemoryType.md)[]

Defined in: [packages/agentos/src/memory/AgentMemory.ts:90](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/AgentMemory.ts#L90)

Memory type filter.
