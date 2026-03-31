# Interface: CrossAgentEvaluationResult

Defined in: [packages/agentos/src/safety/guardrails/crossAgentGuardrailDispatcher.ts:52](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/safety/guardrails/crossAgentGuardrailDispatcher.ts#L52)

Result of cross-agent guardrail evaluation for a chunk.

## Properties

### blocked

> **blocked**: `boolean`

Defined in: [packages/agentos/src/safety/guardrails/crossAgentGuardrailDispatcher.ts:54](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/safety/guardrails/crossAgentGuardrailDispatcher.ts#L54)

Whether the chunk should be blocked

***

### evaluations

> **evaluations**: [`GuardrailEvaluationResult`](GuardrailEvaluationResult.md)[]

Defined in: [packages/agentos/src/safety/guardrails/crossAgentGuardrailDispatcher.ts:60](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/safety/guardrails/crossAgentGuardrailDispatcher.ts#L60)

All evaluation results from cross-agent guardrails

***

### modifiedChunk?

> `optional` **modifiedChunk**: [`AgentOSResponse`](../type-aliases/AgentOSResponse.md)

Defined in: [packages/agentos/src/safety/guardrails/crossAgentGuardrailDispatcher.ts:57](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/safety/guardrails/crossAgentGuardrailDispatcher.ts#L57)

Modified chunk (if sanitized)
