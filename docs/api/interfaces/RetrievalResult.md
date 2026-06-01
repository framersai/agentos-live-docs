# Interface: RetrievalResult

Defined in: [packages/agentos/src/orchestration/pipeline/query/types.ts:219](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/pipeline/query/types.ts#L219)

Aggregated result of the retrieval phase across all active retrieval
strategies (vector search, graph traversal, deep research).

## Properties

### chunks

> **chunks**: [`RetrievedChunk`](RetrievedChunk.md)[]

Defined in: [packages/agentos/src/orchestration/pipeline/query/types.ts:221](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/pipeline/query/types.ts#L221)

Retrieved content chunks, sorted by relevance (highest first).

***

### durationMs

> **durationMs**: `number`

Defined in: [packages/agentos/src/orchestration/pipeline/query/types.ts:236](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/pipeline/query/types.ts#L236)

Wall-clock duration of the retrieval phase in milliseconds.

***

### graphEntities?

> `optional` **graphEntities**: `object`[]

Defined in: [packages/agentos/src/orchestration/pipeline/query/types.ts:227](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/pipeline/query/types.ts#L227)

Entities discovered via knowledge graph traversal.
Present only when graph retrieval was used (tier >= 2).

#### description

> **description**: `string`

#### name

> **name**: `string`

#### type

> **type**: `string`

***

### researchSynthesis?

> `optional` **researchSynthesis**: `string`

Defined in: [packages/agentos/src/orchestration/pipeline/query/types.ts:233](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/pipeline/query/types.ts#L233)

Synthesized narrative from the deep research phase.
Present only when research retrieval was used (tier 3).
