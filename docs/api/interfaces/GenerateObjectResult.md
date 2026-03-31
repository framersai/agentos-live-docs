# Interface: GenerateObjectResult\<T\>

Defined in: [packages/agentos/src/api/generateObject.ts:158](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/generateObject.ts#L158)

The completed result returned by [generateObject](../functions/generateObject.md).

## Type Parameters

### T

`T`

The inferred type from the Zod schema, representing the validated object.

## Properties

### finishReason

> **finishReason**: `string`

Defined in: [packages/agentos/src/api/generateObject.ts:172](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/generateObject.ts#L172)

Reason the model stopped generating on the final successful attempt.
Mirrors the finish reasons from [generateText](../functions/generateText.md).

***

### model

> **model**: `string`

Defined in: [packages/agentos/src/api/generateObject.ts:178](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/generateObject.ts#L178)

Resolved model identifier used for the run.

***

### object

> **object**: `T`

Defined in: [packages/agentos/src/api/generateObject.ts:160](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/generateObject.ts#L160)

The parsed, Zod-validated object matching the provided schema.

***

### provider

> **provider**: `string`

Defined in: [packages/agentos/src/api/generateObject.ts:175](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/generateObject.ts#L175)

Provider identifier used for the run.

***

### text

> **text**: `string`

Defined in: [packages/agentos/src/api/generateObject.ts:163](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/generateObject.ts#L163)

The raw LLM output text before parsing.

***

### usage

> **usage**: [`TokenUsage`](TokenUsage.md)

Defined in: [packages/agentos/src/api/generateObject.ts:166](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/generateObject.ts#L166)

Aggregated token usage across all attempts (including retries).
