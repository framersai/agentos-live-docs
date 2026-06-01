# Interface: GraphTraversalConfig

Defined in: [packages/agentos/src/cognition/rag/unified/types.ts:232](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/rag/unified/types.ts#L232)

Graph traversal configuration for GraphRAG.

## See

RetrievalPlan.graphConfig

## Properties

### maxDepth

> **maxDepth**: `number`

Defined in: [packages/agentos/src/cognition/rag/unified/types.ts:237](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/rag/unified/types.ts#L237)

Maximum depth to traverse from seed entities.

#### Default

```ts
2
```

***

### minEdgeWeight

> **minEdgeWeight**: `number`

Defined in: [packages/agentos/src/cognition/rag/unified/types.ts:243](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/rag/unified/types.ts#L243)

Minimum edge weight to follow during traversal.
Edges below this weight are pruned.

#### Default

```ts
0.3
```
