# Interface: ResourceControls

Defined in: [packages/agentos/src/api/types.ts:537](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/api/types.ts#L537)

Resource limits applied to the entire agency run.
The `onLimitReached` policy determines whether a breach is fatal.

## Properties

### maxAgentCalls?

> `optional` **maxAgentCalls**: `number`

Defined in: [packages/agentos/src/api/types.ts:545](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/api/types.ts#L545)

Maximum number of agent invocations (across all agents).

***

### maxCostUSD?

> `optional` **maxCostUSD**: `number`

Defined in: [packages/agentos/src/api/types.ts:541](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/api/types.ts#L541)

Maximum USD cost cap across the entire run.

***

### maxDurationMs?

> `optional` **maxDurationMs**: `number`

Defined in: [packages/agentos/src/api/types.ts:543](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/api/types.ts#L543)

Wall-clock time budget for the run in milliseconds.

***

### maxEmergentAgents?

> `optional` **maxEmergentAgents**: `number`

Defined in: [packages/agentos/src/api/types.ts:549](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/api/types.ts#L549)

Maximum number of emergent agents the orchestrator may synthesise.

***

### maxStepsPerAgent?

> `optional` **maxStepsPerAgent**: `number`

Defined in: [packages/agentos/src/api/types.ts:547](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/api/types.ts#L547)

Maximum steps per individual agent invocation.

***

### maxTotalTokens?

> `optional` **maxTotalTokens**: `number`

Defined in: [packages/agentos/src/api/types.ts:539](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/api/types.ts#L539)

Maximum total tokens (prompt + completion) across all agents and steps.

***

### maxValidationRetries?

> `optional` **maxValidationRetries**: `number`

Defined in: [packages/agentos/src/api/types.ts:561](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/api/types.ts#L561)

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

Defined in: [packages/agentos/src/api/types.ts:568](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/api/types.ts#L568)

Action taken when any resource limit is breached.
- `"stop"` — gracefully stop and return partial results.
- `"warn"` — emit a `limitReached` event and continue.
- `"error"` — throw an error and halt immediately.
