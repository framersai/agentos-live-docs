# Interface: GuardrailEvaluationResult

Defined in: [packages/agentos/src/safety/guardrails/IGuardrailService.ts:120](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/safety/guardrails/IGuardrailService.ts#L120)

Result returned by a guardrail evaluation.

Contains the action to take and optional context about why.
This result is attached to response chunk metadata for observability.

## Example

```typescript
// Block with explanation
const result: GuardrailEvaluationResult = {
  action: GuardrailAction.BLOCK,
  reason: 'Content contains prohibited material',
  reasonCode: 'CONTENT_POLICY_001',
  metadata: { category: 'violence', confidence: 0.95 }
};

// Sanitize PII
const result: GuardrailEvaluationResult = {
  action: GuardrailAction.SANITIZE,
  modifiedText: 'Contact me at [EMAIL REDACTED]',
  reasonCode: 'PII_REDACTED'
};
```

## Properties

### action

> **action**: [`GuardrailAction`](../enumerations/GuardrailAction.md)

Defined in: [packages/agentos/src/safety/guardrails/IGuardrailService.ts:122](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/safety/guardrails/IGuardrailService.ts#L122)

The action AgentOS should take based on this evaluation

***

### details?

> `optional` **details**: `unknown`

Defined in: [packages/agentos/src/safety/guardrails/IGuardrailService.ts:146](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/safety/guardrails/IGuardrailService.ts#L146)

Detailed information about the evaluation (e.g., moderation scores,
stack traces, matched patterns). Not shown to users.

***

### metadata?

> `optional` **metadata**: `Record`\<`string`, `unknown`\>

Defined in: [packages/agentos/src/safety/guardrails/IGuardrailService.ts:140](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/safety/guardrails/IGuardrailService.ts#L140)

Additional metadata for analytics, audit, or debugging.
Persisted in response chunk metadata.

***

### modifiedText?

> `optional` **modifiedText**: `string` \| `null`

Defined in: [packages/agentos/src/safety/guardrails/IGuardrailService.ts:153](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/safety/guardrails/IGuardrailService.ts#L153)

Replacement text when action is [GuardrailAction.SANITIZE](../enumerations/GuardrailAction.md#sanitize).
For input evaluation: replaces textInput before orchestration.
For output evaluation: replaces textDelta (streaming) or finalResponseText (final).

***

### reason?

> `optional` **reason**: `string`

Defined in: [packages/agentos/src/safety/guardrails/IGuardrailService.ts:128](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/safety/guardrails/IGuardrailService.ts#L128)

Human-readable reason for the action.
May be shown to end users or logged for audit.

***

### reasonCode?

> `optional` **reasonCode**: `string`

Defined in: [packages/agentos/src/safety/guardrails/IGuardrailService.ts:134](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/safety/guardrails/IGuardrailService.ts#L134)

Machine-readable code identifying the policy or rule triggered.
Useful for analytics and automated handling.
