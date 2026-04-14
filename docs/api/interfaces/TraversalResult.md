# Interface: TraversalResult

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts:228](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts#L228)

Result of a graph traversal

## Properties

### levels

> **levels**: `object`[]

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts:232](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts#L232)

Discovered entities by depth level

#### depth

> **depth**: `number`

#### entities

> **entities**: [`KnowledgeEntity`](KnowledgeEntity.md)[]

#### relations

> **relations**: [`KnowledgeRelation`](KnowledgeRelation.md)[]

***

### root

> **root**: [`KnowledgeEntity`](KnowledgeEntity.md)

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts:230](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts#L230)

Starting entity

***

### totalEntities

> **totalEntities**: `number`

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts:238](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts#L238)

Total entities found

***

### totalRelations

> **totalRelations**: `number`

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts:240](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts#L240)

Total relations traversed
