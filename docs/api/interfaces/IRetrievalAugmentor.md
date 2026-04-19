# Interface: IRetrievalAugmentor

Defined in: [packages/agentos/src/rag/IRetrievalAugmentor.ts:246](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/rag/IRetrievalAugmentor.ts#L246)

Primary contract for the Retrieval Augmentor implementation.

## Properties

### augmenterId

> `readonly` **augmenterId**: `string`

Defined in: [packages/agentos/src/rag/IRetrievalAugmentor.ts:247](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/rag/IRetrievalAugmentor.ts#L247)

## Methods

### checkHealth()

> **checkHealth**(): `Promise`\<\{ `details?`: `Record`\<`string`, `unknown`\>; `isHealthy`: `boolean`; \}\>

Defined in: [packages/agentos/src/rag/IRetrievalAugmentor.ts:276](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/rag/IRetrievalAugmentor.ts#L276)

#### Returns

`Promise`\<\{ `details?`: `Record`\<`string`, `unknown`\>; `isHealthy`: `boolean`; \}\>

***

### deleteDocuments()

> **deleteDocuments**(`documentIds`, `dataSourceId?`, `options?`): `Promise`\<\{ `errors?`: `object`[]; `failureCount`: `number`; `successCount`: `number`; \}\>

Defined in: [packages/agentos/src/rag/IRetrievalAugmentor.ts:265](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/rag/IRetrievalAugmentor.ts#L265)

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

Defined in: [packages/agentos/src/rag/IRetrievalAugmentor.ts:255](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/rag/IRetrievalAugmentor.ts#L255)

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

Defined in: [packages/agentos/src/rag/IRetrievalAugmentor.ts:249](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/rag/IRetrievalAugmentor.ts#L249)

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

Defined in: [packages/agentos/src/rag/IRetrievalAugmentor.ts:260](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/rag/IRetrievalAugmentor.ts#L260)

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

Defined in: [packages/agentos/src/rag/IRetrievalAugmentor.ts:278](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/rag/IRetrievalAugmentor.ts#L278)

#### Returns

`Promise`\<`void`\>

***

### updateDocuments()

> **updateDocuments**(`documents`, `options?`): `Promise`\<[`RagIngestionResult`](RagIngestionResult.md)\>

Defined in: [packages/agentos/src/rag/IRetrievalAugmentor.ts:271](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/rag/IRetrievalAugmentor.ts#L271)

#### Parameters

##### documents

[`RagDocumentInput`](RagDocumentInput.md) | [`RagDocumentInput`](RagDocumentInput.md)[]

##### options?

[`RagIngestionOptions`](RagIngestionOptions.md)

#### Returns

`Promise`\<[`RagIngestionResult`](RagIngestionResult.md)\>
