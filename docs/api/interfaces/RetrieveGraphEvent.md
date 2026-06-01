# Interface: RetrieveGraphEvent

Defined in: [packages/agentos/src/orchestration/pipeline/query/types.ts:938](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/pipeline/query/types.ts#L938)

Emitted when graph traversal results are available.

## Properties

### durationMs

> **durationMs**: `number`

Defined in: [packages/agentos/src/orchestration/pipeline/query/types.ts:943](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/pipeline/query/types.ts#L943)

Duration of graph retrieval in milliseconds.

***

### entityCount

> **entityCount**: `number`

Defined in: [packages/agentos/src/orchestration/pipeline/query/types.ts:941](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/pipeline/query/types.ts#L941)

Number of entities discovered via graph traversal.

***

### timestamp

> **timestamp**: `number`

Defined in: [packages/agentos/src/orchestration/pipeline/query/types.ts:945](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/pipeline/query/types.ts#L945)

Timestamp of the event.

***

### type

> **type**: `"retrieve:graph"`

Defined in: [packages/agentos/src/orchestration/pipeline/query/types.ts:939](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/pipeline/query/types.ts#L939)
