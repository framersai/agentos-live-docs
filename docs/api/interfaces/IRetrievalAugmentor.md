# Interface: IRetrievalAugmentor

Defined in: [packages/agentos/src/cognition/rag/IRetrievalAugmentor.ts:340](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/rag/IRetrievalAugmentor.ts#L340)

Primary contract for the Retrieval Augmentor implementation.

## Properties

### augmenterId

> `readonly` **augmenterId**: `string`

Defined in: [packages/agentos/src/cognition/rag/IRetrievalAugmentor.ts:341](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/rag/IRetrievalAugmentor.ts#L341)

## Methods

### checkHealth()

> **checkHealth**(): `Promise`\<\{ `details?`: `Record`\<`string`, `unknown`\>; `isHealthy`: `boolean`; \}\>

Defined in: [packages/agentos/src/cognition/rag/IRetrievalAugmentor.ts:379](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/rag/IRetrievalAugmentor.ts#L379)

#### Returns

`Promise`\<\{ `details?`: `Record`\<`string`, `unknown`\>; `isHealthy`: `boolean`; \}\>

***

### deleteDocuments()

> **deleteDocuments**(`documentIds`, `dataSourceId?`, `options?`): `Promise`\<\{ `errors?`: `object`[]; `failureCount`: `number`; `successCount`: `number`; \}\>

Defined in: [packages/agentos/src/cognition/rag/IRetrievalAugmentor.ts:368](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/rag/IRetrievalAugmentor.ts#L368)

#### Parameters

##### documentIds

`string`[]

##### dataSourceId?

`string`

##### options?

###### ignoreNotFound?

`boolean`

#### Returns

`Promise`\<\{ `errors?`: `object`[]; `failureCount`: `number`; `successCount`: `number`; \}\>

***

### embedTexts()

> **embedTexts**(`texts`): `Promise`\<`number`[][]\>

Defined in: [packages/agentos/src/cognition/rag/IRetrievalAugmentor.ts:366](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/rag/IRetrievalAugmentor.ts#L366)

Batch-embed a list of texts using the same embedding model the augmentor
uses for retrieval. Exposed so consumers (e.g. [CitationVerifier](../classes/CitationVerifier.md)
via the agent-level `verifyCitations: { retrievalAugmentor }` shortcut)
can share a single embedding pipeline rather than wiring an embedder
twice with potentially-divergent model configs.

#### Parameters

##### texts

`string`[]

#### Returns

`Promise`\<`number`[][]\>

***

### ingestDocuments()

> **ingestDocuments**(`documents`, `options?`): `Promise`\<[`RagIngestionResult`](RagIngestionResult.md)\>

Defined in: [packages/agentos/src/cognition/rag/IRetrievalAugmentor.ts:349](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/rag/IRetrievalAugmentor.ts#L349)

#### Parameters

##### documents

[`RagDocumentInput`](RagDocumentInput.md) | [`RagDocumentInput`](RagDocumentInput.md)[]

##### options?

[`RagIngestionOptions`](RagIngestionOptions.md)

#### Returns

`Promise`\<[`RagIngestionResult`](RagIngestionResult.md)\>

***

### initialize()

> **initialize**(`config`, `embeddingManager`, `vectorStoreManager`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/cognition/rag/IRetrievalAugmentor.ts:343](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/rag/IRetrievalAugmentor.ts#L343)

#### Parameters

##### config

`RetrievalAugmentorServiceConfig`

##### embeddingManager

[`IEmbeddingManager`](IEmbeddingManager.md)

##### vectorStoreManager

[`IVectorStoreManager`](IVectorStoreManager.md)

#### Returns

`Promise`\<`void`\>

***

### retrieveContext()

> **retrieveContext**(`queryText`, `options?`): `Promise`\<[`RagRetrievalResult`](RagRetrievalResult.md)\>

Defined in: [packages/agentos/src/cognition/rag/IRetrievalAugmentor.ts:354](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/rag/IRetrievalAugmentor.ts#L354)

#### Parameters

##### queryText

`string`

##### options?

[`RagRetrievalOptions`](RagRetrievalOptions.md)

#### Returns

`Promise`\<[`RagRetrievalResult`](RagRetrievalResult.md)\>

***

### shutdown()

> **shutdown**(): `Promise`\<`void`\>

Defined in: [packages/agentos/src/cognition/rag/IRetrievalAugmentor.ts:381](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/rag/IRetrievalAugmentor.ts#L381)

#### Returns

`Promise`\<`void`\>

***

### updateDocuments()

> **updateDocuments**(`documents`, `options?`): `Promise`\<[`RagIngestionResult`](RagIngestionResult.md)\>

Defined in: [packages/agentos/src/cognition/rag/IRetrievalAugmentor.ts:374](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/rag/IRetrievalAugmentor.ts#L374)

#### Parameters

##### documents

[`RagDocumentInput`](RagDocumentInput.md) | [`RagDocumentInput`](RagDocumentInput.md)[]

##### options?

[`RagIngestionOptions`](RagIngestionOptions.md)

#### Returns

`Promise`\<[`RagIngestionResult`](RagIngestionResult.md)\>
