# Interface: RouteCompleteEvent

Defined in: [packages/agentos/src/query-router/types.ts:1046](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/query-router/types.ts#L1046)

Emitted when the entire query routing pipeline completes.

## Properties

### durationMs

> **durationMs**: `number`

Defined in: [packages/agentos/src/query-router/types.ts:1051](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/query-router/types.ts#L1051)

Total duration of the entire pipeline in milliseconds.

***

### result

> **result**: [`QueryRouterResult`](QueryRouterResult.md)

Defined in: [packages/agentos/src/query-router/types.ts:1049](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/query-router/types.ts#L1049)

The final query result.

***

### timestamp

> **timestamp**: `number`

Defined in: [packages/agentos/src/query-router/types.ts:1053](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/query-router/types.ts#L1053)

Timestamp when routing completed.

***

### type

> **type**: `"route:complete"`

Defined in: [packages/agentos/src/query-router/types.ts:1047](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/query-router/types.ts#L1047)
