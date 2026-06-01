# Interface: GenerateCompleteEvent

Defined in: [packages/agentos/src/orchestration/pipeline/query/types.ts:1044](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/pipeline/query/types.ts#L1044)

Emitted when answer generation completes.

## Properties

### answerLength

> **answerLength**: `number`

Defined in: [packages/agentos/src/orchestration/pipeline/query/types.ts:1047](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/pipeline/query/types.ts#L1047)

Length of the generated answer in characters.

***

### citationCount

> **citationCount**: `number`

Defined in: [packages/agentos/src/orchestration/pipeline/query/types.ts:1049](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/pipeline/query/types.ts#L1049)

Number of source citations in the answer.

***

### durationMs

> **durationMs**: `number`

Defined in: [packages/agentos/src/orchestration/pipeline/query/types.ts:1051](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/pipeline/query/types.ts#L1051)

Duration of generation in milliseconds.

***

### timestamp

> **timestamp**: `number`

Defined in: [packages/agentos/src/orchestration/pipeline/query/types.ts:1053](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/pipeline/query/types.ts#L1053)

Timestamp when generation completed.

***

### type

> **type**: `"generate:complete"`

Defined in: [packages/agentos/src/orchestration/pipeline/query/types.ts:1045](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/pipeline/query/types.ts#L1045)
