# Interface: ToolCallRecord

Defined in: [packages/agentos/src/api/generateText.ts:40](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/generateText.ts#L40)

Record of a single tool invocation performed during a [generateText](../functions/generateText.md) call.
One record is appended per tool call, regardless of whether the call succeeded.

## Properties

### args

> **args**: `unknown`

Defined in: [packages/agentos/src/api/generateText.ts:44](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/generateText.ts#L44)

Parsed arguments supplied by the model.

***

### error?

> `optional` **error**: `string`

Defined in: [packages/agentos/src/api/generateText.ts:48](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/generateText.ts#L48)

Error message when the tool threw or returned a failure result.

***

### name

> **name**: `string`

Defined in: [packages/agentos/src/api/generateText.ts:42](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/generateText.ts#L42)

Name of the tool as registered in the `tools` map.

***

### result?

> `optional` **result**: `unknown`

Defined in: [packages/agentos/src/api/generateText.ts:46](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/generateText.ts#L46)

Return value from the tool's `execute` function (present on success).
