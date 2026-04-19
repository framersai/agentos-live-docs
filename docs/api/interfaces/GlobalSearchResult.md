# Interface: GlobalSearchResult

Defined in: [packages/agentos/src/memory/retrieval/graph/graphrag/IGraphRAG.ts:108](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/retrieval/graph/graphrag/IGraphRAG.ts#L108)

## Properties

### answer

> **answer**: `string`

Defined in: [packages/agentos/src/memory/retrieval/graph/graphrag/IGraphRAG.ts:111](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/retrieval/graph/graphrag/IGraphRAG.ts#L111)

Aggregated answer from community summaries

***

### communitySummaries

> **communitySummaries**: `object`[]

Defined in: [packages/agentos/src/memory/retrieval/graph/graphrag/IGraphRAG.ts:113](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/retrieval/graph/graphrag/IGraphRAG.ts#L113)

Community summaries used to generate the answer

#### communityId

> **communityId**: `string`

#### level

> **level**: `number`

#### relevanceScore

> **relevanceScore**: `number`

#### summary

> **summary**: `string`

#### title

> **title**: `string`

***

### diagnostics?

> `optional` **diagnostics**: `object`

Defined in: [packages/agentos/src/memory/retrieval/graph/graphrag/IGraphRAG.ts:122](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/retrieval/graph/graphrag/IGraphRAG.ts#L122)

#### embeddingTimeMs?

> `optional` **embeddingTimeMs**: `number`

#### searchTimeMs?

> `optional` **searchTimeMs**: `number`

#### synthesisTimeMs?

> `optional` **synthesisTimeMs**: `number`

***

### query

> **query**: `string`

Defined in: [packages/agentos/src/memory/retrieval/graph/graphrag/IGraphRAG.ts:109](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/retrieval/graph/graphrag/IGraphRAG.ts#L109)

***

### totalCommunitiesSearched

> **totalCommunitiesSearched**: `number`

Defined in: [packages/agentos/src/memory/retrieval/graph/graphrag/IGraphRAG.ts:121](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/retrieval/graph/graphrag/IGraphRAG.ts#L121)

Total communities searched
