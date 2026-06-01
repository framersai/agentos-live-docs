# Interface: ClassifyErrorEvent

Defined in: [packages/agentos/src/orchestration/pipeline/query/types.ts:903](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/pipeline/query/types.ts#L903)

Emitted when query classification fails.

## Properties

### error

> **error**: `Error`

Defined in: [packages/agentos/src/orchestration/pipeline/query/types.ts:906](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/pipeline/query/types.ts#L906)

The error that caused classification to fail.

***

### timestamp

> **timestamp**: `number`

Defined in: [packages/agentos/src/orchestration/pipeline/query/types.ts:908](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/pipeline/query/types.ts#L908)

Timestamp when the error occurred.

***

### type

> **type**: `"classify:error"`

Defined in: [packages/agentos/src/orchestration/pipeline/query/types.ts:904](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/pipeline/query/types.ts#L904)
