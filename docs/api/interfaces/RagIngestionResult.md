# Interface: RagIngestionResult

Defined in: [packages/agentos/src/cognition/rag/IRetrievalAugmentor.ts:170](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/rag/IRetrievalAugmentor.ts#L170)

Result of an ingestion attempt.

## Properties

### effectiveDataSourceIds?

> `optional` **effectiveDataSourceIds**: `string`[]

Defined in: [packages/agentos/src/cognition/rag/IRetrievalAugmentor.ts:176](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/rag/IRetrievalAugmentor.ts#L176)

***

### errors?

> `optional` **errors**: `object`[]

Defined in: [packages/agentos/src/cognition/rag/IRetrievalAugmentor.ts:174](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/rag/IRetrievalAugmentor.ts#L174)

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

Defined in: [packages/agentos/src/cognition/rag/IRetrievalAugmentor.ts:172](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/rag/IRetrievalAugmentor.ts#L172)

***

### ingestedIds?

> `optional` **ingestedIds**: `string`[]

Defined in: [packages/agentos/src/cognition/rag/IRetrievalAugmentor.ts:173](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/rag/IRetrievalAugmentor.ts#L173)

***

### jobId?

> `optional` **jobId**: `string`

Defined in: [packages/agentos/src/cognition/rag/IRetrievalAugmentor.ts:175](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/rag/IRetrievalAugmentor.ts#L175)

***

### processedCount

> **processedCount**: `number`

Defined in: [packages/agentos/src/cognition/rag/IRetrievalAugmentor.ts:171](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/rag/IRetrievalAugmentor.ts#L171)
