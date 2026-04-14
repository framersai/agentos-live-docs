# Interface: TraversalOptions

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts:212](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts#L212)

Options for graph traversal

## Properties

### direction?

> `optional` **direction**: `"outgoing"` \| `"incoming"` \| `"both"`

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts:218](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts#L218)

Direction of traversal

***

### maxDepth?

> `optional` **maxDepth**: `number`

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts:214](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts#L214)

Maximum depth to traverse

***

### maxNodes?

> `optional` **maxNodes**: `number`

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts:222](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts#L222)

Maximum nodes to visit

***

### minWeight?

> `optional` **minWeight**: `number`

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts:220](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts#L220)

Minimum relation weight

***

### relationTypes?

> `optional` **relationTypes**: [`RelationType`](../type-aliases/RelationType.md)[]

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts:216](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts#L216)

Relation types to follow
