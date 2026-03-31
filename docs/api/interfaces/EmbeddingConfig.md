# Interface: EmbeddingConfig

Defined in: [packages/agentos/src/memory/io/facade/types.ts:19](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/io/facade/types.ts#L19)

Configuration for the embedding model used to encode memory content and
document chunks into dense vectors.

## Properties

### dimensions?

> `optional` **dimensions**: `number`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:38](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/io/facade/types.ts#L38)

Dimensionality of produced vectors.
Must match the dimensionality expected by the configured vector store.

#### Example

```ts
1536
```

***

### model?

> `optional` **model**: `string`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:31](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/io/facade/types.ts#L31)

Model name to use for generating embeddings.
When omitted the provider's default model is used.

#### Example

```ts
'text-embedding-3-small'
```

***

### provider

> **provider**: `string`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:24](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/io/facade/types.ts#L24)

Embedding provider identifier.

#### Example

```ts
'openai' | 'cohere' | 'local'
```
