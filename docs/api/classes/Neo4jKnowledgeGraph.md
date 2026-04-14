# Class: Neo4jKnowledgeGraph

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/Neo4jKnowledgeGraph.ts:81](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/retrieval/graph/knowledge/Neo4jKnowledgeGraph.ts#L81)

Interface for the Knowledge Graph system

## Implements

- [`IKnowledgeGraph`](../interfaces/IKnowledgeGraph.md)

## Constructors

### Constructor

> **new Neo4jKnowledgeGraph**(`config`): `Neo4jKnowledgeGraph`

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/Neo4jKnowledgeGraph.ts:87](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/retrieval/graph/knowledge/Neo4jKnowledgeGraph.ts#L87)

#### Parameters

##### config

`Neo4jKnowledgeGraphConfig`

#### Returns

`Neo4jKnowledgeGraph`

## Methods

### clear()

> **clear**(): `Promise`\<`void`\>

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/Neo4jKnowledgeGraph.ts:839](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/retrieval/graph/knowledge/Neo4jKnowledgeGraph.ts#L839)

Clear all knowledge

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IKnowledgeGraph`](../interfaces/IKnowledgeGraph.md).[`clear`](../interfaces/IKnowledgeGraph.md#clear)

***

### decayMemories()

> **decayMemories**(`decayFactor?`): `Promise`\<`number`\>

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/Neo4jKnowledgeGraph.ts:767](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/retrieval/graph/knowledge/Neo4jKnowledgeGraph.ts#L767)

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

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/Neo4jKnowledgeGraph.ts:230](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/retrieval/graph/knowledge/Neo4jKnowledgeGraph.ts#L230)

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

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/Neo4jKnowledgeGraph.ts:334](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/retrieval/graph/knowledge/Neo4jKnowledgeGraph.ts#L334)

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

> **extractFromText**(`_text`, `_options?`): `Promise`\<\{ `entities`: [`KnowledgeEntity`](../interfaces/KnowledgeEntity.md)[]; `relations`: [`KnowledgeRelation`](../interfaces/KnowledgeRelation.md)[]; \}\>

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/Neo4jKnowledgeGraph.ts:708](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/retrieval/graph/knowledge/Neo4jKnowledgeGraph.ts#L708)

Extract entities and relations from text

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

#### Implementation of

[`IKnowledgeGraph`](../interfaces/IKnowledgeGraph.md).[`extractFromText`](../interfaces/IKnowledgeGraph.md#extractfromtext)

***

### findPath()

> **findPath**(`sourceId`, `targetId`, `maxDepth?`): `Promise`\<`object`[] \| `null`\>

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/Neo4jKnowledgeGraph.ts:575](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/retrieval/graph/knowledge/Neo4jKnowledgeGraph.ts#L575)

Find shortest path between two entities

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

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/Neo4jKnowledgeGraph.ts:177](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/retrieval/graph/knowledge/Neo4jKnowledgeGraph.ts#L177)

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

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/Neo4jKnowledgeGraph.ts:411](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/retrieval/graph/knowledge/Neo4jKnowledgeGraph.ts#L411)

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

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/Neo4jKnowledgeGraph.ts:609](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/retrieval/graph/knowledge/Neo4jKnowledgeGraph.ts#L609)

Get neighborhood of an entity

#### Parameters

##### entityId

`string`

##### depth?

`number`

#### Returns

`Promise`\<\{ `entities`: [`KnowledgeEntity`](../interfaces/KnowledgeEntity.md)[]; `relations`: [`KnowledgeRelation`](../interfaces/KnowledgeRelation.md)[]; \}\>

#### Implementation of

[`IKnowledgeGraph`](../interfaces/IKnowledgeGraph.md).[`getNeighborhood`](../interfaces/IKnowledgeGraph.md#getneighborhood)

***

### getRelations()

> **getRelations**(`entityId`, `options?`): `Promise`\<[`KnowledgeRelation`](../interfaces/KnowledgeRelation.md)[]\>

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/Neo4jKnowledgeGraph.ts:298](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/retrieval/graph/knowledge/Neo4jKnowledgeGraph.ts#L298)

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

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/Neo4jKnowledgeGraph.ts:786](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/retrieval/graph/knowledge/Neo4jKnowledgeGraph.ts#L786)

Get knowledge graph statistics

#### Returns

`Promise`\<[`KnowledgeGraphStats`](../interfaces/KnowledgeGraphStats.md)\>

#### Implementation of

[`IKnowledgeGraph`](../interfaces/IKnowledgeGraph.md).[`getStats`](../interfaces/IKnowledgeGraph.md#getstats)

***

### initialize()

> **initialize**(): `Promise`\<`void`\>

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/Neo4jKnowledgeGraph.ts:93](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/retrieval/graph/knowledge/Neo4jKnowledgeGraph.ts#L93)

Initialize the knowledge graph

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IKnowledgeGraph`](../interfaces/IKnowledgeGraph.md).[`initialize`](../interfaces/IKnowledgeGraph.md#initialize)

***

### mergeEntities()

> **mergeEntities**(`entityIds`, `primaryId`): `Promise`\<[`KnowledgeEntity`](../interfaces/KnowledgeEntity.md)\>

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/Neo4jKnowledgeGraph.ts:719](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/retrieval/graph/knowledge/Neo4jKnowledgeGraph.ts#L719)

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

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/Neo4jKnowledgeGraph.ts:186](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/retrieval/graph/knowledge/Neo4jKnowledgeGraph.ts#L186)

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

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/Neo4jKnowledgeGraph.ts:428](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/retrieval/graph/knowledge/Neo4jKnowledgeGraph.ts#L428)

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

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/Neo4jKnowledgeGraph.ts:471](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/retrieval/graph/knowledge/Neo4jKnowledgeGraph.ts#L471)

Recall relevant memories (updates access count)

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

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/Neo4jKnowledgeGraph.ts:346](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/retrieval/graph/knowledge/Neo4jKnowledgeGraph.ts#L346)

Record an episodic memory

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

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/Neo4jKnowledgeGraph.ts:643](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/retrieval/graph/knowledge/Neo4jKnowledgeGraph.ts#L643)

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

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/Neo4jKnowledgeGraph.ts:497](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/retrieval/graph/knowledge/Neo4jKnowledgeGraph.ts#L497)

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

> **upsertEntity**(`entity`): `Promise`\<[`KnowledgeEntity`](../interfaces/KnowledgeEntity.md)\>

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/Neo4jKnowledgeGraph.ts:127](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/retrieval/graph/knowledge/Neo4jKnowledgeGraph.ts#L127)

Add or update an entity

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

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/Neo4jKnowledgeGraph.ts:242](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/memory/retrieval/graph/knowledge/Neo4jKnowledgeGraph.ts#L242)

Add or update a relation

#### Parameters

##### relation

`Omit`\<[`KnowledgeRelation`](../interfaces/KnowledgeRelation.md), `"id"` \| `"createdAt"`\> & `object`

#### Returns

`Promise`\<[`KnowledgeRelation`](../interfaces/KnowledgeRelation.md)\>

#### Implementation of

[`IKnowledgeGraph`](../interfaces/IKnowledgeGraph.md).[`upsertRelation`](../interfaces/IKnowledgeGraph.md#upsertrelation)
