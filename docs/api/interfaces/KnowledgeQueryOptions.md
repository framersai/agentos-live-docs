# Interface: KnowledgeQueryOptions

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts:185](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts#L185)

Options for querying the knowledge graph

## Properties

### entityTypes?

> `optional` **entityTypes**: [`EntityType`](../type-aliases/EntityType.md)[]

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts:187](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts#L187)

Filter by entity types

***

### includeEmbeddings?

> `optional` **includeEmbeddings**: `boolean`

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts:197](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts#L197)

Include embeddings in results

***

### limit?

> `optional` **limit**: `number`

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts:199](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts#L199)

Maximum results

***

### minConfidence?

> `optional` **minConfidence**: `number`

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts:195](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts#L195)

Minimum confidence threshold

***

### offset?

> `optional` **offset**: `number`

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts:201](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts#L201)

Offset for pagination

***

### ownerId?

> `optional` **ownerId**: `string`

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts:191](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts#L191)

Filter by owner

***

### relationTypes?

> `optional` **relationTypes**: [`RelationType`](../type-aliases/RelationType.md)[]

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts:189](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts#L189)

Filter by relation types

***

### tags?

> `optional` **tags**: `string`[]

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts:193](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts#L193)

Filter by tags

***

### timeRange?

> `optional` **timeRange**: `object`

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts:203](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts#L203)

Time range filter

#### from?

> `optional` **from**: `string`

#### to?

> `optional` **to**: `string`
