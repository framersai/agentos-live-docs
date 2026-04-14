# Class: QueryGenerator

Defined in: [packages/agentos/src/query-router/QueryGenerator.ts:136](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/query-router/QueryGenerator.ts#L136)

Builds tier-appropriate prompts and generates LLM answers.

The generator selects a model (standard vs. deep) based on the query tier,
constructs a system prompt with optional documentation context and research
synthesis, then delegates to [generateText](../functions/generateText.md) for the actual LLM call.

## Example

```typescript
const gen = new QueryGenerator({
  model: 'openai:gpt-4.1-mini',
  modelDeep: 'openai:gpt-4.1',
  provider: 'openai',
});

const result = await gen.generate('How does auth work?', 1, chunks);
console.log(result.answer);
```

## Constructors

### Constructor

> **new QueryGenerator**(`config`): `QueryGenerator`

Defined in: [packages/agentos/src/query-router/QueryGenerator.ts:147](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/query-router/QueryGenerator.ts#L147)

Create a new QueryGenerator instance.

#### Parameters

##### config

`QueryGeneratorConfig`

Generator configuration specifying models, provider,
                and optional credential overrides.

#### Returns

`QueryGenerator`

## Methods

### generate()

> **generate**(`query`, `tier`, `chunks`, `researchSynthesis?`): `Promise`\<`GenerateResult`\>

Defined in: [packages/agentos/src/query-router/QueryGenerator.ts:167](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/query-router/QueryGenerator.ts#L167)

Generate an answer for the given query at the specified complexity tier.

#### Parameters

##### query

`string`

The user's original question.

##### tier

[`QueryTier`](../type-aliases/QueryTier.md)

The classified complexity tier (0–3).

##### chunks

[`RetrievedChunk`](../interfaces/RetrievedChunk.md)[]

Retrieved documentation chunks, sorted by relevance.

##### researchSynthesis?

`string`

Optional research narrative (T3 only).

#### Returns

`Promise`\<`GenerateResult`\>

A promise resolving to the generated answer, model used, and token usage.
