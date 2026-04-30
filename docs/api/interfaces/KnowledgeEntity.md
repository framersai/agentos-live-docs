# Interface: KnowledgeEntity

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts:23](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts#L23)

Represents an entity (node) in the knowledge graph

## Properties

### confidence

> **confidence**: `number`

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts:35](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts#L35)

Confidence score (0-1)

***

### createdAt

> **createdAt**: `string`

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts:39](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts#L39)

Creation timestamp

***

### embedding?

> `optional` **embedding**: `number`[]

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts:33](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts#L33)

Vector embedding for similarity search

***

### id

> **id**: `string`

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts:25](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts#L25)

Unique entity ID

***

### label

> **label**: `string`

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts:29](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts#L29)

Human-readable label

***

### metadata?

> `optional` **metadata**: `Record`\<`string`, `unknown`\>

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts:47](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts#L47)

Additional metadata

***

### ownerId?

> `optional` **ownerId**: `string`

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts:43](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts#L43)

Associated GMI or user ID

***

### properties

> **properties**: `Record`\<`string`, `unknown`\>

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts:31](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts#L31)

Entity properties/attributes

***

### source

> **source**: [`KnowledgeSource`](KnowledgeSource.md)

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts:37](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts#L37)

Source of this knowledge

***

### tags?

> `optional` **tags**: `string`[]

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts:45](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts#L45)

Tags for categorization

***

### type

> **type**: [`EntityType`](../type-aliases/EntityType.md)

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts:27](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts#L27)

Entity type (person, concept, event, location, etc.)

***

### updatedAt

> **updatedAt**: `string`

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts:41](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts#L41)

Last updated timestamp
