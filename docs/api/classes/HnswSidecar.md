# Class: HnswSidecar

Defined in: [packages/agentos/src/memory/retrieval/store/HnswSidecar.ts:57](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/retrieval/store/HnswSidecar.ts#L57)

Memory-specific HNSW sidecar that wraps the canonical HnswIndexSidecar.

Maintains the original constructor-based API expected by `Memory` facade
and `SqliteBrain` consumers, while delegating all index operations to the
shared RAG implementation.

## Constructors

### Constructor

> **new HnswSidecar**(`config`): `HnswSidecar`

Defined in: [packages/agentos/src/memory/retrieval/store/HnswSidecar.ts:63](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/retrieval/store/HnswSidecar.ts#L63)

#### Parameters

##### config

[`HnswSidecarConfig`](../interfaces/HnswSidecarConfig.md)

#### Returns

`HnswSidecar`

## Accessors

### isActive

#### Get Signature

> **get** **isActive**(): `boolean`

Defined in: [packages/agentos/src/memory/retrieval/store/HnswSidecar.ts:77](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/retrieval/store/HnswSidecar.ts#L77)

Whether the HNSW index is currently active and queryable.

##### Returns

`boolean`

***

### size

#### Get Signature

> **get** **size**(): `number`

Defined in: [packages/agentos/src/memory/retrieval/store/HnswSidecar.ts:82](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/retrieval/store/HnswSidecar.ts#L82)

Number of vectors currently indexed.

##### Returns

`number`

## Methods

### add()

> **add**(`traceId`, `embedding`, `_totalCount`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/memory/retrieval/store/HnswSidecar.ts:114](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/retrieval/store/HnswSidecar.ts#L114)

Add a vector to the index. If below threshold, does nothing.
If threshold is crossed, caller should call rebuildFromData().

#### Parameters

##### traceId

`string`

The trace ID to associate with this vector.

##### embedding

`number`[]

The embedding vector.

##### \_totalCount

`number`

Current total trace count (unused, kept for API compat).

#### Returns

`Promise`\<`void`\>

***

### destroy()

> **destroy**(): `void`

Defined in: [packages/agentos/src/memory/retrieval/store/HnswSidecar.ts:199](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/retrieval/store/HnswSidecar.ts#L199)

Delete index files from disk and deactivate.

#### Returns

`void`

***

### init()

> **init**(): `Promise`\<`void`\>

Defined in: [packages/agentos/src/memory/retrieval/store/HnswSidecar.ts:94](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/retrieval/store/HnswSidecar.ts#L94)

Initialize the sidecar. Loads existing index from disk if present.
If hnswlib-node is not installed, silently stays inactive.

#### Returns

`Promise`\<`void`\>

***

### query()

> **query**(`embedding`, `topK`): [`HnswQueryResult`](../interfaces/HnswQueryResult.md)[]

Defined in: [packages/agentos/src/memory/retrieval/store/HnswSidecar.ts:126](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/retrieval/store/HnswSidecar.ts#L126)

Query the HNSW index for top-K nearest neighbors.
Returns trace IDs sorted by distance (closest first).

#### Parameters

##### embedding

`number`[]

Query vector.

##### topK

`number`

Number of results to return.

#### Returns

[`HnswQueryResult`](../interfaces/HnswQueryResult.md)[]

Array of { id, distance } sorted by distance ascending.

***

### rebuildFromData()

> **rebuildFromData**(`data`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/memory/retrieval/store/HnswSidecar.ts:180](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/retrieval/store/HnswSidecar.ts#L180)

Rebuild the entire index from a set of id/embedding pairs.
Called on first threshold crossing or when brain.hnsw is missing/corrupt.
Filters out dimension-mismatched vectors before delegating.

#### Parameters

##### data

`object`[]

Array of { id, embedding } to index.

#### Returns

`Promise`\<`void`\>

***

### remove()

> **remove**(`traceId`): `void`

Defined in: [packages/agentos/src/memory/retrieval/store/HnswSidecar.ts:168](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/retrieval/store/HnswSidecar.ts#L168)

Remove a trace from the index by marking its label as deleted.
HNSW doesn't support true deletion — cleaned up on rebuild.

#### Parameters

##### traceId

`string`

The trace ID to remove.

#### Returns

`void`

***

### saveToDisk()

> **saveToDisk**(): `void`

Defined in: [packages/agentos/src/memory/retrieval/store/HnswSidecar.ts:192](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/retrieval/store/HnswSidecar.ts#L192)

Persist index and label map to disk.
Called after rebuildFromData() and periodically after adds.

#### Returns

`void`
