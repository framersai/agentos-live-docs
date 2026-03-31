# Function: createMultimodalIndexerFromResolver()

> **createMultimodalIndexerFromResolver**(`opts`): [`MultimodalIndexer`](../classes/MultimodalIndexer.md)

Defined in: [packages/agentos/src/rag/multimodal/createMultimodalIndexerFromResolver.ts:190](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/rag/multimodal/createMultimodalIndexerFromResolver.ts#L190)

Create a [MultimodalIndexer](../classes/MultimodalIndexer.md) that reuses providers from the
voice pipeline's `SpeechProviderResolver` and an optional
`VisionPipeline`.

This is the recommended way to instantiate a multimodal indexer in
applications that also use the voice pipeline — it ensures both
subsystems share the same STT and vision providers instead of
requiring separate configuration.

## Error handling

- If the resolver has no configured STT provider, `resolveSTT()` will
  throw. This function catches that error and simply leaves the STT
  slot empty — audio indexing will throw at call time, not at
  construction time. This makes the factory safe to call even when
  STT is not configured.

- If neither `visionPipeline` nor `visionProvider` is provided, image
  indexing will throw at call time.

## Parameters

### opts

[`MultimodalIndexerFromResolverOptions`](../interfaces/MultimodalIndexerFromResolverOptions.md)

Factory options including resolver, pipeline, and
  required embedding/vector store dependencies.

## Returns

[`MultimodalIndexer`](../classes/MultimodalIndexer.md)

A configured `MultimodalIndexer` instance.

## Throws

If `embeddingManager` or `vectorStore` is missing
  (propagated from `MultimodalIndexer` constructor).

## Example

```typescript
// Full setup: shared STT + vision
const indexer = createMultimodalIndexerFromResolver({
  resolver: speechResolver,
  visionPipeline: pipeline,
  embeddingManager,
  vectorStore,
});

// Vision-only (no audio indexing)
const visionIndexer = createMultimodalIndexerFromResolver({
  visionPipeline: pipeline,
  embeddingManager,
  vectorStore,
});

// STT-only (no image indexing)
const audioIndexer = createMultimodalIndexerFromResolver({
  resolver: speechResolver,
  embeddingManager,
  vectorStore,
});
```
