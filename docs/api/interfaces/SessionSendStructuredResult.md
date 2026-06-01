# Interface: SessionSendStructuredResult\<T\>

Defined in: [packages/agentos/src/api/agent.ts:270](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/agent.ts#L270)

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

Defined in: [packages/agentos/src/api/generateText.ts:447](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/generateText.ts#L447)

Ordered records of every sub-agent call made during an `agency()` run.
`undefined` for plain `generateText` / `agent()` calls.

#### Inherited from

[`GenerateTextResult`](GenerateTextResult.md).[`agentCalls`](GenerateTextResult.md#agentcalls)

***

### finishReason

> **finishReason**: `"error"` \| `"length"` \| `"stop"` \| `"tool-calls"`

Defined in: [packages/agentos/src/api/generateText.ts:442](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/generateText.ts#L442)

Reason the model stopped generating.
- `"stop"`: natural end of response.
- `"length"`: `maxTokens` limit reached.
- `"tool-calls"`: loop exhausted `maxSteps` while still calling tools.
- `"error"`: provider returned an error.

#### Inherited from

[`GenerateTextResult`](GenerateTextResult.md).[`finishReason`](GenerateTextResult.md#finishreason)

***

### grounding?

> `optional` **grounding**: [`VerifiedResponse`](VerifiedResponse.md)

Defined in: [packages/agentos/src/api/generateText.ts:470](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/generateText.ts#L470)

Per-claim citation verdicts attached when `agent({ verifyCitations: … })`
is configured. `undefined` when verification was not requested or could
not run for this turn.

#### See

import('./types.js').VerifyCitationsConfig

#### Inherited from

[`GenerateTextResult`](GenerateTextResult.md).[`grounding`](GenerateTextResult.md#grounding)

***

### model

> **model**: `string`

Defined in: [packages/agentos/src/api/generateText.ts:428](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/generateText.ts#L428)

Resolved model identifier used for the run.

#### Inherited from

[`GenerateTextResult`](GenerateTextResult.md).[`model`](GenerateTextResult.md#model)

***

### object

> **object**: `T`

Defined in: [packages/agentos/src/api/agent.ts:272](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/agent.ts#L272)

Zod-validated typed object.

***

### parsed?

> `optional` **parsed**: `unknown`

Defined in: [packages/agentos/src/api/generateText.ts:457](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/generateText.ts#L457)

Parsed structured output produced when `BaseAgentConfig.output` is a Zod
schema.  `undefined` when no output schema is configured.

#### Inherited from

[`GenerateTextResult`](GenerateTextResult.md).[`parsed`](GenerateTextResult.md#parsed)

***

### plan?

> `optional` **plan**: `Plan`

Defined in: [packages/agentos/src/api/generateText.ts:462](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/generateText.ts#L462)

The plan produced by the planning phase when `planning` is enabled.
`undefined` when planning is disabled or was not requested.

#### Inherited from

[`GenerateTextResult`](GenerateTextResult.md).[`plan`](GenerateTextResult.md#plan)

***

### provider

> **provider**: `string`

Defined in: [packages/agentos/src/api/generateText.ts:426](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/generateText.ts#L426)

Provider identifier used for the final run.

#### Inherited from

[`GenerateTextResult`](GenerateTextResult.md).[`provider`](GenerateTextResult.md#provider)

***

### text

> **text**: `string`

Defined in: [packages/agentos/src/api/generateText.ts:430](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/generateText.ts#L430)

Final assistant text after all agentic steps have completed.

#### Inherited from

[`GenerateTextResult`](GenerateTextResult.md).[`text`](GenerateTextResult.md#text)

***

### toolCalls

> **toolCalls**: [`ToolCallRecord`](ToolCallRecord.md)[]

Defined in: [packages/agentos/src/api/generateText.ts:434](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/generateText.ts#L434)

Ordered list of every tool call made during the run.

#### Inherited from

[`GenerateTextResult`](GenerateTextResult.md).[`toolCalls`](GenerateTextResult.md#toolcalls)

***

### trace?

> `optional` **trace**: [`AgencyTraceEvent`](../type-aliases/AgencyTraceEvent.md)[]

Defined in: [packages/agentos/src/api/generateText.ts:452](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/generateText.ts#L452)

Structured trace events emitted during the run.
Populated by the agency orchestrator; `undefined` for single-agent calls.

#### Inherited from

[`GenerateTextResult`](GenerateTextResult.md).[`trace`](GenerateTextResult.md#trace)

***

### usage

> **usage**: [`TokenUsage`](TokenUsage.md)

Defined in: [packages/agentos/src/api/generateText.ts:432](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/generateText.ts#L432)

Aggregated token usage across all steps.

#### Inherited from

[`GenerateTextResult`](GenerateTextResult.md).[`usage`](GenerateTextResult.md#usage)
