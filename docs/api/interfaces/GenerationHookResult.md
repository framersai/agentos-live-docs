# Interface: GenerationHookResult

Defined in: [packages/agentos/src/api/generateText.ts:502](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/generateText.ts#L502)

Context available to post-generation hooks.
Hooks may return a modified copy to transform the generation output.

## Properties

### step

> **step**: `number`

Defined in: [packages/agentos/src/api/generateText.ts:510](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/generateText.ts#L510)

Current agentic step index (0-based).

***

### text

> **text**: `string`

Defined in: [packages/agentos/src/api/generateText.ts:504](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/generateText.ts#L504)

Generated text from the LLM.

***

### toolCalls

> **toolCalls**: [`ToolCallRecord`](ToolCallRecord.md)[]

Defined in: [packages/agentos/src/api/generateText.ts:506](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/generateText.ts#L506)

Tool calls requested by the LLM.

***

### usage

> **usage**: [`TokenUsage`](TokenUsage.md)

Defined in: [packages/agentos/src/api/generateText.ts:508](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/generateText.ts#L508)

Token usage for this step.
