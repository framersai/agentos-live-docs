# Interface: ResourceControls

Defined in: [packages/agentos/src/api/types.ts:593](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/types.ts#L593)

Resource limits applied to the entire agency run.
The `onLimitReached` policy determines whether a breach is fatal.

## Properties

### maxAgentCalls?

> `optional` **maxAgentCalls**: `number`

Defined in: [packages/agentos/src/api/types.ts:601](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/types.ts#L601)

Maximum number of agent invocations (across all agents).

***

### maxCostUSD?

> `optional` **maxCostUSD**: `number`

Defined in: [packages/agentos/src/api/types.ts:597](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/types.ts#L597)

Maximum USD cost cap across the entire run.

***

### maxDurationMs?

> `optional` **maxDurationMs**: `number`

Defined in: [packages/agentos/src/api/types.ts:599](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/types.ts#L599)

Wall-clock time budget for the run in milliseconds.

***

### maxEmergentAgents?

> `optional` **maxEmergentAgents**: `number`

Defined in: [packages/agentos/src/api/types.ts:605](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/types.ts#L605)

Maximum number of emergent agents the orchestrator may synthesise.

***

### maxStepsPerAgent?

> `optional` **maxStepsPerAgent**: `number`

Defined in: [packages/agentos/src/api/types.ts:603](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/types.ts#L603)

Maximum steps per individual agent invocation.

***

### maxTotalTokens?

> `optional` **maxTotalTokens**: `number`

Defined in: [packages/agentos/src/api/types.ts:595](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/types.ts#L595)

Maximum total tokens (prompt + completion) across all agents and steps.

***

### maxValidationRetries?

> `optional` **maxValidationRetries**: `number`

Defined in: [packages/agentos/src/api/types.ts:617](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/types.ts#L617)

Maximum number of retries when structured output validation fails.

When `agent({ output: someZodSchema })` is set and the LLM returns text
that does not parse or validate against the schema, the agency will
retry the generation up to this many times, each time appending an
error feedback hint to the prompt so the model can self-correct.

Defaults to `1` (one extra attempt = two total calls). Set to `0` to
disable retries entirely.

***

### onLimitReached?

> `optional` **onLimitReached**: `"error"` \| `"warn"` \| `"stop"`

Defined in: [packages/agentos/src/api/types.ts:624](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/types.ts#L624)

Action taken when any resource limit is breached.
- `"stop"` — gracefully stop and return partial results.
- `"warn"` — emit a `limitReached` event and continue.
- `"error"` — throw an error and halt immediately.
