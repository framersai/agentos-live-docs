# Interface: RetrieveRerankEvent

Defined in: [packages/agentos/src/query-router/types.ts:913](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/query-router/types.ts#L913)

Emitted when reranking of retrieved chunks completes.

## Properties

### durationMs

> **durationMs**: `number`

Defined in: [packages/agentos/src/query-router/types.ts:920](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/query-router/types.ts#L920)

Duration of reranking in milliseconds.

***

### inputCount

> **inputCount**: `number`

Defined in: [packages/agentos/src/query-router/types.ts:916](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/query-router/types.ts#L916)

Number of chunks before reranking.

***

### outputCount

> **outputCount**: `number`

Defined in: [packages/agentos/src/query-router/types.ts:918](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/query-router/types.ts#L918)

Number of chunks after reranking (may be fewer due to threshold filtering).

***

### timestamp

> **timestamp**: `number`

Defined in: [packages/agentos/src/query-router/types.ts:922](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/query-router/types.ts#L922)

Timestamp of the event.

***

### type

> **type**: `"retrieve:rerank"`

Defined in: [packages/agentos/src/query-router/types.ts:914](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/query-router/types.ts#L914)
