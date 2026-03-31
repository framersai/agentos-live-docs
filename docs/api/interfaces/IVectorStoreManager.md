# Interface: IVectorStoreManager

Defined in: [packages/agentos/src/core/vector-store/IVectorStoreManager.ts:38](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/core/vector-store/IVectorStoreManager.ts#L38)

## Interface

IVectorStoreManager

## Description

Manages and provides access to various configured IVectorStore instances.
It allows higher-level services like the RetrievalAugmentor to be agnostic of the
specific vector database being used for a particular data source or category,
based on the provided `VectorStoreManagerConfig` and `RagDataSourceConfig`.

## Methods

### checkHealth()

> **checkHealth**(`providerId?`): `Promise`\<[`VectorStoreManagerHealthReport`](VectorStoreManagerHealthReport.md)\>

Defined in: [packages/agentos/src/core/vector-store/IVectorStoreManager.ts:120](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/core/vector-store/IVectorStoreManager.ts#L120)

**`Async`**

Checks the health of all managed vector store providers or a specific one.
This aggregates health information from individual `IVectorStore.checkHealth()` calls.

#### Parameters

##### providerId?

`string`

Optional: If provided, checks only this specific provider.
If omitted, checks all configured providers.

#### Returns

`Promise`\<[`VectorStoreManagerHealthReport`](VectorStoreManagerHealthReport.md)\>

A promise that resolves with a comprehensive health report.

***

### getDefaultProvider()

> **getDefaultProvider**(): [`IVectorStore`](IVectorStore.md)

Defined in: [packages/agentos/src/core/vector-store/IVectorStoreManager.ts:77](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/core/vector-store/IVectorStoreManager.ts#L77)

Retrieves the default IVectorStore provider instance as configured in `VectorStoreManagerConfig.defaultProviderId`.

#### Returns

[`IVectorStore`](IVectorStore.md)

The default IVectorStore instance.

#### Throws

If no default provider is configured, the configured default provider is not found,
or it failed to initialize.

***

### getProvider()

> **getProvider**(`providerId`): [`IVectorStore`](IVectorStore.md)

Defined in: [packages/agentos/src/core/vector-store/IVectorStoreManager.ts:68](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/core/vector-store/IVectorStoreManager.ts#L68)

Retrieves a specific, initialized IVectorStore provider instance by its configured ID.
The provider ID corresponds to `VectorStoreProviderConfig.id`.

#### Parameters

##### providerId

`string`

The unique ID of the vector store provider instance.

#### Returns

[`IVectorStore`](IVectorStore.md)

The IVectorStore instance.

#### Throws

If the providerId is not configured, not found, or the provider
failed to initialize.

***

### getStoreForDataSource()

> **getStoreForDataSource**(`dataSourceId`): `Promise`\<\{ `collectionName`: `string`; `dimension?`: `number`; `store`: [`IVectorStore`](IVectorStore.md); \}\>

Defined in: [packages/agentos/src/core/vector-store/IVectorStoreManager.ts:91](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/core/vector-store/IVectorStoreManager.ts#L91)

Retrieves an IVectorStore instance and the specific collection name within that store
associated with a given logical RAG Data Source ID.
This is a convenience method for services like RetrievalAugmentor that operate on
logical `dataSourceId`s.

#### Parameters

##### dataSourceId

`string`

The logical RAG Data Source ID (from `RagDataSourceConfig.dataSourceId`).

#### Returns

`Promise`\<\{ `collectionName`: `string`; `dimension?`: `number`; `store`: [`IVectorStore`](IVectorStore.md); \}\>

A promise that resolves with the
IVectorStore instance, the actual collection name to use with that store for this data source,
and the expected embedding dimension.

#### Throws

If the `dataSourceId` is not configured, or its associated provider is unavailable.

***

### initialize()

> **initialize**(`managerConfig`, `dataSourceConfigs`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/core/vector-store/IVectorStoreManager.ts:54](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/core/vector-store/IVectorStoreManager.ts#L54)

**`Async`**

Initializes the VectorStoreManager with configurations for all its managed providers
and data sources. This involves instantiating and initializing each configured
`IVectorStore` provider.

#### Parameters

##### managerConfig

`VectorStoreManagerConfig`

The manager's configuration, including an array of
individual vector store provider configurations.

##### dataSourceConfigs

`RagDataSourceConfig`[]

An array of configurations for all logical data sources,
which map to specific providers and collections/indexes within them.

#### Returns

`Promise`\<`void`\>

A promise that resolves when the manager and all its
essential providers are successfully initialized.

#### Throws

If initialization fails due to invalid configuration, inability to connect
to a critical provider, or other setup errors.

***

### listDataSourceIds()

> **listDataSourceIds**(): `string`[]

Defined in: [packages/agentos/src/core/vector-store/IVectorStoreManager.ts:108](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/core/vector-store/IVectorStoreManager.ts#L108)

Lists the unique IDs of all logical RAG Data Sources configured.

#### Returns

`string`[]

An array of RAG Data Source IDs.

***

### listProviderIds()

> **listProviderIds**(): `string`[]

Defined in: [packages/agentos/src/core/vector-store/IVectorStoreManager.ts:101](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/core/vector-store/IVectorStoreManager.ts#L101)

Lists the unique IDs of all vector store providers configured and managed by this manager.

#### Returns

`string`[]

An array of provider IDs.

***

### shutdownAllProviders()

> **shutdownAllProviders**(): `Promise`\<`void`\>

Defined in: [packages/agentos/src/core/vector-store/IVectorStoreManager.ts:129](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/core/vector-store/IVectorStoreManager.ts#L129)

**`Async`**

Gracefully shuts down all managed vector store providers.
This calls the `shutdown()` method on each initialized `IVectorStore` instance.

#### Returns

`Promise`\<`void`\>

A promise that resolves when all providers have been shut down.
