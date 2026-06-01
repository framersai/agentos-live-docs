# Interface: ClassifyCompleteEvent

Defined in: [packages/agentos/src/orchestration/pipeline/query/types.ts:890](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/pipeline/query/types.ts#L890)

Emitted when query classification completes successfully.

## Properties

### durationMs

> **durationMs**: `number`

Defined in: [packages/agentos/src/orchestration/pipeline/query/types.ts:895](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/pipeline/query/types.ts#L895)

Duration of classification in milliseconds.

***

### result

> **result**: [`ClassificationResult`](ClassificationResult.md)

Defined in: [packages/agentos/src/orchestration/pipeline/query/types.ts:893](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/pipeline/query/types.ts#L893)

The classification result.

***

### timestamp

> **timestamp**: `number`

Defined in: [packages/agentos/src/orchestration/pipeline/query/types.ts:897](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/pipeline/query/types.ts#L897)

Timestamp when classification completed.

***

### type

> **type**: `"classify:complete"`

Defined in: [packages/agentos/src/orchestration/pipeline/query/types.ts:891](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/pipeline/query/types.ts#L891)
