# Interface: SemanticSearchResult

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts:264](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts#L264)

Semantic search result

## Properties

### item

> **item**: [`KnowledgeEntity`](KnowledgeEntity.md) \| [`EpisodicMemory`](EpisodicMemory.md)

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts:266](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts#L266)

Matched entity or memory

***

### relatedEntities?

> `optional` **relatedEntities**: [`KnowledgeEntity`](KnowledgeEntity.md)[]

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts:272](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts#L272)

Related entities

***

### similarity

> **similarity**: `number`

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts:270](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts#L270)

Similarity score (0-1)

***

### type

> **type**: `"memory"` \| `"entity"`

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts:268](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts#L268)

Item type
