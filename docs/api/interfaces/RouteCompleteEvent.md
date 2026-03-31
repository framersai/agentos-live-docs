# Interface: RouteCompleteEvent

Defined in: [packages/agentos/src/query-router/types.ts:1021](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/query-router/types.ts#L1021)

Emitted when the entire query routing pipeline completes.

## Properties

### durationMs

> **durationMs**: `number`

Defined in: [packages/agentos/src/query-router/types.ts:1026](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/query-router/types.ts#L1026)

Total duration of the entire pipeline in milliseconds.

***

### result

> **result**: [`QueryRouterResult`](QueryRouterResult.md)

Defined in: [packages/agentos/src/query-router/types.ts:1024](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/query-router/types.ts#L1024)

The final query result.

***

### timestamp

> **timestamp**: `number`

Defined in: [packages/agentos/src/query-router/types.ts:1028](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/query-router/types.ts#L1028)

Timestamp when routing completed.

***

### type

> **type**: `"route:complete"`

Defined in: [packages/agentos/src/query-router/types.ts:1022](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/query-router/types.ts#L1022)
