# Interface: UpsertOptions

Defined in: [packages/agentos/src/core/vector-store/IVectorStore.ts:193](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/vector-store/IVectorStore.ts#L193)

Options for a vector store upsert (insert or update) operation.

## Interface

UpsertOptions

## Properties

### batchSize?

> `optional` **batchSize**: `number`

Defined in: [packages/agentos/src/core/vector-store/IVectorStore.ts:194](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/vector-store/IVectorStore.ts#L194)

Preferred batch size for upserting multiple documents, if the provider supports batching.

***

### customParams?

> `optional` **customParams**: `Record`\<`string`, `any`\>

Defined in: [packages/agentos/src/core/vector-store/IVectorStore.ts:196](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/vector-store/IVectorStore.ts#L196)

Provider-specific parameters for the upsert operation.

***

### overwrite?

> `optional` **overwrite**: `boolean`

Defined in: [packages/agentos/src/core/vector-store/IVectorStore.ts:195](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/vector-store/IVectorStore.ts#L195)

Whether to overwrite existing documents with the same ID.
