# Interface: GuardrailOutputOptions

Defined in: [packages/agentos/src/safety/guardrails/guardrailDispatcher.ts:99](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/safety/guardrails/guardrailDispatcher.ts#L99)

Options for output guardrail wrapping.

## Properties

### inputEvaluations?

> `optional` **inputEvaluations**: [`GuardrailEvaluationResult`](GuardrailEvaluationResult.md)[] \| `null`

Defined in: [packages/agentos/src/safety/guardrails/guardrailDispatcher.ts:107](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/safety/guardrails/guardrailDispatcher.ts#L107)

Input evaluations to attach to first output chunk

***

### personaId?

> `optional` **personaId**: `string`

Defined in: [packages/agentos/src/safety/guardrails/guardrailDispatcher.ts:104](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/safety/guardrails/guardrailDispatcher.ts#L104)

Persona ID for error chunks

***

### ragSources?

> `optional` **ragSources**: [`RagRetrievedChunk`](RagRetrievedChunk.md)[]

Defined in: [packages/agentos/src/safety/guardrails/guardrailDispatcher.ts:110](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/safety/guardrails/guardrailDispatcher.ts#L110)

RAG sources to thread through to output guardrails for grounding verification

***

### streamId

> **streamId**: `string`

Defined in: [packages/agentos/src/safety/guardrails/guardrailDispatcher.ts:101](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/safety/guardrails/guardrailDispatcher.ts#L101)

Stream identifier for error chunks
