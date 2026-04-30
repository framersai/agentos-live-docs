# Interface: KnowledgeSource

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts:72](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts#L72)

Source of knowledge

## Properties

### method?

> `optional` **method**: `string`

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts:80](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts#L80)

Extraction method

***

### reference?

> `optional` **reference**: `string`

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts:76](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts#L76)

Source reference (conversation ID, document ID, URL, etc.)

***

### timestamp

> **timestamp**: `string`

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts:78](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts#L78)

Timestamp of extraction

***

### type

> **type**: `"conversation"` \| `"user_input"` \| `"rag_ingest"` \| `"web_search"` \| `"inference"` \| `"system"`

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts:74](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts#L74)

Source type
