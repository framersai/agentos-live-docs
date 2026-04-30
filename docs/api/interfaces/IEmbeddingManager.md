# Interface: IEmbeddingManager

Defined in: [packages/agentos/src/core/embeddings/IEmbeddingManager.ts:175](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/embeddings/IEmbeddingManager.ts#L175)

## Interface

IEmbeddingManager

## Description

Defines the contract for managing and utilizing embedding models.
Implementations of this interface are responsible for generating vector
embeddings from text, handling different model providers, and potentially
managing caching and model selection strategies.

## Methods

### checkHealth()

> **checkHealth**(): `Promise`\<\{ `details?`: `any`; `isHealthy`: `boolean`; \}\>

Defined in: [packages/agentos/src/core/embeddings/IEmbeddingManager.ts:286](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/embeddings/IEmbeddingManager.ts#L286)

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

***

### generateEmbeddings()

> **generateEmbeddings**(`request`): `Promise`\<[`EmbeddingResponse`](EmbeddingResponse.md)\>

Defined in: [packages/agentos/src/core/embeddings/IEmbeddingManager.ts:225](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/embeddings/IEmbeddingManager.ts#L225)

**`Async`**

Generates embeddings for the provided text(s) using an appropriate model.
This method handles model selection (if not explicitly specified in the request),
interaction with the LLM provider, and caching (if enabled).

#### Parameters

##### request

[`EmbeddingRequest`](EmbeddingRequest.md)

The request object containing the text(s) to embed
and any relevant options.

#### Returns

`Promise`\<[`EmbeddingResponse`](EmbeddingResponse.md)\>

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

***

### getEmbeddingDimension()

> **getEmbeddingDimension**(`modelId?`): `Promise`\<`number`\>

Defined in: [packages/agentos/src/core/embeddings/IEmbeddingManager.ts:266](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/embeddings/IEmbeddingManager.ts#L266)

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

***

### getEmbeddingModelInfo()

> **getEmbeddingModelInfo**(`modelId?`): `Promise`\<`EmbeddingModelConfig` \| `undefined`\>

Defined in: [packages/agentos/src/core/embeddings/IEmbeddingManager.ts:245](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/embeddings/IEmbeddingManager.ts#L245)

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

***

### initialize()

> **initialize**(`config`, `providerManager`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/core/embeddings/IEmbeddingManager.ts:197](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/embeddings/IEmbeddingManager.ts#L197)

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

[`AIModelProviderManager`](../classes/AIModelProviderManager.md)

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

***

### shutdown()?

> `optional` **shutdown**(): `Promise`\<`void`\>

Defined in: [packages/agentos/src/core/embeddings/IEmbeddingManager.ts:298](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/core/embeddings/IEmbeddingManager.ts#L298)

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
