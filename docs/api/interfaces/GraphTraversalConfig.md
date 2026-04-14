# Interface: GraphTraversalConfig

Defined in: [packages/agentos/src/rag/unified/types.ts:230](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/rag/unified/types.ts#L230)

Graph traversal configuration for GraphRAG.

## See

RetrievalPlan.graphConfig

## Properties

### maxDepth

> **maxDepth**: `number`

Defined in: [packages/agentos/src/rag/unified/types.ts:235](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/rag/unified/types.ts#L235)

Maximum depth to traverse from seed entities.

#### Default

```ts
2
```

***

### minEdgeWeight

> **minEdgeWeight**: `number`

Defined in: [packages/agentos/src/rag/unified/types.ts:241](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/rag/unified/types.ts#L241)

Minimum edge weight to follow during traversal.
Edges below this weight are pruned.

#### Default

```ts
0.3
```
