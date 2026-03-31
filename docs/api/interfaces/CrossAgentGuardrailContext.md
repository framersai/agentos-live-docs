# Interface: CrossAgentGuardrailContext

Defined in: [packages/agentos/src/safety/guardrails/crossAgentGuardrailDispatcher.ts:38](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/safety/guardrails/crossAgentGuardrailDispatcher.ts#L38)

Context for cross-agent guardrail evaluation.

## Properties

### agencyId?

> `optional` **agencyId**: `string`

Defined in: [packages/agentos/src/safety/guardrails/crossAgentGuardrailDispatcher.ts:46](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/safety/guardrails/crossAgentGuardrailDispatcher.ts#L46)

Agency ID if agents are in the same agency

***

### observerAgentId

> **observerAgentId**: `string`

Defined in: [packages/agentos/src/safety/guardrails/crossAgentGuardrailDispatcher.ts:43](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/safety/guardrails/crossAgentGuardrailDispatcher.ts#L43)

The agent running the cross-agent guardrails

***

### sourceAgentId

> **sourceAgentId**: `string`

Defined in: [packages/agentos/src/safety/guardrails/crossAgentGuardrailDispatcher.ts:40](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/safety/guardrails/crossAgentGuardrailDispatcher.ts#L40)

The agent whose output is being observed
