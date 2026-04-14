# Interface: RetrieveRerankEvent

Defined in: [packages/agentos/src/query-router/types.ts:927](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/query-router/types.ts#L927)

Emitted when reranking of retrieved chunks completes.

## Properties

### durationMs

> **durationMs**: `number`

Defined in: [packages/agentos/src/query-router/types.ts:934](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/query-router/types.ts#L934)

Duration of reranking in milliseconds.

***

### inputCount

> **inputCount**: `number`

Defined in: [packages/agentos/src/query-router/types.ts:930](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/query-router/types.ts#L930)

Number of chunks before reranking.

***

### outputCount

> **outputCount**: `number`

Defined in: [packages/agentos/src/query-router/types.ts:932](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/query-router/types.ts#L932)

Number of chunks after reranking (may be fewer due to threshold filtering).

***

### timestamp

> **timestamp**: `number`

Defined in: [packages/agentos/src/query-router/types.ts:936](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/query-router/types.ts#L936)

Timestamp of the event.

***

### type

> **type**: `"retrieve:rerank"`

Defined in: [packages/agentos/src/query-router/types.ts:928](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/query-router/types.ts#L928)
