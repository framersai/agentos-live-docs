# Interface: UpsertOptions

Defined in: [packages/agentos/src/core/vector-store/IVectorStore.ts:171](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/core/vector-store/IVectorStore.ts#L171)

Options for a vector store upsert (insert or update) operation.

## Interface

UpsertOptions

## Properties

### batchSize?

> `optional` **batchSize**: `number`

Defined in: [packages/agentos/src/core/vector-store/IVectorStore.ts:172](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/core/vector-store/IVectorStore.ts#L172)

Preferred batch size for upserting multiple documents, if the provider supports batching.

***

### customParams?

> `optional` **customParams**: `Record`\<`string`, `any`\>

Defined in: [packages/agentos/src/core/vector-store/IVectorStore.ts:174](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/core/vector-store/IVectorStore.ts#L174)

Provider-specific parameters for the upsert operation.

***

### overwrite?

> `optional` **overwrite**: `boolean`

Defined in: [packages/agentos/src/core/vector-store/IVectorStore.ts:173](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/core/vector-store/IVectorStore.ts#L173)

Whether to overwrite existing documents with the same ID.
