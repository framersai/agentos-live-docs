# Interface: MultimodalIndexerConfig

Defined in: [packages/agentos/src/cognition/rag/multimodal/types.ts:370](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/rag/multimodal/types.ts#L370)

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

Defined in: [packages/agentos/src/cognition/rag/multimodal/types.ts:375](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/rag/multimodal/types.ts#L375)

Default vector store collection name for indexed content.

#### Default

```ts
'multimodal'
```

***

### imageDescriptionPrompt?

> `optional` **imageDescriptionPrompt**: `string`

Defined in: [packages/agentos/src/cognition/rag/multimodal/types.ts:381](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/rag/multimodal/types.ts#L381)

Custom prompt template for the vision LLM when describing images.
If omitted, a sensible default prompt is used.
