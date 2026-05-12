# Interface: ToolCallHookInfo

Defined in: [packages/agentos/src/api/generateText.ts:463](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/generateText.ts#L463)

Info about a tool call before execution.
Hooks may return a modified copy or `null` to skip execution.

## Properties

### args

> **args**: `Record`\<`string`, `unknown`\>

Defined in: [packages/agentos/src/api/generateText.ts:467](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/generateText.ts#L467)

Parsed arguments.

***

### id

> **id**: `string`

Defined in: [packages/agentos/src/api/generateText.ts:469](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/generateText.ts#L469)

Tool call ID from the LLM.

***

### name

> **name**: `string`

Defined in: [packages/agentos/src/api/generateText.ts:465](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/generateText.ts#L465)

Tool name.

***

### step

> **step**: `number`

Defined in: [packages/agentos/src/api/generateText.ts:471](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/generateText.ts#L471)

Current agentic step index.
