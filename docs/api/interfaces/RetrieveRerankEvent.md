# Interface: RetrieveRerankEvent

Defined in: [packages/agentos/src/orchestration/pipeline/query/types.ts:951](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/pipeline/query/types.ts#L951)

Emitted when reranking of retrieved chunks completes.

## Properties

### durationMs

> **durationMs**: `number`

Defined in: [packages/agentos/src/orchestration/pipeline/query/types.ts:958](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/pipeline/query/types.ts#L958)

Duration of reranking in milliseconds.

***

### inputCount

> **inputCount**: `number`

Defined in: [packages/agentos/src/orchestration/pipeline/query/types.ts:954](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/pipeline/query/types.ts#L954)

Number of chunks before reranking.

***

### outputCount

> **outputCount**: `number`

Defined in: [packages/agentos/src/orchestration/pipeline/query/types.ts:956](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/pipeline/query/types.ts#L956)

Number of chunks after reranking (may be fewer due to threshold filtering).

***

### timestamp

> **timestamp**: `number`

Defined in: [packages/agentos/src/orchestration/pipeline/query/types.ts:960](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/pipeline/query/types.ts#L960)

Timestamp of the event.

***

### type

> **type**: `"retrieve:rerank"`

Defined in: [packages/agentos/src/orchestration/pipeline/query/types.ts:952](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/pipeline/query/types.ts#L952)
