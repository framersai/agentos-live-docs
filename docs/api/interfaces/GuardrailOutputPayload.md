# Interface: GuardrailOutputPayload

Defined in: [packages/agentos/src/safety/guardrails/IGuardrailService.ts:183](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/safety/guardrails/IGuardrailService.ts#L183)

Payload for output guardrail evaluation.

Provided to [IGuardrailService.evaluateOutput](IGuardrailService.md#evaluateoutput) before response
chunks are emitted to the client. Use this to filter, redact,
or block agent output.

## Remarks

The timing of evaluation depends on [GuardrailConfig.evaluateStreamingChunks](GuardrailConfig.md#evaluatestreamingchunks):
- `true`: Called for every TEXT_DELTA chunk (real-time filtering)
- `false` (default): Called only for FINAL_RESPONSE chunks

## Properties

### chunk

> **chunk**: [`AgentOSResponse`](../type-aliases/AgentOSResponse.md)

Defined in: [packages/agentos/src/safety/guardrails/IGuardrailService.ts:188](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/safety/guardrails/IGuardrailService.ts#L188)

The response chunk to evaluate

***

### context

> **context**: [`GuardrailContext`](GuardrailContext.md)

Defined in: [packages/agentos/src/safety/guardrails/IGuardrailService.ts:185](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/safety/guardrails/IGuardrailService.ts#L185)

Conversational context for policy decisions

***

### ragSources?

> `optional` **ragSources**: [`RagRetrievedChunk`](RagRetrievedChunk.md)[]

Defined in: [packages/agentos/src/safety/guardrails/IGuardrailService.ts:196](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/safety/guardrails/IGuardrailService.ts#L196)

RAG source chunks retrieved for this request.
Available to output guardrails for grounding verification.
Persists across all chunks in a stream (not just the final chunk).
Undefined when no RAG retrieval was performed.
