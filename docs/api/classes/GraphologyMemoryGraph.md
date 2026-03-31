# Class: GraphologyMemoryGraph

Defined in: [packages/agentos/src/memory/retrieval/graph/GraphologyMemoryGraph.ts:46](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/retrieval/graph/GraphologyMemoryGraph.ts#L46)

## Implements

- [`IMemoryGraph`](../interfaces/IMemoryGraph.md)

## Constructors

### Constructor

> **new GraphologyMemoryGraph**(): `GraphologyMemoryGraph`

#### Returns

`GraphologyMemoryGraph`

## Methods

### addEdge()

> **addEdge**(`edge`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/memory/retrieval/graph/GraphologyMemoryGraph.ts:83](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/retrieval/graph/GraphologyMemoryGraph.ts#L83)

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

Defined in: [packages/agentos/src/memory/retrieval/graph/GraphologyMemoryGraph.ts:61](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/retrieval/graph/GraphologyMemoryGraph.ts#L61)

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

Defined in: [packages/agentos/src/memory/retrieval/graph/GraphologyMemoryGraph.ts:258](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/retrieval/graph/GraphologyMemoryGraph.ts#L258)

#### Returns

`void`

#### Implementation of

[`IMemoryGraph`](../interfaces/IMemoryGraph.md).[`clear`](../interfaces/IMemoryGraph.md#clear)

***

### detectClusters()

> **detectClusters**(`minSize?`): `Promise`\<[`MemoryCluster`](../interfaces/MemoryCluster.md)[]\>

Defined in: [packages/agentos/src/memory/retrieval/graph/GraphologyMemoryGraph.ts:195](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/retrieval/graph/GraphologyMemoryGraph.ts#L195)

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

Defined in: [packages/agentos/src/memory/retrieval/graph/GraphologyMemoryGraph.ts:254](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/retrieval/graph/GraphologyMemoryGraph.ts#L254)

#### Returns

`number`

#### Implementation of

[`IMemoryGraph`](../interfaces/IMemoryGraph.md).[`edgeCount`](../interfaces/IMemoryGraph.md#edgecount)

***

### getConflicts()

> **getConflicts**(`memoryId`): [`MemoryEdge`](../interfaces/MemoryEdge.md)[]

Defined in: [packages/agentos/src/memory/retrieval/graph/GraphologyMemoryGraph.ts:189](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/retrieval/graph/GraphologyMemoryGraph.ts#L189)

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

Defined in: [packages/agentos/src/memory/retrieval/graph/GraphologyMemoryGraph.ts:108](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/retrieval/graph/GraphologyMemoryGraph.ts#L108)

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

Defined in: [packages/agentos/src/memory/retrieval/graph/GraphologyMemoryGraph.ts:77](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/retrieval/graph/GraphologyMemoryGraph.ts#L77)

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

Defined in: [packages/agentos/src/memory/retrieval/graph/GraphologyMemoryGraph.ts:49](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/retrieval/graph/GraphologyMemoryGraph.ts#L49)

Initialize the graph backend.

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IMemoryGraph`](../interfaces/IMemoryGraph.md).[`initialize`](../interfaces/IMemoryGraph.md#initialize)

***

### nodeCount()

> **nodeCount**(): `number`

Defined in: [packages/agentos/src/memory/retrieval/graph/GraphologyMemoryGraph.ts:250](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/retrieval/graph/GraphologyMemoryGraph.ts#L250)

#### Returns

`number`

#### Implementation of

[`IMemoryGraph`](../interfaces/IMemoryGraph.md).[`nodeCount`](../interfaces/IMemoryGraph.md#nodecount)

***

### recordCoActivation()

> **recordCoActivation**(`memoryIds`, `learningRate?`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/memory/retrieval/graph/GraphologyMemoryGraph.ts:162](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/retrieval/graph/GraphologyMemoryGraph.ts#L162)

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

Defined in: [packages/agentos/src/memory/retrieval/graph/GraphologyMemoryGraph.ts:128](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/retrieval/graph/GraphologyMemoryGraph.ts#L128)

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

Defined in: [packages/agentos/src/memory/retrieval/graph/GraphologyMemoryGraph.ts:70](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/retrieval/graph/GraphologyMemoryGraph.ts#L70)

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

Defined in: [packages/agentos/src/memory/retrieval/graph/GraphologyMemoryGraph.ts:262](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/retrieval/graph/GraphologyMemoryGraph.ts#L262)

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IMemoryGraph`](../interfaces/IMemoryGraph.md).[`shutdown`](../interfaces/IMemoryGraph.md#shutdown)

***

### spreadingActivation()

> **spreadingActivation**(`seedIds`, `config?`): `Promise`\<[`ActivatedNode`](../interfaces/ActivatedNode.md)[]\>

Defined in: [packages/agentos/src/memory/retrieval/graph/GraphologyMemoryGraph.ts:138](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/retrieval/graph/GraphologyMemoryGraph.ts#L138)

#### Parameters

##### seedIds

`string`[]

##### config?

[`SpreadingActivationConfig`](../interfaces/SpreadingActivationConfig.md)

#### Returns

`Promise`\<[`ActivatedNode`](../interfaces/ActivatedNode.md)[]\>

#### Implementation of

[`IMemoryGraph`](../interfaces/IMemoryGraph.md).[`spreadingActivation`](../interfaces/IMemoryGraph.md#spreadingactivation)
