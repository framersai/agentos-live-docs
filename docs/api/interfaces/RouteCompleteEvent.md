# Interface: RouteCompleteEvent

Defined in: [packages/agentos/src/orchestration/pipeline/query/types.ts:1059](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/pipeline/query/types.ts#L1059)

Emitted when the entire query routing pipeline completes.

## Properties

### durationMs

> **durationMs**: `number`

Defined in: [packages/agentos/src/orchestration/pipeline/query/types.ts:1064](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/pipeline/query/types.ts#L1064)

Total duration of the entire pipeline in milliseconds.

***

### result

> **result**: [`QueryRouterResult`](QueryRouterResult.md)

Defined in: [packages/agentos/src/orchestration/pipeline/query/types.ts:1062](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/pipeline/query/types.ts#L1062)

The final query result.

***

### timestamp

> **timestamp**: `number`

Defined in: [packages/agentos/src/orchestration/pipeline/query/types.ts:1066](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/pipeline/query/types.ts#L1066)

Timestamp when routing completed.

***

### type

> **type**: `"route:complete"`

Defined in: [packages/agentos/src/orchestration/pipeline/query/types.ts:1060](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/pipeline/query/types.ts#L1060)
