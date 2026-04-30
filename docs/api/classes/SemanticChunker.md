# Class: SemanticChunker

Defined in: [packages/agentos/src/rag/chunking/SemanticChunker.ts:123](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/chunking/SemanticChunker.ts#L123)

Semantic text chunker that splits on natural boundaries instead of
fixed character counts.

Produces chunks that are more semantically coherent than fixed-size
splitting, improving retrieval quality by keeping related ideas together.

## Examples

```typescript
const chunker = new SemanticChunker({ targetSize: 800, overlap: 50 });
const chunks = chunker.chunk(markdownDocument);
for (const c of chunks) {
  console.log(`Chunk ${c.index} (${c.boundaryType}): ${c.text.length} chars`);
}
```

```typescript
const chunker = new SemanticChunker({
  targetSize: 1000,
  maxSize: 3000, // Allow larger chunks for code blocks
  preserveCodeBlocks: true,
});
const chunks = chunker.chunk(technicalDoc);
```

## Constructors

### Constructor

> **new SemanticChunker**(`config?`): `SemanticChunker`

Defined in: [packages/agentos/src/rag/chunking/SemanticChunker.ts:147](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/chunking/SemanticChunker.ts#L147)

Creates a new SemanticChunker.

#### Parameters

##### config?

[`SemanticChunkerConfig`](../interfaces/SemanticChunkerConfig.md)

Chunking configuration.

#### Returns

`SemanticChunker`

#### Example

```typescript
const chunker = new SemanticChunker({
  targetSize: 800,
  maxSize: 1500,
  overlap: 80,
});
```

## Methods

### chunk()

> **chunk**(`text`, `metadata?`): [`SemanticChunk`](../interfaces/SemanticChunk.md)[]

Defined in: [packages/agentos/src/rag/chunking/SemanticChunker.ts:185](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/chunking/SemanticChunker.ts#L185)

Splits text into semantically coherent chunks.

Pipeline:
1. Pre-process: extract code blocks (if `preserveCodeBlocks`)
2. Split by headings (if `respectHeadings`) — each heading starts a new section
3. Within sections, split by paragraphs (double newline)
4. If a paragraph exceeds `maxSize`, split by sentences
5. If a sentence exceeds `maxSize`, split at word boundaries (fixed fallback)
6. Merge small fragments (< `minSize`) with the previous chunk
7. Add overlap from the end of the previous chunk to each chunk

#### Parameters

##### text

`string`

The full text to chunk.

##### metadata?

`Record`\<`string`, `unknown`\>

Optional metadata attached to all chunks.

#### Returns

[`SemanticChunk`](../interfaces/SemanticChunk.md)[]

Array of chunks in order.

#### Throws

If text is empty.

#### Example

```typescript
const chunks = chunker.chunk(
  '# Introduction\n\nFirst paragraph.\n\n## Details\n\nSecond paragraph.',
  { source: 'docs/readme.md' },
);
// chunks[0].boundaryType === 'heading'
// chunks[0].text includes "# Introduction\n\nFirst paragraph."
```
