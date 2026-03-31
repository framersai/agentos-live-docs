# Interface: SemanticChunkerConfig

Defined in: [packages/agentos/src/rag/chunking/SemanticChunker.ts:30](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/rag/chunking/SemanticChunker.ts#L30)

Configuration for the semantic chunker.

## Interface

SemanticChunkerConfig

## Properties

### maxSize?

> `optional` **maxSize**: `number`

Defined in: [packages/agentos/src/rag/chunking/SemanticChunker.ts:34](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/rag/chunking/SemanticChunker.ts#L34)

Maximum chunk size — hard limit before forced splitting. Default: 2000.

***

### minSize?

> `optional` **minSize**: `number`

Defined in: [packages/agentos/src/rag/chunking/SemanticChunker.ts:36](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/rag/chunking/SemanticChunker.ts#L36)

Minimum chunk size — fragments below this merge with previous. Default: 200.

***

### overlap?

> `optional` **overlap**: `number`

Defined in: [packages/agentos/src/rag/chunking/SemanticChunker.ts:38](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/rag/chunking/SemanticChunker.ts#L38)

Overlap characters from previous chunk prepended for context. Default: 100.

***

### preserveCodeBlocks?

> `optional` **preserveCodeBlocks**: `boolean`

Defined in: [packages/agentos/src/rag/chunking/SemanticChunker.ts:40](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/rag/chunking/SemanticChunker.ts#L40)

Whether to detect and preserve fenced code blocks intact. Default: true.

***

### respectHeadings?

> `optional` **respectHeadings**: `boolean`

Defined in: [packages/agentos/src/rag/chunking/SemanticChunker.ts:42](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/rag/chunking/SemanticChunker.ts#L42)

Whether to detect markdown headings as chunk-start boundaries. Default: true.

***

### targetSize?

> `optional` **targetSize**: `number`

Defined in: [packages/agentos/src/rag/chunking/SemanticChunker.ts:32](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/rag/chunking/SemanticChunker.ts#L32)

Target chunk size in characters. Default: 1000.
