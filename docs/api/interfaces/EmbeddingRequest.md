# Interface: EmbeddingRequest

Defined in: [packages/agentos/src/core/embeddings/IEmbeddingManager.ts:33](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/core/embeddings/IEmbeddingManager.ts#L33)

Represents a request to generate embeddings.
This structure encapsulates the text(s) to be embedded and any parameters
that might influence the embedding process, such as model selection hints
or user context.

## Interface

EmbeddingRequest

## Properties

### collectionId?

> `optional` **collectionId**: `string`

Defined in: [packages/agentos/src/core/embeddings/IEmbeddingManager.ts:86](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/core/embeddings/IEmbeddingManager.ts#L86)

**`Optional`**

Optional: Identifier for a data collection or namespace.
This can be used by dynamic model selection strategies (e.g.,
'dynamic_collection_preference') to choose a model best suited
for the content of a specific collection.

#### Example

```ts
"financial_reports_q3_2024"
```

***

### customParameters?

> `optional` **customParameters**: `Record`\<`string`, `any`\>

Defined in: [packages/agentos/src/core/embeddings/IEmbeddingManager.ts:96](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/core/embeddings/IEmbeddingManager.ts#L96)

**`Optional`**

Optional: Custom parameters to pass through to the embedding generation process.
This could include provider-specific options or hints for the EmbeddingManager.
The exact interpretation of these parameters is implementation-dependent.

#### Example

```ts
{ "priority": "high", "target_latency_ms": 500 }
```

***

### modelId?

> `optional` **modelId**: `string`

Defined in: [packages/agentos/src/core/embeddings/IEmbeddingManager.ts:54](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/core/embeddings/IEmbeddingManager.ts#L54)

**`Optional`**

Optional: The explicit ID of the embedding model to use.
If not provided, the EmbeddingManager will select a model based on its
configured strategy (e.g., default model, dynamic selection).

#### Example

```ts
"text-embedding-3-small"
```

***

### providerId?

> `optional` **providerId**: `string`

Defined in: [packages/agentos/src/core/embeddings/IEmbeddingManager.ts:65](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/core/embeddings/IEmbeddingManager.ts#L65)

**`Optional`**

Optional: The explicit ID of the LLM provider to use.
This is typically used in conjunction with `modelId`. If `modelId` is provided
and has a configured provider, this field might be used for validation or override
if the architecture supports it. Generally, the model's configured provider is preferred.

#### Example

```ts
"openai"
```

***

### texts

> **texts**: `string` \| `string`[]

Defined in: [packages/agentos/src/core/embeddings/IEmbeddingManager.ts:44](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/core/embeddings/IEmbeddingManager.ts#L44)

The text content to be embedded. Can be a single string or an array of strings
for batch processing.

#### Example

```ts
// Single text
const requestOne: EmbeddingRequest = { texts: "Hello, world!" };
// Batch of texts
const requestBatch: EmbeddingRequest = { texts: ["First document.", "Second document."] };
```

***

### userId?

> `optional` **userId**: `string`

Defined in: [packages/agentos/src/core/embeddings/IEmbeddingManager.ts:75](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/core/embeddings/IEmbeddingManager.ts#L75)

**`Optional`**

Optional: Identifier for the user making the request.
This can be used for logging, auditing, or if the underlying LLM provider
requires user-specific API keys or applies user-based rate limits.

#### Example

```ts
"user-12345"
```
