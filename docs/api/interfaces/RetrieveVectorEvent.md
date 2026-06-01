# Interface: RetrieveVectorEvent

Defined in: [packages/agentos/src/orchestration/pipeline/query/types.ts:925](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/pipeline/query/types.ts#L925)

Emitted when vector search results are available.

## Properties

### chunkCount

> **chunkCount**: `number`

Defined in: [packages/agentos/src/orchestration/pipeline/query/types.ts:928](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/pipeline/query/types.ts#L928)

Number of chunks returned by vector search.

***

### durationMs

> **durationMs**: `number`

Defined in: [packages/agentos/src/orchestration/pipeline/query/types.ts:930](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/pipeline/query/types.ts#L930)

Duration of vector retrieval in milliseconds.

***

### timestamp

> **timestamp**: `number`

Defined in: [packages/agentos/src/orchestration/pipeline/query/types.ts:932](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/pipeline/query/types.ts#L932)

Timestamp of the event.

***

### type

> **type**: `"retrieve:vector"`

Defined in: [packages/agentos/src/orchestration/pipeline/query/types.ts:926](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/pipeline/query/types.ts#L926)
