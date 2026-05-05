# Interface: LoopToolCallRequest

Defined in: [packages/agentos/src/orchestration/runtime/LoopController.ts:94](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/orchestration/runtime/LoopController.ts#L94)

A single tool invocation requested by the LLM.

## Properties

### arguments

> **arguments**: `Record`\<`string`, `unknown`\>

Defined in: [packages/agentos/src/orchestration/runtime/LoopController.ts:102](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/orchestration/runtime/LoopController.ts#L102)

Parsed arguments to pass to the tool.

***

### id

> **id**: `string`

Defined in: [packages/agentos/src/orchestration/runtime/LoopController.ts:96](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/orchestration/runtime/LoopController.ts#L96)

Unique identifier for this tool call within a response (matches the tool result).

***

### name

> **name**: `string`

Defined in: [packages/agentos/src/orchestration/runtime/LoopController.ts:99](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/orchestration/runtime/LoopController.ts#L99)

Name of the tool to invoke.
