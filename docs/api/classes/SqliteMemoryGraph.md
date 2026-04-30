# Class: SqliteMemoryGraph

Defined in: [packages/agentos/src/memory/retrieval/store/SqliteMemoryGraph.ts:114](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/retrieval/store/SqliteMemoryGraph.ts#L114)

SQLite-backed implementation of [IMemoryGraph](../interfaces/IMemoryGraph.md).

**Thread safety**: inherits the underlying adapter's concurrency model.
Writes serialise automatically through WAL when using SQLite-backed adapters.

**Usage:**
```ts
const brain = await SqliteBrain.open('/path/to/brain.sqlite');
const graph = new SqliteMemoryGraph(brain);
await graph.initialize();

await graph.addNode('mem-1', { type: 'episodic', scope: 'session', scopeId: 's1', strength: 1.0, createdAt: Date.now() });
await graph.addEdge({ sourceId: 'mem-1', targetId: 'mem-2', type: 'SAME_TOPIC', weight: 0.8, createdAt: Date.now() });

const activated = await graph.spreadingActivation(['mem-1']);
```

## Implements

- [`IMemoryGraph`](../interfaces/IMemoryGraph.md)

## Constructors

### Constructor

> **new SqliteMemoryGraph**(`brain`): `SqliteMemoryGraph`

Defined in: [packages/agentos/src/memory/retrieval/store/SqliteMemoryGraph.ts:143](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/retrieval/store/SqliteMemoryGraph.ts#L143)

#### Parameters

##### brain

[`SqliteBrain`](SqliteBrain.md)

The shared SqliteBrain connection for this agent.
  The `knowledge_nodes` and `knowledge_edges` tables must already exist
  (SqliteBrain creates them in its constructor).

#### Returns

`SqliteMemoryGraph`

## Methods

### addEdge()

> **addEdge**(`edge`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/memory/retrieval/store/SqliteMemoryGraph.ts:312](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/retrieval/store/SqliteMemoryGraph.ts#L312)

Add a directed edge between two memory nodes.

If an edge with the same `(sourceId, targetId)` pair already exists it is
replaced (upsert by composite key). The underlying SQLite row is identified
by a deterministic UUID derived from the source/target pair so that
repeated upserts land on the same row.

#### Parameters

##### edge

[`MemoryEdge`](../interfaces/MemoryEdge.md)

Edge descriptor including type, weight, and timestamp.

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IMemoryGraph`](../interfaces/IMemoryGraph.md).[`addEdge`](../interfaces/IMemoryGraph.md#addedge)

***

### addNode()

> **addNode**(`memoryId`, `metadata`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/memory/retrieval/store/SqliteMemoryGraph.ts:224](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/retrieval/store/SqliteMemoryGraph.ts#L224)

Add a memory node to the graph.

The node is persisted to `knowledge_nodes` (type = 'memory_graph') with
the metadata serialised into the `properties` JSON column. If a node with
the same `memoryId` already exists it is silently replaced (upsert).

#### Parameters

##### memoryId

`string`

Unique identifier for the memory trace this node represents.

##### metadata

[`MemoryGraphNodeMeta`](../interfaces/MemoryGraphNodeMeta.md)

Structural metadata describing the memory.

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IMemoryGraph`](../interfaces/IMemoryGraph.md).[`addNode`](../interfaces/IMemoryGraph.md#addnode)

***

### clear()

> **clear**(): `Promise`\<`void`\>

Defined in: [packages/agentos/src/memory/retrieval/store/SqliteMemoryGraph.ts:747](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/retrieval/store/SqliteMemoryGraph.ts#L747)

Remove all nodes and edges from the graph (both in-memory and SQLite).

This is a destructive, irreversible operation. Intended for tests and
administrative resets only.

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IMemoryGraph`](../interfaces/IMemoryGraph.md).[`clear`](../interfaces/IMemoryGraph.md#clear)

***

### detectClusters()

> **detectClusters**(`minSize?`): `Promise`\<[`MemoryCluster`](../interfaces/MemoryCluster.md)[]\>

Defined in: [packages/agentos/src/memory/retrieval/store/SqliteMemoryGraph.ts:609](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/retrieval/store/SqliteMemoryGraph.ts#L609)

Detect connected components (clusters) in the memory graph.

Uses path-compressed Union-Find over all edges. Components are filtered
to those with at least `minSize` members.

The `centroidId` of each cluster is the member with the highest total
incident edge weight (most central node). If the cluster has only one
member, `centroidId` equals that member.

The `density` of a cluster is computed as:
`actualEdges / maxPossibleEdges` where `maxPossibleEdges = n*(n-1)`.
For single-member clusters, density = 0.

#### Parameters

##### minSize?

`number` = `2`

Minimum component size to include.

#### Returns

`Promise`\<[`MemoryCluster`](../interfaces/MemoryCluster.md)[]\>

Array of [MemoryCluster](../interfaces/MemoryCluster.md) objects.

#### Default

```ts
2
```

#### Implementation of

[`IMemoryGraph`](../interfaces/IMemoryGraph.md).[`detectClusters`](../interfaces/IMemoryGraph.md#detectclusters)

***

### edgeCount()

> **edgeCount**(): `number`

Defined in: [packages/agentos/src/memory/retrieval/store/SqliteMemoryGraph.ts:737](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/retrieval/store/SqliteMemoryGraph.ts#L737)

Return the number of edges currently in the graph.
O(1) — backed by the in-memory Map size.

#### Returns

`number`

#### Implementation of

[`IMemoryGraph`](../interfaces/IMemoryGraph.md).[`edgeCount`](../interfaces/IMemoryGraph.md#edgecount)

***

### getConflicts()

> **getConflicts**(`memoryId`): [`MemoryEdge`](../interfaces/MemoryEdge.md)[]

Defined in: [packages/agentos/src/memory/retrieval/store/SqliteMemoryGraph.ts:584](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/retrieval/store/SqliteMemoryGraph.ts#L584)

Return all CONTRADICTS edges incident to a given memory node.

A CONTRADICTS edge signals that two memories express mutually incompatible
beliefs or facts. The consolidation engine uses this to trigger
conflict-resolution passes.

#### Parameters

##### memoryId

`string`

The memory node to check for contradictions.

#### Returns

[`MemoryEdge`](../interfaces/MemoryEdge.md)[]

Array of CONTRADICTS edges (may be empty).

#### Implementation of

[`IMemoryGraph`](../interfaces/IMemoryGraph.md).[`getConflicts`](../interfaces/IMemoryGraph.md#getconflicts)

***

### getEdges()

> **getEdges**(`memoryId`, `type?`): [`MemoryEdge`](../interfaces/MemoryEdge.md)[]

Defined in: [packages/agentos/src/memory/retrieval/store/SqliteMemoryGraph.ts:343](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/retrieval/store/SqliteMemoryGraph.ts#L343)

Retrieve all edges incident to a memory node.

Returns edges where `memoryId` appears as either source or target.
Optionally filters by edge type.

O(E) scan over the in-memory edge map — acceptable for typical graph sizes
(< 10k edges).

#### Parameters

##### memoryId

`string`

Node ID to query.

##### type?

[`MemoryEdgeType`](../type-aliases/MemoryEdgeType.md)

Optional edge type filter.

#### Returns

[`MemoryEdge`](../interfaces/MemoryEdge.md)[]

Array of matching [MemoryEdge](../interfaces/MemoryEdge.md) objects.

#### Implementation of

[`IMemoryGraph`](../interfaces/IMemoryGraph.md).[`getEdges`](../interfaces/IMemoryGraph.md#getedges)

***

### hasNode()

> **hasNode**(`memoryId`): `boolean`

Defined in: [packages/agentos/src/memory/retrieval/store/SqliteMemoryGraph.ts:294](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/retrieval/store/SqliteMemoryGraph.ts#L294)

Check whether a node exists in the graph.

O(1) in-memory lookup — does not touch SQLite.

#### Parameters

##### memoryId

`string`

ID to check.

#### Returns

`boolean`

`true` if the node is present, `false` otherwise.

#### Implementation of

[`IMemoryGraph`](../interfaces/IMemoryGraph.md).[`hasNode`](../interfaces/IMemoryGraph.md#hasnode)

***

### initialize()

> **initialize**(): `Promise`\<`void`\>

Defined in: [packages/agentos/src/memory/retrieval/store/SqliteMemoryGraph.ts:155](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/retrieval/store/SqliteMemoryGraph.ts#L155)

Hydrate the in-memory node and edge caches from the SQLite database.

Must be called once before any other method. Safe to call multiple times
(idempotent — fully replaces in-memory state each time).

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IMemoryGraph`](../interfaces/IMemoryGraph.md).[`initialize`](../interfaces/IMemoryGraph.md#initialize)

***

### nodeCount()

> **nodeCount**(): `number`

Defined in: [packages/agentos/src/memory/retrieval/store/SqliteMemoryGraph.ts:729](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/retrieval/store/SqliteMemoryGraph.ts#L729)

Return the number of nodes currently in the graph.
O(1) — backed by the in-memory Map size.

#### Returns

`number`

#### Implementation of

[`IMemoryGraph`](../interfaces/IMemoryGraph.md).[`nodeCount`](../interfaces/IMemoryGraph.md#nodecount)

***

### recordCoActivation()

> **recordCoActivation**(`memoryIds`, `learningRate?`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/memory/retrieval/store/SqliteMemoryGraph.ts:532](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/retrieval/store/SqliteMemoryGraph.ts#L532)

Record that a set of memories were activated together (Hebbian learning).

For every unordered pair (A, B) in `memoryIds`, a CO_ACTIVATED edge is
upserted:
- If no edge exists, it is created with `weight = learningRate`.
- If an edge already exists, its weight is incremented by `learningRate`
  and capped at 1.0.

This implements the Hebbian rule "neurons that fire together wire together"
at the memory graph level, gradually strengthening associations between
memories that are frequently retrieved in the same context.

#### Parameters

##### memoryIds

`string`[]

IDs of co-activated memories.

##### learningRate?

`number` = `0.1`

Weight increment per co-activation event.

#### Returns

`Promise`\<`void`\>

#### Default

```ts
0.1
```

#### Implementation of

[`IMemoryGraph`](../interfaces/IMemoryGraph.md).[`recordCoActivation`](../interfaces/IMemoryGraph.md#recordcoactivation)

***

### removeEdge()

> **removeEdge**(`sourceId`, `targetId`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/memory/retrieval/store/SqliteMemoryGraph.ts:361](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/retrieval/store/SqliteMemoryGraph.ts#L361)

Remove a directed edge from the graph.

#### Parameters

##### sourceId

`string`

Source node ID.

##### targetId

`string`

Target node ID.

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IMemoryGraph`](../interfaces/IMemoryGraph.md).[`removeEdge`](../interfaces/IMemoryGraph.md#removeedge)

***

### removeNode()

> **removeNode**(`memoryId`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/memory/retrieval/store/SqliteMemoryGraph.ts:257](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/retrieval/store/SqliteMemoryGraph.ts#L257)

Remove a node and all its incident edges from the graph.

Edges referencing the removed node are deleted from both SQLite and the
in-memory cache to keep the graph consistent.

#### Parameters

##### memoryId

`string`

ID of the node to remove.

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IMemoryGraph`](../interfaces/IMemoryGraph.md).[`removeNode`](../interfaces/IMemoryGraph.md#removenode)

***

### shutdown()

> **shutdown**(): `Promise`\<`void`\>

Defined in: [packages/agentos/src/memory/retrieval/store/SqliteMemoryGraph.ts:206](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/retrieval/store/SqliteMemoryGraph.ts#L206)

Shut down the memory graph.

Currently a no-op because SqliteBrain owns the DB connection lifetime.
Provided for interface compliance and forward compatibility.

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IMemoryGraph`](../interfaces/IMemoryGraph.md).[`shutdown`](../interfaces/IMemoryGraph.md#shutdown)

***

### spreadingActivation()

> **spreadingActivation**(`seedIds`, `config?`): `Promise`\<[`ActivatedNode`](../interfaces/ActivatedNode.md)[]\>

Defined in: [packages/agentos/src/memory/retrieval/store/SqliteMemoryGraph.ts:395](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/memory/retrieval/store/SqliteMemoryGraph.ts#L395)

Run spreading activation from a set of seed nodes.

Implements Anderson's ACT-R spreading activation model using BFS:

1. Each seed node starts with activation = 1.0.
2. When a node propagates to a neighbour, the neighbour's activation
   receives: `parentActivation * (1 - decayPerHop) * edgeWeight`.
3. If a node is reached by multiple paths, the maximum activation is kept.
4. Nodes below `activationThreshold` are not expanded further.
5. BFS stops at depth `maxDepth`.

Seed nodes are excluded from the returned list (they are the query, not
the result).

#### Parameters

##### seedIds

`string`[]

IDs of the memory nodes that trigger the activation.

##### config?

[`SpreadingActivationConfig`](../interfaces/SpreadingActivationConfig.md)

Optional tuning parameters.

#### Returns

`Promise`\<[`ActivatedNode`](../interfaces/ActivatedNode.md)[]\>

Activated nodes sorted by activation descending, capped at `maxResults`.

#### Implementation of

[`IMemoryGraph`](../interfaces/IMemoryGraph.md).[`spreadingActivation`](../interfaces/IMemoryGraph.md#spreadingactivation)
