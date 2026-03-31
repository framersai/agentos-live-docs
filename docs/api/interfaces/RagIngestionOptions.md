# Interface: RagIngestionOptions

Defined in: [packages/agentos/src/rag/IRetrievalAugmentor.ts:55](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/rag/IRetrievalAugmentor.ts#L55)

Chunking options and ingestion-time overrides.

## Properties

### batchSize?

> `optional` **batchSize**: `number`

Defined in: [packages/agentos/src/rag/IRetrievalAugmentor.ts:88](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/rag/IRetrievalAugmentor.ts#L88)

Batch size for large ingestion jobs.

***

### chunkingStrategy?

> `optional` **chunkingStrategy**: `object`

Defined in: [packages/agentos/src/rag/IRetrievalAugmentor.ts:72](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/rag/IRetrievalAugmentor.ts#L72)

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

Defined in: [packages/agentos/src/rag/IRetrievalAugmentor.ts:67](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/rag/IRetrievalAugmentor.ts#L67)

Behavior when a document ID already exists.
- `overwrite`: replace the existing document/chunks (default).
- `skip`: ignore duplicate IDs.
- `error`: surface a validation error.

***

### embeddingModelId?

> `optional` **embeddingModelId**: `string`

Defined in: [packages/agentos/src/rag/IRetrievalAugmentor.ts:82](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/rag/IRetrievalAugmentor.ts#L82)

Embedding model identifier used when generating embeddings for this ingestion request.
When omitted the augmentor consults the service config / category defaults.

***

### personaId?

> `optional` **personaId**: `string`

Defined in: [packages/agentos/src/rag/IRetrievalAugmentor.ts:86](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/rag/IRetrievalAugmentor.ts#L86)

Optional persona identifier for personalization.

***

### processAsync?

> `optional` **processAsync**: `boolean`

Defined in: [packages/agentos/src/rag/IRetrievalAugmentor.ts:90](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/rag/IRetrievalAugmentor.ts#L90)

Whether to schedule ingestion asynchronously (future enhancement hook).

***

### targetDataSourceId?

> `optional` **targetDataSourceId**: `string`

Defined in: [packages/agentos/src/rag/IRetrievalAugmentor.ts:60](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/rag/IRetrievalAugmentor.ts#L60)

Explicit target data source ID.  If omitted, the augmentor falls back to the document-specified
`dataSourceId`, category behavior defaults, or system defaults.

***

### userId?

> `optional` **userId**: `string`

Defined in: [packages/agentos/src/rag/IRetrievalAugmentor.ts:84](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/rag/IRetrievalAugmentor.ts#L84)

Optional user identifier for auditing and personalization.
