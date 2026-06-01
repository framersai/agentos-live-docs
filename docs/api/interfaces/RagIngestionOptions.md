# Interface: RagIngestionOptions

Defined in: [packages/agentos/src/cognition/rag/IRetrievalAugmentor.ts:88](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/rag/IRetrievalAugmentor.ts#L88)

Chunking options and ingestion-time overrides.

## Properties

### batchSize?

> `optional` **batchSize**: `number`

Defined in: [packages/agentos/src/cognition/rag/IRetrievalAugmentor.ts:121](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/rag/IRetrievalAugmentor.ts#L121)

Batch size for large ingestion jobs.

***

### chunkingStrategy?

> `optional` **chunkingStrategy**: `object`

Defined in: [packages/agentos/src/cognition/rag/IRetrievalAugmentor.ts:105](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/rag/IRetrievalAugmentor.ts#L105)

Chunking configuration.  `strategySpecificParams` allows pluggable implementations to carry
provider-specific hints without widening the base interface each time.

#### chunkOverlap?

> `optional` **chunkOverlap**: `number`

#### chunkSize?

> `optional` **chunkSize**: `number`

#### strategySpecificParams?

> `optional` **strategySpecificParams**: `Record`\<`string`, `any`\>

#### type

> **type**: `"none"` \| `"semantic"` \| `"fixed_size"` \| `"recursive_character"`

***

### duplicateHandling?

> `optional` **duplicateHandling**: `"error"` \| `"overwrite"` \| `"skip"`

Defined in: [packages/agentos/src/cognition/rag/IRetrievalAugmentor.ts:100](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/rag/IRetrievalAugmentor.ts#L100)

Behavior when a document ID already exists.
- `overwrite`: replace the existing document/chunks (default).
- `skip`: ignore duplicate IDs.
- `error`: surface a validation error.

***

### embeddingModelId?

> `optional` **embeddingModelId**: `string`

Defined in: [packages/agentos/src/cognition/rag/IRetrievalAugmentor.ts:115](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/rag/IRetrievalAugmentor.ts#L115)

Embedding model identifier used when generating embeddings for this ingestion request.
When omitted the augmentor consults the service config / category defaults.

***

### personaId?

> `optional` **personaId**: `string`

Defined in: [packages/agentos/src/cognition/rag/IRetrievalAugmentor.ts:119](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/rag/IRetrievalAugmentor.ts#L119)

Optional persona identifier for personalization.

***

### processAsync?

> `optional` **processAsync**: `boolean`

Defined in: [packages/agentos/src/cognition/rag/IRetrievalAugmentor.ts:123](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/rag/IRetrievalAugmentor.ts#L123)

Whether to schedule ingestion asynchronously (future enhancement hook).

***

### targetDataSourceId?

> `optional` **targetDataSourceId**: `string`

Defined in: [packages/agentos/src/cognition/rag/IRetrievalAugmentor.ts:93](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/rag/IRetrievalAugmentor.ts#L93)

Explicit target data source ID.  If omitted, the augmentor falls back to the document-specified
`dataSourceId`, category behavior defaults, or system defaults.

***

### userId?

> `optional` **userId**: `string`

Defined in: [packages/agentos/src/cognition/rag/IRetrievalAugmentor.ts:117](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/rag/IRetrievalAugmentor.ts#L117)

Optional user identifier for auditing and personalization.
