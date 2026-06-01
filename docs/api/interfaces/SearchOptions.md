# Interface: SearchOptions

Defined in: [packages/agentos/src/cognition/memory/AgentMemory.ts:87](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/AgentMemory.ts#L87)

## Properties

### limit?

> `optional` **limit**: `number`

Defined in: [packages/agentos/src/cognition/memory/AgentMemory.ts:89](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/AgentMemory.ts#L89)

Maximum results. Default: 10.

***

### minConfidence?

> `optional` **minConfidence**: `number`

Defined in: [packages/agentos/src/cognition/memory/AgentMemory.ts:95](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/AgentMemory.ts#L95)

Minimum confidence. Default: 0.

***

### policy?

> `optional` **policy**: [`MemoryRetrievalPolicy`](MemoryRetrievalPolicy.md)

Defined in: [packages/agentos/src/cognition/memory/AgentMemory.ts:103](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/AgentMemory.ts#L103)

Shared retrieval policy surface.

***

### tags?

> `optional` **tags**: `string`[]

Defined in: [packages/agentos/src/cognition/memory/AgentMemory.ts:93](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/AgentMemory.ts#L93)

Tags filter.

***

### types?

> `optional` **types**: [`MemoryType`](../type-aliases/MemoryType.md)[]

Defined in: [packages/agentos/src/cognition/memory/AgentMemory.ts:91](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/AgentMemory.ts#L91)

Memory type filter.

***

### usableFor?

> `optional` **usableFor**: [`TrustCapability`](../type-aliases/TrustCapability.md) \| [`TrustCapability`](../type-aliases/TrustCapability.md)[]

Defined in: [packages/agentos/src/cognition/memory/AgentMemory.ts:101](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/AgentMemory.ts#L101)

Restrict results to traces whose trust policy permits the listed
capability (or all of them when given an array). Use when the recall
is going into an auth-sensitive prompt or a fact-claim assertion.
