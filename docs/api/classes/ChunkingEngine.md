# Class: ChunkingEngine

Defined in: [packages/agentos/src/memory/io/ingestion/ChunkingEngine.ts:214](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/io/ingestion/ChunkingEngine.ts#L214)

Splits raw document text into an ordered array of `DocumentChunk` objects
suitable for embedding and storage in a vector index.

## Example

```typescript
const engine = new ChunkingEngine();
const chunks = await engine.chunk(content, { strategy: 'fixed', chunkSize: 512 });
```

## Constructors

### Constructor

> **new ChunkingEngine**(): `ChunkingEngine`

#### Returns

`ChunkingEngine`

## Methods

### chunk()

> **chunk**(`content`, `options`): `Promise`\<[`DocumentChunk`](../interfaces/DocumentChunk.md)[]\>

Defined in: [packages/agentos/src/memory/io/ingestion/ChunkingEngine.ts:229](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/io/ingestion/ChunkingEngine.ts#L229)

Chunks the provided `content` string according to the given `options`.

All strategy implementations are async to accommodate the optional
`embedFn` used by the semantic strategy.

#### Parameters

##### content

`string`

Full document text to split.

##### options

`ChunkOptions`

Chunking strategy and tuning parameters.

#### Returns

`Promise`\<[`DocumentChunk`](../interfaces/DocumentChunk.md)[]\>

Ordered array of `DocumentChunk` objects with sequential indices.
