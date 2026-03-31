# Interface: GraphRAGConfig

Defined in: [packages/agentos/src/memory/retrieval/graph/graphrag/IGraphRAG.ts:154](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/retrieval/graph/graphrag/IGraphRAG.ts#L154)

## Properties

### communityCollectionName?

> `optional` **communityCollectionName**: `string`

Defined in: [packages/agentos/src/memory/retrieval/graph/graphrag/IGraphRAG.ts:183](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/retrieval/graph/graphrag/IGraphRAG.ts#L183)

Collection name for community summary embeddings

***

### communityResolution?

> `optional` **communityResolution**: `number`

Defined in: [packages/agentos/src/memory/retrieval/graph/graphrag/IGraphRAG.ts:164](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/retrieval/graph/graphrag/IGraphRAG.ts#L164)

Louvain resolution parameter (higher = more communities)

***

### embeddingDimension?

> `optional` **embeddingDimension**: `number`

Defined in: [packages/agentos/src/memory/retrieval/graph/graphrag/IGraphRAG.ts:175](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/retrieval/graph/graphrag/IGraphRAG.ts#L175)

Embedding dimension for the selected embedding model.

Optional: when omitted and an `embeddingManager` is available, the engine will
probe the embedding dimension at runtime by generating a tiny embedding once.

***

### embeddingModelId?

> `optional` **embeddingModelId**: `string`

Defined in: [packages/agentos/src/memory/retrieval/graph/graphrag/IGraphRAG.ts:168](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/retrieval/graph/graphrag/IGraphRAG.ts#L168)

Embedding model ID to use

***

### engineId

> **engineId**: `string`

Defined in: [packages/agentos/src/memory/retrieval/graph/graphrag/IGraphRAG.ts:156](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/retrieval/graph/graphrag/IGraphRAG.ts#L156)

Unique ID for this GraphRAG engine instance

***

### entityCollectionName?

> `optional` **entityCollectionName**: `string`

Defined in: [packages/agentos/src/memory/retrieval/graph/graphrag/IGraphRAG.ts:181](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/retrieval/graph/graphrag/IGraphRAG.ts#L181)

Collection name for entity embeddings

***

### entityTypes?

> `optional` **entityTypes**: `string`[]

Defined in: [packages/agentos/src/memory/retrieval/graph/graphrag/IGraphRAG.ts:158](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/retrieval/graph/graphrag/IGraphRAG.ts#L158)

Entity types to extract (e.g., ['person', 'organization', 'concept'])

***

### generateEntityEmbeddings?

> `optional` **generateEntityEmbeddings**: `boolean`

Defined in: [packages/agentos/src/memory/retrieval/graph/graphrag/IGraphRAG.ts:166](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/retrieval/graph/graphrag/IGraphRAG.ts#L166)

Whether to generate embeddings for entities

***

### maxCommunityLevels?

> `optional` **maxCommunityLevels**: `number`

Defined in: [packages/agentos/src/memory/retrieval/graph/graphrag/IGraphRAG.ts:160](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/retrieval/graph/graphrag/IGraphRAG.ts#L160)

Maximum community hierarchy depth

***

### maxSummaryTokens?

> `optional` **maxSummaryTokens**: `number`

Defined in: [packages/agentos/src/memory/retrieval/graph/graphrag/IGraphRAG.ts:177](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/retrieval/graph/graphrag/IGraphRAG.ts#L177)

Maximum tokens for community summaries

***

### minCommunitySize?

> `optional` **minCommunitySize**: `number`

Defined in: [packages/agentos/src/memory/retrieval/graph/graphrag/IGraphRAG.ts:162](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/retrieval/graph/graphrag/IGraphRAG.ts#L162)

Minimum community size (entities) before splitting stops

***

### tablePrefix?

> `optional` **tablePrefix**: `string`

Defined in: [packages/agentos/src/memory/retrieval/graph/graphrag/IGraphRAG.ts:185](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/retrieval/graph/graphrag/IGraphRAG.ts#L185)

SQL table prefix for persistence

***

### vectorStoreProviderId?

> `optional` **vectorStoreProviderId**: `string`

Defined in: [packages/agentos/src/memory/retrieval/graph/graphrag/IGraphRAG.ts:179](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/retrieval/graph/graphrag/IGraphRAG.ts#L179)

Vector store provider ID for entity embeddings
