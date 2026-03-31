# Interface: IKnowledgeGraph

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts:296](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts#L296)

Interface for the Knowledge Graph system

## Methods

### clear()

> **clear**(): `Promise`\<`void`\>

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts:425](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts#L425)

Clear all knowledge

#### Returns

`Promise`\<`void`\>

***

### decayMemories()

> **decayMemories**(`decayFactor?`): `Promise`\<`number`\>

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts:415](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts#L415)

Decay old memories (reduce importance over time)

#### Parameters

##### decayFactor?

`number`

#### Returns

`Promise`\<`number`\>

***

### deleteEntity()

> **deleteEntity**(`id`): `Promise`\<`boolean`\>

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts:324](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts#L324)

Delete an entity and its relations

#### Parameters

##### id

`string`

#### Returns

`Promise`\<`boolean`\>

***

### deleteRelation()

> **deleteRelation**(`id`): `Promise`\<`boolean`\>

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts:341](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts#L341)

Delete a relation

#### Parameters

##### id

`string`

#### Returns

`Promise`\<`boolean`\>

***

### extractFromText()

> **extractFromText**(`text`, `options?`): `Promise`\<\{ `entities`: [`KnowledgeEntity`](KnowledgeEntity.md)[]; `relations`: [`KnowledgeRelation`](KnowledgeRelation.md)[]; \}\>

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts:400](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts#L400)

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

`Promise`\<\{ `entities`: [`KnowledgeEntity`](KnowledgeEntity.md)[]; `relations`: [`KnowledgeRelation`](KnowledgeRelation.md)[]; \}\>

***

### findPath()

> **findPath**(`sourceId`, `targetId`, `maxDepth?`): `Promise`\<`object`[] \| `null`\>

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts:381](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts#L381)

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

***

### getEntity()

> **getEntity**(`id`): `Promise`\<[`KnowledgeEntity`](KnowledgeEntity.md) \| `undefined`\>

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts:314](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts#L314)

Get entity by ID

#### Parameters

##### id

`string`

#### Returns

`Promise`\<[`KnowledgeEntity`](KnowledgeEntity.md) \| `undefined`\>

***

### getMemory()

> **getMemory**(`id`): `Promise`\<[`EpisodicMemory`](EpisodicMemory.md) \| `undefined`\>

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts:353](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts#L353)

Get memory by ID

#### Parameters

##### id

`string`

#### Returns

`Promise`\<[`EpisodicMemory`](EpisodicMemory.md) \| `undefined`\>

***

### getNeighborhood()

> **getNeighborhood**(`entityId`, `depth?`): `Promise`\<\{ `entities`: [`KnowledgeEntity`](KnowledgeEntity.md)[]; `relations`: [`KnowledgeRelation`](KnowledgeRelation.md)[]; \}\>

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts:386](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts#L386)

Get neighborhood of an entity

#### Parameters

##### entityId

`string`

##### depth?

`number`

#### Returns

`Promise`\<\{ `entities`: [`KnowledgeEntity`](KnowledgeEntity.md)[]; `relations`: [`KnowledgeRelation`](KnowledgeRelation.md)[]; \}\>

***

### getRelations()

> **getRelations**(`entityId`, `options?`): `Promise`\<[`KnowledgeRelation`](KnowledgeRelation.md)[]\>

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts:336](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts#L336)

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

`Promise`\<[`KnowledgeRelation`](KnowledgeRelation.md)[]\>

***

### getStats()

> **getStats**(): `Promise`\<[`KnowledgeGraphStats`](KnowledgeGraphStats.md)\>

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts:420](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts#L420)

Get knowledge graph statistics

#### Returns

`Promise`\<[`KnowledgeGraphStats`](KnowledgeGraphStats.md)\>

***

### initialize()

> **initialize**(): `Promise`\<`void`\>

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts:302](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts#L302)

Initialize the knowledge graph

#### Returns

`Promise`\<`void`\>

***

### mergeEntities()

> **mergeEntities**(`entityIds`, `primaryId`): `Promise`\<[`KnowledgeEntity`](KnowledgeEntity.md)\>

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts:410](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts#L410)

Merge duplicate entities

#### Parameters

##### entityIds

`string`[]

##### primaryId

`string`

#### Returns

`Promise`\<[`KnowledgeEntity`](KnowledgeEntity.md)\>

***

### queryEntities()

> **queryEntities**(`options?`): `Promise`\<[`KnowledgeEntity`](KnowledgeEntity.md)[]\>

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts:319](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts#L319)

Query entities

#### Parameters

##### options?

[`KnowledgeQueryOptions`](KnowledgeQueryOptions.md)

#### Returns

`Promise`\<[`KnowledgeEntity`](KnowledgeEntity.md)[]\>

***

### queryMemories()

> **queryMemories**(`options?`): `Promise`\<[`EpisodicMemory`](EpisodicMemory.md)[]\>

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts:358](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts#L358)

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

`Promise`\<[`EpisodicMemory`](EpisodicMemory.md)[]\>

***

### recallMemories()

> **recallMemories**(`query`, `topK?`): `Promise`\<[`EpisodicMemory`](EpisodicMemory.md)[]\>

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts:369](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts#L369)

Recall relevant memories (updates access count)

#### Parameters

##### query

`string`

##### topK?

`number`

#### Returns

`Promise`\<[`EpisodicMemory`](EpisodicMemory.md)[]\>

***

### recordMemory()

> **recordMemory**(`memory`): `Promise`\<[`EpisodicMemory`](EpisodicMemory.md)\>

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts:348](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts#L348)

Record an episodic memory

#### Parameters

##### memory

`Omit`\<[`EpisodicMemory`](EpisodicMemory.md), `"id"` \| `"createdAt"` \| `"accessCount"` \| `"lastAccessedAt"`\>

#### Returns

`Promise`\<[`EpisodicMemory`](EpisodicMemory.md)\>

***

### semanticSearch()

> **semanticSearch**(`options`): `Promise`\<[`SemanticSearchResult`](SemanticSearchResult.md)[]\>

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts:393](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts#L393)

Semantic search across entities and memories

#### Parameters

##### options

[`SemanticSearchOptions`](SemanticSearchOptions.md)

#### Returns

`Promise`\<[`SemanticSearchResult`](SemanticSearchResult.md)[]\>

***

### traverse()

> **traverse**(`startEntityId`, `options?`): `Promise`\<[`TraversalResult`](TraversalResult.md)\>

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts:376](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts#L376)

Traverse the graph from a starting entity

#### Parameters

##### startEntityId

`string`

##### options?

[`TraversalOptions`](TraversalOptions.md)

#### Returns

`Promise`\<[`TraversalResult`](TraversalResult.md)\>

***

### upsertEntity()

> **upsertEntity**(`entity`): `Promise`\<[`KnowledgeEntity`](KnowledgeEntity.md)\>

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts:309](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts#L309)

Add or update an entity

#### Parameters

##### entity

`Omit`\<[`KnowledgeEntity`](KnowledgeEntity.md), `"id"` \| `"updatedAt"` \| `"createdAt"`\> & `object`

#### Returns

`Promise`\<[`KnowledgeEntity`](KnowledgeEntity.md)\>

***

### upsertRelation()

> **upsertRelation**(`relation`): `Promise`\<[`KnowledgeRelation`](KnowledgeRelation.md)\>

Defined in: [packages/agentos/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts:331](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/memory/retrieval/graph/knowledge/IKnowledgeGraph.ts#L331)

Add or update a relation

#### Parameters

##### relation

`Omit`\<[`KnowledgeRelation`](KnowledgeRelation.md), `"id"` \| `"createdAt"`\> & `object`

#### Returns

`Promise`\<[`KnowledgeRelation`](KnowledgeRelation.md)\>
