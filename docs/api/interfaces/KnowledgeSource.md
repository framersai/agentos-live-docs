# Interface: KnowledgeSource

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts:72](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts#L72)

Source of knowledge

## Properties

### method?

> `optional` **method**: `string`

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts:80](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts#L80)

Extraction method

***

### reference?

> `optional` **reference**: `string`

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts:76](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts#L76)

Source reference (conversation ID, document ID, URL, etc.)

***

### timestamp

> **timestamp**: `string`

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts:78](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts#L78)

Timestamp of extraction

***

### type

> **type**: `"conversation"` \| `"user_input"` \| `"rag_ingest"` \| `"web_search"` \| `"inference"` \| `"system"`

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts:74](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts#L74)

Source type
