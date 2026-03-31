# Interface: ResourceControls

Defined in: [packages/agentos/src/api/types.ts:357](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/types.ts#L357)

Resource limits applied to the entire agency run.
The `onLimitReached` policy determines whether a breach is fatal.

## Properties

### maxAgentCalls?

> `optional` **maxAgentCalls**: `number`

Defined in: [packages/agentos/src/api/types.ts:365](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/types.ts#L365)

Maximum number of agent invocations (across all agents).

***

### maxCostUSD?

> `optional` **maxCostUSD**: `number`

Defined in: [packages/agentos/src/api/types.ts:361](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/types.ts#L361)

Maximum USD cost cap across the entire run.

***

### maxDurationMs?

> `optional` **maxDurationMs**: `number`

Defined in: [packages/agentos/src/api/types.ts:363](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/types.ts#L363)

Wall-clock time budget for the run in milliseconds.

***

### maxEmergentAgents?

> `optional` **maxEmergentAgents**: `number`

Defined in: [packages/agentos/src/api/types.ts:369](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/types.ts#L369)

Maximum number of emergent agents the orchestrator may synthesise.

***

### maxStepsPerAgent?

> `optional` **maxStepsPerAgent**: `number`

Defined in: [packages/agentos/src/api/types.ts:367](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/types.ts#L367)

Maximum steps per individual agent invocation.

***

### maxTotalTokens?

> `optional` **maxTotalTokens**: `number`

Defined in: [packages/agentos/src/api/types.ts:359](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/types.ts#L359)

Maximum total tokens (prompt + completion) across all agents and steps.

***

### onLimitReached?

> `optional` **onLimitReached**: `"error"` \| `"warn"` \| `"stop"`

Defined in: [packages/agentos/src/api/types.ts:376](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/types.ts#L376)

Action taken when any resource limit is breached.
- `"stop"` — gracefully stop and return partial results.
- `"warn"` — emit a `limitReached` event and continue.
- `"error"` — throw an error and halt immediately.
