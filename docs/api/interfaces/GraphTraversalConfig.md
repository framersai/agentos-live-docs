# Interface: GraphTraversalConfig

Defined in: [packages/agentos/src/rag/unified/types.ts:230](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/rag/unified/types.ts#L230)

Graph traversal configuration for GraphRAG.

## See

RetrievalPlan.graphConfig

## Properties

### maxDepth

> **maxDepth**: `number`

Defined in: [packages/agentos/src/rag/unified/types.ts:235](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/rag/unified/types.ts#L235)

Maximum depth to traverse from seed entities.

#### Default

```ts
2
```

***

### minEdgeWeight

> **minEdgeWeight**: `number`

Defined in: [packages/agentos/src/rag/unified/types.ts:241](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/rag/unified/types.ts#L241)

Minimum edge weight to follow during traversal.
Edges below this weight are pruned.

#### Default

```ts
0.3
```
