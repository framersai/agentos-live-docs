# Interface: GenerationHookResult

Defined in: [packages/agentos/src/api/generateText.ts:448](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/generateText.ts#L448)

Context available to post-generation hooks.
Hooks may return a modified copy to transform the generation output.

## Properties

### step

> **step**: `number`

Defined in: [packages/agentos/src/api/generateText.ts:456](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/generateText.ts#L456)

Current agentic step index (0-based).

***

### text

> **text**: `string`

Defined in: [packages/agentos/src/api/generateText.ts:450](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/generateText.ts#L450)

Generated text from the LLM.

***

### toolCalls

> **toolCalls**: [`ToolCallRecord`](ToolCallRecord.md)[]

Defined in: [packages/agentos/src/api/generateText.ts:452](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/generateText.ts#L452)

Tool calls requested by the LLM.

***

### usage

> **usage**: [`TokenUsage`](TokenUsage.md)

Defined in: [packages/agentos/src/api/generateText.ts:454](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/generateText.ts#L454)

Token usage for this step.
