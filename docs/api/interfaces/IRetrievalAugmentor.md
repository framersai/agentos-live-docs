# Interface: IRetrievalAugmentor

Defined in: [packages/agentos/src/rag/IRetrievalAugmentor.ts:255](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/IRetrievalAugmentor.ts#L255)

Primary contract for the Retrieval Augmentor implementation.

## Properties

### augmenterId

> `readonly` **augmenterId**: `string`

Defined in: [packages/agentos/src/rag/IRetrievalAugmentor.ts:256](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/IRetrievalAugmentor.ts#L256)

## Methods

### checkHealth()

> **checkHealth**(): `Promise`\<\{ `details?`: `Record`\<`string`, `unknown`\>; `isHealthy`: `boolean`; \}\>

Defined in: [packages/agentos/src/rag/IRetrievalAugmentor.ts:285](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/IRetrievalAugmentor.ts#L285)

#### Returns

`Promise`\<\{ `details?`: `Record`\<`string`, `unknown`\>; `isHealthy`: `boolean`; \}\>

***

### deleteDocuments()

> **deleteDocuments**(`documentIds`, `dataSourceId?`, `options?`): `Promise`\<\{ `errors?`: `object`[]; `failureCount`: `number`; `successCount`: `number`; \}\>

Defined in: [packages/agentos/src/rag/IRetrievalAugmentor.ts:274](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/IRetrievalAugmentor.ts#L274)

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

### ingestDocuments()

> **ingestDocuments**(`documents`, `options?`): `Promise`\<[`RagIngestionResult`](RagIngestionResult.md)\>

Defined in: [packages/agentos/src/rag/IRetrievalAugmentor.ts:264](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/IRetrievalAugmentor.ts#L264)

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

Defined in: [packages/agentos/src/rag/IRetrievalAugmentor.ts:258](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/IRetrievalAugmentor.ts#L258)

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

Defined in: [packages/agentos/src/rag/IRetrievalAugmentor.ts:269](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/IRetrievalAugmentor.ts#L269)

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

Defined in: [packages/agentos/src/rag/IRetrievalAugmentor.ts:287](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/IRetrievalAugmentor.ts#L287)

#### Returns

`Promise`\<`void`\>

***

### updateDocuments()

> **updateDocuments**(`documents`, `options?`): `Promise`\<[`RagIngestionResult`](RagIngestionResult.md)\>

Defined in: [packages/agentos/src/rag/IRetrievalAugmentor.ts:280](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/rag/IRetrievalAugmentor.ts#L280)

#### Parameters

##### documents

[`RagDocumentInput`](RagDocumentInput.md) | [`RagDocumentInput`](RagDocumentInput.md)[]

##### options?

[`RagIngestionOptions`](RagIngestionOptions.md)

#### Returns

`Promise`\<[`RagIngestionResult`](RagIngestionResult.md)\>
