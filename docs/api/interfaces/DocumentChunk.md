# Interface: DocumentChunk

Defined in: [packages/agentos/src/memory/io/facade/types.ts:699](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/io/facade/types.ts#L699)

A single chunk produced by splitting a document.
Used internally and returned in `LoadedDocument.chunks`.

## Properties

### content

> **content**: `string`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:703](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/io/facade/types.ts#L703)

Text content of this chunk after extraction and cleaning.

***

### heading?

> `optional` **heading**: `string`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:718](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/io/facade/types.ts#L718)

Heading or section title that precedes this chunk, if detected.

***

### index

> **index**: `number`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:708](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/io/facade/types.ts#L708)

Zero-based chunk index within the parent document.

***

### metadata?

> `optional` **metadata**: `Record`\<`string`, `unknown`\>

Defined in: [packages/agentos/src/memory/io/facade/types.ts:723](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/io/facade/types.ts#L723)

Chunk-level metadata (e.g. bounding box, column number for layout mode).

***

### pageNumber?

> `optional` **pageNumber**: `number`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:713](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/io/facade/types.ts#L713)

Page number this chunk originates from (1-based, PDF/DOCX).
