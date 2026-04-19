# Interface: MultimodalSearchOptions

Defined in: [packages/agentos/src/rag/multimodal/types.ts:166](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/rag/multimodal/types.ts#L166)

Options for cross-modal search.

## Example

```typescript
const results = await indexer.search('cats playing', {
  topK: 10,
  modalities: ['image', 'text'],
  collection: 'user-content',
});
```

## Properties

### collection?

> `optional` **collection**: `string`

Defined in: [packages/agentos/src/rag/multimodal/types.ts:183](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/rag/multimodal/types.ts#L183)

Vector store collection to search in.

#### Default

```ts
'multimodal'
```

***

### hyde?

> `optional` **hyde**: `object`

Defined in: [packages/agentos/src/rag/multimodal/types.ts:203](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/rag/multimodal/types.ts#L203)

HyDE (Hypothetical Document Embedding) configuration for this search.

When enabled, a hypothetical answer is generated from the query via LLM
and embedded instead of the raw query. This produces embeddings that are
semantically closer to stored document representations, improving recall
for vague or exploratory queries.

Requires a `HydeRetriever` to be set on the indexer via
[MultimodalIndexer.setHydeRetriever](../classes/MultimodalIndexer.md#sethyderetriever).

#### enabled?

> `optional` **enabled**: `boolean`

Whether to use HyDE for this search.

##### Default

```ts
false
```

#### hypothesis?

> `optional` **hypothesis**: `string`

Pre-generated hypothesis text (skips the LLM call).

#### Example

```typescript
const results = await indexer.search('architecture diagram', {
  hyde: { enabled: true },
});
```

***

### modalities?

> `optional` **modalities**: [`ContentModality`](../type-aliases/ContentModality.md)[]

Defined in: [packages/agentos/src/rag/multimodal/types.ts:177](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/rag/multimodal/types.ts#L177)

Filter results to specific modalities. If omitted or empty,
all modalities are searched.

***

### topK?

> `optional` **topK**: `number`

Defined in: [packages/agentos/src/rag/multimodal/types.ts:171](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/rag/multimodal/types.ts#L171)

Maximum number of results to return.

#### Default

```ts
5
```
