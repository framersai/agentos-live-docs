# Interface: RouteCompleteEvent

Defined in: [packages/agentos/src/query-router/types.ts:1035](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/query-router/types.ts#L1035)

Emitted when the entire query routing pipeline completes.

## Properties

### durationMs

> **durationMs**: `number`

Defined in: [packages/agentos/src/query-router/types.ts:1040](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/query-router/types.ts#L1040)

Total duration of the entire pipeline in milliseconds.

***

### result

> **result**: [`QueryRouterResult`](QueryRouterResult.md)

Defined in: [packages/agentos/src/query-router/types.ts:1038](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/query-router/types.ts#L1038)

The final query result.

***

### timestamp

> **timestamp**: `number`

Defined in: [packages/agentos/src/query-router/types.ts:1042](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/query-router/types.ts#L1042)

Timestamp when routing completed.

***

### type

> **type**: `"route:complete"`

Defined in: [packages/agentos/src/query-router/types.ts:1036](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/query-router/types.ts#L1036)
