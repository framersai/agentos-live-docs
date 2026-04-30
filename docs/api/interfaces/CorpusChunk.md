# Interface: CorpusChunk

Defined in: [packages/agentos/src/query-router/types.ts:1215](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/query-router/types.ts#L1215)

A chunk of corpus content with optional pre-computed embedding.
Used during corpus ingestion into the vector store.

## Properties

### content

> **content**: `string`

Defined in: [packages/agentos/src/query-router/types.ts:1220](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/query-router/types.ts#L1220)

The text content of the chunk.

***

### embedding?

> `optional` **embedding**: `number`[]

Defined in: [packages/agentos/src/query-router/types.ts:1232](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/query-router/types.ts#L1232)

Pre-computed embedding vector. When present, the ingestion pipeline
can skip embedding generation for this chunk.

***

### heading

> **heading**: `string`

Defined in: [packages/agentos/src/query-router/types.ts:1223](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/query-router/types.ts#L1223)

Section heading or title the chunk belongs to.

***

### id

> **id**: `string`

Defined in: [packages/agentos/src/query-router/types.ts:1217](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/query-router/types.ts#L1217)

Unique identifier for the chunk.

***

### sourcePath

> **sourcePath**: `string`

Defined in: [packages/agentos/src/query-router/types.ts:1226](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/query-router/types.ts#L1226)

File path or document source path this chunk was extracted from.
