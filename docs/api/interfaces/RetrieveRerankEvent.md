# Interface: RetrieveRerankEvent

Defined in: [packages/agentos/src/query-router/types.ts:938](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/query-router/types.ts#L938)

Emitted when reranking of retrieved chunks completes.

## Properties

### durationMs

> **durationMs**: `number`

Defined in: [packages/agentos/src/query-router/types.ts:945](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/query-router/types.ts#L945)

Duration of reranking in milliseconds.

***

### inputCount

> **inputCount**: `number`

Defined in: [packages/agentos/src/query-router/types.ts:941](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/query-router/types.ts#L941)

Number of chunks before reranking.

***

### outputCount

> **outputCount**: `number`

Defined in: [packages/agentos/src/query-router/types.ts:943](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/query-router/types.ts#L943)

Number of chunks after reranking (may be fewer due to threshold filtering).

***

### timestamp

> **timestamp**: `number`

Defined in: [packages/agentos/src/query-router/types.ts:947](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/query-router/types.ts#L947)

Timestamp of the event.

***

### type

> **type**: `"retrieve:rerank"`

Defined in: [packages/agentos/src/query-router/types.ts:939](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/query-router/types.ts#L939)
