# Interface: EmbeddingResponse

Defined in: [packages/agentos/src/core/embeddings/IEmbeddingManager.ts:107](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/core/embeddings/IEmbeddingManager.ts#L107)

Represents the response from an embedding generation request.
This structure includes the generated embeddings, information about the model
and provider used, token usage details, and any errors encountered during
processing (especially relevant for batch requests).

## Interface

EmbeddingResponse

## Properties

### embeddings

> **embeddings**: `number`[][]

Defined in: [packages/agentos/src/core/embeddings/IEmbeddingManager.ts:117](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/core/embeddings/IEmbeddingManager.ts#L117)

An array of embedding vectors. Each inner array (`number[]`) corresponds
to an input text from the `EmbeddingRequest`. The order is preserved.
If an error occurred for a specific text in a batch, its corresponding
entry might be missing, or represented by a specific error object if partial
results are supported differently. The `errors` array should be checked.

#### Example

```ts
[[0.1, 0.2, ...], [0.3, 0.4, ...]]
```

***

### errors?

> `optional` **errors**: `object`[]

Defined in: [packages/agentos/src/core/embeddings/IEmbeddingManager.ts:161](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/core/embeddings/IEmbeddingManager.ts#L161)

**`Optional`**

Optional: An array of error objects, relevant if processing a batch of texts
and some individual texts failed. If the entire request failed catastrophically,
the `generateEmbeddings` method itself should throw an error.

#### details?

> `optional` **details**: `any`

#### message

> **message**: `string`

#### textIndex

> **textIndex**: `number`

#### Example

```ts
errors: [{ textIndex: 1, message: "Content policy violation", details: { reason: "unsafe_content" } }]
```

***

### modelId

> **modelId**: `string`

Defined in: [packages/agentos/src/core/embeddings/IEmbeddingManager.ts:125](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/core/embeddings/IEmbeddingManager.ts#L125)

The ID of the embedding model that was actually used to generate the embeddings.
This is important for consistency, especially if model selection was dynamic.

#### Example

```ts
"text-embedding-3-small"
```

***

### providerId

> **providerId**: `string`

Defined in: [packages/agentos/src/core/embeddings/IEmbeddingManager.ts:132](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/core/embeddings/IEmbeddingManager.ts#L132)

The ID of the LLM provider that was used.

#### Example

```ts
"openai"
```

***

### usage

> **usage**: `object`

Defined in: [packages/agentos/src/core/embeddings/IEmbeddingManager.ts:143](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/core/embeddings/IEmbeddingManager.ts#L143)

Information about token usage and cost for the embedding generation.

#### costUSD?

> `optional` **costUSD**: `number`

#### inputTokens?

> `optional` **inputTokens**: `number`

#### totalTokens

> **totalTokens**: `number`
