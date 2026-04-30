# Interface: GraphCommunity

Defined in: [packages/agentos/src/memory/retrieval/graph/graphrag/IGraphRAG.ts:48](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/retrieval/graph/graphrag/IGraphRAG.ts#L48)

## Properties

### childCommunityIds

> **childCommunityIds**: `string`[]

Defined in: [packages/agentos/src/memory/retrieval/graph/graphrag/IGraphRAG.ts:55](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/retrieval/graph/graphrag/IGraphRAG.ts#L55)

Child community IDs

***

### createdAt

> **createdAt**: `string`

Defined in: [packages/agentos/src/memory/retrieval/graph/graphrag/IGraphRAG.ts:68](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/retrieval/graph/graphrag/IGraphRAG.ts#L68)

***

### entityIds

> **entityIds**: `string`[]

Defined in: [packages/agentos/src/memory/retrieval/graph/graphrag/IGraphRAG.ts:57](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/retrieval/graph/graphrag/IGraphRAG.ts#L57)

Entity IDs belonging to this community

***

### findings

> **findings**: `string`[]

Defined in: [packages/agentos/src/memory/retrieval/graph/graphrag/IGraphRAG.ts:63](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/retrieval/graph/graphrag/IGraphRAG.ts#L63)

Key findings extracted from the community

***

### id

> **id**: `string`

Defined in: [packages/agentos/src/memory/retrieval/graph/graphrag/IGraphRAG.ts:49](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/retrieval/graph/graphrag/IGraphRAG.ts#L49)

***

### importance

> **importance**: `number`

Defined in: [packages/agentos/src/memory/retrieval/graph/graphrag/IGraphRAG.ts:65](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/retrieval/graph/graphrag/IGraphRAG.ts#L65)

Aggregate importance score

***

### level

> **level**: `number`

Defined in: [packages/agentos/src/memory/retrieval/graph/graphrag/IGraphRAG.ts:51](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/retrieval/graph/graphrag/IGraphRAG.ts#L51)

Level in the hierarchy (0 = root, higher = more granular)

***

### parentCommunityId

> **parentCommunityId**: `string` \| `null`

Defined in: [packages/agentos/src/memory/retrieval/graph/graphrag/IGraphRAG.ts:53](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/retrieval/graph/graphrag/IGraphRAG.ts#L53)

Parent community ID (null for root)

***

### relationshipIds

> **relationshipIds**: `string`[]

Defined in: [packages/agentos/src/memory/retrieval/graph/graphrag/IGraphRAG.ts:59](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/retrieval/graph/graphrag/IGraphRAG.ts#L59)

Relationship IDs internal to this community

***

### summary

> **summary**: `string`

Defined in: [packages/agentos/src/memory/retrieval/graph/graphrag/IGraphRAG.ts:61](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/retrieval/graph/graphrag/IGraphRAG.ts#L61)

LLM-generated summary of this community

***

### title

> **title**: `string`

Defined in: [packages/agentos/src/memory/retrieval/graph/graphrag/IGraphRAG.ts:67](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/retrieval/graph/graphrag/IGraphRAG.ts#L67)

Title/label for the community
