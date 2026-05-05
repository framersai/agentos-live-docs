# Interface: RouteCompleteEvent

Defined in: [packages/agentos/src/query-router/types.ts:1046](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/query-router/types.ts#L1046)

Emitted when the entire query routing pipeline completes.

## Properties

### durationMs

> **durationMs**: `number`

Defined in: [packages/agentos/src/query-router/types.ts:1051](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/query-router/types.ts#L1051)

Total duration of the entire pipeline in milliseconds.

***

### result

> **result**: [`QueryRouterResult`](QueryRouterResult.md)

Defined in: [packages/agentos/src/query-router/types.ts:1049](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/query-router/types.ts#L1049)

The final query result.

***

### timestamp

> **timestamp**: `number`

Defined in: [packages/agentos/src/query-router/types.ts:1053](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/query-router/types.ts#L1053)

Timestamp when routing completed.

***

### type

> **type**: `"route:complete"`

Defined in: [packages/agentos/src/query-router/types.ts:1047](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/query-router/types.ts#L1047)
