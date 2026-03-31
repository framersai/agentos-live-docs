# Class: StreamingManager

Defined in: [packages/agentos/src/core/streaming/StreamingManager.ts:260](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/core/streaming/StreamingManager.ts#L260)

## Implements

Manages real-time data streams for AgentOS, handling client subscriptions
and chunk distribution.

## Implements

- [`IStreamingManager`](../interfaces/IStreamingManager.md)

## Constructors

### Constructor

> **new StreamingManager**(): `StreamingManager`

Defined in: [packages/agentos/src/core/streaming/StreamingManager.ts:266](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/core/streaming/StreamingManager.ts#L266)

#### Returns

`StreamingManager`

## Properties

### managerId

> `readonly` **managerId**: `string`

Defined in: [packages/agentos/src/core/streaming/StreamingManager.ts:264](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/core/streaming/StreamingManager.ts#L264)

## Methods

### closeStream()

> **closeStream**(`streamId`, `reason?`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/core/streaming/StreamingManager.ts:461](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/core/streaming/StreamingManager.ts#L461)

**`Async`**

Closes a specific stream. All subscribed clients will be notified and subsequently deregistered.
No further data can be pushed to a closed stream.

#### Parameters

##### streamId

`string`

The ID of the stream to close.

##### reason?

`string`

An optional reason for closing the stream.

#### Returns

`Promise`\<`void`\>

A promise that resolves when the stream is closed and clients are notified.

#### Throws

If the stream does not exist.

#### Implementation of

[`IStreamingManager`](../interfaces/IStreamingManager.md).[`closeStream`](../interfaces/IStreamingManager.md#closestream)

***

### createStream()

> **createStream**(`requestedStreamId?`): `Promise`\<`string`\>

Defined in: [packages/agentos/src/core/streaming/StreamingManager.ts:304](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/core/streaming/StreamingManager.ts#L304)

Creates a new data stream and returns its unique ID.

#### Parameters

##### requestedStreamId?

`string`

Optional. If provided, attempts to use this ID.
If not provided or if the ID already exists, a new unique ID will be generated.

#### Returns

`Promise`\<`string`\>

A promise resolving to the unique ID of the created stream.

#### Throws

If the maximum number of concurrent streams is reached,
or if a `requestedStreamId` is provided but already in use (and regeneration is not supported/fails).

#### Implementation of

[`IStreamingManager`](../interfaces/IStreamingManager.md).[`createStream`](../interfaces/IStreamingManager.md#createstream)

***

### deregisterClient()

> **deregisterClient**(`streamId`, `clientId`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/core/streaming/StreamingManager.ts:372](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/core/streaming/StreamingManager.ts#L372)

**`Async`**

Deregisters a client from a specific stream.
The client will no longer receive data chunks for this stream.

#### Parameters

##### streamId

`string`

The ID of the stream to unsubscribe from.

##### clientId

`string`

The ID of the client to deregister.

#### Returns

`Promise`\<`void`\>

A promise that resolves when the client is successfully deregistered.

#### Throws

If the stream or client does not exist within that stream.

#### Implementation of

[`IStreamingManager`](../interfaces/IStreamingManager.md).[`deregisterClient`](../interfaces/IStreamingManager.md#deregisterclient)

***

### getActiveStreamIds()

> **getActiveStreamIds**(): `Promise`\<`string`[]\>

Defined in: [packages/agentos/src/core/streaming/StreamingManager.ts:530](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/core/streaming/StreamingManager.ts#L530)

Retrieves a list of IDs for all currently active streams.

#### Returns

`Promise`\<`string`[]\>

A promise resolving to an array of active stream IDs.

#### Implementation of

[`IStreamingManager`](../interfaces/IStreamingManager.md).[`getActiveStreamIds`](../interfaces/IStreamingManager.md#getactivestreamids)

***

### getClientCountForStream()

> **getClientCountForStream**(`streamId`): `Promise`\<`number`\>

Defined in: [packages/agentos/src/core/streaming/StreamingManager.ts:536](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/core/streaming/StreamingManager.ts#L536)

**`Async`**

Retrieves the number of clients currently subscribed to a specific stream.

#### Parameters

##### streamId

`string`

The ID of the stream.

#### Returns

`Promise`\<`number`\>

A promise resolving to the number of clients.

#### Throws

If the stream does not exist.

#### Implementation of

[`IStreamingManager`](../interfaces/IStreamingManager.md).[`getClientCountForStream`](../interfaces/IStreamingManager.md#getclientcountforstream)

***

### handleStreamError()

> **handleStreamError**(`streamId`, `error`, `terminateStream?`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/core/streaming/StreamingManager.ts:491](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/core/streaming/StreamingManager.ts#L491)

**`Async`**

Handles an error that occurred on a specific stream.
This might involve notifying clients with an error chunk and/or closing the stream.

#### Parameters

##### streamId

`string`

The ID of the stream where the error occurred.

##### error

`Error`

The error object.

##### terminateStream?

`boolean` = `true`

If true, the stream will be closed after processing the error.

#### Returns

`Promise`\<`void`\>

A promise that resolves when the error has been handled.

#### Throws

If the stream does not exist.

#### Implementation of

[`IStreamingManager`](../interfaces/IStreamingManager.md).[`handleStreamError`](../interfaces/IStreamingManager.md#handlestreamerror)

***

### initialize()

> **initialize**(`config`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/core/streaming/StreamingManager.ts:272](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/core/streaming/StreamingManager.ts#L272)

**`Async`**

Initializes the StreamingManager with its configuration.
This method must be called successfully before any other operations.

#### Parameters

##### config

[`StreamingManagerConfig`](../interfaces/StreamingManagerConfig.md)

The configuration for the manager.

#### Returns

`Promise`\<`void`\>

A promise that resolves upon successful initialization.

#### Throws

If configuration is invalid or initialization fails.

#### Implementation of

[`IStreamingManager`](../interfaces/IStreamingManager.md).[`initialize`](../interfaces/IStreamingManager.md#initialize)

***

### pushChunk()

> **pushChunk**(`streamId`, `chunk`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/core/streaming/StreamingManager.ts:401](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/core/streaming/StreamingManager.ts#L401)

**`Async`**

Pushes a data chunk to all clients currently subscribed to the specified stream.

#### Parameters

##### streamId

`string`

The ID of the stream to push data to.

##### chunk

[`AgentOSResponse`](../type-aliases/AgentOSResponse.md)

The data chunk to distribute.

#### Returns

`Promise`\<`void`\>

A promise that resolves when the chunk has been pushed to all
active clients of the stream (or attempted, based on `onClientSendErrorBehavior`).

#### Throws

If the stream does not exist, or if `onClientSendErrorBehavior` is 'throw'
and a client send fails.

#### Implementation of

[`IStreamingManager`](../interfaces/IStreamingManager.md).[`pushChunk`](../interfaces/IStreamingManager.md#pushchunk)

***

### registerClient()

> **registerClient**(`streamId`, `client`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/core/streaming/StreamingManager.ts:343](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/core/streaming/StreamingManager.ts#L343)

**`Async`**

Registers a client to a specific stream to receive data chunks.

#### Parameters

##### streamId

`string`

The ID of the stream to subscribe to.

##### client

`IStreamClient`

The client instance that implements `IStreamClient`.

#### Returns

`Promise`\<`void`\>

A promise that resolves when the client is successfully registered.

#### Throws

If the stream does not exist, if the client is already registered,
or if the maximum number of clients for the stream is reached.

#### Implementation of

[`IStreamingManager`](../interfaces/IStreamingManager.md).[`registerClient`](../interfaces/IStreamingManager.md#registerclient)

***

### shutdown()

> **shutdown**(`isReinitializing?`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/core/streaming/StreamingManager.ts:546](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/core/streaming/StreamingManager.ts#L546)

**`Async`**

Gracefully shuts down the StreamingManager, closing all active streams
and releasing any resources.

#### Parameters

##### isReinitializing?

`boolean` = `false`

#### Returns

`Promise`\<`void`\>

A promise that resolves when shutdown is complete.

#### Implementation of

[`IStreamingManager`](../interfaces/IStreamingManager.md).[`shutdown`](../interfaces/IStreamingManager.md#shutdown)
