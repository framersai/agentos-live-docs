# Interface: QueryOptions

Defined in: [packages/agentos/src/core/vector-store/IVectorStore.ts:126](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/vector-store/IVectorStore.ts#L126)

Options for a vector store query operation.

## Interface

QueryOptions

## Properties

### customParams?

> `optional` **customParams**: `Record`\<`string`, `any`\>

Defined in: [packages/agentos/src/core/vector-store/IVectorStore.ts:134](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/vector-store/IVectorStore.ts#L134)

Provider-specific parameters for the query.

***

### filter?

> `optional` **filter**: [`MetadataFilter`](../type-aliases/MetadataFilter.md)

Defined in: [packages/agentos/src/core/vector-store/IVectorStore.ts:128](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/vector-store/IVectorStore.ts#L128)

Metadata filter to apply to the search. Only documents matching
the filter will be considered.

***

### includeEmbedding?

> `optional` **includeEmbedding**: `boolean`

Defined in: [packages/agentos/src/core/vector-store/IVectorStore.ts:129](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/vector-store/IVectorStore.ts#L129)

Whether to include the embedding vector in the retrieved documents.

***

### includeMetadata?

> `optional` **includeMetadata**: `boolean`

Defined in: [packages/agentos/src/core/vector-store/IVectorStore.ts:130](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/vector-store/IVectorStore.ts#L130)

Whether to include metadata in the retrieved documents.

***

### includeTextContent?

> `optional` **includeTextContent**: `boolean`

Defined in: [packages/agentos/src/core/vector-store/IVectorStore.ts:131](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/vector-store/IVectorStore.ts#L131)

Whether to include the `textContent` in the retrieved documents.

***

### minSimilarityScore?

> `optional` **minSimilarityScore**: `number`

Defined in: [packages/agentos/src/core/vector-store/IVectorStore.ts:132](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/vector-store/IVectorStore.ts#L132)

Optional minimum similarity score (0-1, or specific to metric)
for a document to be included in the results. Interpretation depends on the store's similarity metric.

***

### topK?

> `optional` **topK**: `number`

Defined in: [packages/agentos/src/core/vector-store/IVectorStore.ts:127](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/vector-store/IVectorStore.ts#L127)

The number of most similar documents to retrieve.

***

### userId?

> `optional` **userId**: `string`

Defined in: [packages/agentos/src/core/vector-store/IVectorStore.ts:133](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/vector-store/IVectorStore.ts#L133)

Optional user ID, which might be used for multi-tenancy filters if the store supports it.
