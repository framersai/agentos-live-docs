# Interface: IMemoryGraph

Defined in: [packages/agentos/src/memory/retrieval/graph/IMemoryGraph.ts:87](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/retrieval/graph/IMemoryGraph.ts#L87)

## Methods

### addEdge()

> **addEdge**(`edge`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/memory/retrieval/graph/IMemoryGraph.ts:97](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/retrieval/graph/IMemoryGraph.ts#L97)

#### Parameters

##### edge

[`MemoryEdge`](MemoryEdge.md)

#### Returns

`Promise`\<`void`\>

***

### addNode()

> **addNode**(`memoryId`, `metadata`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/memory/retrieval/graph/IMemoryGraph.ts:92](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/retrieval/graph/IMemoryGraph.ts#L92)

#### Parameters

##### memoryId

`string`

##### metadata

[`MemoryGraphNodeMeta`](MemoryGraphNodeMeta.md)

#### Returns

`Promise`\<`void`\>

***

### clear()

> **clear**(): `void`

Defined in: [packages/agentos/src/memory/retrieval/graph/IMemoryGraph.ts:119](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/retrieval/graph/IMemoryGraph.ts#L119)

#### Returns

`void`

***

### detectClusters()

> **detectClusters**(`minSize?`): `Promise`\<[`MemoryCluster`](MemoryCluster.md)[]\>

Defined in: [packages/agentos/src/memory/retrieval/graph/IMemoryGraph.ts:114](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/retrieval/graph/IMemoryGraph.ts#L114)

#### Parameters

##### minSize?

`number`

#### Returns

`Promise`\<[`MemoryCluster`](MemoryCluster.md)[]\>

***

### edgeCount()

> **edgeCount**(): `number`

Defined in: [packages/agentos/src/memory/retrieval/graph/IMemoryGraph.ts:118](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/retrieval/graph/IMemoryGraph.ts#L118)

#### Returns

`number`

***

### getConflicts()

> **getConflicts**(`memoryId`): [`MemoryEdge`](MemoryEdge.md)[]

Defined in: [packages/agentos/src/memory/retrieval/graph/IMemoryGraph.ts:111](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/retrieval/graph/IMemoryGraph.ts#L111)

#### Parameters

##### memoryId

`string`

#### Returns

[`MemoryEdge`](MemoryEdge.md)[]

***

### getEdges()

> **getEdges**(`memoryId`, `type?`): [`MemoryEdge`](MemoryEdge.md)[]

Defined in: [packages/agentos/src/memory/retrieval/graph/IMemoryGraph.ts:98](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/retrieval/graph/IMemoryGraph.ts#L98)

#### Parameters

##### memoryId

`string`

##### type?

[`MemoryEdgeType`](../type-aliases/MemoryEdgeType.md)

#### Returns

[`MemoryEdge`](MemoryEdge.md)[]

***

### hasNode()

> **hasNode**(`memoryId`): `boolean`

Defined in: [packages/agentos/src/memory/retrieval/graph/IMemoryGraph.ts:94](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/retrieval/graph/IMemoryGraph.ts#L94)

#### Parameters

##### memoryId

`string`

#### Returns

`boolean`

***

### initialize()

> **initialize**(): `Promise`\<`void`\>

Defined in: [packages/agentos/src/memory/retrieval/graph/IMemoryGraph.ts:89](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/retrieval/graph/IMemoryGraph.ts#L89)

Initialize the graph backend.

#### Returns

`Promise`\<`void`\>

***

### nodeCount()

> **nodeCount**(): `number`

Defined in: [packages/agentos/src/memory/retrieval/graph/IMemoryGraph.ts:117](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/retrieval/graph/IMemoryGraph.ts#L117)

#### Returns

`number`

***

### recordCoActivation()

> **recordCoActivation**(`memoryIds`, `learningRate?`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/memory/retrieval/graph/IMemoryGraph.ts:108](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/retrieval/graph/IMemoryGraph.ts#L108)

#### Parameters

##### memoryIds

`string`[]

##### learningRate?

`number`

#### Returns

`Promise`\<`void`\>

***

### removeEdge()

> **removeEdge**(`sourceId`, `targetId`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/memory/retrieval/graph/IMemoryGraph.ts:99](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/retrieval/graph/IMemoryGraph.ts#L99)

#### Parameters

##### sourceId

`string`

##### targetId

`string`

#### Returns

`Promise`\<`void`\>

***

### removeNode()

> **removeNode**(`memoryId`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/memory/retrieval/graph/IMemoryGraph.ts:93](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/retrieval/graph/IMemoryGraph.ts#L93)

#### Parameters

##### memoryId

`string`

#### Returns

`Promise`\<`void`\>

***

### shutdown()

> **shutdown**(): `Promise`\<`void`\>

Defined in: [packages/agentos/src/memory/retrieval/graph/IMemoryGraph.ts:120](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/retrieval/graph/IMemoryGraph.ts#L120)

#### Returns

`Promise`\<`void`\>

***

### spreadingActivation()

> **spreadingActivation**(`seedIds`, `config?`): `Promise`\<[`ActivatedNode`](ActivatedNode.md)[]\>

Defined in: [packages/agentos/src/memory/retrieval/graph/IMemoryGraph.ts:102](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/retrieval/graph/IMemoryGraph.ts#L102)

#### Parameters

##### seedIds

`string`[]

##### config?

[`SpreadingActivationConfig`](SpreadingActivationConfig.md)

#### Returns

`Promise`\<[`ActivatedNode`](ActivatedNode.md)[]\>
