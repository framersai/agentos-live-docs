# Class: KnowledgeGraph

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/KnowledgeGraph.ts:48](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/retrieval/graph/knowledge/KnowledgeGraph.ts#L48)

In-memory Knowledge Graph implementation

## Implements

- [`IKnowledgeGraph`](../interfaces/IKnowledgeGraph.md)

## Constructors

### Constructor

> **new KnowledgeGraph**(`config?`): `KnowledgeGraph`

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/KnowledgeGraph.ts:64](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/retrieval/graph/knowledge/KnowledgeGraph.ts#L64)

#### Parameters

##### config?

`KnowledgeGraphConfig` = `{}`

#### Returns

`KnowledgeGraph`

## Methods

### clear()

> **clear**(): `Promise`\<`void`\>

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/KnowledgeGraph.ts:746](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/retrieval/graph/knowledge/KnowledgeGraph.ts#L746)

Clear all knowledge

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IKnowledgeGraph`](../interfaces/IKnowledgeGraph.md).[`clear`](../interfaces/IKnowledgeGraph.md#clear)

***

### decayMemories()

> **decayMemories**(`decayFactor?`): `Promise`\<`number`\>

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/KnowledgeGraph.ts:686](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/retrieval/graph/knowledge/KnowledgeGraph.ts#L686)

Decay old memories (reduce importance over time)

#### Parameters

##### decayFactor?

`number`

#### Returns

`Promise`\<`number`\>

#### Implementation of

[`IKnowledgeGraph`](../interfaces/IKnowledgeGraph.md).[`decayMemories`](../interfaces/IKnowledgeGraph.md#decaymemories)

***

### deleteEntity()

> **deleteEntity**(`id`): `Promise`\<`boolean`\>

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/KnowledgeGraph.ts:173](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/retrieval/graph/knowledge/KnowledgeGraph.ts#L173)

Delete an entity and its relations

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

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/KnowledgeGraph.ts:265](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/retrieval/graph/knowledge/KnowledgeGraph.ts#L265)

Delete a relation

#### Parameters

##### id

`string`

#### Returns

`Promise`\<`boolean`\>

#### Implementation of

[`IKnowledgeGraph`](../interfaces/IKnowledgeGraph.md).[`deleteRelation`](../interfaces/IKnowledgeGraph.md#deleterelation)

***

### extractFromText()

> **extractFromText**(`text`, `options?`): `Promise`\<\{ `entities`: [`KnowledgeEntity`](../interfaces/KnowledgeEntity.md)[]; `relations`: [`KnowledgeRelation`](../interfaces/KnowledgeRelation.md)[]; \}\>

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/KnowledgeGraph.ts:598](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/retrieval/graph/knowledge/KnowledgeGraph.ts#L598)

Extract entities and relations from text

#### Parameters

##### text

`string`

##### options?

###### entityTypes?

[`EntityType`](../type-aliases/EntityType.md)[]

###### extractRelations?

`boolean`

#### Returns

`Promise`\<\{ `entities`: [`KnowledgeEntity`](../interfaces/KnowledgeEntity.md)[]; `relations`: [`KnowledgeRelation`](../interfaces/KnowledgeRelation.md)[]; \}\>

#### Implementation of

[`IKnowledgeGraph`](../interfaces/IKnowledgeGraph.md).[`extractFromText`](../interfaces/IKnowledgeGraph.md#extractfromtext)

***

### findPath()

> **findPath**(`sourceId`, `targetId`, `maxDepth?`): `Promise`\<`object`[] \| `null`\>

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/KnowledgeGraph.ts:461](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/retrieval/graph/knowledge/KnowledgeGraph.ts#L461)

Find shortest path between two entities

#### Parameters

##### sourceId

`string`

##### targetId

`string`

##### maxDepth?

`number` = `5`

#### Returns

`Promise`\<`object`[] \| `null`\>

#### Implementation of

[`IKnowledgeGraph`](../interfaces/IKnowledgeGraph.md).[`findPath`](../interfaces/IKnowledgeGraph.md#findpath)

***

### getEntity()

> **getEntity**(`id`): `Promise`\<[`KnowledgeEntity`](../interfaces/KnowledgeEntity.md) \| `undefined`\>

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/KnowledgeGraph.ts:123](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/retrieval/graph/knowledge/KnowledgeGraph.ts#L123)

Get entity by ID

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

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/KnowledgeGraph.ts:311](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/retrieval/graph/knowledge/KnowledgeGraph.ts#L311)

Get memory by ID

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

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/KnowledgeGraph.ts:510](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/retrieval/graph/knowledge/KnowledgeGraph.ts#L510)

Get neighborhood of an entity

#### Parameters

##### entityId

`string`

##### depth?

`number` = `1`

#### Returns

`Promise`\<\{ `entities`: [`KnowledgeEntity`](../interfaces/KnowledgeEntity.md)[]; `relations`: [`KnowledgeRelation`](../interfaces/KnowledgeRelation.md)[]; \}\>

#### Implementation of

[`IKnowledgeGraph`](../interfaces/IKnowledgeGraph.md).[`getNeighborhood`](../interfaces/IKnowledgeGraph.md#getneighborhood)

***

### getRelations()

> **getRelations**(`entityId`, `options?`): `Promise`\<[`KnowledgeRelation`](../interfaces/KnowledgeRelation.md)[]\>

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/KnowledgeGraph.ts:234](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/retrieval/graph/knowledge/KnowledgeGraph.ts#L234)

Get relations for an entity

#### Parameters

##### entityId

`string`

##### options?

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

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/KnowledgeGraph.ts:712](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/retrieval/graph/knowledge/KnowledgeGraph.ts#L712)

Get knowledge graph statistics

#### Returns

`Promise`\<[`KnowledgeGraphStats`](../interfaces/KnowledgeGraphStats.md)\>

#### Implementation of

[`IKnowledgeGraph`](../interfaces/IKnowledgeGraph.md).[`getStats`](../interfaces/IKnowledgeGraph.md#getstats)

***

### initialize()

> **initialize**(): `Promise`\<`void`\>

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/KnowledgeGraph.ts:71](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/retrieval/graph/knowledge/KnowledgeGraph.ts#L71)

Initialize the knowledge graph

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IKnowledgeGraph`](../interfaces/IKnowledgeGraph.md).[`initialize`](../interfaces/IKnowledgeGraph.md#initialize)

***

### mergeEntities()

> **mergeEntities**(`entityIds`, `primaryId`): `Promise`\<[`KnowledgeEntity`](../interfaces/KnowledgeEntity.md)\>

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/KnowledgeGraph.ts:652](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/retrieval/graph/knowledge/KnowledgeGraph.ts#L652)

Merge duplicate entities

#### Parameters

##### entityIds

`string`[]

##### primaryId

`string`

#### Returns

`Promise`\<[`KnowledgeEntity`](../interfaces/KnowledgeEntity.md)\>

#### Implementation of

[`IKnowledgeGraph`](../interfaces/IKnowledgeGraph.md).[`mergeEntities`](../interfaces/IKnowledgeGraph.md#mergeentities)

***

### queryEntities()

> **queryEntities**(`options?`): `Promise`\<[`KnowledgeEntity`](../interfaces/KnowledgeEntity.md)[]\>

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/KnowledgeGraph.ts:127](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/retrieval/graph/knowledge/KnowledgeGraph.ts#L127)

Query entities

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

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/KnowledgeGraph.ts:321](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/retrieval/graph/knowledge/KnowledgeGraph.ts#L321)

Query episodic memories

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

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/KnowledgeGraph.ts:363](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/retrieval/graph/knowledge/KnowledgeGraph.ts#L363)

Recall relevant memories (updates access count)

#### Parameters

##### query

`string`

##### topK?

`number` = `5`

#### Returns

`Promise`\<[`EpisodicMemory`](../interfaces/EpisodicMemory.md)[]\>

#### Implementation of

[`IKnowledgeGraph`](../interfaces/IKnowledgeGraph.md).[`recallMemories`](../interfaces/IKnowledgeGraph.md#recallmemories)

***

### recordMemory()

> **recordMemory**(`memoryInput`): `Promise`\<[`EpisodicMemory`](../interfaces/EpisodicMemory.md)\>

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/KnowledgeGraph.ts:281](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/retrieval/graph/knowledge/KnowledgeGraph.ts#L281)

Record an episodic memory

#### Parameters

##### memoryInput

`Omit`\<[`EpisodicMemory`](../interfaces/EpisodicMemory.md), `"id"` \| `"createdAt"` \| `"accessCount"` \| `"lastAccessedAt"`\>

#### Returns

`Promise`\<[`EpisodicMemory`](../interfaces/EpisodicMemory.md)\>

#### Implementation of

[`IKnowledgeGraph`](../interfaces/IKnowledgeGraph.md).[`recordMemory`](../interfaces/IKnowledgeGraph.md#recordmemory)

***

### semanticSearch()

> **semanticSearch**(`options`): `Promise`\<[`SemanticSearchResult`](../interfaces/SemanticSearchResult.md)[]\>

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/KnowledgeGraph.ts:526](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/retrieval/graph/knowledge/KnowledgeGraph.ts#L526)

Semantic search across entities and memories

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

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/KnowledgeGraph.ts:398](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/retrieval/graph/knowledge/KnowledgeGraph.ts#L398)

Traverse the graph from a starting entity

#### Parameters

##### startEntityId

`string`

##### options?

[`TraversalOptions`](../interfaces/TraversalOptions.md)

#### Returns

`Promise`\<[`TraversalResult`](../interfaces/TraversalResult.md)\>

#### Implementation of

[`IKnowledgeGraph`](../interfaces/IKnowledgeGraph.md).[`traverse`](../interfaces/IKnowledgeGraph.md#traverse)

***

### upsertEntity()

> **upsertEntity**(`entityInput`): `Promise`\<[`KnowledgeEntity`](../interfaces/KnowledgeEntity.md)\>

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/KnowledgeGraph.ts:79](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/retrieval/graph/knowledge/KnowledgeGraph.ts#L79)

Add or update an entity

#### Parameters

##### entityInput

`Omit`\<[`KnowledgeEntity`](../interfaces/KnowledgeEntity.md), `"id"` \| `"updatedAt"` \| `"createdAt"`\> & `object`

#### Returns

`Promise`\<[`KnowledgeEntity`](../interfaces/KnowledgeEntity.md)\>

#### Implementation of

[`IKnowledgeGraph`](../interfaces/IKnowledgeGraph.md).[`upsertEntity`](../interfaces/IKnowledgeGraph.md#upsertentity)

***

### upsertRelation()

> **upsertRelation**(`relationInput`): `Promise`\<[`KnowledgeRelation`](../interfaces/KnowledgeRelation.md)\>

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/KnowledgeGraph.ts:201](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/retrieval/graph/knowledge/KnowledgeGraph.ts#L201)

Add or update a relation

#### Parameters

##### relationInput

`Omit`\<[`KnowledgeRelation`](../interfaces/KnowledgeRelation.md), `"id"` \| `"createdAt"`\> & `object`

#### Returns

`Promise`\<[`KnowledgeRelation`](../interfaces/KnowledgeRelation.md)\>

#### Implementation of

[`IKnowledgeGraph`](../interfaces/IKnowledgeGraph.md).[`upsertRelation`](../interfaces/IKnowledgeGraph.md#upsertrelation)
