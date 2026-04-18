# Interface: SemanticSearchOptions

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts:246](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts#L246)

Semantic search options

## Properties

### entityTypes?

> `optional` **entityTypes**: [`EntityType`](../type-aliases/EntityType.md)[]

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts:252](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts#L252)

Entity types to search

***

### minSimilarity?

> `optional` **minSimilarity**: `number`

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts:256](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts#L256)

Minimum similarity threshold (0-1)

***

### ownerId?

> `optional` **ownerId**: `string`

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts:258](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts#L258)

Owner filter

***

### query

> **query**: `string`

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts:248](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts#L248)

Query text

***

### scope?

> `optional` **scope**: `"all"` \| `"entities"` \| `"memories"`

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts:250](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts#L250)

Search scope

***

### topK?

> `optional` **topK**: `number`

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts:254](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts#L254)

Maximum results
