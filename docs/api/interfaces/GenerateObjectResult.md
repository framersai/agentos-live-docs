# Interface: GenerateObjectResult\<T\>

Defined in: [packages/agentos/src/api/generateObject.ts:177](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/generateObject.ts#L177)

The completed result returned by [generateObject](../functions/generateObject.md).

## Type Parameters

### T

`T`

The inferred type from the Zod schema, representing the validated object.

## Properties

### finishReason

> **finishReason**: `string`

Defined in: [packages/agentos/src/api/generateObject.ts:191](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/generateObject.ts#L191)

Reason the model stopped generating on the final successful attempt.
Mirrors the finish reasons from [generateText](../functions/generateText.md).

***

### model

> **model**: `string`

Defined in: [packages/agentos/src/api/generateObject.ts:197](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/generateObject.ts#L197)

Resolved model identifier used for the run.

***

### object

> **object**: `T`

Defined in: [packages/agentos/src/api/generateObject.ts:179](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/generateObject.ts#L179)

The parsed, Zod-validated object matching the provided schema.

***

### provider

> **provider**: `string`

Defined in: [packages/agentos/src/api/generateObject.ts:194](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/generateObject.ts#L194)

Provider identifier used for the run.

***

### text

> **text**: `string`

Defined in: [packages/agentos/src/api/generateObject.ts:182](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/generateObject.ts#L182)

The raw LLM output text before parsing.

***

### usage

> **usage**: [`TokenUsage`](TokenUsage.md)

Defined in: [packages/agentos/src/api/generateObject.ts:185](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/generateObject.ts#L185)

Aggregated token usage across all attempts (including retries).
