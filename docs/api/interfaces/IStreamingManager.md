# Interface: IStreamingManager

Defined in: [packages/agentos/src/core/streaming/StreamingManager.ts:115](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/core/streaming/StreamingManager.ts#L115)

## Interface

IStreamingManager

## Description

Defines the contract for the StreamingManager service.
This service is responsible for creating, managing, and terminating data streams,
as well as handling client subscriptions and data distribution.

## Methods

### closeStream()

> **closeStream**(`streamId`, `reason?`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/core/streaming/StreamingManager.ts:191](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/core/streaming/StreamingManager.ts#L191)

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

***

### createStream()

> **createStream**(`requestedStreamId?`): `Promise`\<`string`\>

Defined in: [packages/agentos/src/core/streaming/StreamingManager.ts:138](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/core/streaming/StreamingManager.ts#L138)

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

***

### deregisterClient()

> **deregisterClient**(`streamId`, `clientId`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/core/streaming/StreamingManager.ts:164](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/core/streaming/StreamingManager.ts#L164)

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

***

### getActiveStreamIds()

> **getActiveStreamIds**(): `Promise`\<`string`[]\>

Defined in: [packages/agentos/src/core/streaming/StreamingManager.ts:213](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/core/streaming/StreamingManager.ts#L213)

Retrieves a list of IDs for all currently active streams.

#### Returns

`Promise`\<`string`[]\>

A promise resolving to an array of active stream IDs.

***

### getClientCountForStream()

> **getClientCountForStream**(`streamId`): `Promise`\<`number`\>

Defined in: [packages/agentos/src/core/streaming/StreamingManager.ts:224](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/core/streaming/StreamingManager.ts#L224)

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

***

### handleStreamError()

> **handleStreamError**(`streamId`, `error`, `terminateStream?`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/core/streaming/StreamingManager.ts:205](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/core/streaming/StreamingManager.ts#L205)

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

`boolean`

If true, the stream will be closed after processing the error.

#### Returns

`Promise`\<`void`\>

A promise that resolves when the error has been handled.

#### Throws

If the stream does not exist.

***

### initialize()

> **initialize**(`config`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/core/streaming/StreamingManager.ts:126](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/core/streaming/StreamingManager.ts#L126)

**`Async`**

Initializes the StreamingManager with its configuration.
This method must be called successfully before any other operations.

#### Parameters

##### config

[`StreamingManagerConfig`](StreamingManagerConfig.md)

The configuration for the manager.

#### Returns

`Promise`\<`void`\>

A promise that resolves upon successful initialization.

#### Throws

If configuration is invalid or initialization fails.

***

### pushChunk()

> **pushChunk**(`streamId`, `chunk`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/core/streaming/StreamingManager.ts:178](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/core/streaming/StreamingManager.ts#L178)

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

***

### registerClient()

> **registerClient**(`streamId`, `client`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/core/streaming/StreamingManager.ts:151](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/core/streaming/StreamingManager.ts#L151)

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

***

### shutdown()

> **shutdown**(): `Promise`\<`void`\>

Defined in: [packages/agentos/src/core/streaming/StreamingManager.ts:234](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/core/streaming/StreamingManager.ts#L234)

**`Async`**

Gracefully shuts down the StreamingManager, closing all active streams
and releasing any resources.

#### Returns

`Promise`\<`void`\>

A promise that resolves when shutdown is complete.
