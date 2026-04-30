# Interface: NodeExecutionResult

Defined in: [packages/agentos/src/orchestration/runtime/NodeExecutor.ts:44](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/orchestration/runtime/NodeExecutor.ts#L44)

The normalised result returned by every `NodeExecutor.execute()` call regardless
of which executor variant was dispatched.

The runtime inspects these fields to decide the next graph step:
- `success`          — whether the node completed without error.
- `output`           — arbitrary payload produced by the node (tool result, LLM response, etc.).
- `error`            — human-readable error message; only present when `success` is `false`.
- `routeTarget`      — next node id determined by a `router` or `guardrail` node.
- `scratchUpdate`    — partial object merged into `GraphState.scratch` by `StateManager`.
- `artifactsUpdate`  — partial object merged into `GraphState.artifacts` by `StateManager`.
- `events`           — additional `GraphEvent` values the executor wants the runtime to emit.
- `interrupt`        — when `true`, the runtime suspends the run and waits for human input.

## Properties

### artifactsUpdate?

> `optional` **artifactsUpdate**: `Record`\<`string`, `unknown`\>

Defined in: [packages/agentos/src/orchestration/runtime/NodeExecutor.ts:56](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/orchestration/runtime/NodeExecutor.ts#L56)

Partial update to merge into `GraphState.artifacts`.

***

### error?

> `optional` **error**: `string`

Defined in: [packages/agentos/src/orchestration/runtime/NodeExecutor.ts:50](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/orchestration/runtime/NodeExecutor.ts#L50)

Human-readable error description; populated only when `success` is `false`.

***

### events?

> `optional` **events**: [`GraphEvent`](../type-aliases/GraphEvent.md)[]

Defined in: [packages/agentos/src/orchestration/runtime/NodeExecutor.ts:58](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/orchestration/runtime/NodeExecutor.ts#L58)

Extra runtime events the executor wants to surface to callers.

***

### expansionRequests?

> `optional` **expansionRequests**: `object`[]

Defined in: [packages/agentos/src/orchestration/runtime/NodeExecutor.ts:60](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/orchestration/runtime/NodeExecutor.ts#L60)

Mission graph expansion requests emitted by this node's tool usage.

#### patch?

> `optional` **patch**: [`MissionGraphPatch`](MissionGraphPatch.md)

#### reason

> **reason**: `string`

#### request

> **request**: `unknown`

#### trigger

> **trigger**: [`MissionExpansionTrigger`](../type-aliases/MissionExpansionTrigger.md)

***

### interrupt?

> `optional` **interrupt**: `boolean`

Defined in: [packages/agentos/src/orchestration/runtime/NodeExecutor.ts:67](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/orchestration/runtime/NodeExecutor.ts#L67)

When `true`, the runtime must suspend and await human resolution.

***

### output?

> `optional` **output**: `unknown`

Defined in: [packages/agentos/src/orchestration/runtime/NodeExecutor.ts:48](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/orchestration/runtime/NodeExecutor.ts#L48)

Arbitrary output produced by the node.

***

### routeTarget?

> `optional` **routeTarget**: `string`

Defined in: [packages/agentos/src/orchestration/runtime/NodeExecutor.ts:52](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/orchestration/runtime/NodeExecutor.ts#L52)

Target node id returned by `router` or guardrail rerouting.

***

### scratchUpdate?

> `optional` **scratchUpdate**: `Record`\<`string`, `unknown`\>

Defined in: [packages/agentos/src/orchestration/runtime/NodeExecutor.ts:54](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/orchestration/runtime/NodeExecutor.ts#L54)

Partial update to merge into `GraphState.scratch`.

***

### success

> **success**: `boolean`

Defined in: [packages/agentos/src/orchestration/runtime/NodeExecutor.ts:46](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/orchestration/runtime/NodeExecutor.ts#L46)

Whether the node completed successfully.
