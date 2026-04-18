# Class: SqliteKnowledgeGraph

Defined in: [packages/agentos/src/memory/retrieval/store/SqliteKnowledgeGraph.ts:174](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/retrieval/store/SqliteKnowledgeGraph.ts#L174)

Persistent knowledge graph backed by SQLite via SqliteBrain.

Implements the full `IKnowledgeGraph` interface using the `knowledge_nodes`
and `knowledge_edges` tables. Extended entity/relation fields that don't
have dedicated columns are serialized into the JSON `properties` / `metadata`
columns.

## Example

```ts
const brain = await SqliteBrain.open('/tmp/agent-brain.sqlite');
const graph = new SqliteKnowledgeGraph(brain);
await graph.initialize();

const entity = await graph.upsertEntity({
  type: 'person',
  label: 'Alice',
  properties: { role: 'engineer' },
  confidence: 0.95,
  source: { type: 'user_input', timestamp: new Date().toISOString() },
});
```

## Implements

- [`IKnowledgeGraph`](../interfaces/IKnowledgeGraph.md)

## Constructors

### Constructor

> **new SqliteKnowledgeGraph**(`brain`): `SqliteKnowledgeGraph`

Defined in: [packages/agentos/src/memory/retrieval/store/SqliteKnowledgeGraph.ts:182](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/retrieval/store/SqliteKnowledgeGraph.ts#L182)

#### Parameters

##### brain

[`SqliteBrain`](SqliteBrain.md)

A SqliteBrain instance whose async StorageAdapter methods
               are used for all queries.

#### Returns

`SqliteKnowledgeGraph`

## Methods

### clear()

> **clear**(): `Promise`\<`void`\>

Defined in: [packages/agentos/src/memory/retrieval/store/SqliteKnowledgeGraph.ts:1272](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/retrieval/store/SqliteKnowledgeGraph.ts#L1272)

Delete all rows from knowledge_nodes and knowledge_edges.
Wipes the knowledge graph completely.

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IKnowledgeGraph`](../interfaces/IKnowledgeGraph.md).[`clear`](../interfaces/IKnowledgeGraph.md#clear)

***

### decayMemories()

> **decayMemories**(`decayFactor?`): `Promise`\<`number`\>

Defined in: [packages/agentos/src/memory/retrieval/store/SqliteKnowledgeGraph.ts:1186](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/retrieval/store/SqliteKnowledgeGraph.ts#L1186)

Decay the confidence of all memory-type nodes by a multiplicative factor.

This simulates the Ebbinghaus forgetting curve — memories that are not
accessed (reinforced) gradually fade.

#### Parameters

##### decayFactor?

`number`

Multiplicative factor in (0, 1). Default 0.95.

#### Returns

`Promise`\<`number`\>

The number of memory nodes whose confidence was reduced.

#### Implementation of

[`IKnowledgeGraph`](../interfaces/IKnowledgeGraph.md).[`decayMemories`](../interfaces/IKnowledgeGraph.md#decaymemories)

***

### deleteEntity()

> **deleteEntity**(`id`): `Promise`\<`boolean`\>

Defined in: [packages/agentos/src/memory/retrieval/store/SqliteKnowledgeGraph.ts:363](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/retrieval/store/SqliteKnowledgeGraph.ts#L363)

Delete an entity and all its associated relations (incoming and outgoing).
Returns `true` if the entity existed and was deleted.

#### Parameters

##### id

`string`

#### Returns

`Promise`\<`boolean`\>

#### Implementation of

[`IKnowledgeGraph`](../interfaces/IKnowledgeGraph.md).[`deleteEntity`](../interfaces/IKnowledgeGraph.md#deleteentity)

***

### deleteRelation()

> **deleteRelation**(`id`): `Promise`\<`boolean`\>

Defined in: [packages/agentos/src/memory/retrieval/store/SqliteKnowledgeGraph.ts:491](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/retrieval/store/SqliteKnowledgeGraph.ts#L491)

Delete a single relation by its ID.
Returns `true` if the relation existed and was deleted.

#### Parameters

##### id

`string`

#### Returns

`Promise`\<`boolean`\>

#### Implementation of

[`IKnowledgeGraph`](../interfaces/IKnowledgeGraph.md).[`deleteRelation`](../interfaces/IKnowledgeGraph.md#deleterelation)

***

### extractFromText()

> **extractFromText**(`_text`, `_options?`): `Promise`\<\{ `entities`: [`KnowledgeEntity`](../interfaces/KnowledgeEntity.md)[]; `relations`: [`KnowledgeRelation`](../interfaces/KnowledgeRelation.md)[]; \}\>

Defined in: [packages/agentos/src/memory/retrieval/store/SqliteKnowledgeGraph.ts:1113](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/retrieval/store/SqliteKnowledgeGraph.ts#L1113)

Extract entities and relations from text.

This operation requires an LLM and is not supported at the store level.
Use the Memory facade for LLM-powered extraction.

#### Parameters

##### \_text

`string`

##### \_options?

###### entityTypes?

[`EntityType`](../type-aliases/EntityType.md)[]

###### extractRelations?

`boolean`

#### Returns

`Promise`\<\{ `entities`: [`KnowledgeEntity`](../interfaces/KnowledgeEntity.md)[]; `relations`: [`KnowledgeRelation`](../interfaces/KnowledgeRelation.md)[]; \}\>

#### Throws

Always — extraction requires an LLM.

#### Implementation of

[`IKnowledgeGraph`](../interfaces/IKnowledgeGraph.md).[`extractFromText`](../interfaces/IKnowledgeGraph.md#extractfromtext)

***

### findPath()

> **findPath**(`sourceId`, `targetId`, `maxDepth?`): `Promise`\<`object`[] \| `null`\>

Defined in: [packages/agentos/src/memory/retrieval/store/SqliteKnowledgeGraph.ts:853](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/retrieval/store/SqliteKnowledgeGraph.ts#L853)

Find the shortest path between two entities using a bidirectional BFS
implemented via a recursive CTE.

Returns an ordered array of `{ entity, relation? }` steps from source to
target, or `null` if no path exists within `maxDepth` hops.

#### Parameters

##### sourceId

`string`

##### targetId

`string`

##### maxDepth?

`number`

#### Returns

`Promise`\<`object`[] \| `null`\>

#### Implementation of

[`IKnowledgeGraph`](../interfaces/IKnowledgeGraph.md).[`findPath`](../interfaces/IKnowledgeGraph.md#findpath)

***

### getEntity()

> **getEntity**(`id`): `Promise`\<[`KnowledgeEntity`](../interfaces/KnowledgeEntity.md) \| `undefined`\>

Defined in: [packages/agentos/src/memory/retrieval/store/SqliteKnowledgeGraph.ts:280](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/retrieval/store/SqliteKnowledgeGraph.ts#L280)

Retrieve a single entity by its ID.
Returns `undefined` if the entity does not exist.

#### Parameters

##### id

`string`

#### Returns

`Promise`\<[`KnowledgeEntity`](../interfaces/KnowledgeEntity.md) \| `undefined`\>

#### Implementation of

[`IKnowledgeGraph`](../interfaces/IKnowledgeGraph.md).[`getEntity`](../interfaces/IKnowledgeGraph.md#getentity)

***

### getMemory()

> **getMemory**(`id`): `Promise`\<[`EpisodicMemory`](../interfaces/EpisodicMemory.md) \| `undefined`\>

Defined in: [packages/agentos/src/memory/retrieval/store/SqliteKnowledgeGraph.ts:586](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/retrieval/store/SqliteKnowledgeGraph.ts#L586)

Get an episodic memory by ID.

Looks up the knowledge_node with the given ID and `type = 'memory'`,
then unpacks the memory-specific fields from the `properties` JSON.

#### Parameters

##### id

`string`

#### Returns

`Promise`\<[`EpisodicMemory`](../interfaces/EpisodicMemory.md) \| `undefined`\>

#### Implementation of

[`IKnowledgeGraph`](../interfaces/IKnowledgeGraph.md).[`getMemory`](../interfaces/IKnowledgeGraph.md#getmemory)

***

### getNeighborhood()

> **getNeighborhood**(`entityId`, `depth?`): `Promise`\<\{ `entities`: [`KnowledgeEntity`](../interfaces/KnowledgeEntity.md)[]; `relations`: [`KnowledgeRelation`](../interfaces/KnowledgeRelation.md)[]; \}\>

Defined in: [packages/agentos/src/memory/retrieval/store/SqliteKnowledgeGraph.ts:930](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/retrieval/store/SqliteKnowledgeGraph.ts#L930)

Get the neighbourhood of an entity — all entities and relations within
`depth` hops.

#### Parameters

##### entityId

`string`

Centre entity.

##### depth?

`number`

Maximum number of hops (default 1).

#### Returns

`Promise`\<\{ `entities`: [`KnowledgeEntity`](../interfaces/KnowledgeEntity.md)[]; `relations`: [`KnowledgeRelation`](../interfaces/KnowledgeRelation.md)[]; \}\>

#### Implementation of

[`IKnowledgeGraph`](../interfaces/IKnowledgeGraph.md).[`getNeighborhood`](../interfaces/IKnowledgeGraph.md#getneighborhood)

***

### getRelations()

> **getRelations**(`entityId`, `options?`): `Promise`\<[`KnowledgeRelation`](../interfaces/KnowledgeRelation.md)[]\>

Defined in: [packages/agentos/src/memory/retrieval/store/SqliteKnowledgeGraph.ts:455](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/retrieval/store/SqliteKnowledgeGraph.ts#L455)

Get all relations for a given entity.

#### Parameters

##### entityId

`string`

The entity whose relations to retrieve.

##### options?

Optional filters: direction ('outgoing'|'incoming'|'both'), types.

###### direction?

`"outgoing"` \| `"incoming"` \| `"both"`

###### types?

[`RelationType`](../type-aliases/RelationType.md)[]

#### Returns

`Promise`\<[`KnowledgeRelation`](../interfaces/KnowledgeRelation.md)[]\>

#### Implementation of

[`IKnowledgeGraph`](../interfaces/IKnowledgeGraph.md).[`getRelations`](../interfaces/IKnowledgeGraph.md#getrelations)

***

### getStats()

> **getStats**(): `Promise`\<[`KnowledgeGraphStats`](../interfaces/KnowledgeGraphStats.md)\>

Defined in: [packages/agentos/src/memory/retrieval/store/SqliteKnowledgeGraph.ts:1205](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/retrieval/store/SqliteKnowledgeGraph.ts#L1205)

Get aggregate statistics about the knowledge graph.

Returns counts of entities, relations, memories, breakdowns by type,
average confidence, and oldest/newest entry timestamps.

#### Returns

`Promise`\<[`KnowledgeGraphStats`](../interfaces/KnowledgeGraphStats.md)\>

#### Implementation of

[`IKnowledgeGraph`](../interfaces/IKnowledgeGraph.md).[`getStats`](../interfaces/IKnowledgeGraph.md#getstats)

***

### initialize()

> **initialize**(): `Promise`\<`void`\>

Defined in: [packages/agentos/src/memory/retrieval/store/SqliteKnowledgeGraph.ts:196](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/retrieval/store/SqliteKnowledgeGraph.ts#L196)

Initialize the knowledge graph.

The schema is already created by SqliteBrain's constructor, so this is
effectively a no-op. Provided to satisfy the IKnowledgeGraph contract.

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IKnowledgeGraph`](../interfaces/IKnowledgeGraph.md).[`initialize`](../interfaces/IKnowledgeGraph.md#initialize)

***

### mergeEntities()

> **mergeEntities**(`entityIds`, `primaryId`): `Promise`\<[`KnowledgeEntity`](../interfaces/KnowledgeEntity.md)\>

Defined in: [packages/agentos/src/memory/retrieval/store/SqliteKnowledgeGraph.ts:1135](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/retrieval/store/SqliteKnowledgeGraph.ts#L1135)

Merge multiple entities into one primary entity.

All relations (edges) pointing to or from the non-primary entities are
re-linked to the primary entity. The non-primary entities are then deleted.

#### Parameters

##### entityIds

`string`[]

All entity IDs involved in the merge.

##### primaryId

`string`

The ID that survives the merge.

#### Returns

`Promise`\<[`KnowledgeEntity`](../interfaces/KnowledgeEntity.md)\>

#### Implementation of

[`IKnowledgeGraph`](../interfaces/IKnowledgeGraph.md).[`mergeEntities`](../interfaces/IKnowledgeGraph.md#mergeentities)

***

### queryEntities()

> **queryEntities**(`options?`): `Promise`\<[`KnowledgeEntity`](../interfaces/KnowledgeEntity.md)[]\>

Defined in: [packages/agentos/src/memory/retrieval/store/SqliteKnowledgeGraph.ts:296](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/retrieval/store/SqliteKnowledgeGraph.ts#L296)

Query entities with optional filters.

Supports filtering by entity type, tags, owner, minimum confidence,
full-text search, pagination (limit/offset), and time ranges.

#### Parameters

##### options?

[`KnowledgeQueryOptions`](../interfaces/KnowledgeQueryOptions.md)

#### Returns

`Promise`\<[`KnowledgeEntity`](../interfaces/KnowledgeEntity.md)[]\>

#### Implementation of

[`IKnowledgeGraph`](../interfaces/IKnowledgeGraph.md).[`queryEntities`](../interfaces/IKnowledgeGraph.md#queryentities)

***

### queryMemories()

> **queryMemories**(`options?`): `Promise`\<[`EpisodicMemory`](../interfaces/EpisodicMemory.md)[]\>

Defined in: [packages/agentos/src/memory/retrieval/store/SqliteKnowledgeGraph.ts:602](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/retrieval/store/SqliteKnowledgeGraph.ts#L602)

Query episodic memories with optional filters.

Supports filtering by memory sub-type, participants, minimum importance,
time range, and result limit.

#### Parameters

##### options?

###### limit?

`number`

###### minImportance?

`number`

###### participants?

`string`[]

###### timeRange?

\{ `from?`: `string`; `to?`: `string`; \}

###### timeRange.from?

`string`

###### timeRange.to?

`string`

###### types?

(`"discovery"` \| `"success"` \| `"error"` \| `"conversation"` \| `"task"` \| `"interaction"`)[]

#### Returns

`Promise`\<[`EpisodicMemory`](../interfaces/EpisodicMemory.md)[]\>

#### Implementation of

[`IKnowledgeGraph`](../interfaces/IKnowledgeGraph.md).[`queryMemories`](../interfaces/IKnowledgeGraph.md#querymemories)

***

### recallMemories()

> **recallMemories**(`query`, `topK?`): `Promise`\<[`EpisodicMemory`](../interfaces/EpisodicMemory.md)[]\>

Defined in: [packages/agentos/src/memory/retrieval/store/SqliteKnowledgeGraph.ts:660](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/retrieval/store/SqliteKnowledgeGraph.ts#L660)

Recall relevant memories via keyword search against summaries.

Performs a case-insensitive substring match on the label (which contains
the summary text). Increments accessCount and updates lastAccessedAt for
each returned memory (Hebbian reinforcement).

Full semantic (embedding-based) recall requires the Memory facade.

#### Parameters

##### query

`string`

##### topK?

`number`

#### Returns

`Promise`\<[`EpisodicMemory`](../interfaces/EpisodicMemory.md)[]\>

#### Implementation of

[`IKnowledgeGraph`](../interfaces/IKnowledgeGraph.md).[`recallMemories`](../interfaces/IKnowledgeGraph.md#recallmemories)

***

### recordMemory()

> **recordMemory**(`memory`): `Promise`\<[`EpisodicMemory`](../interfaces/EpisodicMemory.md)\>

Defined in: [packages/agentos/src/memory/retrieval/store/SqliteKnowledgeGraph.ts:509](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/retrieval/store/SqliteKnowledgeGraph.ts#L509)

Record an episodic memory.

Memories are stored as knowledge_nodes with `type = 'memory'`. The
memory-specific fields are packed into the `properties` JSON column.

#### Parameters

##### memory

`Omit`\<[`EpisodicMemory`](../interfaces/EpisodicMemory.md), `"id"` \| `"createdAt"` \| `"accessCount"` \| `"lastAccessedAt"`\>

#### Returns

`Promise`\<[`EpisodicMemory`](../interfaces/EpisodicMemory.md)\>

#### Implementation of

[`IKnowledgeGraph`](../interfaces/IKnowledgeGraph.md).[`recordMemory`](../interfaces/IKnowledgeGraph.md#recordmemory)

***

### semanticSearch()

> **semanticSearch**(`options`): `Promise`\<[`SemanticSearchResult`](../interfaces/SemanticSearchResult.md)[]\>

Defined in: [packages/agentos/src/memory/retrieval/store/SqliteKnowledgeGraph.ts:990](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/retrieval/store/SqliteKnowledgeGraph.ts#L990)

Semantic search across entities and/or memories.

Loads all embeddings from `knowledge_nodes`, computes cosine similarity
against the query embedding (if present in `options`), and returns the
top-K results above the minimum similarity threshold.

NOTE: This implementation requires the caller to provide a query embedding
via a pre-processing step. If no nodes have embeddings, an empty array is
returned. For full text-to-embedding semantic search, use the Memory facade.

#### Parameters

##### options

[`SemanticSearchOptions`](../interfaces/SemanticSearchOptions.md)

#### Returns

`Promise`\<[`SemanticSearchResult`](../interfaces/SemanticSearchResult.md)[]\>

#### Implementation of

[`IKnowledgeGraph`](../interfaces/IKnowledgeGraph.md).[`semanticSearch`](../interfaces/IKnowledgeGraph.md#semanticsearch)

***

### traverse()

> **traverse**(`startEntityId`, `options?`): `Promise`\<[`TraversalResult`](../interfaces/TraversalResult.md)\>

Defined in: [packages/agentos/src/memory/retrieval/store/SqliteKnowledgeGraph.ts:713](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/retrieval/store/SqliteKnowledgeGraph.ts#L713)

Traverse the graph from a starting entity using BFS.

Uses a recursive CTE (Common Table Expression) to walk the graph up to
`maxDepth` hops from the start node. Results are grouped by depth level.

#### Parameters

##### startEntityId

`string`

ID of the entity to start traversal from.

##### options?

[`TraversalOptions`](../interfaces/TraversalOptions.md)

Optional: maxDepth, relationTypes, direction, minWeight, maxNodes.

#### Returns

`Promise`\<[`TraversalResult`](../interfaces/TraversalResult.md)\>

#### Implementation of

[`IKnowledgeGraph`](../interfaces/IKnowledgeGraph.md).[`traverse`](../interfaces/IKnowledgeGraph.md#traverse)

***

### upsertEntity()

> **upsertEntity**(`entity`): `Promise`\<[`KnowledgeEntity`](../interfaces/KnowledgeEntity.md)\>

Defined in: [packages/agentos/src/memory/retrieval/store/SqliteKnowledgeGraph.ts:215](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/retrieval/store/SqliteKnowledgeGraph.ts#L215)

Insert or update a knowledge entity.

If `entity.id` is provided and exists, the row is updated (INSERT OR REPLACE).
If omitted, a new UUID is generated.

Extended fields (ownerId, tags, metadata, updatedAt) are packed into the
`properties` JSON column as underscore-prefixed keys to avoid collisions
with user-supplied properties.

#### Parameters

##### entity

`Omit`\<[`KnowledgeEntity`](../interfaces/KnowledgeEntity.md), `"id"` \| `"updatedAt"` \| `"createdAt"`\> & `object`

#### Returns

`Promise`\<[`KnowledgeEntity`](../interfaces/KnowledgeEntity.md)\>

#### Implementation of

[`IKnowledgeGraph`](../interfaces/IKnowledgeGraph.md).[`upsertEntity`](../interfaces/IKnowledgeGraph.md#upsertentity)

***

### upsertRelation()

> **upsertRelation**(`relation`): `Promise`\<[`KnowledgeRelation`](../interfaces/KnowledgeRelation.md)\>

Defined in: [packages/agentos/src/memory/retrieval/store/SqliteKnowledgeGraph.ts:391](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/memory/retrieval/store/SqliteKnowledgeGraph.ts#L391)

Insert or update a knowledge relation (edge).

Extended edge fields (label, properties, confidence, source, validFrom,
validTo) are packed into the `metadata` JSON column.

#### Parameters

##### relation

`Omit`\<[`KnowledgeRelation`](../interfaces/KnowledgeRelation.md), `"id"` \| `"createdAt"`\> & `object`

#### Returns

`Promise`\<[`KnowledgeRelation`](../interfaces/KnowledgeRelation.md)\>

#### Implementation of

[`IKnowledgeGraph`](../interfaces/IKnowledgeGraph.md).[`upsertRelation`](../interfaces/IKnowledgeGraph.md#upsertrelation)
