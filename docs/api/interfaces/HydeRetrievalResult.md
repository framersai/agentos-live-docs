# Interface: HydeRetrievalResult

Defined in: [packages/agentos/src/rag/HydeRetriever.ts:122](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/rag/HydeRetriever.ts#L122)

## Properties

### effectiveThreshold

> **effectiveThreshold**: `number`

Defined in: [packages/agentos/src/rag/HydeRetriever.ts:130](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/rag/HydeRetriever.ts#L130)

Final similarity threshold that produced results.

***

### hypothesis

> **hypothesis**: `string`

Defined in: [packages/agentos/src/rag/HydeRetriever.ts:124](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/rag/HydeRetriever.ts#L124)

The generated hypothesis used for embedding.

***

### hypothesisEmbedding

> **hypothesisEmbedding**: `number`[]

Defined in: [packages/agentos/src/rag/HydeRetriever.ts:126](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/rag/HydeRetriever.ts#L126)

The embedding of the hypothesis.

***

### hypothesisLatencyMs

> **hypothesisLatencyMs**: `number`

Defined in: [packages/agentos/src/rag/HydeRetriever.ts:134](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/rag/HydeRetriever.ts#L134)

Time taken for hypothesis generation (ms).

***

### queryResult

> **queryResult**: [`QueryResult`](QueryResult.md)

Defined in: [packages/agentos/src/rag/HydeRetriever.ts:128](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/rag/HydeRetriever.ts#L128)

Vector store query result.

***

### retrievalLatencyMs

> **retrievalLatencyMs**: `number`

Defined in: [packages/agentos/src/rag/HydeRetriever.ts:136](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/rag/HydeRetriever.ts#L136)

Time taken for embedding + retrieval (ms).

***

### thresholdSteps

> **thresholdSteps**: `number`

Defined in: [packages/agentos/src/rag/HydeRetriever.ts:132](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/rag/HydeRetriever.ts#L132)

Number of threshold steps taken (0 = first try worked).
