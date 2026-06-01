# Interface: ResearchPhaseEvent

Defined in: [packages/agentos/src/orchestration/pipeline/query/types.ts:1003](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/pipeline/query/types.ts#L1003)

Emitted after each iteration of the research loop.

## Properties

### iteration

> **iteration**: `number`

Defined in: [packages/agentos/src/orchestration/pipeline/query/types.ts:1006](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/pipeline/query/types.ts#L1006)

Current iteration number (1-based).

***

### newChunksFound

> **newChunksFound**: `number`

Defined in: [packages/agentos/src/orchestration/pipeline/query/types.ts:1010](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/pipeline/query/types.ts#L1010)

Number of new chunks discovered in this iteration.

***

### timestamp

> **timestamp**: `number`

Defined in: [packages/agentos/src/orchestration/pipeline/query/types.ts:1012](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/pipeline/query/types.ts#L1012)

Timestamp of the event.

***

### totalIterations

> **totalIterations**: `number`

Defined in: [packages/agentos/src/orchestration/pipeline/query/types.ts:1008](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/pipeline/query/types.ts#L1008)

Total configured iterations.

***

### type

> **type**: `"research:phase"`

Defined in: [packages/agentos/src/orchestration/pipeline/query/types.ts:1004](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/pipeline/query/types.ts#L1004)
