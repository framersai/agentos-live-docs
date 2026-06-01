# Interface: ResourceControls

Defined in: [packages/agentos/src/api/types.ts:605](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/types.ts#L605)

Resource limits applied to the entire agency run.
The `onLimitReached` policy determines whether a breach is fatal.

## Properties

### maxAgentCalls?

> `optional` **maxAgentCalls**: `number`

Defined in: [packages/agentos/src/api/types.ts:613](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/types.ts#L613)

Maximum number of agent invocations (across all agents).

***

### maxCostUSD?

> `optional` **maxCostUSD**: `number`

Defined in: [packages/agentos/src/api/types.ts:609](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/types.ts#L609)

Maximum USD cost cap across the entire run.

***

### maxDurationMs?

> `optional` **maxDurationMs**: `number`

Defined in: [packages/agentos/src/api/types.ts:611](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/types.ts#L611)

Wall-clock time budget for the run in milliseconds.

***

### maxEmergentAgents?

> `optional` **maxEmergentAgents**: `number`

Defined in: [packages/agentos/src/api/types.ts:617](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/types.ts#L617)

Maximum number of emergent agents the orchestrator may synthesise.

***

### maxStepsPerAgent?

> `optional` **maxStepsPerAgent**: `number`

Defined in: [packages/agentos/src/api/types.ts:615](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/types.ts#L615)

Maximum steps per individual agent invocation.

***

### maxTotalTokens?

> `optional` **maxTotalTokens**: `number`

Defined in: [packages/agentos/src/api/types.ts:607](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/types.ts#L607)

Maximum total tokens (prompt + completion) across all agents and steps.

***

### maxValidationRetries?

> `optional` **maxValidationRetries**: `number`

Defined in: [packages/agentos/src/api/types.ts:629](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/types.ts#L629)

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

Defined in: [packages/agentos/src/api/types.ts:636](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/types.ts#L636)

Action taken when any resource limit is breached.
- `"stop"` — gracefully stop and return partial results.
- `"warn"` — emit a `limitReached` event and continue.
- `"error"` — throw an error and halt immediately.
