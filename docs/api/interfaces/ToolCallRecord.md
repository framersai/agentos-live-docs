# Interface: ToolCallRecord

Defined in: [packages/agentos/src/api/generateText.ts:76](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/generateText.ts#L76)

Record of a single tool invocation performed during a [generateText](../functions/generateText.md) call.
One record is appended per tool call, regardless of whether the call succeeded.

## Properties

### args

> **args**: `unknown`

Defined in: [packages/agentos/src/api/generateText.ts:80](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/generateText.ts#L80)

Parsed arguments supplied by the model.

***

### error?

> `optional` **error**: `string`

Defined in: [packages/agentos/src/api/generateText.ts:84](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/generateText.ts#L84)

Error message when the tool threw or returned a failure result.

***

### name

> **name**: `string`

Defined in: [packages/agentos/src/api/generateText.ts:78](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/generateText.ts#L78)

Name of the tool as registered in the `tools` map.

***

### result?

> `optional` **result**: `unknown`

Defined in: [packages/agentos/src/api/generateText.ts:82](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/generateText.ts#L82)

Return value from the tool's `execute` function (present on success).
