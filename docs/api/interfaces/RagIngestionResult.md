# Interface: RagIngestionResult

Defined in: [packages/agentos/src/rag/IRetrievalAugmentor.ts:118](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/IRetrievalAugmentor.ts#L118)

Result of an ingestion attempt.

## Properties

### effectiveDataSourceIds?

> `optional` **effectiveDataSourceIds**: `string`[]

Defined in: [packages/agentos/src/rag/IRetrievalAugmentor.ts:124](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/IRetrievalAugmentor.ts#L124)

***

### errors?

> `optional` **errors**: `object`[]

Defined in: [packages/agentos/src/rag/IRetrievalAugmentor.ts:122](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/IRetrievalAugmentor.ts#L122)

#### chunkId?

> `optional` **chunkId**: `string`

#### details?

> `optional` **details**: `unknown`

#### documentId?

> `optional` **documentId**: `string`

#### message

> **message**: `string`

***

### failedCount

> **failedCount**: `number`

Defined in: [packages/agentos/src/rag/IRetrievalAugmentor.ts:120](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/IRetrievalAugmentor.ts#L120)

***

### ingestedIds?

> `optional` **ingestedIds**: `string`[]

Defined in: [packages/agentos/src/rag/IRetrievalAugmentor.ts:121](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/IRetrievalAugmentor.ts#L121)

***

### jobId?

> `optional` **jobId**: `string`

Defined in: [packages/agentos/src/rag/IRetrievalAugmentor.ts:123](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/IRetrievalAugmentor.ts#L123)

***

### processedCount

> **processedCount**: `number`

Defined in: [packages/agentos/src/rag/IRetrievalAugmentor.ts:119](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/IRetrievalAugmentor.ts#L119)
