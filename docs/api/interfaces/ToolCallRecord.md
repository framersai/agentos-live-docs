# Interface: ToolCallRecord

Defined in: [packages/agentos/src/api/generateText.ts:39](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/generateText.ts#L39)

Record of a single tool invocation performed during a [generateText](../functions/generateText.md) call.
One record is appended per tool call, regardless of whether the call succeeded.

## Properties

### args

> **args**: `unknown`

Defined in: [packages/agentos/src/api/generateText.ts:43](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/generateText.ts#L43)

Parsed arguments supplied by the model.

***

### error?

> `optional` **error**: `string`

Defined in: [packages/agentos/src/api/generateText.ts:47](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/generateText.ts#L47)

Error message when the tool threw or returned a failure result.

***

### name

> **name**: `string`

Defined in: [packages/agentos/src/api/generateText.ts:41](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/generateText.ts#L41)

Name of the tool as registered in the `tools` map.

***

### result?

> `optional` **result**: `unknown`

Defined in: [packages/agentos/src/api/generateText.ts:45](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/generateText.ts#L45)

Return value from the tool's `execute` function (present on success).
