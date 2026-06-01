# Interface: ToolCallHookInfo

Defined in: [packages/agentos/src/api/generateText.ts:517](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/generateText.ts#L517)

Info about a tool call before execution.
Hooks may return a modified copy or `null` to skip execution.

## Properties

### args

> **args**: `Record`\<`string`, `unknown`\>

Defined in: [packages/agentos/src/api/generateText.ts:521](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/generateText.ts#L521)

Parsed arguments.

***

### id

> **id**: `string`

Defined in: [packages/agentos/src/api/generateText.ts:523](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/generateText.ts#L523)

Tool call ID from the LLM.

***

### name

> **name**: `string`

Defined in: [packages/agentos/src/api/generateText.ts:519](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/generateText.ts#L519)

Tool name.

***

### step

> **step**: `number`

Defined in: [packages/agentos/src/api/generateText.ts:525](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/generateText.ts#L525)

Current agentic step index.
