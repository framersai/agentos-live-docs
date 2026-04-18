# Interface: RetrievedChunk

Defined in: [packages/agentos/src/query-router/types.ts:164](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/query-router/types.ts#L164)

A single chunk of content retrieved during the retrieval phase.

## Properties

### content

> **content**: `string`

Defined in: [packages/agentos/src/query-router/types.ts:169](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/query-router/types.ts#L169)

The text content of the chunk.

***

### heading

> **heading**: `string`

Defined in: [packages/agentos/src/query-router/types.ts:172](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/query-router/types.ts#L172)

Section heading or title the chunk belongs to, if available.

***

### id

> **id**: `string`

Defined in: [packages/agentos/src/query-router/types.ts:166](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/query-router/types.ts#L166)

Unique identifier for the chunk (typically from the vector store).

***

### matchType

> **matchType**: `"vector"` \| `"graph"` \| `"research"`

Defined in: [packages/agentos/src/query-router/types.ts:189](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/query-router/types.ts#L189)

Which retrieval method produced this chunk.
- `'vector'` — Dense vector similarity search
- `'graph'` — Knowledge graph traversal (GraphRAG)
- `'research'` — Iterative deep research synthesis

***

### relevanceScore

> **relevanceScore**: `number`

Defined in: [packages/agentos/src/query-router/types.ts:181](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/query-router/types.ts#L181)

Relevance score (0 to 1) indicating how well this chunk matches
the query. Higher is better.

***

### sourcePath

> **sourcePath**: `string`

Defined in: [packages/agentos/src/query-router/types.ts:175](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/query-router/types.ts#L175)

File path or document source path this chunk was extracted from.
