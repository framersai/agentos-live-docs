# Interface: GraphRAGSearchOptions

Defined in: [packages/agentos/src/memory/retrieval/graph/graphrag/IGraphRAG.ts:91](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/retrieval/graph/graphrag/IGraphRAG.ts#L91)

## Properties

### auditCollector?

> `optional` **auditCollector**: [`RAGAuditCollector`](../classes/RAGAuditCollector.md)

Defined in: [packages/agentos/src/memory/retrieval/graph/graphrag/IGraphRAG.ts:105](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/retrieval/graph/graphrag/IGraphRAG.ts#L105)

Optional audit collector for transparent RAG operation tracking.

***

### communityLevels?

> `optional` **communityLevels**: `number`[]

Defined in: [packages/agentos/src/memory/retrieval/graph/graphrag/IGraphRAG.ts:97](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/retrieval/graph/graphrag/IGraphRAG.ts#L97)

Specific community levels to search

***

### includeEntities?

> `optional` **includeEntities**: `boolean`

Defined in: [packages/agentos/src/memory/retrieval/graph/graphrag/IGraphRAG.ts:99](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/retrieval/graph/graphrag/IGraphRAG.ts#L99)

Include entity details in results

***

### includeRelationships?

> `optional` **includeRelationships**: `boolean`

Defined in: [packages/agentos/src/memory/retrieval/graph/graphrag/IGraphRAG.ts:101](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/retrieval/graph/graphrag/IGraphRAG.ts#L101)

Include relationship details in results

***

### metadataFilter?

> `optional` **metadataFilter**: `Record`\<`string`, [`MetadataValue`](../type-aliases/MetadataValue.md)\>

Defined in: [packages/agentos/src/memory/retrieval/graph/graphrag/IGraphRAG.ts:103](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/retrieval/graph/graphrag/IGraphRAG.ts#L103)

Metadata filter for source documents

***

### minRelevance?

> `optional` **minRelevance**: `number`

Defined in: [packages/agentos/src/memory/retrieval/graph/graphrag/IGraphRAG.ts:95](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/retrieval/graph/graphrag/IGraphRAG.ts#L95)

Minimum relevance score (0-1)

***

### topK?

> `optional` **topK**: `number`

Defined in: [packages/agentos/src/memory/retrieval/graph/graphrag/IGraphRAG.ts:93](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/retrieval/graph/graphrag/IGraphRAG.ts#L93)

Maximum number of results
