# Interface: MultimodalIndexerConfig

Defined in: [packages/agentos/src/rag/multimodal/types.ts:334](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/rag/multimodal/types.ts#L334)

Configuration for the [MultimodalIndexer](../classes/MultimodalIndexer.md).

## Example

```typescript
const config: MultimodalIndexerConfig = {
  defaultCollection: 'knowledge-base',
  imageDescriptionPrompt: 'Describe this image for use in a search index.',
};
```

## Properties

### defaultCollection?

> `optional` **defaultCollection**: `string`

Defined in: [packages/agentos/src/rag/multimodal/types.ts:339](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/rag/multimodal/types.ts#L339)

Default vector store collection name for indexed content.

#### Default

```ts
'multimodal'
```

***

### imageDescriptionPrompt?

> `optional` **imageDescriptionPrompt**: `string`

Defined in: [packages/agentos/src/rag/multimodal/types.ts:345](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/rag/multimodal/types.ts#L345)

Custom prompt template for the vision LLM when describing images.
If omitted, a sensible default prompt is used.
