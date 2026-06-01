# Interface: RetrieveFallbackEvent

Defined in: [packages/agentos/src/orchestration/pipeline/query/types.ts:977](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/pipeline/query/types.ts#L977)

Emitted when a retrieval fallback strategy is activated.

## Properties

### reason

> **reason**: `string`

Defined in: [packages/agentos/src/orchestration/pipeline/query/types.ts:982](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/pipeline/query/types.ts#L982)

Reason the fallback was triggered.

***

### strategy

> **strategy**: `string`

Defined in: [packages/agentos/src/orchestration/pipeline/query/types.ts:980](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/pipeline/query/types.ts#L980)

Name of the fallback strategy activated (e.g., 'keyword-fallback').

***

### timestamp

> **timestamp**: `number`

Defined in: [packages/agentos/src/orchestration/pipeline/query/types.ts:984](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/pipeline/query/types.ts#L984)

Timestamp of the event.

***

### type

> **type**: `"retrieve:fallback"`

Defined in: [packages/agentos/src/orchestration/pipeline/query/types.ts:978](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/pipeline/query/types.ts#L978)
