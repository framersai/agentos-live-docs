# Interface: SessionSendStructuredResult\<T\>

Defined in: [packages/agentos/src/api/agent.ts:235](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/agent.ts#L235)

Result returned by [AgentSession.send](AgentSession.md#send) when `responseSchema` is set.
Extends [GenerateTextResult](GenerateTextResult.md) with a typed Zod-validated `object`.

## Extends

- [`GenerateTextResult`](GenerateTextResult.md)

## Type Parameters

### T

`T`

## Properties

### agentCalls?

> `optional` **agentCalls**: [`AgentCallRecord`](AgentCallRecord.md)[]

Defined in: [packages/agentos/src/api/generateText.ts:401](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/generateText.ts#L401)

Ordered records of every sub-agent call made during an `agency()` run.
`undefined` for plain `generateText` / `agent()` calls.

#### Inherited from

[`GenerateTextResult`](GenerateTextResult.md).[`agentCalls`](GenerateTextResult.md#agentcalls)

***

### finishReason

> **finishReason**: `"error"` \| `"length"` \| `"stop"` \| `"tool-calls"`

Defined in: [packages/agentos/src/api/generateText.ts:396](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/generateText.ts#L396)

Reason the model stopped generating.
- `"stop"` — natural end of response.
- `"length"` — `maxTokens` limit reached.
- `"tool-calls"` — loop exhausted `maxSteps` while still calling tools.
- `"error"` — provider returned an error.

#### Inherited from

[`GenerateTextResult`](GenerateTextResult.md).[`finishReason`](GenerateTextResult.md#finishreason)

***

### model

> **model**: `string`

Defined in: [packages/agentos/src/api/generateText.ts:382](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/generateText.ts#L382)

Resolved model identifier used for the run.

#### Inherited from

[`GenerateTextResult`](GenerateTextResult.md).[`model`](GenerateTextResult.md#model)

***

### object

> **object**: `T`

Defined in: [packages/agentos/src/api/agent.ts:237](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/agent.ts#L237)

Zod-validated typed object.

***

### parsed?

> `optional` **parsed**: `unknown`

Defined in: [packages/agentos/src/api/generateText.ts:411](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/generateText.ts#L411)

Parsed structured output produced when `BaseAgentConfig.output` is a Zod
schema.  `undefined` when no output schema is configured.

#### Inherited from

[`GenerateTextResult`](GenerateTextResult.md).[`parsed`](GenerateTextResult.md#parsed)

***

### plan?

> `optional` **plan**: `Plan`

Defined in: [packages/agentos/src/api/generateText.ts:416](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/generateText.ts#L416)

The plan produced by the planning phase when `planning` is enabled.
`undefined` when planning is disabled or was not requested.

#### Inherited from

[`GenerateTextResult`](GenerateTextResult.md).[`plan`](GenerateTextResult.md#plan)

***

### provider

> **provider**: `string`

Defined in: [packages/agentos/src/api/generateText.ts:380](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/generateText.ts#L380)

Provider identifier used for the final run.

#### Inherited from

[`GenerateTextResult`](GenerateTextResult.md).[`provider`](GenerateTextResult.md#provider)

***

### text

> **text**: `string`

Defined in: [packages/agentos/src/api/generateText.ts:384](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/generateText.ts#L384)

Final assistant text after all agentic steps have completed.

#### Inherited from

[`GenerateTextResult`](GenerateTextResult.md).[`text`](GenerateTextResult.md#text)

***

### toolCalls

> **toolCalls**: [`ToolCallRecord`](ToolCallRecord.md)[]

Defined in: [packages/agentos/src/api/generateText.ts:388](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/generateText.ts#L388)

Ordered list of every tool call made during the run.

#### Inherited from

[`GenerateTextResult`](GenerateTextResult.md).[`toolCalls`](GenerateTextResult.md#toolcalls)

***

### trace?

> `optional` **trace**: [`AgencyTraceEvent`](../type-aliases/AgencyTraceEvent.md)[]

Defined in: [packages/agentos/src/api/generateText.ts:406](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/generateText.ts#L406)

Structured trace events emitted during the run.
Populated by the agency orchestrator; `undefined` for single-agent calls.

#### Inherited from

[`GenerateTextResult`](GenerateTextResult.md).[`trace`](GenerateTextResult.md#trace)

***

### usage

> **usage**: [`TokenUsage`](TokenUsage.md)

Defined in: [packages/agentos/src/api/generateText.ts:386](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/generateText.ts#L386)

Aggregated token usage across all steps.

#### Inherited from

[`GenerateTextResult`](GenerateTextResult.md).[`usage`](GenerateTextResult.md#usage)
