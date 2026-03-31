# Interface: CorpusChunk

Defined in: [packages/agentos/src/query-router/types.ts:1190](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/query-router/types.ts#L1190)

A chunk of corpus content with optional pre-computed embedding.
Used during corpus ingestion into the vector store.

## Properties

### content

> **content**: `string`

Defined in: [packages/agentos/src/query-router/types.ts:1195](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/query-router/types.ts#L1195)

The text content of the chunk.

***

### embedding?

> `optional` **embedding**: `number`[]

Defined in: [packages/agentos/src/query-router/types.ts:1207](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/query-router/types.ts#L1207)

Pre-computed embedding vector. When present, the ingestion pipeline
can skip embedding generation for this chunk.

***

### heading

> **heading**: `string`

Defined in: [packages/agentos/src/query-router/types.ts:1198](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/query-router/types.ts#L1198)

Section heading or title the chunk belongs to.

***

### id

> **id**: `string`

Defined in: [packages/agentos/src/query-router/types.ts:1192](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/query-router/types.ts#L1192)

Unique identifier for the chunk.

***

### sourcePath

> **sourcePath**: `string`

Defined in: [packages/agentos/src/query-router/types.ts:1201](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/query-router/types.ts#L1201)

File path or document source path this chunk was extracted from.
