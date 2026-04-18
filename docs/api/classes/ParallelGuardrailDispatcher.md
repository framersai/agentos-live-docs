# Class: ParallelGuardrailDispatcher

Defined in: [packages/agentos/src/safety/guardrails/ParallelGuardrailDispatcher.ts:166](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/safety/guardrails/ParallelGuardrailDispatcher.ts#L166)

Stateless two-phase parallel guardrail dispatcher.

All methods are static — no instantiation needed. The class exists purely
as a namespace to keep the two public entry points grouped.

## Constructors

### Constructor

> **new ParallelGuardrailDispatcher**(): `ParallelGuardrailDispatcher`

#### Returns

`ParallelGuardrailDispatcher`

## Methods

### evaluateInput()

> `static` **evaluateInput**(`services`, `input`, `context`): `Promise`\<[`GuardrailInputOutcome`](../interfaces/GuardrailInputOutcome.md)\>

Defined in: [packages/agentos/src/safety/guardrails/ParallelGuardrailDispatcher.ts:192](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/safety/guardrails/ParallelGuardrailDispatcher.ts#L192)

Evaluate user input through registered guardrails using two-phase execution.

**Phase 1 (Sequential — sanitizers):**
Guardrails with `config.canSanitize === true` run one-at-a-time in
registration order. Each sees (and may modify) the cumulative sanitized
input. A BLOCK result short-circuits immediately — Phase 2 never runs.

**Phase 2 (Parallel — classifiers):**
All remaining guardrails run concurrently via `Promise.allSettled` on
the text produced by Phase 1. A Phase 2 SANITIZE is downgraded to FLAG.

**Aggregation:** worst-wins (BLOCK > FLAG > ALLOW). The singular
`evaluation` field is set to the first BLOCK, else the worst-severity
evaluation, else the last evaluation by registration order.

#### Parameters

##### services

[`IGuardrailService`](../interfaces/IGuardrailService.md)[]

Array of guardrail services (already normalized)

##### input

[`AgentOSInput`](../interfaces/AgentOSInput.md)

User input to evaluate

##### context

[`GuardrailContext`](../interfaces/GuardrailContext.md)

Conversational context for policy decisions

#### Returns

`Promise`\<[`GuardrailInputOutcome`](../interfaces/GuardrailInputOutcome.md)\>

Outcome with sanitized input and all evaluations in registration order

***

### wrapOutput()

> `static` **wrapOutput**(`services`, `context`, `stream`, `options`): `AsyncGenerator`\<[`AgentOSResponse`](../type-aliases/AgentOSResponse.md), `void`, `undefined`\>

Defined in: [packages/agentos/src/safety/guardrails/ParallelGuardrailDispatcher.ts:358](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/safety/guardrails/ParallelGuardrailDispatcher.ts#L358)

Wrap a response stream with two-phase guardrail filtering.

Partitions services into four groups (once, up front):
1. **Streaming sanitizers** (`canSanitize && evaluateStreamingChunks`)
2. **Streaming parallel** classifiers (`evaluateStreamingChunks && !canSanitize`)
3. **Final sanitizers** (`canSanitize && !evaluateStreamingChunks`)
4. **Final parallel** classifiers (the rest with `evaluateOutput`)

For each TEXT_DELTA chunk: Phase 1 runs streaming sanitizers sequentially
(with per-service rate limiting), then Phase 2 runs streaming classifiers
in parallel.

For each isFinal chunk: Phase 1 runs final sanitizers sequentially, then
Phase 2 runs final classifiers in parallel. All services with
`evaluateOutput` participate in final evaluation.

A BLOCK in either phase terminates the stream immediately with an error
chunk.

#### Parameters

##### services

[`IGuardrailService`](../interfaces/IGuardrailService.md)[]

Array of guardrail services (already normalized)

##### context

[`GuardrailContext`](../interfaces/GuardrailContext.md)

Conversational context for policy decisions

##### stream

`AsyncGenerator`\<[`AgentOSResponse`](../type-aliases/AgentOSResponse.md), `void`, `undefined`\>

Source response stream to filter

##### options

[`GuardrailOutputOptions`](../interfaces/GuardrailOutputOptions.md)

Stream options and input evaluations to embed

#### Returns

`AsyncGenerator`\<[`AgentOSResponse`](../type-aliases/AgentOSResponse.md), `void`, `undefined`\>

Wrapped async generator with guardrail filtering applied
