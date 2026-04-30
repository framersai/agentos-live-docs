# Interface: GenerateTextResult

Defined in: [packages/agentos/src/api/generateText.ts:344](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/generateText.ts#L344)

The completed result returned by [generateText](../functions/generateText.md).

## Properties

### agentCalls?

> `optional` **agentCalls**: [`AgentCallRecord`](AgentCallRecord.md)[]

Defined in: [packages/agentos/src/api/generateText.ts:367](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/generateText.ts#L367)

Ordered records of every sub-agent call made during an `agency()` run.
`undefined` for plain `generateText` / `agent()` calls.

***

### finishReason

> **finishReason**: `"error"` \| `"length"` \| `"stop"` \| `"tool-calls"`

Defined in: [packages/agentos/src/api/generateText.ts:362](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/generateText.ts#L362)

Reason the model stopped generating.
- `"stop"` — natural end of response.
- `"length"` — `maxTokens` limit reached.
- `"tool-calls"` — loop exhausted `maxSteps` while still calling tools.
- `"error"` — provider returned an error.

***

### model

> **model**: `string`

Defined in: [packages/agentos/src/api/generateText.ts:348](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/generateText.ts#L348)

Resolved model identifier used for the run.

***

### parsed?

> `optional` **parsed**: `unknown`

Defined in: [packages/agentos/src/api/generateText.ts:377](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/generateText.ts#L377)

Parsed structured output produced when `BaseAgentConfig.output` is a Zod
schema.  `undefined` when no output schema is configured.

***

### plan?

> `optional` **plan**: `Plan`

Defined in: [packages/agentos/src/api/generateText.ts:382](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/generateText.ts#L382)

The plan produced by the planning phase when `planning` is enabled.
`undefined` when planning is disabled or was not requested.

***

### provider

> **provider**: `string`

Defined in: [packages/agentos/src/api/generateText.ts:346](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/generateText.ts#L346)

Provider identifier used for the final run.

***

### text

> **text**: `string`

Defined in: [packages/agentos/src/api/generateText.ts:350](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/generateText.ts#L350)

Final assistant text after all agentic steps have completed.

***

### toolCalls

> **toolCalls**: [`ToolCallRecord`](ToolCallRecord.md)[]

Defined in: [packages/agentos/src/api/generateText.ts:354](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/generateText.ts#L354)

Ordered list of every tool call made during the run.

***

### trace?

> `optional` **trace**: [`AgencyTraceEvent`](../type-aliases/AgencyTraceEvent.md)[]

Defined in: [packages/agentos/src/api/generateText.ts:372](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/generateText.ts#L372)

Structured trace events emitted during the run.
Populated by the agency orchestrator; `undefined` for single-agent calls.

***

### usage

> **usage**: [`TokenUsage`](TokenUsage.md)

Defined in: [packages/agentos/src/api/generateText.ts:352](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/generateText.ts#L352)

Aggregated token usage across all steps.
