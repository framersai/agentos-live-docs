# Interface: GenerateTextResult

Defined in: [packages/agentos/src/api/generateText.ts:265](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/generateText.ts#L265)

The completed result returned by [generateText](../functions/generateText.md).

## Properties

### agentCalls?

> `optional` **agentCalls**: [`AgentCallRecord`](AgentCallRecord.md)[]

Defined in: [packages/agentos/src/api/generateText.ts:288](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/generateText.ts#L288)

Ordered records of every sub-agent call made during an `agency()` run.
`undefined` for plain `generateText` / `agent()` calls.

***

### finishReason

> **finishReason**: `"error"` \| `"length"` \| `"stop"` \| `"tool-calls"`

Defined in: [packages/agentos/src/api/generateText.ts:283](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/generateText.ts#L283)

Reason the model stopped generating.
- `"stop"` — natural end of response.
- `"length"` — `maxTokens` limit reached.
- `"tool-calls"` — loop exhausted `maxSteps` while still calling tools.
- `"error"` — provider returned an error.

***

### model

> **model**: `string`

Defined in: [packages/agentos/src/api/generateText.ts:269](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/generateText.ts#L269)

Resolved model identifier used for the run.

***

### parsed?

> `optional` **parsed**: `unknown`

Defined in: [packages/agentos/src/api/generateText.ts:298](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/generateText.ts#L298)

Parsed structured output produced when `BaseAgentConfig.output` is a Zod
schema.  `undefined` when no output schema is configured.

***

### plan?

> `optional` **plan**: `Plan`

Defined in: [packages/agentos/src/api/generateText.ts:303](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/generateText.ts#L303)

The plan produced by the planning phase when `planning` is enabled.
`undefined` when planning is disabled or was not requested.

***

### provider

> **provider**: `string`

Defined in: [packages/agentos/src/api/generateText.ts:267](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/generateText.ts#L267)

Provider identifier used for the final run.

***

### text

> **text**: `string`

Defined in: [packages/agentos/src/api/generateText.ts:271](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/generateText.ts#L271)

Final assistant text after all agentic steps have completed.

***

### toolCalls

> **toolCalls**: [`ToolCallRecord`](ToolCallRecord.md)[]

Defined in: [packages/agentos/src/api/generateText.ts:275](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/generateText.ts#L275)

Ordered list of every tool call made during the run.

***

### trace?

> `optional` **trace**: [`AgencyTraceEvent`](../type-aliases/AgencyTraceEvent.md)[]

Defined in: [packages/agentos/src/api/generateText.ts:293](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/generateText.ts#L293)

Structured trace events emitted during the run.
Populated by the agency orchestrator; `undefined` for single-agent calls.

***

### usage

> **usage**: [`TokenUsage`](TokenUsage.md)

Defined in: [packages/agentos/src/api/generateText.ts:273](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/generateText.ts#L273)

Aggregated token usage across all steps.
