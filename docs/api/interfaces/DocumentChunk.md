# Interface: DocumentChunk

Defined in: [packages/agentos/src/memory/io/facade/types.ts:707](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/io/facade/types.ts#L707)

A single chunk produced by splitting a document.
Used internally and returned in `LoadedDocument.chunks`.

## Properties

### content

> **content**: `string`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:711](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/io/facade/types.ts#L711)

Text content of this chunk after extraction and cleaning.

***

### heading?

> `optional` **heading**: `string`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:726](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/io/facade/types.ts#L726)

Heading or section title that precedes this chunk, if detected.

***

### index

> **index**: `number`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:716](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/io/facade/types.ts#L716)

Zero-based chunk index within the parent document.

***

### metadata?

> `optional` **metadata**: `Record`\<`string`, `unknown`\>

Defined in: [packages/agentos/src/memory/io/facade/types.ts:731](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/io/facade/types.ts#L731)

Chunk-level metadata (e.g. bounding box, column number for layout mode).

***

### pageNumber?

> `optional` **pageNumber**: `number`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:721](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/io/facade/types.ts#L721)

Page number this chunk originates from (1-based, PDF/DOCX).
