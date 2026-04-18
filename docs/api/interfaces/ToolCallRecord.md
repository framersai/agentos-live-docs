# Interface: ToolCallRecord

Defined in: [packages/agentos/src/api/generateText.ts:70](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/generateText.ts#L70)

Record of a single tool invocation performed during a [generateText](../functions/generateText.md) call.
One record is appended per tool call, regardless of whether the call succeeded.

## Properties

### args

> **args**: `unknown`

Defined in: [packages/agentos/src/api/generateText.ts:74](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/generateText.ts#L74)

Parsed arguments supplied by the model.

***

### error?

> `optional` **error**: `string`

Defined in: [packages/agentos/src/api/generateText.ts:78](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/generateText.ts#L78)

Error message when the tool threw or returned a failure result.

***

### name

> **name**: `string`

Defined in: [packages/agentos/src/api/generateText.ts:72](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/generateText.ts#L72)

Name of the tool as registered in the `tools` map.

***

### result?

> `optional` **result**: `unknown`

Defined in: [packages/agentos/src/api/generateText.ts:76](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/generateText.ts#L76)

Return value from the tool's `execute` function (present on success).
