# Interface: CorpusChunk

Defined in: [packages/agentos/src/query-router/types.ts:1204](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/query-router/types.ts#L1204)

A chunk of corpus content with optional pre-computed embedding.
Used during corpus ingestion into the vector store.

## Properties

### content

> **content**: `string`

Defined in: [packages/agentos/src/query-router/types.ts:1209](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/query-router/types.ts#L1209)

The text content of the chunk.

***

### embedding?

> `optional` **embedding**: `number`[]

Defined in: [packages/agentos/src/query-router/types.ts:1221](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/query-router/types.ts#L1221)

Pre-computed embedding vector. When present, the ingestion pipeline
can skip embedding generation for this chunk.

***

### heading

> **heading**: `string`

Defined in: [packages/agentos/src/query-router/types.ts:1212](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/query-router/types.ts#L1212)

Section heading or title the chunk belongs to.

***

### id

> **id**: `string`

Defined in: [packages/agentos/src/query-router/types.ts:1206](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/query-router/types.ts#L1206)

Unique identifier for the chunk.

***

### sourcePath

> **sourcePath**: `string`

Defined in: [packages/agentos/src/query-router/types.ts:1215](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/query-router/types.ts#L1215)

File path or document source path this chunk was extracted from.
