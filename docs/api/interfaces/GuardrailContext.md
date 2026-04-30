# Interface: GuardrailContext

Defined in: [packages/agentos/src/safety/guardrails/IGuardrailService.ts:76](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/safety/guardrails/IGuardrailService.ts#L76)

Lightweight description of the conversational context for guardrail decisions.

Provides identity and session information to help guardrails make
context-aware decisions (e.g., different policies per user tier).

## Example

```typescript
const context: GuardrailContext = {
  userId: 'user-123',
  sessionId: 'session-abc',
  personaId: 'support-agent',
  metadata: { userTier: 'premium', region: 'EU' }
};
```

## Properties

### conversationId?

> `optional` **conversationId**: `string`

Defined in: [packages/agentos/src/safety/guardrails/IGuardrailService.ts:87](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/safety/guardrails/IGuardrailService.ts#L87)

Conversation thread identifier

***

### metadata?

> `optional` **metadata**: `Record`\<`string`, `unknown`\>

Defined in: [packages/agentos/src/safety/guardrails/IGuardrailService.ts:93](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/safety/guardrails/IGuardrailService.ts#L93)

Additional context for guardrail evaluation

***

### mode?

> `optional` **mode**: `string`

Defined in: [packages/agentos/src/safety/guardrails/IGuardrailService.ts:90](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/safety/guardrails/IGuardrailService.ts#L90)

Operating mode (e.g., 'debug', 'production')

***

### personaId?

> `optional` **personaId**: `string`

Defined in: [packages/agentos/src/safety/guardrails/IGuardrailService.ts:84](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/safety/guardrails/IGuardrailService.ts#L84)

Active persona/agent identity (if applicable)

***

### sessionId

> **sessionId**: `string`

Defined in: [packages/agentos/src/safety/guardrails/IGuardrailService.ts:81](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/safety/guardrails/IGuardrailService.ts#L81)

Current session identifier

***

### userId

> **userId**: `string`

Defined in: [packages/agentos/src/safety/guardrails/IGuardrailService.ts:78](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/safety/guardrails/IGuardrailService.ts#L78)

Unique identifier for the user making the request
