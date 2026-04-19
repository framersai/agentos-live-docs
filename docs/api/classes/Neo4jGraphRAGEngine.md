# Class: Neo4jGraphRAGEngine

Defined in: [packages/agentos/src/memory/retrieval/graph/graphrag/Neo4jGraphRAGEngine.ts:78](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/retrieval/graph/graphrag/Neo4jGraphRAGEngine.ts#L78)

## Implements

- [`IGraphRAGEngine`](../interfaces/IGraphRAGEngine.md)

## Constructors

### Constructor

> **new Neo4jGraphRAGEngine**(`deps`): `Neo4jGraphRAGEngine`

Defined in: [packages/agentos/src/memory/retrieval/graph/graphrag/Neo4jGraphRAGEngine.ts:84](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/retrieval/graph/graphrag/Neo4jGraphRAGEngine.ts#L84)

#### Parameters

##### deps

`Neo4jGraphRAGEngineDeps`

#### Returns

`Neo4jGraphRAGEngine`

## Methods

### clear()

> **clear**(): `Promise`\<`void`\>

Defined in: [packages/agentos/src/memory/retrieval/graph/graphrag/Neo4jGraphRAGEngine.ts:653](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/retrieval/graph/graphrag/Neo4jGraphRAGEngine.ts#L653)

Clear all data

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IGraphRAGEngine`](../interfaces/IGraphRAGEngine.md).[`clear`](../interfaces/IGraphRAGEngine.md#clear)

***

### getCommunities()

> **getCommunities**(`level?`): `Promise`\<[`GraphCommunity`](../interfaces/GraphCommunity.md)[]\>

Defined in: [packages/agentos/src/memory/retrieval/graph/graphrag/Neo4jGraphRAGEngine.ts:604](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/retrieval/graph/graphrag/Neo4jGraphRAGEngine.ts#L604)

Get community hierarchy

#### Parameters

##### level?

`number`

#### Returns

`Promise`\<[`GraphCommunity`](../interfaces/GraphCommunity.md)[]\>

#### Implementation of

[`IGraphRAGEngine`](../interfaces/IGraphRAGEngine.md).[`getCommunities`](../interfaces/IGraphRAGEngine.md#getcommunities)

***

### getEntities()

> **getEntities**(`options?`): `Promise`\<[`GraphEntity`](../interfaces/GraphEntity.md)[]\>

Defined in: [packages/agentos/src/memory/retrieval/graph/graphrag/Neo4jGraphRAGEngine.ts:562](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/retrieval/graph/graphrag/Neo4jGraphRAGEngine.ts#L562)

Get all entities

#### Parameters

##### options?

###### limit?

`number`

###### type?

`string`

#### Returns

`Promise`\<[`GraphEntity`](../interfaces/GraphEntity.md)[]\>

#### Implementation of

[`IGraphRAGEngine`](../interfaces/IGraphRAGEngine.md).[`getEntities`](../interfaces/IGraphRAGEngine.md#getentities)

***

### getRelationships()

> **getRelationships**(`entityId`): `Promise`\<[`GraphRelationship`](../interfaces/GraphRelationship.md)[]\>

Defined in: [packages/agentos/src/memory/retrieval/graph/graphrag/Neo4jGraphRAGEngine.ts:581](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/retrieval/graph/graphrag/Neo4jGraphRAGEngine.ts#L581)

Get all relationships for an entity

#### Parameters

##### entityId

`string`

#### Returns

`Promise`\<[`GraphRelationship`](../interfaces/GraphRelationship.md)[]\>

#### Implementation of

[`IGraphRAGEngine`](../interfaces/IGraphRAGEngine.md).[`getRelationships`](../interfaces/IGraphRAGEngine.md#getrelationships)

***

### getStats()

> **getStats**(): `Promise`\<\{ `communityLevels`: `number`; `documentsIngested`: `number`; `totalCommunities`: `number`; `totalEntities`: `number`; `totalRelationships`: `number`; \}\>

Defined in: [packages/agentos/src/memory/retrieval/graph/graphrag/Neo4jGraphRAGEngine.ts:624](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/retrieval/graph/graphrag/Neo4jGraphRAGEngine.ts#L624)

Get statistics

#### Returns

`Promise`\<\{ `communityLevels`: `number`; `documentsIngested`: `number`; `totalCommunities`: `number`; `totalEntities`: `number`; `totalRelationships`: `number`; \}\>

#### Implementation of

[`IGraphRAGEngine`](../interfaces/IGraphRAGEngine.md).[`getStats`](../interfaces/IGraphRAGEngine.md#getstats)

***

### globalSearch()

> **globalSearch**(`query`, `options?`): `Promise`\<[`GlobalSearchResult`](../interfaces/GlobalSearchResult.md)\>

Defined in: [packages/agentos/src/memory/retrieval/graph/graphrag/Neo4jGraphRAGEngine.ts:278](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/retrieval/graph/graphrag/Neo4jGraphRAGEngine.ts#L278)

Global search: answers broad questions using community summaries.
Best for "What are the main themes?" type questions.

#### Parameters

##### query

`string`

##### options?

[`GraphRAGSearchOptions`](../interfaces/GraphRAGSearchOptions.md)

#### Returns

`Promise`\<[`GlobalSearchResult`](../interfaces/GlobalSearchResult.md)\>

#### Implementation of

[`IGraphRAGEngine`](../interfaces/IGraphRAGEngine.md).[`globalSearch`](../interfaces/IGraphRAGEngine.md#globalsearch)

***

### ingestDocuments()

> **ingestDocuments**(`documents`): `Promise`\<\{ `communitiesDetected`: `number`; `documentsProcessed`: `number`; `entitiesExtracted`: `number`; `relationshipsExtracted`: `number`; \}\>

Defined in: [packages/agentos/src/memory/retrieval/graph/graphrag/Neo4jGraphRAGEngine.ts:128](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/retrieval/graph/graphrag/Neo4jGraphRAGEngine.ts#L128)

Ingest documents: extract entities/relationships, build graph,
detect communities, generate summaries.

#### Parameters

##### documents

`object`[]

#### Returns

`Promise`\<\{ `communitiesDetected`: `number`; `documentsProcessed`: `number`; `entitiesExtracted`: `number`; `relationshipsExtracted`: `number`; \}\>

#### Implementation of

[`IGraphRAGEngine`](../interfaces/IGraphRAGEngine.md).[`ingestDocuments`](../interfaces/IGraphRAGEngine.md#ingestdocuments)

***

### initialize()

> **initialize**(`config`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/memory/retrieval/graph/graphrag/Neo4jGraphRAGEngine.ts:86](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/retrieval/graph/graphrag/Neo4jGraphRAGEngine.ts#L86)

Initialize the engine with configuration

#### Parameters

##### config

[`GraphRAGConfig`](../interfaces/GraphRAGConfig.md)

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IGraphRAGEngine`](../interfaces/IGraphRAGEngine.md).[`initialize`](../interfaces/IGraphRAGEngine.md#initialize)

***

### localSearch()

> **localSearch**(`query`, `options?`): `Promise`\<[`LocalSearchResult`](../interfaces/LocalSearchResult.md)\>

Defined in: [packages/agentos/src/memory/retrieval/graph/graphrag/Neo4jGraphRAGEngine.ts:377](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/retrieval/graph/graphrag/Neo4jGraphRAGEngine.ts#L377)

Local search: finds specific entities and their context.
Best for "Tell me about X" type questions.

#### Parameters

##### query

`string`

##### options?

[`GraphRAGSearchOptions`](../interfaces/GraphRAGSearchOptions.md)

#### Returns

`Promise`\<[`LocalSearchResult`](../interfaces/LocalSearchResult.md)\>

#### Implementation of

[`IGraphRAGEngine`](../interfaces/IGraphRAGEngine.md).[`localSearch`](../interfaces/IGraphRAGEngine.md#localsearch)

***

### removeDocuments()

> **removeDocuments**(`documentIds`): `Promise`\<\{ `communitiesDetected`: `number`; `documentsRemoved`: `number`; \}\>

Defined in: [packages/agentos/src/memory/retrieval/graph/graphrag/Neo4jGraphRAGEngine.ts:238](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/retrieval/graph/graphrag/Neo4jGraphRAGEngine.ts#L238)

Remove one or more previously-ingested documents from the graph.

This subtracts the document's entity/relationship contributions and recomputes
communities. It is used to keep GraphRAG in sync when a source document is
deleted or moved out of indexed categories.

#### Parameters

##### documentIds

`string`[]

#### Returns

`Promise`\<\{ `communitiesDetected`: `number`; `documentsRemoved`: `number`; \}\>

#### Implementation of

[`IGraphRAGEngine`](../interfaces/IGraphRAGEngine.md).[`removeDocuments`](../interfaces/IGraphRAGEngine.md#removedocuments)

***

### shutdown()

> **shutdown**(): `Promise`\<`void`\>

Defined in: [packages/agentos/src/memory/retrieval/graph/graphrag/Neo4jGraphRAGEngine.ts:659](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/memory/retrieval/graph/graphrag/Neo4jGraphRAGEngine.ts#L659)

Shutdown and cleanup

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IGraphRAGEngine`](../interfaces/IGraphRAGEngine.md).[`shutdown`](../interfaces/IGraphRAGEngine.md#shutdown)
