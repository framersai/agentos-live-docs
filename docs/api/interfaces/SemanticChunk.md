# Interface: SemanticChunk

Defined in: [packages/agentos/src/rag/chunking/SemanticChunker.ts:56](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/rag/chunking/SemanticChunker.ts#L56)

A semantically coherent text chunk produced by the chunker.

## Interface

SemanticChunk

## Properties

### boundaryType

> **boundaryType**: [`BoundaryType`](../type-aliases/BoundaryType.md)

Defined in: [packages/agentos/src/rag/chunking/SemanticChunker.ts:66](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/rag/chunking/SemanticChunker.ts#L66)

Type of boundary that determined this chunk's split.

***

### endOffset

> **endOffset**: `number`

Defined in: [packages/agentos/src/rag/chunking/SemanticChunker.ts:64](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/rag/chunking/SemanticChunker.ts#L64)

Character offset in the original text where this chunk ends.

***

### index

> **index**: `number`

Defined in: [packages/agentos/src/rag/chunking/SemanticChunker.ts:60](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/rag/chunking/SemanticChunker.ts#L60)

0-based sequence index within the chunked document.

***

### metadata?

> `optional` **metadata**: `Record`\<`string`, `unknown`\>

Defined in: [packages/agentos/src/rag/chunking/SemanticChunker.ts:68](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/rag/chunking/SemanticChunker.ts#L68)

Pass-through metadata from the caller.

***

### startOffset

> **startOffset**: `number`

Defined in: [packages/agentos/src/rag/chunking/SemanticChunker.ts:62](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/rag/chunking/SemanticChunker.ts#L62)

Character offset in the original text where this chunk begins.

***

### text

> **text**: `string`

Defined in: [packages/agentos/src/rag/chunking/SemanticChunker.ts:58](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/rag/chunking/SemanticChunker.ts#L58)

The chunk text content (may include overlap prefix).
