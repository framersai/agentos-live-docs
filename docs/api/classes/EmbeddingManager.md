# Class: EmbeddingManager

Defined in: [packages/agentos/src/rag/EmbeddingManager.ts:52](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/rag/EmbeddingManager.ts#L52)

Implements the `IEmbeddingManager` interface to provide robust embedding generation services.

## Implements

## Implements

- [`IEmbeddingManager`](../interfaces/IEmbeddingManager.md)

## Constructors

### Constructor

> **new EmbeddingManager**(): `EmbeddingManager`

Defined in: [packages/agentos/src/rag/EmbeddingManager.ts:64](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/rag/EmbeddingManager.ts#L64)

Constructs an EmbeddingManager instance.
The manager is not operational until `initialize` is called.

#### Returns

`EmbeddingManager`

## Methods

### checkHealth()

> **checkHealth**(): `Promise`\<\{ `details?`: `any`; `isHealthy`: `boolean`; \}\>

Defined in: [packages/agentos/src/rag/EmbeddingManager.ts:498](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/rag/EmbeddingManager.ts#L498)

**`Async`**

Checks the operational health of the EmbeddingManager.
This may involve verifying its initialization status and, potentially, the
health of its connections to default or critical LLM providers.

#### Returns

`Promise`\<\{ `details?`: `any`; `isHealthy`: `boolean`; \}\>

A promise that resolves with
an object indicating health status
and optionally providing more details
(e.g., status of providers, cache).

#### Example

```ts
const health = await embeddingManager.checkHealth();
if (health.isHealthy) {
console.log("EmbeddingManager is healthy.");
} else {
console.error("EmbeddingManager health check failed:", health.details);
}
```

#### Implementation of

[`IEmbeddingManager`](../interfaces/IEmbeddingManager.md).[`checkHealth`](../interfaces/IEmbeddingManager.md#checkhealth)

***

### generateEmbeddings()

> **generateEmbeddings**(`request`): `Promise`\<[`EmbeddingResponse`](../interfaces/EmbeddingResponse.md)\>

Defined in: [packages/agentos/src/rag/EmbeddingManager.ts:258](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/rag/EmbeddingManager.ts#L258)

**`Async`**

Generates embeddings for the provided text(s) using an appropriate model.
This method handles model selection (if not explicitly specified in the request),
interaction with the LLM provider, and caching (if enabled).

#### Parameters

##### request

[`EmbeddingRequest`](../interfaces/EmbeddingRequest.md)

The request object containing the text(s) to embed
and any relevant options.

#### Returns

`Promise`\<[`EmbeddingResponse`](../interfaces/EmbeddingResponse.md)\>

A promise that resolves with the generated embeddings,
usage details, and information about the model used.

#### Throws

If the embedding generation process fails critically (e.g.,
provider unavailable, authentication error, invalid request parameters
not caught by initial validation). A `GMIError` with a `code` like
'PROVIDER_ERROR', 'REQUEST_FAILED', or 'NOT_INITIALIZED' is preferred.
For batch requests, individual text failures might be reported in
`EmbeddingResponse.errors` instead of throwing.

#### Example

```ts
const response = await embeddingManager.generateEmbeddings({
texts: ["What is the capital of France?", "Explain quantum computing."],
userId: "user-xyz"
});
console.log(response.embeddings);
```

#### Implementation of

[`IEmbeddingManager`](../interfaces/IEmbeddingManager.md).[`generateEmbeddings`](../interfaces/IEmbeddingManager.md#generateembeddings)

***

### getEmbeddingDimension()

> **getEmbeddingDimension**(`modelId?`): `Promise`\<`number`\>

Defined in: [packages/agentos/src/rag/EmbeddingManager.ts:472](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/rag/EmbeddingManager.ts#L472)

**`Async`**

Gets the embedding dimension for a specific model, or the default system dimension.
This is crucial for configuring vector stores and other components that need to
know the size of the embedding vectors.

#### Parameters

##### modelId?

`string`

Optional: The ID of the model. If omitted, tries to return
the dimension of the default model, or a system-wide default
embedding dimension if configured.

#### Returns

`Promise`\<`number`\>

A promise that resolves with the embedding dimension.

#### Throws

If the dimension cannot be determined (e.g., model not found
and no default dimension configured). A `GMIError` with code
'CONFIG_ERROR' or 'NOT_FOUND' is preferred.

#### Example

```ts
const dimension = await embeddingManager.getEmbeddingDimension("text-embedding-3-small");
console.log(`Embeddings will have ${dimension} dimensions.`);
```

#### Implementation of

[`IEmbeddingManager`](../interfaces/IEmbeddingManager.md).[`getEmbeddingDimension`](../interfaces/IEmbeddingManager.md#getembeddingdimension)

***

### getEmbeddingModelInfo()

> **getEmbeddingModelInfo**(`modelId?`): `Promise`\<`EmbeddingModelConfig` \| `undefined`\>

Defined in: [packages/agentos/src/rag/EmbeddingManager.ts:456](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/rag/EmbeddingManager.ts#L456)

**`Async`**

Retrieves configuration information for a specific embedding model.
If no `modelId` is provided, it typically returns information for the
default configured embedding model.

#### Parameters

##### modelId?

`string`

Optional: The ID of the model to get information for.
If omitted, the default model's info is returned.

#### Returns

`Promise`\<`EmbeddingModelConfig` \| `undefined`\>

A promise that resolves with the
model's configuration object, or
`undefined` if the model is not found.

#### Throws

If the manager is not initialized.

#### Example

```ts
const modelInfo = await embeddingManager.getEmbeddingModelInfo("text-embedding-ada-002");
if (modelInfo) {
console.log(`Model Dimensions: ${modelInfo.dimension}`);
}
```

#### Implementation of

[`IEmbeddingManager`](../interfaces/IEmbeddingManager.md).[`getEmbeddingModelInfo`](../interfaces/IEmbeddingManager.md#getembeddingmodelinfo)

***

### initialize()

> **initialize**(`config`, `providerManager`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/rag/EmbeddingManager.ts:71](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/rag/EmbeddingManager.ts#L71)

**`Async`**

Initializes the EmbeddingManager with its configuration and necessary dependencies.
This method must be called before any other operations can be performed.
It sets up available embedding models, caching, and selection strategies.

#### Parameters

##### config

`EmbeddingManagerConfig`

The configuration object for the EmbeddingManager.
This includes details about available models,
caching, and default settings.

##### providerManager

[`AIModelProviderManager`](AIModelProviderManager.md)

An instance of AIModelProviderManager,
used to interact with the actual LLM providers
that generate embeddings.

#### Returns

`Promise`\<`void`\>

A promise that resolves when initialization is complete.

#### Throws

If initialization fails due to invalid configuration,
inability to set up providers, or other critical errors.
A `GMIError` with a `code` like 'CONFIG_ERROR' or 'INITIALIZATION_FAILED'
is preferred.

#### Example

```ts
const manager = new EmbeddingManager();
await manager.initialize(embeddingManagerConfig, aiModelProviderManager);
```

#### Implementation of

[`IEmbeddingManager`](../interfaces/IEmbeddingManager.md).[`initialize`](../interfaces/IEmbeddingManager.md#initialize)

***

### shutdown()

> **shutdown**(): `Promise`\<`void`\>

Defined in: [packages/agentos/src/rag/EmbeddingManager.ts:538](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/rag/EmbeddingManager.ts#L538)

**`Async`**

Gracefully shuts down the EmbeddingManager, releasing any resources it holds.
This could include clearing caches, closing persistent connections if any were
managed directly (though typically provider connections are managed by AIModelProviderManager).

#### Returns

`Promise`\<`void`\>

A promise that resolves when shutdown is complete.

#### Example

```ts
await embeddingManager.shutdown();
```

#### Implementation of

[`IEmbeddingManager`](../interfaces/IEmbeddingManager.md).[`shutdown`](../interfaces/IEmbeddingManager.md#shutdown)
