# Interface: SourceCitation

Defined in: [packages/agentos/src/orchestration/pipeline/query/types.ts:195](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/pipeline/query/types.ts#L195)

A citation referencing a source used in generating the final answer.

## Properties

### heading

> **heading**: `string`

Defined in: [packages/agentos/src/orchestration/pipeline/query/types.ts:200](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/pipeline/query/types.ts#L200)

Section heading within the source, if applicable.

***

### matchType

> **matchType**: `"vector"` \| `"graph"` \| `"research"`

Defined in: [packages/agentos/src/orchestration/pipeline/query/types.ts:212](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/pipeline/query/types.ts#L212)

Which retrieval method produced the cited source.

#### See

RetrievedChunk.matchType

***

### path

> **path**: `string`

Defined in: [packages/agentos/src/orchestration/pipeline/query/types.ts:197](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/pipeline/query/types.ts#L197)

File path or document path of the cited source.

***

### relevanceScore

> **relevanceScore**: `number`

Defined in: [packages/agentos/src/orchestration/pipeline/query/types.ts:206](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/pipeline/query/types.ts#L206)

Relevance score of the cited source (0 to 1).
Inherited from the highest-scoring chunk from this source.
