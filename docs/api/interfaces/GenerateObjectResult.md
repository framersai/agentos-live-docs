# Interface: GenerateObjectResult\<T\>

Defined in: [packages/agentos/src/api/generateObject.ts:179](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/generateObject.ts#L179)

The completed result returned by [generateObject](../functions/generateObject.md).

## Type Parameters

### T

`T`

The inferred type from the Zod schema, representing the validated object.

## Properties

### finishReason

> **finishReason**: `string`

Defined in: [packages/agentos/src/api/generateObject.ts:193](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/generateObject.ts#L193)

Reason the model stopped generating on the final successful attempt.
Mirrors the finish reasons from [generateText](../functions/generateText.md).

***

### model

> **model**: `string`

Defined in: [packages/agentos/src/api/generateObject.ts:199](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/generateObject.ts#L199)

Resolved model identifier used for the run.

***

### object

> **object**: `T`

Defined in: [packages/agentos/src/api/generateObject.ts:181](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/generateObject.ts#L181)

The parsed, Zod-validated object matching the provided schema.

***

### provider

> **provider**: `string`

Defined in: [packages/agentos/src/api/generateObject.ts:196](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/generateObject.ts#L196)

Provider identifier used for the run.

***

### text

> **text**: `string`

Defined in: [packages/agentos/src/api/generateObject.ts:184](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/generateObject.ts#L184)

The raw LLM output text before parsing.

***

### usage

> **usage**: [`TokenUsage`](TokenUsage.md)

Defined in: [packages/agentos/src/api/generateObject.ts:187](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/generateObject.ts#L187)

Aggregated token usage across all attempts (including retries).
