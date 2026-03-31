# Interface: GraphRuntimeConfig

Defined in: [packages/agentos/src/orchestration/runtime/GraphRuntime.ts:44](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/orchestration/runtime/GraphRuntime.ts#L44)

Dependencies required to construct a `GraphRuntime`.

## Properties

### checkpointStore

> **checkpointStore**: [`ICheckpointStore`](ICheckpointStore.md)

Defined in: [packages/agentos/src/orchestration/runtime/GraphRuntime.ts:46](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/orchestration/runtime/GraphRuntime.ts#L46)

Persistence backend for checkpoint snapshots.

***

### discoveryEngine?

> `optional` **discoveryEngine**: `object`

Defined in: [packages/agentos/src/orchestration/runtime/GraphRuntime.ts:58](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/orchestration/runtime/GraphRuntime.ts#L58)

Optional discovery engine for `discovery`-type edge routing.
When present and an edge has a `discoveryQuery`, the engine is called to
resolve the target dynamically. Falls back to `discoveryFallback` when absent.

#### discover()

> **discover**(`query`, `options?`): `Promise`\<\{ `results?`: `object`[]; \}\>

##### Parameters

###### query

`string`

###### options?

`unknown`

##### Returns

`Promise`\<\{ `results?`: `object`[]; \}\>

***

### expansionHandler?

> `optional` **expansionHandler**: [`GraphExpansionHandler`](GraphExpansionHandler.md)

Defined in: [packages/agentos/src/orchestration/runtime/GraphRuntime.ts:50](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/orchestration/runtime/GraphRuntime.ts#L50)

Optional mission graph expansion hook applied between node executions.

***

### nodeExecutor

> **nodeExecutor**: [`NodeExecutor`](../classes/NodeExecutor.md)

Defined in: [packages/agentos/src/orchestration/runtime/GraphRuntime.ts:48](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/orchestration/runtime/GraphRuntime.ts#L48)

Dispatcher that runs individual graph nodes.

***

### personaTraits?

> `optional` **personaTraits**: `Record`\<`string`, `number`\>

Defined in: [packages/agentos/src/orchestration/runtime/GraphRuntime.ts:66](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/orchestration/runtime/GraphRuntime.ts#L66)

Optional persona trait values for `personality`-type edge routing.
Keys are trait names (e.g. `'openness'`), values are 0–1 floats.
When absent, traits are read from `state.scratch._personaTraits` or default to 0.5.

***

### reevalInterval?

> `optional` **reevalInterval**: `number`

Defined in: [packages/agentos/src/orchestration/runtime/GraphRuntime.ts:52](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/orchestration/runtime/GraphRuntime.ts#L52)

Optional periodic planner reevaluation cadence, in completed nodes.
