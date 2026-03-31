# Class: GraphRAGEngine

Defined in: [packages/agentos/src/memory/retrieval/graph/graphrag/GraphRAGEngine.ts:106](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/retrieval/graph/graphrag/GraphRAGEngine.ts#L106)

## Implements

- [`IGraphRAGEngine`](../interfaces/IGraphRAGEngine.md)

## Constructors

### Constructor

> **new GraphRAGEngine**(`deps?`): `GraphRAGEngine`

Defined in: [packages/agentos/src/memory/retrieval/graph/graphrag/GraphRAGEngine.ts:130](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/retrieval/graph/graphrag/GraphRAGEngine.ts#L130)

#### Parameters

##### deps?

###### embeddingManager?

[`IEmbeddingManager`](../interfaces/IEmbeddingManager.md)

###### llmProvider?

`LLMProvider`

###### persistenceAdapter?

`PersistenceAdapter`

###### vectorStore?

[`IVectorStore`](../interfaces/IVectorStore.md)

#### Returns

`GraphRAGEngine`

## Methods

### clear()

> **clear**(): `Promise`\<`void`\>

Defined in: [packages/agentos/src/memory/retrieval/graph/graphrag/GraphRAGEngine.ts:1494](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/retrieval/graph/graphrag/GraphRAGEngine.ts#L1494)

Clear all data

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IGraphRAGEngine`](../interfaces/IGraphRAGEngine.md).[`clear`](../interfaces/IGraphRAGEngine.md#clear)

***

### getCommunities()

> **getCommunities**(`level?`): `Promise`\<[`GraphCommunity`](../interfaces/GraphCommunity.md)[]\>

Defined in: [packages/agentos/src/memory/retrieval/graph/graphrag/GraphRAGEngine.ts:1467](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/retrieval/graph/graphrag/GraphRAGEngine.ts#L1467)

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

Defined in: [packages/agentos/src/memory/retrieval/graph/graphrag/GraphRAGEngine.ts:1451](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/retrieval/graph/graphrag/GraphRAGEngine.ts#L1451)

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

Defined in: [packages/agentos/src/memory/retrieval/graph/graphrag/GraphRAGEngine.ts:1460](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/retrieval/graph/graphrag/GraphRAGEngine.ts#L1460)

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

Defined in: [packages/agentos/src/memory/retrieval/graph/graphrag/GraphRAGEngine.ts:1476](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/retrieval/graph/graphrag/GraphRAGEngine.ts#L1476)

Get statistics

#### Returns

`Promise`\<\{ `communityLevels`: `number`; `documentsIngested`: `number`; `totalCommunities`: `number`; `totalEntities`: `number`; `totalRelationships`: `number`; \}\>

#### Implementation of

[`IGraphRAGEngine`](../interfaces/IGraphRAGEngine.md).[`getStats`](../interfaces/IGraphRAGEngine.md#getstats)

***

### globalSearch()

> **globalSearch**(`query`, `options?`): `Promise`\<[`GlobalSearchResult`](../interfaces/GlobalSearchResult.md)\>

Defined in: [packages/agentos/src/memory/retrieval/graph/graphrag/GraphRAGEngine.ts:1116](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/retrieval/graph/graphrag/GraphRAGEngine.ts#L1116)

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

Defined in: [packages/agentos/src/memory/retrieval/graph/graphrag/GraphRAGEngine.ts:264](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/retrieval/graph/graphrag/GraphRAGEngine.ts#L264)

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

Defined in: [packages/agentos/src/memory/retrieval/graph/graphrag/GraphRAGEngine.ts:198](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/retrieval/graph/graphrag/GraphRAGEngine.ts#L198)

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

Defined in: [packages/agentos/src/memory/retrieval/graph/graphrag/GraphRAGEngine.ts:1287](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/retrieval/graph/graphrag/GraphRAGEngine.ts#L1287)

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

Defined in: [packages/agentos/src/memory/retrieval/graph/graphrag/GraphRAGEngine.ts:417](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/retrieval/graph/graphrag/GraphRAGEngine.ts#L417)

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

Defined in: [packages/agentos/src/memory/retrieval/graph/graphrag/GraphRAGEngine.ts:1517](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/memory/retrieval/graph/graphrag/GraphRAGEngine.ts#L1517)

Shutdown and cleanup

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IGraphRAGEngine`](../interfaces/IGraphRAGEngine.md).[`shutdown`](../interfaces/IGraphRAGEngine.md#shutdown)
