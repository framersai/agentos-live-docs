# Interface: ResearchCompleteEvent

Defined in: [packages/agentos/src/orchestration/pipeline/query/types.ts:1018](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/pipeline/query/types.ts#L1018)

Emitted when deep research completes.

## Properties

### durationMs

> **durationMs**: `number`

Defined in: [packages/agentos/src/orchestration/pipeline/query/types.ts:1025](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/pipeline/query/types.ts#L1025)

Duration of the research phase in milliseconds.

***

### iterationsUsed

> **iterationsUsed**: `number`

Defined in: [packages/agentos/src/orchestration/pipeline/query/types.ts:1021](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/pipeline/query/types.ts#L1021)

Total number of research iterations performed.

***

### timestamp

> **timestamp**: `number`

Defined in: [packages/agentos/src/orchestration/pipeline/query/types.ts:1027](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/pipeline/query/types.ts#L1027)

Timestamp when research completed.

***

### totalChunks

> **totalChunks**: `number`

Defined in: [packages/agentos/src/orchestration/pipeline/query/types.ts:1023](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/pipeline/query/types.ts#L1023)

Total chunks gathered across all iterations.

***

### type

> **type**: `"research:complete"`

Defined in: [packages/agentos/src/orchestration/pipeline/query/types.ts:1019](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/pipeline/query/types.ts#L1019)
