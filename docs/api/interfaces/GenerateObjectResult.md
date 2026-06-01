# Interface: GenerateObjectResult\<T\>

Defined in: [packages/agentos/src/api/generateObject.ts:229](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/generateObject.ts#L229)

The completed result returned by [generateObject](../functions/generateObject.md).

## Type Parameters

### T

`T`

The inferred type from the Zod schema, representing the validated object.

## Properties

### finishReason

> **finishReason**: `string`

Defined in: [packages/agentos/src/api/generateObject.ts:243](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/generateObject.ts#L243)

Reason the model stopped generating on the final successful attempt.
Mirrors the finish reasons from [generateText](../functions/generateText.md).

***

### model

> **model**: `string`

Defined in: [packages/agentos/src/api/generateObject.ts:249](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/generateObject.ts#L249)

Resolved model identifier used for the run.

***

### object

> **object**: `T`

Defined in: [packages/agentos/src/api/generateObject.ts:231](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/generateObject.ts#L231)

The parsed, Zod-validated object matching the provided schema.

***

### provider

> **provider**: `string`

Defined in: [packages/agentos/src/api/generateObject.ts:246](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/generateObject.ts#L246)

Provider identifier used for the run.

***

### text

> **text**: `string`

Defined in: [packages/agentos/src/api/generateObject.ts:234](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/generateObject.ts#L234)

The raw LLM output text before parsing.

***

### usage

> **usage**: [`TokenUsage`](TokenUsage.md)

Defined in: [packages/agentos/src/api/generateObject.ts:237](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/generateObject.ts#L237)

Aggregated token usage across all attempts (including retries).
