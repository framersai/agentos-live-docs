# Interface: RaptorTreeStats

Defined in: [packages/agentos/src/cognition/rag/raptor/RaptorTree.ts:87](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/rag/raptor/RaptorTree.ts#L87)

Statistics about the constructed RAPTOR tree.

## Interface

RaptorTreeStats

## Properties

### buildTimeMs

> **buildTimeMs**: `number`

Defined in: [packages/agentos/src/cognition/rag/raptor/RaptorTree.ts:97](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/rag/raptor/RaptorTree.ts#L97)

Time taken to build the tree (ms).

***

### nodesPerLayer

> **nodesPerLayer**: `Record`\<`number`, `number`\>

Defined in: [packages/agentos/src/cognition/rag/raptor/RaptorTree.ts:91](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/rag/raptor/RaptorTree.ts#L91)

Number of nodes (chunks + summaries) per layer.

***

### totalClusters

> **totalClusters**: `number`

Defined in: [packages/agentos/src/cognition/rag/raptor/RaptorTree.ts:95](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/rag/raptor/RaptorTree.ts#L95)

Total number of clusters created.

***

### totalLayers

> **totalLayers**: `number`

Defined in: [packages/agentos/src/cognition/rag/raptor/RaptorTree.ts:89](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/rag/raptor/RaptorTree.ts#L89)

Total number of layers (0 = leaf only, 1 = one summary layer, etc.).

***

### totalNodes

> **totalNodes**: `number`

Defined in: [packages/agentos/src/cognition/rag/raptor/RaptorTree.ts:93](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/rag/raptor/RaptorTree.ts#L93)

Total nodes across all layers.
