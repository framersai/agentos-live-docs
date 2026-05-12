# Interface: TypedNetworkRetrieveOptions

Defined in: [packages/agentos/src/memory/retrieval/typed-network/TypedNetworkRetriever.ts:71](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/retrieval/typed-network/TypedNetworkRetriever.ts#L71)

Per-query retrieval options.

## Properties

### queryEntities?

> `optional` **queryEntities**: `string`[]

Defined in: [packages/agentos/src/memory/retrieval/typed-network/TypedNetworkRetriever.ts:81](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/retrieval/typed-network/TypedNetworkRetriever.ts#L81)

Pre-extracted query entities. Pass when the consumer has done
its own entity extraction (e.g. via a stronger NER model);
skipping passes the query through [extractQueryEntities](../functions/extractQueryEntities.md).

***

### scope

> **scope**: `object`

Defined in: [packages/agentos/src/memory/retrieval/typed-network/TypedNetworkRetriever.ts:75](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/retrieval/typed-network/TypedNetworkRetriever.ts#L75)

Memory scope (matches the canonical retrieval scope).

#### scope

> **scope**: [`MemoryScope`](../type-aliases/MemoryScope.md)

#### scopeId

> **scopeId**: `string`

***

### topK

> **topK**: `number`

Defined in: [packages/agentos/src/memory/retrieval/typed-network/TypedNetworkRetriever.ts:73](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/retrieval/typed-network/TypedNetworkRetriever.ts#L73)

Top-K facts to return after activation ranking.
