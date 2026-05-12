# Function: runPostApprovalGuardrails()

> **runPostApprovalGuardrails**(`toolName`, `args`, `guardrailIds`, `callbacks?`): `Promise`\<[`GuardrailHitlOverrideResult`](../interfaces/GuardrailHitlOverrideResult.md)\>

Defined in: [packages/agentos/src/api/agency.ts:1510](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/agency.ts#L1510)

Runs post-approval guardrails against tool call arguments to catch
destructive actions that slipped past the HITL handler.

This is the core safety net: even when auto-approve, LLM judge, or a
human approves a tool call, the configured guardrails get a final say.
If any guardrail returns `action: 'block'`, the approval is overridden.

## Parameters

### toolName

`string`

The tool that was approved.

### args

`Record`\<`string`, `unknown`\>

The arguments the tool would be called with.

### guardrailIds

`string`[]

Ordered list of guardrail IDs to evaluate.

### callbacks?

[`AgencyCallbacks`](../interfaces/AgencyCallbacks.md)

Optional event callback map for emitting override events.

## Returns

`Promise`\<[`GuardrailHitlOverrideResult`](../interfaces/GuardrailHitlOverrideResult.md)\>

A result indicating whether the guardrails passed.
