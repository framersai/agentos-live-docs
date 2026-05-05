# Interface: EmbeddingConfig

Defined in: [packages/agentos/src/memory/io/facade/types.ts:21](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/io/facade/types.ts#L21)

Configuration for the embedding model used to encode memory content and
document chunks into dense vectors.

## Properties

### dimensions?

> `optional` **dimensions**: `number`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:40](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/io/facade/types.ts#L40)

Dimensionality of produced vectors.
Must match the dimensionality expected by the configured vector store.

#### Example

```ts
1536
```

***

### model?

> `optional` **model**: `string`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:33](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/io/facade/types.ts#L33)

Model name to use for generating embeddings.
When omitted the provider's default model is used.

#### Example

```ts
'text-embedding-3-small'
```

***

### provider

> **provider**: `string`

Defined in: [packages/agentos/src/memory/io/facade/types.ts:26](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/io/facade/types.ts#L26)

Embedding provider identifier.

#### Example

```ts
'openai' | 'cohere' | 'local'
```
