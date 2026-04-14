# Class: MultimodalIndexer

Defined in: [packages/agentos/src/rag/multimodal/MultimodalIndexer.ts:128](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/rag/multimodal/MultimodalIndexer.ts#L128)

Indexes non-text content (images, audio) into the vector store by
generating text descriptions and embeddings.

## Image indexing flow
1. If the image is a Buffer, convert to base64 data URL.
2. Send to the vision LLM to generate a text description.
3. Embed the description via the embedding manager.
4. Store in the vector store with `modality: 'image'` metadata.

## Audio indexing flow
1. Send the audio buffer to the STT provider for transcription.
2. Embed the transcript via the embedding manager.
3. Store in the vector store with `modality: 'audio'` metadata.

## Cross-modal search
1. Embed the text query via the embedding manager.
2. Query the vector store with optional modality filters.
3. Return results annotated with their source modality.

## Example

```typescript
import { MultimodalIndexer } from '@framers/agentos/rag/multimodal';

const indexer = new MultimodalIndexer({
  embeddingManager,
  vectorStore,
  visionProvider,
  sttProvider,
});

// Index an image
const imgResult = await indexer.indexImage({
  image: fs.readFileSync('./photo.jpg'),
  metadata: { source: 'upload' },
});

// Index audio
const audioResult = await indexer.indexAudio({
  audio: fs.readFileSync('./meeting.wav'),
  language: 'en',
});

// Search across all modalities
const results = await indexer.search('cats on a beach');
```

## Constructors

### Constructor

> **new MultimodalIndexer**(`deps`): `MultimodalIndexer`

Defined in: [packages/agentos/src/rag/multimodal/MultimodalIndexer.ts:204](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/rag/multimodal/MultimodalIndexer.ts#L204)

Create a new multimodal indexer.

#### Parameters

##### deps

Dependency injection container.

###### config?

[`MultimodalIndexerConfig`](../interfaces/MultimodalIndexerConfig.md)

Optional configuration overrides.

###### embeddingManager

[`IEmbeddingManager`](../interfaces/IEmbeddingManager.md)

Manager for generating text embeddings.

###### sttProvider?

[`ISpeechToTextProvider`](../interfaces/ISpeechToTextProvider.md)

Optional STT provider for audio transcription.

###### vectorStore

[`IVectorStore`](../interfaces/IVectorStore.md)

Vector store for document storage and search.

###### visionPipeline?

[`VisionPipeline`](VisionPipeline.md)

Optional full vision pipeline with OCR, handwriting,
  document understanding, CLIP embeddings, and cloud fallback. When provided,
  it is wrapped as an `IVisionProvider` via `PipelineVisionProvider`,
  overriding any `visionProvider` passed alongside it.

###### visionProvider?

[`IVisionProvider`](../interfaces/IVisionProvider.md)

Optional vision LLM for image description.

#### Returns

`MultimodalIndexer`

#### Throws

If embeddingManager or vectorStore is missing.

#### Example

```typescript
// With a simple vision LLM provider
const indexer = new MultimodalIndexer({
  embeddingManager,
  vectorStore,
  visionProvider: myVisionLLM,
  sttProvider: myWhisperService,
  config: { defaultCollection: 'knowledge' },
});

// With the full vision pipeline (recommended)
const indexer = new MultimodalIndexer({
  embeddingManager,
  vectorStore,
  visionPipeline: myVisionPipeline,
});
```

## Methods

### createMemoryBridge()

> **createMemoryBridge**(`memoryManager?`, `options?`): `MultimodalMemoryBridge`

Defined in: [packages/agentos/src/rag/multimodal/MultimodalIndexer.ts:598](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/rag/multimodal/MultimodalIndexer.ts#L598)

Create a `MultimodalMemoryBridge` using this indexer's providers.

The bridge extends this indexer's RAG capabilities with cognitive memory
integration, enabling multimodal content to be stored in both the vector
store (for search) and long-term memory (for recall during conversation).

#### Parameters

##### memoryManager?

[`ICognitiveMemoryManager`](../interfaces/ICognitiveMemoryManager.md)

Optional cognitive memory manager for memory trace creation.
  When omitted, the bridge still indexes into RAG but creates no memory traces.

##### options?

`MultimodalBridgeOptions`

Bridge configuration overrides (mood, chunk sizes, etc.)

#### Returns

`MultimodalMemoryBridge`

A configured multimodal memory bridge instance.

#### Example

```typescript
const bridge = indexer.createMemoryBridge(memoryManager, {
  enableMemory: true,
  defaultChunkSize: 800,
});

await bridge.ingestImage(imageBuffer, { source: 'user-upload' });
```

See `MultimodalMemoryBridge` for full documentation.

***

### indexAudio()

> **indexAudio**(`opts`): `Promise`\<[`AudioIndexResult`](../interfaces/AudioIndexResult.md)\>

Defined in: [packages/agentos/src/rag/multimodal/MultimodalIndexer.ts:394](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/rag/multimodal/MultimodalIndexer.ts#L394)

Index an audio file by transcribing via STT, then embedding and
storing the transcript.

#### Parameters

##### opts

[`AudioIndexOptions`](../interfaces/AudioIndexOptions.md)

Audio data, metadata, collection, and language options.

#### Returns

`Promise`\<[`AudioIndexResult`](../interfaces/AudioIndexResult.md)\>

The document ID and generated transcript.

#### Throws

If no STT provider is configured.

#### Throws

If the STT provider fails to transcribe.

#### Throws

If embedding generation or vector store upsert fails.

#### Example

```typescript
const result = await indexer.indexAudio({
  audio: fs.readFileSync('./podcast.mp3'),
  metadata: { source: 'podcast', episode: 42 },
  language: 'en',
});
console.log(result.transcript); // "Welcome to episode 42..."
```

***

### indexImage()

> **indexImage**(`opts`): `Promise`\<[`ImageIndexResult`](../interfaces/ImageIndexResult.md)\>

Defined in: [packages/agentos/src/rag/multimodal/MultimodalIndexer.ts:301](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/rag/multimodal/MultimodalIndexer.ts#L301)

Index an image by generating a text description via vision LLM,
then embedding and storing the description.

#### Parameters

##### opts

[`ImageIndexOptions`](../interfaces/ImageIndexOptions.md)

Image data, metadata, and collection options.

#### Returns

`Promise`\<[`ImageIndexResult`](../interfaces/ImageIndexResult.md)\>

The document ID and generated description.

#### Throws

If no vision provider is configured.

#### Throws

If the vision LLM fails to describe the image.

#### Throws

If embedding generation or vector store upsert fails.

#### Example

```typescript
const result = await indexer.indexImage({
  image: 'https://example.com/photo.jpg',
  metadata: { source: 'web-scrape', url: 'https://example.com' },
});
console.log(result.description); // "A golden retriever playing fetch..."
```

***

### search()

> **search**(`query`, `opts?`): `Promise`\<[`MultimodalSearchResult`](../interfaces/MultimodalSearchResult.md)[]\>

Defined in: [packages/agentos/src/rag/multimodal/MultimodalIndexer.ts:482](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/rag/multimodal/MultimodalIndexer.ts#L482)

Search across all modalities (text + image descriptions + audio transcripts).

The query text is embedded, then the vector store is searched with
optional modality filtering. Results are returned with their source
modality indicated.

#### Parameters

##### query

`string`

Natural language search query.

##### opts?

[`MultimodalSearchOptions`](../interfaces/MultimodalSearchOptions.md)

Optional search parameters (topK, modalities, collection).

#### Returns

`Promise`\<[`MultimodalSearchResult`](../interfaces/MultimodalSearchResult.md)[]\>

Array of search results sorted by relevance score (descending).

#### Throws

If embedding generation fails.

#### Example

```typescript
// Search only image descriptions
const imageResults = await indexer.search('cats playing', {
  modalities: ['image'],
  topK: 10,
});

// Search across all modalities
const allResults = await indexer.search('machine learning tutorial');
```

***

### setHydeRetriever()

> **setHydeRetriever**(`retriever`): `void`

Defined in: [packages/agentos/src/rag/multimodal/MultimodalIndexer.ts:273](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/rag/multimodal/MultimodalIndexer.ts#L273)

Attach a HyDE retriever to enable hypothesis-driven multimodal search.

Once set, pass `hyde: { enabled: true }` in the `search()` options to
activate HyDE for that query. The retriever generates a hypothetical
answer using an LLM, then embeds that answer instead of the raw query
text, which typically yields better recall for exploratory queries.

#### Parameters

##### retriever

[`HydeRetriever`](HydeRetriever.md)

A pre-configured HydeRetriever instance.

#### Returns

`void`

#### Example

```typescript
indexer.setHydeRetriever(new HydeRetriever({
  llmCaller: myLlmCaller,
  embeddingManager: myEmbeddingManager,
  config: { enabled: true },
}));

const results = await indexer.search('cats on a beach', {
  hyde: { enabled: true },
});
```
