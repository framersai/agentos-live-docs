# Interface: HydeMultiRetrievalResult

Defined in: [packages/agentos/src/rag/HydeRetriever.ts:147](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/rag/HydeRetriever.ts#L147)

Result from multi-hypothesis HyDE retrieval.

Contains all generated hypotheses and the deduplicated, merged result set
from searching with each hypothesis embedding.

## Interface

HydeMultiRetrievalResult

## Properties

### hypotheses

> **hypotheses**: `string`[]

Defined in: [packages/agentos/src/rag/HydeRetriever.ts:149](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/rag/HydeRetriever.ts#L149)

All generated hypotheses.

***

### hypothesisCount

> **hypothesisCount**: `number`

Defined in: [packages/agentos/src/rag/HydeRetriever.ts:153](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/rag/HydeRetriever.ts#L153)

Number of hypotheses generated.

***

### hypothesisLatencyMs

> **hypothesisLatencyMs**: `number`

Defined in: [packages/agentos/src/rag/HydeRetriever.ts:155](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/rag/HydeRetriever.ts#L155)

Total time for all hypothesis generations (ms).

***

### queryResult

> **queryResult**: [`QueryResult`](QueryResult.md)

Defined in: [packages/agentos/src/rag/HydeRetriever.ts:151](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/rag/HydeRetriever.ts#L151)

Deduplicated query result (union of all hypothesis searches, highest score per doc).

***

### retrievalLatencyMs

> **retrievalLatencyMs**: `number`

Defined in: [packages/agentos/src/rag/HydeRetriever.ts:157](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/rag/HydeRetriever.ts#L157)

Total time for all embedding + retrieval passes (ms).
