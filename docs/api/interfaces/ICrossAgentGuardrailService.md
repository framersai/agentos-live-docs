# Interface: ICrossAgentGuardrailService

Defined in: [packages/agentos/src/safety/guardrails/ICrossAgentGuardrailService.ts:127](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/safety/guardrails/ICrossAgentGuardrailService.ts#L127)

Cross-agent guardrail service for multi-agent supervision.

Extends [IGuardrailService](IGuardrailService.md) to enable observation and intervention
in other agents' output streams. Use this for:

- **Supervisor patterns**: A supervisor agent monitors worker agents
- **Quality gates**: Enforce quality standards across an agency
- **Policy enforcement**: Apply organization-wide rules to all agents
- **Safety monitoring**: Detect and prevent harmful outputs from any agent

## Examples

```typescript
class QualityGateGuardrail implements ICrossAgentGuardrailService {
  // Observe all agents in the agency
  observeAgentIds = [];
  canInterruptOthers = true;

  async evaluateCrossAgentOutput({ sourceAgentId, chunk, context }) {
    if (chunk.type === 'FINAL_RESPONSE') {
      const quality = await assessQuality(chunk.finalResponseText);
      if (quality.score < 0.5) {
        return {
          action: GuardrailAction.BLOCK,
          reason: 'Response did not meet quality standards',
          metadata: { qualityScore: quality.score, agent: sourceAgentId }
        };
      }
    }
    return null;
  }
}
```

```typescript
class SensitiveDataGuardrail implements ICrossAgentGuardrailService {
  // Only observe agents handling sensitive data
  observeAgentIds = ['data-analyst', 'report-generator'];
  canInterruptOthers = true;
  config = { evaluateStreamingChunks: true };

  async evaluateCrossAgentOutput({ chunk }) {
    if (chunk.textDelta && containsPII(chunk.textDelta)) {
      return {
        action: GuardrailAction.SANITIZE,
        modifiedText: redactPII(chunk.textDelta)
      };
    }
    return null;
  }
}
```

## Extends

- [`IGuardrailService`](IGuardrailService.md)

## Properties

### canInterruptOthers?

> `optional` **canInterruptOthers**: `boolean`

Defined in: [packages/agentos/src/safety/guardrails/ICrossAgentGuardrailService.ts:158](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/safety/guardrails/ICrossAgentGuardrailService.ts#L158)

Whether this guardrail can interrupt other agents' streams.

When `true`:
- [GuardrailAction.BLOCK](../enumerations/GuardrailAction.md#block) terminates the observed agent's stream
- [GuardrailAction.SANITIZE](../enumerations/GuardrailAction.md#sanitize) modifies the observed agent's output

When `false` (default):
- Guardrail can only observe and log (FLAG action)
- BLOCK/SANITIZE actions are downgraded to FLAG

#### Default

```ts
false
```

***

### config?

> `optional` **config**: [`GuardrailConfig`](GuardrailConfig.md)

Defined in: [packages/agentos/src/safety/guardrails/IGuardrailService.ts:379](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/safety/guardrails/IGuardrailService.ts#L379)

Configuration for evaluation behavior.
Controls streaming vs final-only evaluation and rate limiting.

#### Inherited from

[`IGuardrailService`](IGuardrailService.md).[`config`](IGuardrailService.md#config)

***

### observeAgentIds?

> `optional` **observeAgentIds**: `string`[]

Defined in: [packages/agentos/src/safety/guardrails/ICrossAgentGuardrailService.ts:143](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/safety/guardrails/ICrossAgentGuardrailService.ts#L143)

Agent IDs this guardrail observes.

- Empty array `[]` or undefined: Observe all agents in the agency
- Specific IDs: Only observe listed agents

#### Example

```typescript
// Observe specific workers
observeAgentIds = ['worker-1', 'worker-2'];

// Observe all agents
observeAgentIds = [];
```

## Methods

### evaluateCrossAgentOutput()?

> `optional` **evaluateCrossAgentOutput**(`payload`): `Promise`\<[`GuardrailEvaluationResult`](GuardrailEvaluationResult.md) \| `null`\>

Defined in: [packages/agentos/src/safety/guardrails/ICrossAgentGuardrailService.ts:175](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/safety/guardrails/ICrossAgentGuardrailService.ts#L175)

Evaluate output from an observed agent.

Called when an observed agent (per [observeAgentIds](#observeagentids)) emits a chunk.
The evaluation timing depends on [IGuardrailService.config](IGuardrailService.md#config):
- `evaluateStreamingChunks: true`: Called for each TEXT_DELTA
- `evaluateStreamingChunks: false`: Called only for FINAL_RESPONSE

#### Parameters

##### payload

[`CrossAgentOutputPayload`](CrossAgentOutputPayload.md)

Cross-agent context and chunk to evaluate

#### Returns

`Promise`\<[`GuardrailEvaluationResult`](GuardrailEvaluationResult.md) \| `null`\>

Evaluation result, or `null` to allow without action

#### Remarks

- Only effective when [canInterruptOthers](#caninterruptothers) is `true`
- Falls back to this guardrail's own stream for logging/metadata

***

### evaluateInput()?

> `optional` **evaluateInput**(`payload`): `Promise`\<[`GuardrailEvaluationResult`](GuardrailEvaluationResult.md) \| `null`\>

Defined in: [packages/agentos/src/safety/guardrails/IGuardrailService.ts:395](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/safety/guardrails/IGuardrailService.ts#L395)

Evaluate user input before orchestration.

Called once per request before the orchestration pipeline starts.
Use this to validate, sanitize, or block user messages.

#### Parameters

##### payload

[`GuardrailInputPayload`](GuardrailInputPayload.md)

Input and context to evaluate

#### Returns

`Promise`\<[`GuardrailEvaluationResult`](GuardrailEvaluationResult.md) \| `null`\>

Evaluation result, or `null` to allow without action

#### Remarks

- Return `BLOCK` to prevent the request from being processed
- Return `SANITIZE` with `modifiedText` to clean the input
- Return `null` or `ALLOW` to let the request through

#### Inherited from

[`IGuardrailService`](IGuardrailService.md).[`evaluateInput`](IGuardrailService.md#evaluateinput)

***

### evaluateOutput()?

> `optional` **evaluateOutput**(`payload`): `Promise`\<[`GuardrailEvaluationResult`](GuardrailEvaluationResult.md) \| `null`\>

Defined in: [packages/agentos/src/safety/guardrails/IGuardrailService.ts:412](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/safety/guardrails/IGuardrailService.ts#L412)

Evaluate agent output before streaming to client.

Called for response chunks based on [GuardrailConfig.evaluateStreamingChunks](GuardrailConfig.md#evaluatestreamingchunks):
- `true`: Called for every TEXT_DELTA chunk (real-time filtering)
- `false` (default): Called only for FINAL_RESPONSE chunks

#### Parameters

##### payload

[`GuardrailOutputPayload`](GuardrailOutputPayload.md)

Response chunk and context to evaluate

#### Returns

`Promise`\<[`GuardrailEvaluationResult`](GuardrailEvaluationResult.md) \| `null`\>

Evaluation result, or `null` to allow without action

#### Remarks

- Return `BLOCK` to immediately terminate the stream with an error
- Return `SANITIZE` with `modifiedText` to redact/modify content
- Streaming evaluation adds latency; use only when real-time filtering is required

#### Inherited from

[`IGuardrailService`](IGuardrailService.md).[`evaluateOutput`](IGuardrailService.md#evaluateoutput)
