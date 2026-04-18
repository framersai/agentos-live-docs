# Interface: RagIngestionResult

Defined in: [packages/agentos/src/rag/IRetrievalAugmentor.ts:116](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/rag/IRetrievalAugmentor.ts#L116)

Result of an ingestion attempt.

## Properties

### effectiveDataSourceIds?

> `optional` **effectiveDataSourceIds**: `string`[]

Defined in: [packages/agentos/src/rag/IRetrievalAugmentor.ts:122](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/rag/IRetrievalAugmentor.ts#L122)

***

### errors?

> `optional` **errors**: `object`[]

Defined in: [packages/agentos/src/rag/IRetrievalAugmentor.ts:120](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/rag/IRetrievalAugmentor.ts#L120)

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

Defined in: [packages/agentos/src/rag/IRetrievalAugmentor.ts:118](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/rag/IRetrievalAugmentor.ts#L118)

***

### ingestedIds?

> `optional` **ingestedIds**: `string`[]

Defined in: [packages/agentos/src/rag/IRetrievalAugmentor.ts:119](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/rag/IRetrievalAugmentor.ts#L119)

***

### jobId?

> `optional` **jobId**: `string`

Defined in: [packages/agentos/src/rag/IRetrievalAugmentor.ts:121](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/rag/IRetrievalAugmentor.ts#L121)

***

### processedCount

> **processedCount**: `number`

Defined in: [packages/agentos/src/rag/IRetrievalAugmentor.ts:117](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/rag/IRetrievalAugmentor.ts#L117)
