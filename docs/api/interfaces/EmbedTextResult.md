# Interface: EmbedTextResult

Defined in: [packages/agentos/src/api/embedText.ts:102](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/embedText.ts#L102)

The result returned by [embedText](../functions/embedText.md).

## Example

```ts
const { embeddings, usage } = await embedText({
  provider: 'openai',
  model: 'text-embedding-3-small',
  input: ['Hello', 'World'],
});
console.log(embeddings.length); // 2
console.log(embeddings[0].length); // e.g. 1536
```

## Properties

### embeddings

> **embeddings**: `number`[][]

Defined in: [packages/agentos/src/api/embedText.ts:108](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/embedText.ts#L108)

One embedding vector per input string. Each vector is a plain `number[]`
of floats whose dimensionality depends on the model (and the optional
`dimensions` parameter).

***

### model

> **model**: `string`

Defined in: [packages/agentos/src/api/embedText.ts:111](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/embedText.ts#L111)

Model identifier reported by the provider (may differ from the requested model).

***

### provider

> **provider**: `string`

Defined in: [packages/agentos/src/api/embedText.ts:114](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/embedText.ts#L114)

Provider identifier used for the run.

***

### usage

> **usage**: `object`

Defined in: [packages/agentos/src/api/embedText.ts:121](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/embedText.ts#L121)

Token usage for the embedding request.
Most embedding APIs only report prompt tokens (the input); completion
tokens are typically zero.

#### promptTokens

> **promptTokens**: `number`

Number of tokens consumed by the input text(s).

#### totalTokens

> **totalTokens**: `number`

Sum of prompt and any other tokens (usually equal to `promptTokens`).
