# Interface: CorpusChunk

Defined in: [packages/agentos/src/orchestration/pipeline/query/types.ts:1228](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/pipeline/query/types.ts#L1228)

A chunk of corpus content with optional pre-computed embedding.
Used during corpus ingestion into the vector store.

## Properties

### content

> **content**: `string`

Defined in: [packages/agentos/src/orchestration/pipeline/query/types.ts:1233](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/pipeline/query/types.ts#L1233)

The text content of the chunk.

***

### embedding?

> `optional` **embedding**: `number`[]

Defined in: [packages/agentos/src/orchestration/pipeline/query/types.ts:1245](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/pipeline/query/types.ts#L1245)

Pre-computed embedding vector. When present, the ingestion pipeline
can skip embedding generation for this chunk.

***

### heading

> **heading**: `string`

Defined in: [packages/agentos/src/orchestration/pipeline/query/types.ts:1236](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/pipeline/query/types.ts#L1236)

Section heading or title the chunk belongs to.

***

### id

> **id**: `string`

Defined in: [packages/agentos/src/orchestration/pipeline/query/types.ts:1230](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/pipeline/query/types.ts#L1230)

Unique identifier for the chunk.

***

### sourcePath

> **sourcePath**: `string`

Defined in: [packages/agentos/src/orchestration/pipeline/query/types.ts:1239](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/pipeline/query/types.ts#L1239)

File path or document source path this chunk was extracted from.
