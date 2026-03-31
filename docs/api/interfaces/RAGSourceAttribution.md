# Interface: RAGSourceAttribution

Defined in: [packages/agentos/src/rag/audit/RAGAuditTypes.ts:85](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/rag/audit/RAGAuditTypes.ts#L85)

Attribution to a specific source document/chunk.

## Properties

### chunkId

> **chunkId**: `string`

Defined in: [packages/agentos/src/rag/audit/RAGAuditTypes.ts:86](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/rag/audit/RAGAuditTypes.ts#L86)

***

### contentSnippet

> **contentSnippet**: `string`

Defined in: [packages/agentos/src/rag/audit/RAGAuditTypes.ts:91](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/rag/audit/RAGAuditTypes.ts#L91)

First 200 characters of chunk content.

***

### dataSourceId?

> `optional` **dataSourceId**: `string`

Defined in: [packages/agentos/src/rag/audit/RAGAuditTypes.ts:95](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/rag/audit/RAGAuditTypes.ts#L95)

Data source / collection this chunk came from.

***

### documentId

> **documentId**: `string`

Defined in: [packages/agentos/src/rag/audit/RAGAuditTypes.ts:87](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/rag/audit/RAGAuditTypes.ts#L87)

***

### metadata?

> `optional` **metadata**: `Record`\<`string`, `unknown`\>

Defined in: [packages/agentos/src/rag/audit/RAGAuditTypes.ts:97](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/rag/audit/RAGAuditTypes.ts#L97)

Chunk metadata.

***

### relevanceScore

> **relevanceScore**: `number`

Defined in: [packages/agentos/src/rag/audit/RAGAuditTypes.ts:93](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/rag/audit/RAGAuditTypes.ts#L93)

Similarity/relevance score (0–1).

***

### source?

> `optional` **source**: `string`

Defined in: [packages/agentos/src/rag/audit/RAGAuditTypes.ts:89](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/rag/audit/RAGAuditTypes.ts#L89)

Original source pointer (URL, file path, etc.).
