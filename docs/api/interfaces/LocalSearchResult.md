# Interface: LocalSearchResult

Defined in: [packages/agentos/src/memory/retrieval/graph/graphrag/IGraphRAG.ts:129](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/retrieval/graph/graphrag/IGraphRAG.ts#L129)

## Properties

### augmentedContext

> **augmentedContext**: `string`

Defined in: [packages/agentos/src/memory/retrieval/graph/graphrag/IGraphRAG.ts:142](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/retrieval/graph/graphrag/IGraphRAG.ts#L142)

Assembled context string for LLM consumption

***

### communityContext

> **communityContext**: `object`[]

Defined in: [packages/agentos/src/memory/retrieval/graph/graphrag/IGraphRAG.ts:135](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/retrieval/graph/graphrag/IGraphRAG.ts#L135)

Community context for matched entities

#### communityId

> **communityId**: `string`

#### level

> **level**: `number`

#### summary

> **summary**: `string`

#### title

> **title**: `string`

***

### diagnostics?

> `optional` **diagnostics**: `object`

Defined in: [packages/agentos/src/memory/retrieval/graph/graphrag/IGraphRAG.ts:143](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/retrieval/graph/graphrag/IGraphRAG.ts#L143)

#### embeddingTimeMs?

> `optional` **embeddingTimeMs**: `number`

#### graphTraversalTimeMs?

> `optional` **graphTraversalTimeMs**: `number`

#### searchTimeMs?

> `optional` **searchTimeMs**: `number`

***

### entities

> **entities**: [`GraphEntity`](GraphEntity.md) & `object`[]

Defined in: [packages/agentos/src/memory/retrieval/graph/graphrag/IGraphRAG.ts:132](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/retrieval/graph/graphrag/IGraphRAG.ts#L132)

Direct entity/relationship matches

***

### query

> **query**: `string`

Defined in: [packages/agentos/src/memory/retrieval/graph/graphrag/IGraphRAG.ts:130](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/retrieval/graph/graphrag/IGraphRAG.ts#L130)

***

### relationships

> **relationships**: [`GraphRelationship`](GraphRelationship.md)[]

Defined in: [packages/agentos/src/memory/retrieval/graph/graphrag/IGraphRAG.ts:133](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/retrieval/graph/graphrag/IGraphRAG.ts#L133)
