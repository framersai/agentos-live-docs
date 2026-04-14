# Interface: MultimodalIndexerFromResolverOptions

Defined in: [packages/agentos/src/rag/multimodal/createMultimodalIndexerFromResolver.ts:88](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/rag/multimodal/createMultimodalIndexerFromResolver.ts#L88)

Options for [createMultimodalIndexerFromResolver](../functions/createMultimodalIndexerFromResolver.md).

At minimum, `embeddingManager` and `vectorStore` are required (same as
the raw `MultimodalIndexer` constructor). The resolver, vision pipeline,
and config are all optional — omitting them simply disables the
corresponding modality.

## Example

```typescript
const opts: MultimodalIndexerFromResolverOptions = {
  resolver: speechResolver,
  visionPipeline: pipeline,
  embeddingManager,
  vectorStore,
  config: { defaultCollection: 'knowledge-base' },
};
```

## Properties

### config?

> `optional` **config**: [`MultimodalIndexerConfig`](MultimodalIndexerConfig.md)

Defined in: [packages/agentos/src/rag/multimodal/createMultimodalIndexerFromResolver.ts:130](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/rag/multimodal/createMultimodalIndexerFromResolver.ts#L130)

Optional indexer configuration overrides (collection name,
image description prompt, etc.).

***

### embeddingManager

> **embeddingManager**: [`IEmbeddingManager`](IEmbeddingManager.md)

Defined in: [packages/agentos/src/rag/multimodal/createMultimodalIndexerFromResolver.ts:118](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/rag/multimodal/createMultimodalIndexerFromResolver.ts#L118)

Embedding manager for generating vector representations.
Required — passed through to the `MultimodalIndexer` constructor.

***

### resolver?

> `optional` **resolver**: [`SpeechProviderResolver`](../classes/SpeechProviderResolver.md)

Defined in: [packages/agentos/src/rag/multimodal/createMultimodalIndexerFromResolver.ts:94](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/rag/multimodal/createMultimodalIndexerFromResolver.ts#L94)

The speech provider resolver from the voice pipeline.
Used to obtain the best available STT provider.
When omitted, audio indexing is unavailable.

***

### vectorStore

> **vectorStore**: [`IVectorStore`](IVectorStore.md)

Defined in: [packages/agentos/src/rag/multimodal/createMultimodalIndexerFromResolver.ts:124](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/rag/multimodal/createMultimodalIndexerFromResolver.ts#L124)

Vector store for persistent document storage and search.
Required — passed through to the `MultimodalIndexer` constructor.

***

### visionPipeline?

> `optional` **visionPipeline**: [`VisionPipeline`](../classes/VisionPipeline.md)

Defined in: [packages/agentos/src/rag/multimodal/createMultimodalIndexerFromResolver.ts:105](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/rag/multimodal/createMultimodalIndexerFromResolver.ts#L105)

Vision pipeline for multi-tier image processing.
When provided, it is wrapped as an `IVisionProvider` via
`PipelineVisionProvider`, giving the indexer the full
progressive OCR + cloud fallback pipeline.

Mutually exclusive with `visionProvider` — if both are set,
`visionPipeline` takes precedence.

***

### visionProvider?

> `optional` **visionProvider**: [`IVisionProvider`](IVisionProvider.md)

Defined in: [packages/agentos/src/rag/multimodal/createMultimodalIndexerFromResolver.ts:112](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/rag/multimodal/createMultimodalIndexerFromResolver.ts#L112)

Pre-built vision provider to use instead of a pipeline.
Useful when the caller already has a configured LLMVisionProvider
or custom implementation. Ignored when `visionPipeline` is set.
