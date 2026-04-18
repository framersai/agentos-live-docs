# Interface: RaptorTreeStats

Defined in: [packages/agentos/src/rag/raptor/RaptorTree.ts:87](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/rag/raptor/RaptorTree.ts#L87)

Statistics about the constructed RAPTOR tree.

## Interface

RaptorTreeStats

## Properties

### buildTimeMs

> **buildTimeMs**: `number`

Defined in: [packages/agentos/src/rag/raptor/RaptorTree.ts:97](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/rag/raptor/RaptorTree.ts#L97)

Time taken to build the tree (ms).

***

### nodesPerLayer

> **nodesPerLayer**: `Record`\<`number`, `number`\>

Defined in: [packages/agentos/src/rag/raptor/RaptorTree.ts:91](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/rag/raptor/RaptorTree.ts#L91)

Number of nodes (chunks + summaries) per layer.

***

### totalClusters

> **totalClusters**: `number`

Defined in: [packages/agentos/src/rag/raptor/RaptorTree.ts:95](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/rag/raptor/RaptorTree.ts#L95)

Total number of clusters created.

***

### totalLayers

> **totalLayers**: `number`

Defined in: [packages/agentos/src/rag/raptor/RaptorTree.ts:89](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/rag/raptor/RaptorTree.ts#L89)

Total number of layers (0 = leaf only, 1 = one summary layer, etc.).

***

### totalNodes

> **totalNodes**: `number`

Defined in: [packages/agentos/src/rag/raptor/RaptorTree.ts:93](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/rag/raptor/RaptorTree.ts#L93)

Total nodes across all layers.
