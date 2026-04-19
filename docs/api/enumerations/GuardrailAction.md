# Enumeration: GuardrailAction

Defined in: [packages/agentos/src/safety/guardrails/IGuardrailService.ts:32](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/safety/guardrails/IGuardrailService.ts#L32)

High-level outcome emitted by a guardrail evaluation.

The action instructs AgentOS how to handle evaluated content:
- [GuardrailAction.ALLOW](#allow) - Pass through unchanged
- [GuardrailAction.FLAG](#flag) - Pass through but record metadata
- [GuardrailAction.SANITIZE](#sanitize) - Replace content with modified version
- [GuardrailAction.BLOCK](#block) - Reject/terminate the interaction

## Example

```typescript
// Allow content to pass
return { action: GuardrailAction.ALLOW };

// Block harmful content
return {
  action: GuardrailAction.BLOCK,
  reason: 'Content violates policy',
  reasonCode: 'POLICY_VIOLATION'
};

// Redact sensitive information
return {
  action: GuardrailAction.SANITIZE,
  modifiedText: text.replace(/\b\d{3}-\d{2}-\d{4}\b/g, '[SSN REDACTED]')
};
```

## Enumeration Members

### ALLOW

> **ALLOW**: `"allow"`

Defined in: [packages/agentos/src/safety/guardrails/IGuardrailService.ts:37](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/safety/guardrails/IGuardrailService.ts#L37)

Allow the content to pass through unchanged.
Use when content passes all policy checks.

***

### BLOCK

> **BLOCK**: `"block"`

Defined in: [packages/agentos/src/safety/guardrails/IGuardrailService.ts:57](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/safety/guardrails/IGuardrailService.ts#L57)

Block the interaction entirely and return an error to the host.
Use for policy violations, harmful content, or security threats.
Terminates the stream immediately when used in output evaluation.

***

### FLAG

> **FLAG**: `"flag"`

Defined in: [packages/agentos/src/safety/guardrails/IGuardrailService.ts:43](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/safety/guardrails/IGuardrailService.ts#L43)

Allow the request/response but record metadata for analytics or audit.
Content passes through, but the evaluation is logged for review.

***

### SANITIZE

> **SANITIZE**: `"sanitize"`

Defined in: [packages/agentos/src/safety/guardrails/IGuardrailService.ts:50](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/safety/guardrails/IGuardrailService.ts#L50)

Continue processing after replacing content with a sanitized version.
Use for PII redaction, profanity filtering, or content modification.
Requires [GuardrailEvaluationResult.modifiedText](../interfaces/GuardrailEvaluationResult.md#modifiedtext) to be set.
