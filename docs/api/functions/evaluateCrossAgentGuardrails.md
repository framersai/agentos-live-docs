# Function: evaluateCrossAgentGuardrails()

> **evaluateCrossAgentGuardrails**(`guardrails`, `crossAgentContext`, `guardrailContext`, `chunk`): `Promise`\<[`CrossAgentEvaluationResult`](../interfaces/CrossAgentEvaluationResult.md)\>

Defined in: [packages/agentos/src/safety/guardrails/crossAgentGuardrailDispatcher.ts:91](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/safety/guardrails/crossAgentGuardrailDispatcher.ts#L91)

Evaluate a chunk through all applicable cross-agent guardrails.

Filters guardrails to only those observing the source agent, then
evaluates the chunk through each. Respects `canInterruptOthers` flag.

## Parameters

### guardrails

[`ICrossAgentGuardrailService`](../interfaces/ICrossAgentGuardrailService.md)[]

Cross-agent guardrails to evaluate

### crossAgentContext

[`CrossAgentGuardrailContext`](../interfaces/CrossAgentGuardrailContext.md)

Source/observer agent context

### guardrailContext

[`GuardrailContext`](../interfaces/GuardrailContext.md)

Standard guardrail context

### chunk

[`AgentOSResponse`](../type-aliases/AgentOSResponse.md)

The output chunk to evaluate

## Returns

`Promise`\<[`CrossAgentEvaluationResult`](../interfaces/CrossAgentEvaluationResult.md)\>

Evaluation result with blocked status and any modifications

## Example

```typescript
const result = await evaluateCrossAgentGuardrails(
  crossAgentGuardrails,
  { sourceAgentId: 'worker-1', observerAgentId: 'supervisor' },
  guardrailContext,
  textDeltaChunk
);

if (result.blocked) {
  // Terminate the source agent's stream
} else if (result.modifiedChunk) {
  // Use the sanitized chunk
}
```
