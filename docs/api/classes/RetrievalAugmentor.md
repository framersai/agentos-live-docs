# Class: RetrievalAugmentor

Defined in: [packages/agentos/src/rag/RetrievalAugmentor.ts:56](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/rag/RetrievalAugmentor.ts#L56)

## Implements

Orchestrates the RAG pipeline including ingestion, retrieval, and document management.

## Implements

- [`IRetrievalAugmentor`](../interfaces/IRetrievalAugmentor.md)

## Constructors

### Constructor

> **new RetrievalAugmentor**(): `RetrievalAugmentor`

Defined in: [packages/agentos/src/rag/RetrievalAugmentor.ts:84](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/rag/RetrievalAugmentor.ts#L84)

Constructs a RetrievalAugmentor instance.
It is not operational until `initialize` is successfully called.

#### Returns

`RetrievalAugmentor`

## Properties

### augmenterId

> `readonly` **augmenterId**: `string`

Defined in: [packages/agentos/src/rag/RetrievalAugmentor.ts:57](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/rag/RetrievalAugmentor.ts#L57)

#### Implementation of

[`IRetrievalAugmentor`](../interfaces/IRetrievalAugmentor.md).[`augmenterId`](../interfaces/IRetrievalAugmentor.md#augmenterid)

## Methods

### checkHealth()

> **checkHealth**(): `Promise`\<\{ `details?`: `Record`\<`string`, `unknown`\>; `isHealthy`: `boolean`; \}\>

Defined in: [packages/agentos/src/rag/RetrievalAugmentor.ts:1274](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/rag/RetrievalAugmentor.ts#L1274)

#### Returns

`Promise`\<\{ `details?`: `Record`\<`string`, `unknown`\>; `isHealthy`: `boolean`; \}\>

#### Inherit Doc

#### Implementation of

[`IRetrievalAugmentor`](../interfaces/IRetrievalAugmentor.md).[`checkHealth`](../interfaces/IRetrievalAugmentor.md#checkhealth)

***

### deleteDocuments()

> **deleteDocuments**(`documentIds`, `dataSourceId?`, `options?`): `Promise`\<\{ `errors?`: `object`[]; `failureCount`: `number`; `successCount`: `number`; \}\>

Defined in: [packages/agentos/src/rag/RetrievalAugmentor.ts:1138](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/rag/RetrievalAugmentor.ts#L1138)

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

#### Inherit Doc

#### Implementation of

[`IRetrievalAugmentor`](../interfaces/IRetrievalAugmentor.md).[`deleteDocuments`](../interfaces/IRetrievalAugmentor.md#deletedocuments)

***

### ingestDocuments()

> **ingestDocuments**(`documents`, `options?`): `Promise`\<[`RagIngestionResult`](../interfaces/RagIngestionResult.md)\>

Defined in: [packages/agentos/src/rag/RetrievalAugmentor.ts:307](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/rag/RetrievalAugmentor.ts#L307)

#### Parameters

##### documents

[`RagDocumentInput`](../interfaces/RagDocumentInput.md) | [`RagDocumentInput`](../interfaces/RagDocumentInput.md)[]

##### options?

[`RagIngestionOptions`](../interfaces/RagIngestionOptions.md)

#### Returns

`Promise`\<[`RagIngestionResult`](../interfaces/RagIngestionResult.md)\>

#### Inherit Doc

#### Implementation of

[`IRetrievalAugmentor`](../interfaces/IRetrievalAugmentor.md).[`ingestDocuments`](../interfaces/IRetrievalAugmentor.md#ingestdocuments)

***

### initialize()

> **initialize**(`config`, `embeddingManager`, `vectorStoreManager`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/rag/RetrievalAugmentor.ts:91](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/rag/RetrievalAugmentor.ts#L91)

#### Parameters

##### config

`RetrievalAugmentorServiceConfig`

##### embeddingManager

[`IEmbeddingManager`](../interfaces/IEmbeddingManager.md)

##### vectorStoreManager

[`IVectorStoreManager`](../interfaces/IVectorStoreManager.md)

#### Returns

`Promise`\<`void`\>

#### Inherit Doc

#### Implementation of

[`IRetrievalAugmentor`](../interfaces/IRetrievalAugmentor.md).[`initialize`](../interfaces/IRetrievalAugmentor.md#initialize)

***

### registerRerankerProvider()

> **registerRerankerProvider**(`provider`): `void`

Defined in: [packages/agentos/src/rag/RetrievalAugmentor.ts:217](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/rag/RetrievalAugmentor.ts#L217)

Register a reranker provider with the RerankerService.

Call this after initialization to add reranker providers (e.g., CohereReranker,
LocalCrossEncoderReranker) that will be available for reranking operations.

#### Parameters

##### provider

`IRerankerProvider`

A reranker provider instance implementing IRerankerProvider

#### Returns

`void`

#### Throws

If RerankerService is not configured

#### Example

```typescript
import { CohereReranker, LocalCrossEncoderReranker } from '@framers/agentos/rag/reranking';

// After initialization
augmentor.registerRerankerProvider(new CohereReranker({
  providerId: 'cohere',
  apiKey: process.env.COHERE_API_KEY!
}));

augmentor.registerRerankerProvider(new LocalCrossEncoderReranker({
  providerId: 'local',
  defaultModelId: 'cross-encoder/ms-marco-MiniLM-L-6-v2'
}));
```

***

### retrieveContext()

> **retrieveContext**(`queryText`, `options?`): `Promise`\<[`RagRetrievalResult`](../interfaces/RagRetrievalResult.md)\>

Defined in: [packages/agentos/src/rag/RetrievalAugmentor.ts:744](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/rag/RetrievalAugmentor.ts#L744)

#### Parameters

##### queryText

`string`

##### options?

[`RagRetrievalOptions`](../interfaces/RagRetrievalOptions.md)

#### Returns

`Promise`\<[`RagRetrievalResult`](../interfaces/RagRetrievalResult.md)\>

#### Inherit Doc

#### Implementation of

[`IRetrievalAugmentor`](../interfaces/IRetrievalAugmentor.md).[`retrieveContext`](../interfaces/IRetrievalAugmentor.md#retrievecontext)

***

### setHydeLlmCaller()

> **setHydeLlmCaller**(`llmCaller`): `void`

Defined in: [packages/agentos/src/rag/RetrievalAugmentor.ts:261](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/rag/RetrievalAugmentor.ts#L261)

Register an LLM caller for HyDE hypothesis generation.

HyDE (Hypothetical Document Embedding) improves retrieval quality by
generating a hypothetical answer first, then embedding that answer
instead of the raw query. The hypothesis is semantically closer to the
stored documents, yielding better vector similarity matches.

The caller must be set before HyDE-enabled retrieval can be used. Once
set, HyDE can be activated per-request via `options.hyde.enabled` on
[retrieveContext](#retrievecontext), or it can be activated globally by passing a
default HyDE config.

#### Parameters

##### llmCaller

[`HydeLlmCaller`](../type-aliases/HydeLlmCaller.md)

An async function that takes `(systemPrompt, userPrompt)`
  and returns the LLM completion text. The system prompt contains
  instructions for hypothesis generation; the user prompt is the query.

#### Returns

`void`

#### Example

```typescript
augmentor.setHydeLlmCaller(async (systemPrompt, userPrompt) => {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    max_tokens: 200,
  });
  return response.choices[0].message.content ?? '';
});
```

***

### shutdown()

> **shutdown**(): `Promise`\<`void`\>

Defined in: [packages/agentos/src/rag/RetrievalAugmentor.ts:1303](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/rag/RetrievalAugmentor.ts#L1303)

#### Returns

`Promise`\<`void`\>

#### Inherit Doc

#### Implementation of

[`IRetrievalAugmentor`](../interfaces/IRetrievalAugmentor.md).[`shutdown`](../interfaces/IRetrievalAugmentor.md#shutdown)

***

### updateDocuments()

> **updateDocuments**(`documents`, `options?`): `Promise`\<[`RagIngestionResult`](../interfaces/RagIngestionResult.md)\>

Defined in: [packages/agentos/src/rag/RetrievalAugmentor.ts:1249](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/rag/RetrievalAugmentor.ts#L1249)

#### Parameters

##### documents

[`RagDocumentInput`](../interfaces/RagDocumentInput.md) | [`RagDocumentInput`](../interfaces/RagDocumentInput.md)[]

##### options?

[`RagIngestionOptions`](../interfaces/RagIngestionOptions.md)

#### Returns

`Promise`\<[`RagIngestionResult`](../interfaces/RagIngestionResult.md)\>

#### Inherit Doc

#### Implementation of

[`IRetrievalAugmentor`](../interfaces/IRetrievalAugmentor.md).[`updateDocuments`](../interfaces/IRetrievalAugmentor.md#updatedocuments)
