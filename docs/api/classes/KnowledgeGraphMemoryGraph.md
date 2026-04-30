# Class: KnowledgeGraphMemoryGraph

Defined in: [packages/agentos/src/memory/retrieval/graph/KnowledgeGraphMemoryGraph.ts:59](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/retrieval/graph/KnowledgeGraphMemoryGraph.ts#L59)

## Implements

- [`IMemoryGraph`](../interfaces/IMemoryGraph.md)

## Constructors

### Constructor

> **new KnowledgeGraphMemoryGraph**(`kg`): `KnowledgeGraphMemoryGraph`

Defined in: [packages/agentos/src/memory/retrieval/graph/KnowledgeGraphMemoryGraph.ts:65](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/retrieval/graph/KnowledgeGraphMemoryGraph.ts#L65)

#### Parameters

##### kg

[`IKnowledgeGraph`](../interfaces/IKnowledgeGraph.md)

#### Returns

`KnowledgeGraphMemoryGraph`

## Methods

### addEdge()

> **addEdge**(`edge`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/memory/retrieval/graph/KnowledgeGraphMemoryGraph.ts:115](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/retrieval/graph/KnowledgeGraphMemoryGraph.ts#L115)

#### Parameters

##### edge

[`MemoryEdge`](../interfaces/MemoryEdge.md)

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IMemoryGraph`](../interfaces/IMemoryGraph.md).[`addEdge`](../interfaces/IMemoryGraph.md#addedge)

***

### addNode()

> **addNode**(`memoryId`, `metadata`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/memory/retrieval/graph/KnowledgeGraphMemoryGraph.ts:82](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/retrieval/graph/KnowledgeGraphMemoryGraph.ts#L82)

#### Parameters

##### memoryId

`string`

##### metadata

[`MemoryGraphNodeMeta`](../interfaces/MemoryGraphNodeMeta.md)

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IMemoryGraph`](../interfaces/IMemoryGraph.md).[`addNode`](../interfaces/IMemoryGraph.md#addnode)

***

### clear()

> **clear**(): `void`

Defined in: [packages/agentos/src/memory/retrieval/graph/KnowledgeGraphMemoryGraph.ts:294](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/retrieval/graph/KnowledgeGraphMemoryGraph.ts#L294)

#### Returns

`void`

#### Implementation of

[`IMemoryGraph`](../interfaces/IMemoryGraph.md).[`clear`](../interfaces/IMemoryGraph.md#clear)

***

### detectClusters()

> **detectClusters**(`minSize?`): `Promise`\<[`MemoryCluster`](../interfaces/MemoryCluster.md)[]\>

Defined in: [packages/agentos/src/memory/retrieval/graph/KnowledgeGraphMemoryGraph.ts:236](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/retrieval/graph/KnowledgeGraphMemoryGraph.ts#L236)

#### Parameters

##### minSize?

`number` = `3`

#### Returns

`Promise`\<[`MemoryCluster`](../interfaces/MemoryCluster.md)[]\>

#### Implementation of

[`IMemoryGraph`](../interfaces/IMemoryGraph.md).[`detectClusters`](../interfaces/IMemoryGraph.md#detectclusters)

***

### edgeCount()

> **edgeCount**(): `number`

Defined in: [packages/agentos/src/memory/retrieval/graph/KnowledgeGraphMemoryGraph.ts:286](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/retrieval/graph/KnowledgeGraphMemoryGraph.ts#L286)

#### Returns

`number`

#### Implementation of

[`IMemoryGraph`](../interfaces/IMemoryGraph.md).[`edgeCount`](../interfaces/IMemoryGraph.md#edgecount)

***

### getConflicts()

> **getConflicts**(`memoryId`): [`MemoryEdge`](../interfaces/MemoryEdge.md)[]

Defined in: [packages/agentos/src/memory/retrieval/graph/KnowledgeGraphMemoryGraph.ts:230](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/retrieval/graph/KnowledgeGraphMemoryGraph.ts#L230)

#### Parameters

##### memoryId

`string`

#### Returns

[`MemoryEdge`](../interfaces/MemoryEdge.md)[]

#### Implementation of

[`IMemoryGraph`](../interfaces/IMemoryGraph.md).[`getConflicts`](../interfaces/IMemoryGraph.md#getconflicts)

***

### getEdges()

> **getEdges**(`memoryId`, `type?`): [`MemoryEdge`](../interfaces/MemoryEdge.md)[]

Defined in: [packages/agentos/src/memory/retrieval/graph/KnowledgeGraphMemoryGraph.ts:142](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/retrieval/graph/KnowledgeGraphMemoryGraph.ts#L142)

#### Parameters

##### memoryId

`string`

##### type?

[`MemoryEdgeType`](../type-aliases/MemoryEdgeType.md)

#### Returns

[`MemoryEdge`](../interfaces/MemoryEdge.md)[]

#### Implementation of

[`IMemoryGraph`](../interfaces/IMemoryGraph.md).[`getEdges`](../interfaces/IMemoryGraph.md#getedges)

***

### hasNode()

> **hasNode**(`memoryId`): `boolean`

Defined in: [packages/agentos/src/memory/retrieval/graph/KnowledgeGraphMemoryGraph.ts:109](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/retrieval/graph/KnowledgeGraphMemoryGraph.ts#L109)

#### Parameters

##### memoryId

`string`

#### Returns

`boolean`

#### Implementation of

[`IMemoryGraph`](../interfaces/IMemoryGraph.md).[`hasNode`](../interfaces/IMemoryGraph.md#hasnode)

***

### initialize()

> **initialize**(): `Promise`\<`void`\>

Defined in: [packages/agentos/src/memory/retrieval/graph/KnowledgeGraphMemoryGraph.ts:67](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/retrieval/graph/KnowledgeGraphMemoryGraph.ts#L67)

Initialize the graph backend.

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IMemoryGraph`](../interfaces/IMemoryGraph.md).[`initialize`](../interfaces/IMemoryGraph.md#initialize)

***

### nodeCount()

> **nodeCount**(): `number`

Defined in: [packages/agentos/src/memory/retrieval/graph/KnowledgeGraphMemoryGraph.ts:282](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/retrieval/graph/KnowledgeGraphMemoryGraph.ts#L282)

#### Returns

`number`

#### Implementation of

[`IMemoryGraph`](../interfaces/IMemoryGraph.md).[`nodeCount`](../interfaces/IMemoryGraph.md#nodecount)

***

### recordCoActivation()

> **recordCoActivation**(`memoryIds`, `learningRate?`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/memory/retrieval/graph/KnowledgeGraphMemoryGraph.ts:200](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/retrieval/graph/KnowledgeGraphMemoryGraph.ts#L200)

#### Parameters

##### memoryIds

`string`[]

##### learningRate?

`number` = `0.1`

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IMemoryGraph`](../interfaces/IMemoryGraph.md).[`recordCoActivation`](../interfaces/IMemoryGraph.md#recordcoactivation)

***

### removeEdge()

> **removeEdge**(`sourceId`, `targetId`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/memory/retrieval/graph/KnowledgeGraphMemoryGraph.ts:148](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/retrieval/graph/KnowledgeGraphMemoryGraph.ts#L148)

#### Parameters

##### sourceId

`string`

##### targetId

`string`

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IMemoryGraph`](../interfaces/IMemoryGraph.md).[`removeEdge`](../interfaces/IMemoryGraph.md#removeedge)

***

### removeNode()

> **removeNode**(`memoryId`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/memory/retrieval/graph/KnowledgeGraphMemoryGraph.ts:103](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/retrieval/graph/KnowledgeGraphMemoryGraph.ts#L103)

#### Parameters

##### memoryId

`string`

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IMemoryGraph`](../interfaces/IMemoryGraph.md).[`removeNode`](../interfaces/IMemoryGraph.md#removenode)

***

### shutdown()

> **shutdown**(): `Promise`\<`void`\>

Defined in: [packages/agentos/src/memory/retrieval/graph/KnowledgeGraphMemoryGraph.ts:299](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/retrieval/graph/KnowledgeGraphMemoryGraph.ts#L299)

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IMemoryGraph`](../interfaces/IMemoryGraph.md).[`shutdown`](../interfaces/IMemoryGraph.md#shutdown)

***

### spreadingActivation()

> **spreadingActivation**(`seedIds`, `config?`): `Promise`\<[`ActivatedNode`](../interfaces/ActivatedNode.md)[]\>

Defined in: [packages/agentos/src/memory/retrieval/graph/KnowledgeGraphMemoryGraph.ts:172](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/retrieval/graph/KnowledgeGraphMemoryGraph.ts#L172)

#### Parameters

##### seedIds

`string`[]

##### config?

[`SpreadingActivationConfig`](../interfaces/SpreadingActivationConfig.md)

#### Returns

`Promise`\<[`ActivatedNode`](../interfaces/ActivatedNode.md)[]\>

#### Implementation of

[`IMemoryGraph`](../interfaces/IMemoryGraph.md).[`spreadingActivation`](../interfaces/IMemoryGraph.md#spreadingactivation)
