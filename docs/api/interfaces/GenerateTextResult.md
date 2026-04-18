# Interface: GenerateTextResult

Defined in: [packages/agentos/src/api/generateText.ts:333](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/generateText.ts#L333)

The completed result returned by [generateText](../functions/generateText.md).

## Properties

### agentCalls?

> `optional` **agentCalls**: [`AgentCallRecord`](AgentCallRecord.md)[]

Defined in: [packages/agentos/src/api/generateText.ts:356](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/generateText.ts#L356)

Ordered records of every sub-agent call made during an `agency()` run.
`undefined` for plain `generateText` / `agent()` calls.

***

### finishReason

> **finishReason**: `"error"` \| `"length"` \| `"stop"` \| `"tool-calls"`

Defined in: [packages/agentos/src/api/generateText.ts:351](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/generateText.ts#L351)

Reason the model stopped generating.
- `"stop"` — natural end of response.
- `"length"` — `maxTokens` limit reached.
- `"tool-calls"` — loop exhausted `maxSteps` while still calling tools.
- `"error"` — provider returned an error.

***

### model

> **model**: `string`

Defined in: [packages/agentos/src/api/generateText.ts:337](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/generateText.ts#L337)

Resolved model identifier used for the run.

***

### parsed?

> `optional` **parsed**: `unknown`

Defined in: [packages/agentos/src/api/generateText.ts:366](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/generateText.ts#L366)

Parsed structured output produced when `BaseAgentConfig.output` is a Zod
schema.  `undefined` when no output schema is configured.

***

### plan?

> `optional` **plan**: `Plan`

Defined in: [packages/agentos/src/api/generateText.ts:371](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/generateText.ts#L371)

The plan produced by the planning phase when `planning` is enabled.
`undefined` when planning is disabled or was not requested.

***

### provider

> **provider**: `string`

Defined in: [packages/agentos/src/api/generateText.ts:335](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/generateText.ts#L335)

Provider identifier used for the final run.

***

### text

> **text**: `string`

Defined in: [packages/agentos/src/api/generateText.ts:339](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/generateText.ts#L339)

Final assistant text after all agentic steps have completed.

***

### toolCalls

> **toolCalls**: [`ToolCallRecord`](ToolCallRecord.md)[]

Defined in: [packages/agentos/src/api/generateText.ts:343](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/generateText.ts#L343)

Ordered list of every tool call made during the run.

***

### trace?

> `optional` **trace**: [`AgencyTraceEvent`](../type-aliases/AgencyTraceEvent.md)[]

Defined in: [packages/agentos/src/api/generateText.ts:361](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/generateText.ts#L361)

Structured trace events emitted during the run.
Populated by the agency orchestrator; `undefined` for single-agent calls.

***

### usage

> **usage**: [`TokenUsage`](TokenUsage.md)

Defined in: [packages/agentos/src/api/generateText.ts:341](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/generateText.ts#L341)

Aggregated token usage across all steps.
