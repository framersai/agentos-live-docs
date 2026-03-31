# Function: wrapWithCrossAgentGuardrails()

> **wrapWithCrossAgentGuardrails**(`guardrails`, `crossAgentContext`, `guardrailContext`, `stream`, `options`): `AsyncGenerator`\<[`AgentOSResponse`](../type-aliases/AgentOSResponse.md), `void`, `undefined`\>

Defined in: [packages/agentos/src/safety/guardrails/crossAgentGuardrailDispatcher.ts:227](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/safety/guardrails/crossAgentGuardrailDispatcher.ts#L227)

Wrap an agent's output stream with cross-agent guardrail supervision.

Creates an async generator that evaluates each chunk through applicable
cross-agent guardrails before yielding. If any guardrail returns BLOCK
(and has `canInterruptOthers: true`), the stream is terminated.

## Parameters

### guardrails

[`ICrossAgentGuardrailService`](../interfaces/ICrossAgentGuardrailService.md)[]

Cross-agent guardrails to apply

### crossAgentContext

[`CrossAgentGuardrailContext`](../interfaces/CrossAgentGuardrailContext.md)

Source/observer agent context

### guardrailContext

[`GuardrailContext`](../interfaces/GuardrailContext.md)

Standard guardrail context

### stream

`AsyncGenerator`\<[`AgentOSResponse`](../type-aliases/AgentOSResponse.md), `void`, `undefined`\>

Source agent's output stream

### options

[`GuardrailOutputOptions`](../interfaces/GuardrailOutputOptions.md)

Stream options

## Returns

`AsyncGenerator`\<[`AgentOSResponse`](../type-aliases/AgentOSResponse.md), `void`, `undefined`\>

Supervised stream with cross-agent guardrail filtering

## Example

```typescript
// Supervisor monitors worker agent
const supervisedStream = wrapWithCrossAgentGuardrails(
  [qualityGate, policyEnforcer],
  {
    sourceAgentId: 'worker-analyst',
    observerAgentId: 'supervisor',
    agencyId: 'research-agency'
  },
  guardrailContext,
  workerStream,
  { streamId: 'stream-xyz' }
);

for await (const chunk of supervisedStream) {
  // Chunk has been approved/modified by cross-agent guardrails
  yield chunk;
}
```
