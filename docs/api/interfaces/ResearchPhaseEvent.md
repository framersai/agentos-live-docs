# Interface: ResearchPhaseEvent

Defined in: [packages/agentos/src/query-router/types.ts:990](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/query-router/types.ts#L990)

Emitted after each iteration of the research loop.

## Properties

### iteration

> **iteration**: `number`

Defined in: [packages/agentos/src/query-router/types.ts:993](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/query-router/types.ts#L993)

Current iteration number (1-based).

***

### newChunksFound

> **newChunksFound**: `number`

Defined in: [packages/agentos/src/query-router/types.ts:997](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/query-router/types.ts#L997)

Number of new chunks discovered in this iteration.

***

### timestamp

> **timestamp**: `number`

Defined in: [packages/agentos/src/query-router/types.ts:999](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/query-router/types.ts#L999)

Timestamp of the event.

***

### totalIterations

> **totalIterations**: `number`

Defined in: [packages/agentos/src/query-router/types.ts:995](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/query-router/types.ts#L995)

Total configured iterations.

***

### type

> **type**: `"research:phase"`

Defined in: [packages/agentos/src/query-router/types.ts:991](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/query-router/types.ts#L991)
