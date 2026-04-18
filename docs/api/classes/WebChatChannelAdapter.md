# Class: WebChatChannelAdapter

Defined in: [packages/agentos/src/channels/adapters/WebChatChannelAdapter.ts:147](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/channels/adapters/WebChatChannelAdapter.ts#L147)

Channel adapter for web-based chat using HTTP/WebSocket.

Uses dynamic import for the `ws` package so it is only required
at runtime when the adapter is actually initialized.

Capabilities: text, rich_text, images, buttons, typing_indicator,
read_receipts.

## Extends

- [`BaseChannelAdapter`](BaseChannelAdapter.md)\<[`WebChatAuthParams`](../interfaces/WebChatAuthParams.md)\>

## Constructors

### Constructor

> **new WebChatChannelAdapter**(`retryConfig?`): `WebChatChannelAdapter`

Defined in: [packages/agentos/src/channels/adapters/BaseChannelAdapter.ts:111](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/channels/adapters/BaseChannelAdapter.ts#L111)

#### Parameters

##### retryConfig?

`Partial`\<[`RetryConfig`](../interfaces/RetryConfig.md)\>

#### Returns

`WebChatChannelAdapter`

#### Inherited from

[`BaseChannelAdapter`](BaseChannelAdapter.md).[`constructor`](BaseChannelAdapter.md#constructor)

## Properties

### auth

> `protected` **auth**: [`ChannelAuthConfig`](../interfaces/ChannelAuthConfig.md) & `object` \| `undefined`

Defined in: [packages/agentos/src/channels/adapters/BaseChannelAdapter.ts:97](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/channels/adapters/BaseChannelAdapter.ts#L97)

Stored auth config so `reconnect()` can re-use it.

#### Inherited from

[`BaseChannelAdapter`](BaseChannelAdapter.md).[`auth`](BaseChannelAdapter.md#auth)

***

### capabilities

> `readonly` **capabilities**: readonly [`ChannelCapability`](../type-aliases/ChannelCapability.md)[]

Defined in: [packages/agentos/src/channels/adapters/WebChatChannelAdapter.ts:150](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/channels/adapters/WebChatChannelAdapter.ts#L150)

Declared capabilities of this adapter.

#### Overrides

[`BaseChannelAdapter`](BaseChannelAdapter.md).[`capabilities`](BaseChannelAdapter.md#capabilities)

***

### connectedSince

> `protected` **connectedSince**: `string` \| `undefined`

Defined in: [packages/agentos/src/channels/adapters/BaseChannelAdapter.ts:92](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/channels/adapters/BaseChannelAdapter.ts#L92)

#### Inherited from

[`BaseChannelAdapter`](BaseChannelAdapter.md).[`connectedSince`](BaseChannelAdapter.md#connectedsince)

***

### displayName

> `readonly` **displayName**: `"WebChat"` = `'WebChat'`

Defined in: [packages/agentos/src/channels/adapters/WebChatChannelAdapter.ts:149](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/channels/adapters/WebChatChannelAdapter.ts#L149)

Human-readable display name (e.g., "WhatsApp Business").

#### Overrides

[`BaseChannelAdapter`](BaseChannelAdapter.md).[`displayName`](BaseChannelAdapter.md#displayname)

***

### errorMessage

> `protected` **errorMessage**: `string` \| `undefined`

Defined in: [packages/agentos/src/channels/adapters/BaseChannelAdapter.ts:93](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/channels/adapters/BaseChannelAdapter.ts#L93)

#### Inherited from

[`BaseChannelAdapter`](BaseChannelAdapter.md).[`errorMessage`](BaseChannelAdapter.md#errormessage)

***

### platform

> `readonly` **platform**: [`ChannelPlatform`](../type-aliases/ChannelPlatform.md) = `'webchat'`

Defined in: [packages/agentos/src/channels/adapters/WebChatChannelAdapter.ts:148](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/channels/adapters/WebChatChannelAdapter.ts#L148)

Platform this adapter serves.

#### Overrides

[`BaseChannelAdapter`](BaseChannelAdapter.md).[`platform`](BaseChannelAdapter.md#platform)

***

### platformInfo

> `protected` **platformInfo**: `Record`\<`string`, `unknown`\> = `{}`

Defined in: [packages/agentos/src/channels/adapters/BaseChannelAdapter.ts:94](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/channels/adapters/BaseChannelAdapter.ts#L94)

#### Inherited from

[`BaseChannelAdapter`](BaseChannelAdapter.md).[`platformInfo`](BaseChannelAdapter.md#platforminfo)

***

### retryConfig

> `protected` `readonly` **retryConfig**: [`RetryConfig`](../interfaces/RetryConfig.md)

Defined in: [packages/agentos/src/channels/adapters/BaseChannelAdapter.ts:101](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/channels/adapters/BaseChannelAdapter.ts#L101)

#### Inherited from

[`BaseChannelAdapter`](BaseChannelAdapter.md).[`retryConfig`](BaseChannelAdapter.md#retryconfig)

***

### status

> `protected` **status**: [`ChannelConnectionStatus`](../type-aliases/ChannelConnectionStatus.md) = `'disconnected'`

Defined in: [packages/agentos/src/channels/adapters/BaseChannelAdapter.ts:91](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/channels/adapters/BaseChannelAdapter.ts#L91)

#### Inherited from

[`BaseChannelAdapter`](BaseChannelAdapter.md).[`status`](BaseChannelAdapter.md#status)

## Methods

### attachToServer()

> **attachToServer**(`server`): `void`

Defined in: [packages/agentos/src/channels/adapters/WebChatChannelAdapter.ts:195](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/channels/adapters/WebChatChannelAdapter.ts#L195)

Attach to an existing HTTP server instead of creating a standalone one.
Must be called before [initialize](#initialize).

#### Parameters

##### server

`any`

Node.js http.Server instance (e.g., from Express).

#### Returns

`void`

***

### broadcast()

> **broadcast**(`content`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/channels/adapters/WebChatChannelAdapter.ts:411](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/channels/adapters/WebChatChannelAdapter.ts#L411)

Broadcast a message to ALL connected and authenticated clients.

#### Parameters

##### content

[`MessageContent`](../interfaces/MessageContent.md)

#### Returns

`Promise`\<`void`\>

***

### doConnect()

> `protected` **doConnect**(`auth`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/channels/adapters/WebChatChannelAdapter.ts:201](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/channels/adapters/WebChatChannelAdapter.ts#L201)

Establish the platform connection using the supplied credentials.
Called by [initialize](#initialize) after state has been set to `connecting`.
Must throw on failure — the base class handles retry and state changes.

#### Parameters

##### auth

[`ChannelAuthConfig`](../interfaces/ChannelAuthConfig.md) & `object`

#### Returns

`Promise`\<`void`\>

#### Overrides

[`BaseChannelAdapter`](BaseChannelAdapter.md).[`doConnect`](BaseChannelAdapter.md#doconnect)

***

### doSendMessage()

> `protected` **doSendMessage**(`conversationId`, `content`): `Promise`\<[`ChannelSendResult`](../interfaces/ChannelSendResult.md)\>

Defined in: [packages/agentos/src/channels/adapters/WebChatChannelAdapter.ts:281](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/channels/adapters/WebChatChannelAdapter.ts#L281)

Deliver a message to the external platform.
Called by [sendMessage](#sendmessage) only when the adapter is `connected`.

#### Parameters

##### conversationId

`string`

##### content

[`MessageContent`](../interfaces/MessageContent.md)

#### Returns

`Promise`\<[`ChannelSendResult`](../interfaces/ChannelSendResult.md)\>

#### Overrides

[`BaseChannelAdapter`](BaseChannelAdapter.md).[`doSendMessage`](BaseChannelAdapter.md#dosendmessage)

***

### doShutdown()

> `protected` **doShutdown**(): `Promise`\<`void`\>

Defined in: [packages/agentos/src/channels/adapters/WebChatChannelAdapter.ts:322](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/channels/adapters/WebChatChannelAdapter.ts#L322)

Release platform resources (close WebSocket, stop polling, etc.).
Called by [shutdown](#shutdown) before the state transitions to `disconnected`.

#### Returns

`Promise`\<`void`\>

#### Overrides

[`BaseChannelAdapter`](BaseChannelAdapter.md).[`doShutdown`](BaseChannelAdapter.md#doshutdown)

***

### emit()

> `protected` **emit**(`event`): `void`

Defined in: [packages/agentos/src/channels/adapters/BaseChannelAdapter.ts:265](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/channels/adapters/BaseChannelAdapter.ts#L265)

Emit an event to all matching subscribers.
Subclasses call this when the platform SDK receives an inbound event.

#### Parameters

##### event

[`ChannelEvent`](../interfaces/ChannelEvent.md)

#### Returns

`void`

#### Inherited from

[`BaseChannelAdapter`](BaseChannelAdapter.md).[`emit`](BaseChannelAdapter.md#emit)

***

### emitConnectionChange()

> `protected` **emitConnectionChange**(): `void`

Defined in: [packages/agentos/src/channels/adapters/BaseChannelAdapter.ts:296](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/channels/adapters/BaseChannelAdapter.ts#L296)

Convenience helper: emit a `connection_change` event with the current
status. Called automatically by [setStatus](#setstatus).

#### Returns

`void`

#### Inherited from

[`BaseChannelAdapter`](BaseChannelAdapter.md).[`emitConnectionChange`](BaseChannelAdapter.md#emitconnectionchange)

***

### getConnectedClientCount()

> **getConnectedClientCount**(): `number`

Defined in: [packages/agentos/src/channels/adapters/WebChatChannelAdapter.ts:399](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/channels/adapters/WebChatChannelAdapter.ts#L399)

Get the number of currently connected clients.

#### Returns

`number`

***

### getConnectedClientIds()

> **getConnectedClientIds**(): `string`[]

Defined in: [packages/agentos/src/channels/adapters/WebChatChannelAdapter.ts:404](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/channels/adapters/WebChatChannelAdapter.ts#L404)

Get all connected client IDs.

#### Returns

`string`[]

***

### getConnectionInfo()

> **getConnectionInfo**(): [`ChannelConnectionInfo`](../interfaces/ChannelConnectionInfo.md)

Defined in: [packages/agentos/src/channels/adapters/BaseChannelAdapter.ts:205](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/channels/adapters/BaseChannelAdapter.ts#L205)

Get the current connection status and metadata.

#### Returns

[`ChannelConnectionInfo`](../interfaces/ChannelConnectionInfo.md)

#### Inherited from

[`BaseChannelAdapter`](BaseChannelAdapter.md).[`getConnectionInfo`](BaseChannelAdapter.md#getconnectioninfo)

***

### getConversationInfo()

> **getConversationInfo**(`conversationId`): `Promise`\<\{ `isGroup`: `boolean`; `memberCount?`: `number`; `metadata?`: `Record`\<`string`, `unknown`\>; `name?`: `string`; \}\>

Defined in: [packages/agentos/src/channels/adapters/WebChatChannelAdapter.ts:378](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/channels/adapters/WebChatChannelAdapter.ts#L378)

#### Parameters

##### conversationId

`string`

#### Returns

`Promise`\<\{ `isGroup`: `boolean`; `memberCount?`: `number`; `metadata?`: `Record`\<`string`, `unknown`\>; `name?`: `string`; \}\>

***

### hasCapability()

> `protected` **hasCapability**(`cap`): `boolean`

Defined in: [packages/agentos/src/channels/adapters/BaseChannelAdapter.ts:312](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/channels/adapters/BaseChannelAdapter.ts#L312)

Check whether this adapter declares a specific capability.

#### Parameters

##### cap

[`ChannelCapability`](../type-aliases/ChannelCapability.md)

#### Returns

`boolean`

#### Inherited from

[`BaseChannelAdapter`](BaseChannelAdapter.md).[`hasCapability`](BaseChannelAdapter.md#hascapability)

***

### initialize()

> **initialize**(`auth`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/channels/adapters/BaseChannelAdapter.ts:151](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/channels/adapters/BaseChannelAdapter.ts#L151)

Initialize the adapter with auth credentials. If already connected this
will shut down the existing connection first (idempotent).

#### Parameters

##### auth

[`ChannelAuthConfig`](../interfaces/ChannelAuthConfig.md)

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`BaseChannelAdapter`](BaseChannelAdapter.md).[`initialize`](BaseChannelAdapter.md#initialize)

***

### on()

> **on**(`handler`, `eventTypes?`): () => `void`

Defined in: [packages/agentos/src/channels/adapters/BaseChannelAdapter.ts:248](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/channels/adapters/BaseChannelAdapter.ts#L248)

Register an event handler. Returns an unsubscribe function.

#### Parameters

##### handler

[`ChannelEventHandler`](../type-aliases/ChannelEventHandler.md)

##### eventTypes?

[`ChannelEventType`](../type-aliases/ChannelEventType.md)[]

#### Returns

> (): `void`

##### Returns

`void`

#### Inherited from

[`BaseChannelAdapter`](BaseChannelAdapter.md).[`on`](BaseChannelAdapter.md#on)

***

### reconnect()

> **reconnect**(): `Promise`\<`void`\>

Defined in: [packages/agentos/src/channels/adapters/BaseChannelAdapter.ts:186](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/channels/adapters/BaseChannelAdapter.ts#L186)

Manually trigger a reconnection attempt using stored credentials.
Useful for UI-driven "reconnect" buttons.

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`BaseChannelAdapter`](BaseChannelAdapter.md).[`reconnect`](BaseChannelAdapter.md#reconnect)

***

### sendMessage()

> **sendMessage**(`conversationId`, `content`): `Promise`\<[`ChannelSendResult`](../interfaces/ChannelSendResult.md)\>

Defined in: [packages/agentos/src/channels/adapters/BaseChannelAdapter.ts:218](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/channels/adapters/BaseChannelAdapter.ts#L218)

Send a message to a conversation on the external platform.

#### Parameters

##### conversationId

`string`

Platform-native conversation/chat ID.

##### content

[`MessageContent`](../interfaces/MessageContent.md)

Message content to send.

#### Returns

`Promise`\<[`ChannelSendResult`](../interfaces/ChannelSendResult.md)\>

The platform-assigned message ID.

#### Inherited from

[`BaseChannelAdapter`](BaseChannelAdapter.md).[`sendMessage`](BaseChannelAdapter.md#sendmessage)

***

### sendTypingIndicator()

> **sendTypingIndicator**(`conversationId`, `isTyping`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/channels/adapters/WebChatChannelAdapter.ts:360](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/channels/adapters/WebChatChannelAdapter.ts#L360)

Default stub — platforms that support typing indicators should override.

#### Parameters

##### conversationId

`string`

##### isTyping

`boolean`

#### Returns

`Promise`\<`void`\>

#### Overrides

[`BaseChannelAdapter`](BaseChannelAdapter.md).[`sendTypingIndicator`](BaseChannelAdapter.md#sendtypingindicator)

***

### setStatus()

> `protected` **setStatus**(`newStatus`, `error?`): `void`

Defined in: [packages/agentos/src/channels/adapters/BaseChannelAdapter.ts:319](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/channels/adapters/BaseChannelAdapter.ts#L319)

Transition to a new connection status and emit an event.

#### Parameters

##### newStatus

[`ChannelConnectionStatus`](../type-aliases/ChannelConnectionStatus.md)

##### error?

`string`

#### Returns

`void`

#### Inherited from

[`BaseChannelAdapter`](BaseChannelAdapter.md).[`setStatus`](BaseChannelAdapter.md#setstatus)

***

### shutdown()

> **shutdown**(): `Promise`\<`void`\>

Defined in: [packages/agentos/src/channels/adapters/BaseChannelAdapter.ts:166](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/channels/adapters/BaseChannelAdapter.ts#L166)

Gracefully shut down the adapter and release all resources.

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`BaseChannelAdapter`](BaseChannelAdapter.md).[`shutdown`](BaseChannelAdapter.md#shutdown)
