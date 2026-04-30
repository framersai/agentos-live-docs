# Interface: EmbedTextResult

Defined in: [packages/agentos/src/api/embedText.ts:98](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/embedText.ts#L98)

The result returned by [embedText](../functions/embedText.md).

## Example

```ts
const { embeddings, usage } = await embedText({
  model: 'openai:text-embedding-3-small',
  input: ['Hello', 'World'],
});
console.log(embeddings.length); // 2
console.log(embeddings[0].length); // e.g. 1536
```

## Properties

### embeddings

> **embeddings**: `number`[][]

Defined in: [packages/agentos/src/api/embedText.ts:104](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/embedText.ts#L104)

One embedding vector per input string. Each vector is a plain `number[]`
of floats whose dimensionality depends on the model (and the optional
`dimensions` parameter).

***

### model

> **model**: `string`

Defined in: [packages/agentos/src/api/embedText.ts:107](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/embedText.ts#L107)

Model identifier reported by the provider (may differ from the requested model).

***

### provider

> **provider**: `string`

Defined in: [packages/agentos/src/api/embedText.ts:110](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/embedText.ts#L110)

Provider identifier used for the run.

***

### usage

> **usage**: `object`

Defined in: [packages/agentos/src/api/embedText.ts:117](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/embedText.ts#L117)

Token usage for the embedding request.
Most embedding APIs only report prompt tokens (the input); completion
tokens are typically zero.

#### promptTokens

> **promptTokens**: `number`

Number of tokens consumed by the input text(s).

#### totalTokens

> **totalTokens**: `number`

Sum of prompt and any other tokens (usually equal to `promptTokens`).
