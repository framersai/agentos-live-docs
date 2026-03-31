# Interface: CrossAgentOutputPayload

Defined in: [packages/agentos/src/safety/guardrails/ICrossAgentGuardrailService.ts:44](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/safety/guardrails/ICrossAgentGuardrailService.ts#L44)

Payload for cross-agent output evaluation.

Provides information about both the source agent (producing output)
and the observer agent (running the guardrail).

## Properties

### agencyId?

> `optional` **agencyId**: `string`

Defined in: [packages/agentos/src/safety/guardrails/ICrossAgentGuardrailService.ts:60](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/safety/guardrails/ICrossAgentGuardrailService.ts#L60)

Agency ID if both agents belong to the same agency.
Useful for agency-level policy enforcement.

***

### chunk

> **chunk**: [`AgentOSResponse`](../type-aliases/AgentOSResponse.md)

Defined in: [packages/agentos/src/safety/guardrails/ICrossAgentGuardrailService.ts:65](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/safety/guardrails/ICrossAgentGuardrailService.ts#L65)

The output chunk from the source agent.

***

### context

> **context**: [`GuardrailContext`](GuardrailContext.md)

Defined in: [packages/agentos/src/safety/guardrails/ICrossAgentGuardrailService.ts:70](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/safety/guardrails/ICrossAgentGuardrailService.ts#L70)

Guardrail context for policy decisions.

***

### observerAgentId

> **observerAgentId**: `string`

Defined in: [packages/agentos/src/safety/guardrails/ICrossAgentGuardrailService.ts:54](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/safety/guardrails/ICrossAgentGuardrailService.ts#L54)

The agent running this guardrail (the observer/supervisor).

***

### sourceAgentId

> **sourceAgentId**: `string`

Defined in: [packages/agentos/src/safety/guardrails/ICrossAgentGuardrailService.ts:49](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/safety/guardrails/ICrossAgentGuardrailService.ts#L49)

The agent that produced this output chunk.
Use this to apply agent-specific policies.
