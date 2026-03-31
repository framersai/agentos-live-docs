# Interface: IGraphRAGEngine

Defined in: [packages/agentos/src/memory/retrieval/graph/graphrag/IGraphRAG.ts:192](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/retrieval/graph/graphrag/IGraphRAG.ts#L192)

## Methods

### clear()

> **clear**(): `Promise`\<`void`\>

Defined in: [packages/agentos/src/memory/retrieval/graph/graphrag/IGraphRAG.ts:252](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/retrieval/graph/graphrag/IGraphRAG.ts#L252)

Clear all data

#### Returns

`Promise`\<`void`\>

***

### getCommunities()

> **getCommunities**(`level?`): `Promise`\<[`GraphCommunity`](GraphCommunity.md)[]\>

Defined in: [packages/agentos/src/memory/retrieval/graph/graphrag/IGraphRAG.ts:240](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/retrieval/graph/graphrag/IGraphRAG.ts#L240)

Get community hierarchy

#### Parameters

##### level?

`number`

#### Returns

`Promise`\<[`GraphCommunity`](GraphCommunity.md)[]\>

***

### getEntities()

> **getEntities**(`options?`): `Promise`\<[`GraphEntity`](GraphEntity.md)[]\>

Defined in: [packages/agentos/src/memory/retrieval/graph/graphrag/IGraphRAG.ts:234](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/retrieval/graph/graphrag/IGraphRAG.ts#L234)

Get all entities

#### Parameters

##### options?

###### limit?

`number`

###### type?

`string`

#### Returns

`Promise`\<[`GraphEntity`](GraphEntity.md)[]\>

***

### getRelationships()

> **getRelationships**(`entityId`): `Promise`\<[`GraphRelationship`](GraphRelationship.md)[]\>

Defined in: [packages/agentos/src/memory/retrieval/graph/graphrag/IGraphRAG.ts:237](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/retrieval/graph/graphrag/IGraphRAG.ts#L237)

Get all relationships for an entity

#### Parameters

##### entityId

`string`

#### Returns

`Promise`\<[`GraphRelationship`](GraphRelationship.md)[]\>

***

### getStats()

> **getStats**(): `Promise`\<\{ `communityLevels`: `number`; `documentsIngested`: `number`; `totalCommunities`: `number`; `totalEntities`: `number`; `totalRelationships`: `number`; \}\>

Defined in: [packages/agentos/src/memory/retrieval/graph/graphrag/IGraphRAG.ts:243](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/retrieval/graph/graphrag/IGraphRAG.ts#L243)

Get statistics

#### Returns

`Promise`\<\{ `communityLevels`: `number`; `documentsIngested`: `number`; `totalCommunities`: `number`; `totalEntities`: `number`; `totalRelationships`: `number`; \}\>

***

### globalSearch()

> **globalSearch**(`query`, `options?`): `Promise`\<[`GlobalSearchResult`](GlobalSearchResult.md)\>

Defined in: [packages/agentos/src/memory/retrieval/graph/graphrag/IGraphRAG.ts:225](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/retrieval/graph/graphrag/IGraphRAG.ts#L225)

Global search: answers broad questions using community summaries.
Best for "What are the main themes?" type questions.

#### Parameters

##### query

`string`

##### options?

[`GraphRAGSearchOptions`](GraphRAGSearchOptions.md)

#### Returns

`Promise`\<[`GlobalSearchResult`](GlobalSearchResult.md)\>

***

### ingestDocuments()

> **ingestDocuments**(`documents`): `Promise`\<\{ `communitiesDetected`: `number`; `documentsProcessed`: `number`; `entitiesExtracted`: `number`; `relationshipsExtracted`: `number`; \}\>

Defined in: [packages/agentos/src/memory/retrieval/graph/graphrag/IGraphRAG.ts:200](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/retrieval/graph/graphrag/IGraphRAG.ts#L200)

Ingest documents: extract entities/relationships, build graph,
detect communities, generate summaries.

#### Parameters

##### documents

`object`[]

#### Returns

`Promise`\<\{ `communitiesDetected`: `number`; `documentsProcessed`: `number`; `entitiesExtracted`: `number`; `relationshipsExtracted`: `number`; \}\>

***

### initialize()

> **initialize**(`config`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/memory/retrieval/graph/graphrag/IGraphRAG.ts:194](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/retrieval/graph/graphrag/IGraphRAG.ts#L194)

Initialize the engine with configuration

#### Parameters

##### config

[`GraphRAGConfig`](GraphRAGConfig.md)

#### Returns

`Promise`\<`void`\>

***

### localSearch()

> **localSearch**(`query`, `options?`): `Promise`\<[`LocalSearchResult`](LocalSearchResult.md)\>

Defined in: [packages/agentos/src/memory/retrieval/graph/graphrag/IGraphRAG.ts:231](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/retrieval/graph/graphrag/IGraphRAG.ts#L231)

Local search: finds specific entities and their context.
Best for "Tell me about X" type questions.

#### Parameters

##### query

`string`

##### options?

[`GraphRAGSearchOptions`](GraphRAGSearchOptions.md)

#### Returns

`Promise`\<[`LocalSearchResult`](LocalSearchResult.md)\>

***

### removeDocuments()

> **removeDocuments**(`documentIds`): `Promise`\<\{ `communitiesDetected`: `number`; `documentsRemoved`: `number`; \}\>

Defined in: [packages/agentos/src/memory/retrieval/graph/graphrag/IGraphRAG.ts:216](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/retrieval/graph/graphrag/IGraphRAG.ts#L216)

Remove one or more previously-ingested documents from the graph.

This subtracts the document's entity/relationship contributions and recomputes
communities. It is used to keep GraphRAG in sync when a source document is
deleted or moved out of indexed categories.

#### Parameters

##### documentIds

`string`[]

#### Returns

`Promise`\<\{ `communitiesDetected`: `number`; `documentsRemoved`: `number`; \}\>

***

### shutdown()

> **shutdown**(): `Promise`\<`void`\>

Defined in: [packages/agentos/src/memory/retrieval/graph/graphrag/IGraphRAG.ts:255](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/memory/retrieval/graph/graphrag/IGraphRAG.ts#L255)

Shutdown and cleanup

#### Returns

`Promise`\<`void`\>
