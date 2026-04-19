# Class: VectorStoreManager

Defined in: [packages/agentos/src/rag/VectorStoreManager.ts:59](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/rag/VectorStoreManager.ts#L59)

Implements the `IVectorStoreManager` interface.

## Implements

## Implements

- [`IVectorStoreManager`](../interfaces/IVectorStoreManager.md)

## Constructors

### Constructor

> **new VectorStoreManager**(): `VectorStoreManager`

Defined in: [packages/agentos/src/rag/VectorStoreManager.ts:70](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/rag/VectorStoreManager.ts#L70)

Constructs a VectorStoreManager instance.
The manager is not operational until `initialize` is called.

#### Returns

`VectorStoreManager`

## Properties

### managerInstanceId

> `readonly` **managerInstanceId**: `string`

Defined in: [packages/agentos/src/rag/VectorStoreManager.ts:64](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/rag/VectorStoreManager.ts#L64)

## Methods

### checkHealth()

> **checkHealth**(`providerId?`): `Promise`\<[`VectorStoreManagerHealthReport`](../interfaces/VectorStoreManagerHealthReport.md)\>

Defined in: [packages/agentos/src/rag/VectorStoreManager.ts:290](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/rag/VectorStoreManager.ts#L290)

**`Async`**

Checks the health of all managed vector store providers or a specific one.
This aggregates health information from individual `IVectorStore.checkHealth()` calls.

#### Parameters

##### providerId?

`string`

Optional: If provided, checks only this specific provider.
If omitted, checks all configured providers.

#### Returns

`Promise`\<[`VectorStoreManagerHealthReport`](../interfaces/VectorStoreManagerHealthReport.md)\>

A promise that resolves with a comprehensive health report.

#### Implementation of

[`IVectorStoreManager`](../interfaces/IVectorStoreManager.md).[`checkHealth`](../interfaces/IVectorStoreManager.md#checkhealth)

***

### getDefaultProvider()

> **getDefaultProvider**(): [`IVectorStore`](../interfaces/IVectorStore.md)

Defined in: [packages/agentos/src/rag/VectorStoreManager.ts:228](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/rag/VectorStoreManager.ts#L228)

Retrieves the default IVectorStore provider instance as configured in `VectorStoreManagerConfig.defaultProviderId`.

#### Returns

[`IVectorStore`](../interfaces/IVectorStore.md)

The default IVectorStore instance.

#### Throws

If no default provider is configured, the configured default provider is not found,
or it failed to initialize.

#### Implementation of

[`IVectorStoreManager`](../interfaces/IVectorStoreManager.md).[`getDefaultProvider`](../interfaces/IVectorStoreManager.md#getdefaultprovider)

***

### getProvider()

> **getProvider**(`providerId`): [`IVectorStore`](../interfaces/IVectorStore.md)

Defined in: [packages/agentos/src/rag/VectorStoreManager.ts:212](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/rag/VectorStoreManager.ts#L212)

Retrieves a specific, initialized IVectorStore provider instance by its configured ID.
The provider ID corresponds to `VectorStoreProviderConfig.id`.

#### Parameters

##### providerId

`string`

The unique ID of the vector store provider instance.

#### Returns

[`IVectorStore`](../interfaces/IVectorStore.md)

The IVectorStore instance.

#### Throws

If the providerId is not configured, not found, or the provider
failed to initialize.

#### Implementation of

[`IVectorStoreManager`](../interfaces/IVectorStoreManager.md).[`getProvider`](../interfaces/IVectorStoreManager.md#getprovider)

***

### getStoreForDataSource()

> **getStoreForDataSource**(`dataSourceId`): `Promise`\<\{ `collectionName`: `string`; `dimension?`: `number`; `store`: [`IVectorStore`](../interfaces/IVectorStore.md); \}\>

Defined in: [packages/agentos/src/rag/VectorStoreManager.ts:250](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/rag/VectorStoreManager.ts#L250)

Retrieves an IVectorStore instance and the specific collection name within that store
associated with a given logical RAG Data Source ID.
This is a convenience method for services like RetrievalAugmentor that operate on
logical `dataSourceId`s.

#### Parameters

##### dataSourceId

`string`

The logical RAG Data Source ID (from `RagDataSourceConfig.dataSourceId`).

#### Returns

`Promise`\<\{ `collectionName`: `string`; `dimension?`: `number`; `store`: [`IVectorStore`](../interfaces/IVectorStore.md); \}\>

A promise that resolves with the
IVectorStore instance, the actual collection name to use with that store for this data source,
and the expected embedding dimension.

#### Throws

If the `dataSourceId` is not configured, or its associated provider is unavailable.

#### Implementation of

[`IVectorStoreManager`](../interfaces/IVectorStoreManager.md).[`getStoreForDataSource`](../interfaces/IVectorStoreManager.md#getstorefordatasource)

***

### initialize()

> **initialize**(`managerConfig`, `dataSourceConfigs`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/rag/VectorStoreManager.ts:79](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/rag/VectorStoreManager.ts#L79)

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

#### Implementation of

[`IVectorStoreManager`](../interfaces/IVectorStoreManager.md).[`initialize`](../interfaces/IVectorStoreManager.md#initialize)

***

### listDataSourceIds()

> **listDataSourceIds**(): `string`[]

Defined in: [packages/agentos/src/rag/VectorStoreManager.ts:282](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/rag/VectorStoreManager.ts#L282)

Lists the unique IDs of all logical RAG Data Sources configured.

#### Returns

`string`[]

An array of RAG Data Source IDs.

#### Implementation of

[`IVectorStoreManager`](../interfaces/IVectorStoreManager.md).[`listDataSourceIds`](../interfaces/IVectorStoreManager.md#listdatasourceids)

***

### listProviderIds()

> **listProviderIds**(): `string`[]

Defined in: [packages/agentos/src/rag/VectorStoreManager.ts:274](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/rag/VectorStoreManager.ts#L274)

Lists the unique IDs of all vector store providers configured and managed by this manager.

#### Returns

`string`[]

An array of provider IDs.

#### Implementation of

[`IVectorStoreManager`](../interfaces/IVectorStoreManager.md).[`listProviderIds`](../interfaces/IVectorStoreManager.md#listproviderids)

***

### shutdownAllProviders()

> **shutdownAllProviders**(): `Promise`\<`void`\>

Defined in: [packages/agentos/src/rag/VectorStoreManager.ts:351](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/rag/VectorStoreManager.ts#L351)

**`Async`**

Gracefully shuts down all managed vector store providers.
This calls the `shutdown()` method on each initialized `IVectorStore` instance.

#### Returns

`Promise`\<`void`\>

A promise that resolves when all providers have been shut down.

#### Implementation of

[`IVectorStoreManager`](../interfaces/IVectorStoreManager.md).[`shutdownAllProviders`](../interfaces/IVectorStoreManager.md#shutdownallproviders)
