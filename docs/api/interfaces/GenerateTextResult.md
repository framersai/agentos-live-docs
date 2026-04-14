# Interface: GenerateTextResult

Defined in: [packages/agentos/src/api/generateText.ts:304](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/api/generateText.ts#L304)

The completed result returned by [generateText](../functions/generateText.md).

## Properties

### agentCalls?

> `optional` **agentCalls**: [`AgentCallRecord`](AgentCallRecord.md)[]

Defined in: [packages/agentos/src/api/generateText.ts:327](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/api/generateText.ts#L327)

Ordered records of every sub-agent call made during an `agency()` run.
`undefined` for plain `generateText` / `agent()` calls.

***

### finishReason

> **finishReason**: `"error"` \| `"length"` \| `"stop"` \| `"tool-calls"`

Defined in: [packages/agentos/src/api/generateText.ts:322](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/api/generateText.ts#L322)

Reason the model stopped generating.
- `"stop"` — natural end of response.
- `"length"` — `maxTokens` limit reached.
- `"tool-calls"` — loop exhausted `maxSteps` while still calling tools.
- `"error"` — provider returned an error.

***

### model

> **model**: `string`

Defined in: [packages/agentos/src/api/generateText.ts:308](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/api/generateText.ts#L308)

Resolved model identifier used for the run.

***

### parsed?

> `optional` **parsed**: `unknown`

Defined in: [packages/agentos/src/api/generateText.ts:337](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/api/generateText.ts#L337)

Parsed structured output produced when `BaseAgentConfig.output` is a Zod
schema.  `undefined` when no output schema is configured.

***

### plan?

> `optional` **plan**: `Plan`

Defined in: [packages/agentos/src/api/generateText.ts:342](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/api/generateText.ts#L342)

The plan produced by the planning phase when `planning` is enabled.
`undefined` when planning is disabled or was not requested.

***

### provider

> **provider**: `string`

Defined in: [packages/agentos/src/api/generateText.ts:306](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/api/generateText.ts#L306)

Provider identifier used for the final run.

***

### text

> **text**: `string`

Defined in: [packages/agentos/src/api/generateText.ts:310](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/api/generateText.ts#L310)

Final assistant text after all agentic steps have completed.

***

### toolCalls

> **toolCalls**: [`ToolCallRecord`](ToolCallRecord.md)[]

Defined in: [packages/agentos/src/api/generateText.ts:314](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/api/generateText.ts#L314)

Ordered list of every tool call made during the run.

***

### trace?

> `optional` **trace**: [`AgencyTraceEvent`](../type-aliases/AgencyTraceEvent.md)[]

Defined in: [packages/agentos/src/api/generateText.ts:332](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/api/generateText.ts#L332)

Structured trace events emitted during the run.
Populated by the agency orchestrator; `undefined` for single-agent calls.

***

### usage

> **usage**: [`TokenUsage`](TokenUsage.md)

Defined in: [packages/agentos/src/api/generateText.ts:312](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/api/generateText.ts#L312)

Aggregated token usage across all steps.
