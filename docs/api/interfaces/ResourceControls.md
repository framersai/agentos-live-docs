# Interface: ResourceControls

Defined in: [packages/agentos/src/api/types.ts:324](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/types.ts#L324)

Resource limits applied to the entire agency run.
The `onLimitReached` policy determines whether a breach is fatal.

## Properties

### maxAgentCalls?

> `optional` **maxAgentCalls**: `number`

Defined in: [packages/agentos/src/api/types.ts:332](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/types.ts#L332)

Maximum number of agent invocations (across all agents).

***

### maxCostUSD?

> `optional` **maxCostUSD**: `number`

Defined in: [packages/agentos/src/api/types.ts:328](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/types.ts#L328)

Maximum USD cost cap across the entire run.

***

### maxDurationMs?

> `optional` **maxDurationMs**: `number`

Defined in: [packages/agentos/src/api/types.ts:330](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/types.ts#L330)

Wall-clock time budget for the run in milliseconds.

***

### maxEmergentAgents?

> `optional` **maxEmergentAgents**: `number`

Defined in: [packages/agentos/src/api/types.ts:336](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/types.ts#L336)

Maximum number of emergent agents the orchestrator may synthesise.

***

### maxStepsPerAgent?

> `optional` **maxStepsPerAgent**: `number`

Defined in: [packages/agentos/src/api/types.ts:334](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/types.ts#L334)

Maximum steps per individual agent invocation.

***

### maxTotalTokens?

> `optional` **maxTotalTokens**: `number`

Defined in: [packages/agentos/src/api/types.ts:326](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/types.ts#L326)

Maximum total tokens (prompt + completion) across all agents and steps.

***

### onLimitReached?

> `optional` **onLimitReached**: `"error"` \| `"warn"` \| `"stop"`

Defined in: [packages/agentos/src/api/types.ts:343](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/types.ts#L343)

Action taken when any resource limit is breached.
- `"stop"` — gracefully stop and return partial results.
- `"warn"` — emit a `limitReached` event and continue.
- `"error"` — throw an error and halt immediately.
