# Interface: GuardrailInputOutcome

Defined in: [packages/agentos/src/safety/guardrails/guardrailDispatcher.ts:85](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/safety/guardrails/guardrailDispatcher.ts#L85)

Result of running input guardrails.

Contains the potentially modified input and all evaluation results.
Check `evaluation.action` to determine if processing should continue.

## Properties

### evaluation?

> `optional` **evaluation**: [`GuardrailEvaluationResult`](GuardrailEvaluationResult.md) \| `null`

Defined in: [packages/agentos/src/safety/guardrails/guardrailDispatcher.ts:90](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/safety/guardrails/guardrailDispatcher.ts#L90)

The last evaluation result. Convenience accessor; prefer `evaluations[]` for the full set.

***

### evaluations?

> `optional` **evaluations**: [`GuardrailEvaluationResult`](GuardrailEvaluationResult.md)[]

Defined in: [packages/agentos/src/safety/guardrails/guardrailDispatcher.ts:93](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/safety/guardrails/guardrailDispatcher.ts#L93)

All evaluation results from all guardrails in execution order.

***

### sanitizedInput

> **sanitizedInput**: [`AgentOSInput`](AgentOSInput.md)

Defined in: [packages/agentos/src/safety/guardrails/guardrailDispatcher.ts:87](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/safety/guardrails/guardrailDispatcher.ts#L87)

Input after all sanitization (may be modified from original)
