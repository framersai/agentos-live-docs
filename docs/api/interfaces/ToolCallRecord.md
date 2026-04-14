# Interface: ToolCallRecord

Defined in: [packages/agentos/src/api/generateText.ts:67](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/api/generateText.ts#L67)

Record of a single tool invocation performed during a [generateText](../functions/generateText.md) call.
One record is appended per tool call, regardless of whether the call succeeded.

## Properties

### args

> **args**: `unknown`

Defined in: [packages/agentos/src/api/generateText.ts:71](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/api/generateText.ts#L71)

Parsed arguments supplied by the model.

***

### error?

> `optional` **error**: `string`

Defined in: [packages/agentos/src/api/generateText.ts:75](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/api/generateText.ts#L75)

Error message when the tool threw or returned a failure result.

***

### name

> **name**: `string`

Defined in: [packages/agentos/src/api/generateText.ts:69](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/api/generateText.ts#L69)

Name of the tool as registered in the `tools` map.

***

### result?

> `optional` **result**: `unknown`

Defined in: [packages/agentos/src/api/generateText.ts:73](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/api/generateText.ts#L73)

Return value from the tool's `execute` function (present on success).
