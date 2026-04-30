# Class: TwitterChannelAdapter

Defined in: [packages/agentos/src/channels/adapters/TwitterChannelAdapter.ts:85](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/channels/adapters/TwitterChannelAdapter.ts#L85)

Channel adapter for Twitter / X.

Uses the `twitter-api-v2` package via dynamic import so the
dependency is optional -- it is only loaded at connection time.

Capabilities: `text`, `images`, `video`, `hashtags`, `mentions`,
`threads`, `reactions`, `polls`.

## Extends

- [`BaseChannelAdapter`](BaseChannelAdapter.md)\<[`TwitterAuthParams`](../interfaces/TwitterAuthParams.md)\>

## Constructors

### Constructor

> **new TwitterChannelAdapter**(`retryConfig?`): `TwitterChannelAdapter`

Defined in: [packages/agentos/src/channels/adapters/BaseChannelAdapter.ts:111](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/channels/adapters/BaseChannelAdapter.ts#L111)

#### Parameters

##### retryConfig?

`Partial`\<[`RetryConfig`](../interfaces/RetryConfig.md)\>

#### Returns

`TwitterChannelAdapter`

#### Inherited from

[`BaseChannelAdapter`](BaseChannelAdapter.md).[`constructor`](BaseChannelAdapter.md#constructor)

## Properties

### auth

> `protected` **auth**: [`ChannelAuthConfig`](../interfaces/ChannelAuthConfig.md) & `object` \| `undefined`

Defined in: [packages/agentos/src/channels/adapters/BaseChannelAdapter.ts:97](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/channels/adapters/BaseChannelAdapter.ts#L97)

Stored auth config so `reconnect()` can re-use it.

#### Inherited from

[`BaseChannelAdapter`](BaseChannelAdapter.md).[`auth`](BaseChannelAdapter.md#auth)

***

### capabilities

> `readonly` **capabilities**: readonly [`ChannelCapability`](../type-aliases/ChannelCapability.md)[]

Defined in: [packages/agentos/src/channels/adapters/TwitterChannelAdapter.ts:88](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/channels/adapters/TwitterChannelAdapter.ts#L88)

Declared capabilities of this adapter.

#### Overrides

[`BaseChannelAdapter`](BaseChannelAdapter.md).[`capabilities`](BaseChannelAdapter.md#capabilities)

***

### connectedSince

> `protected` **connectedSince**: `string` \| `undefined`

Defined in: [packages/agentos/src/channels/adapters/BaseChannelAdapter.ts:92](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/channels/adapters/BaseChannelAdapter.ts#L92)

#### Inherited from

[`BaseChannelAdapter`](BaseChannelAdapter.md).[`connectedSince`](BaseChannelAdapter.md#connectedsince)

***

### displayName

> `readonly` **displayName**: `"Twitter / X"` = `'Twitter / X'`

Defined in: [packages/agentos/src/channels/adapters/TwitterChannelAdapter.ts:87](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/channels/adapters/TwitterChannelAdapter.ts#L87)

Human-readable display name (e.g., "WhatsApp Business").

#### Overrides

[`BaseChannelAdapter`](BaseChannelAdapter.md).[`displayName`](BaseChannelAdapter.md#displayname)

***

### errorMessage

> `protected` **errorMessage**: `string` \| `undefined`

Defined in: [packages/agentos/src/channels/adapters/BaseChannelAdapter.ts:93](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/channels/adapters/BaseChannelAdapter.ts#L93)

#### Inherited from

[`BaseChannelAdapter`](BaseChannelAdapter.md).[`errorMessage`](BaseChannelAdapter.md#errormessage)

***

### platform

> `readonly` **platform**: [`ChannelPlatform`](../type-aliases/ChannelPlatform.md) = `'twitter'`

Defined in: [packages/agentos/src/channels/adapters/TwitterChannelAdapter.ts:86](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/channels/adapters/TwitterChannelAdapter.ts#L86)

Platform this adapter serves.

#### Overrides

[`BaseChannelAdapter`](BaseChannelAdapter.md).[`platform`](BaseChannelAdapter.md#platform)

***

### platformInfo

> `protected` **platformInfo**: `Record`\<`string`, `unknown`\> = `{}`

Defined in: [packages/agentos/src/channels/adapters/BaseChannelAdapter.ts:94](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/channels/adapters/BaseChannelAdapter.ts#L94)

#### Inherited from

[`BaseChannelAdapter`](BaseChannelAdapter.md).[`platformInfo`](BaseChannelAdapter.md#platforminfo)

***

### retryConfig

> `protected` `readonly` **retryConfig**: [`RetryConfig`](../interfaces/RetryConfig.md)

Defined in: [packages/agentos/src/channels/adapters/BaseChannelAdapter.ts:101](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/channels/adapters/BaseChannelAdapter.ts#L101)

#### Inherited from

[`BaseChannelAdapter`](BaseChannelAdapter.md).[`retryConfig`](BaseChannelAdapter.md#retryconfig)

***

### status

> `protected` **status**: [`ChannelConnectionStatus`](../type-aliases/ChannelConnectionStatus.md) = `'disconnected'`

Defined in: [packages/agentos/src/channels/adapters/BaseChannelAdapter.ts:91](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/channels/adapters/BaseChannelAdapter.ts#L91)

#### Inherited from

[`BaseChannelAdapter`](BaseChannelAdapter.md).[`status`](BaseChannelAdapter.md#status)

## Methods

### doConnect()

> `protected` **doConnect**(`auth`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/channels/adapters/TwitterChannelAdapter.ts:117](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/channels/adapters/TwitterChannelAdapter.ts#L117)

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

Defined in: [packages/agentos/src/channels/adapters/TwitterChannelAdapter.ts:178](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/channels/adapters/TwitterChannelAdapter.ts#L178)

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

Defined in: [packages/agentos/src/channels/adapters/TwitterChannelAdapter.ts:197](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/channels/adapters/TwitterChannelAdapter.ts#L197)

Release platform resources (close WebSocket, stop polling, etc.).
Called by [shutdown](#shutdown) before the state transitions to `disconnected`.

#### Returns

`Promise`\<`void`\>

#### Overrides

[`BaseChannelAdapter`](BaseChannelAdapter.md).[`doShutdown`](BaseChannelAdapter.md#doshutdown)

***

### emit()

> `protected` **emit**(`event`): `void`

Defined in: [packages/agentos/src/channels/adapters/BaseChannelAdapter.ts:265](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/channels/adapters/BaseChannelAdapter.ts#L265)

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

Defined in: [packages/agentos/src/channels/adapters/BaseChannelAdapter.ts:296](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/channels/adapters/BaseChannelAdapter.ts#L296)

Convenience helper: emit a `connection_change` event with the current
status. Called automatically by [setStatus](#setstatus).

#### Returns

`void`

#### Inherited from

[`BaseChannelAdapter`](BaseChannelAdapter.md).[`emitConnectionChange`](BaseChannelAdapter.md#emitconnectionchange)

***

### getAuthenticatedUser()

> **getAuthenticatedUser**(): \{ `id`: `string`; `name`: `string`; `username`: `string`; \} \| `undefined`

Defined in: [packages/agentos/src/channels/adapters/TwitterChannelAdapter.ts:327](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/channels/adapters/TwitterChannelAdapter.ts#L327)

Get the authenticated user information.

#### Returns

\{ `id`: `string`; `name`: `string`; `username`: `string`; \} \| `undefined`

***

### getConnectionInfo()

> **getConnectionInfo**(): [`ChannelConnectionInfo`](../interfaces/ChannelConnectionInfo.md)

Defined in: [packages/agentos/src/channels/adapters/BaseChannelAdapter.ts:205](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/channels/adapters/BaseChannelAdapter.ts#L205)

Get the current connection status and metadata.

#### Returns

[`ChannelConnectionInfo`](../interfaces/ChannelConnectionInfo.md)

#### Inherited from

[`BaseChannelAdapter`](BaseChannelAdapter.md).[`getConnectionInfo`](BaseChannelAdapter.md#getconnectioninfo)

***

### hasCapability()

> `protected` **hasCapability**(`cap`): `boolean`

Defined in: [packages/agentos/src/channels/adapters/BaseChannelAdapter.ts:312](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/channels/adapters/BaseChannelAdapter.ts#L312)

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

Defined in: [packages/agentos/src/channels/adapters/BaseChannelAdapter.ts:151](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/channels/adapters/BaseChannelAdapter.ts#L151)

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

### likeTweet()

> **likeTweet**(`tweetId`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/channels/adapters/TwitterChannelAdapter.ts:291](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/channels/adapters/TwitterChannelAdapter.ts#L291)

Like (favorite) a tweet.

#### Parameters

##### tweetId

`string`

#### Returns

`Promise`\<`void`\>

***

### on()

> **on**(`handler`, `eventTypes?`): () => `void`

Defined in: [packages/agentos/src/channels/adapters/BaseChannelAdapter.ts:248](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/channels/adapters/BaseChannelAdapter.ts#L248)

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

### postThread()

> **postThread**(`tweets`): `Promise`\<[`ChannelSendResult`](../interfaces/ChannelSendResult.md)[]\>

Defined in: [packages/agentos/src/channels/adapters/TwitterChannelAdapter.ts:272](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/channels/adapters/TwitterChannelAdapter.ts#L272)

Post a thread (sequence of connected tweets).

#### Parameters

##### tweets

[`MessageContent`](../interfaces/MessageContent.md)[]

#### Returns

`Promise`\<[`ChannelSendResult`](../interfaces/ChannelSendResult.md)[]\>

***

### postTweet()

> **postTweet**(`content`, `replyToTweetId?`): `Promise`\<[`ChannelSendResult`](../interfaces/ChannelSendResult.md)\>

Defined in: [packages/agentos/src/channels/adapters/TwitterChannelAdapter.ts:215](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/channels/adapters/TwitterChannelAdapter.ts#L215)

Post a tweet (public timeline post).

#### Parameters

##### content

[`MessageContent`](../interfaces/MessageContent.md)

Message content to tweet.

##### replyToTweetId?

`string`

If provided, the tweet will be a reply in a thread.

#### Returns

`Promise`\<[`ChannelSendResult`](../interfaces/ChannelSendResult.md)\>

***

### reconnect()

> **reconnect**(): `Promise`\<`void`\>

Defined in: [packages/agentos/src/channels/adapters/BaseChannelAdapter.ts:186](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/channels/adapters/BaseChannelAdapter.ts#L186)

Manually trigger a reconnection attempt using stored credentials.
Useful for UI-driven "reconnect" buttons.

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`BaseChannelAdapter`](BaseChannelAdapter.md).[`reconnect`](BaseChannelAdapter.md#reconnect)

***

### retweet()

> **retweet**(`tweetId`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/channels/adapters/TwitterChannelAdapter.ts:309](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/channels/adapters/TwitterChannelAdapter.ts#L309)

Retweet a tweet.

#### Parameters

##### tweetId

`string`

#### Returns

`Promise`\<`void`\>

***

### sendMessage()

> **sendMessage**(`conversationId`, `content`): `Promise`\<[`ChannelSendResult`](../interfaces/ChannelSendResult.md)\>

Defined in: [packages/agentos/src/channels/adapters/BaseChannelAdapter.ts:218](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/channels/adapters/BaseChannelAdapter.ts#L218)

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

> **sendTypingIndicator**(`_conversationId`, `_isTyping`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/channels/adapters/BaseChannelAdapter.ts:234](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/channels/adapters/BaseChannelAdapter.ts#L234)

Default stub — platforms that support typing indicators should override.

#### Parameters

##### \_conversationId

`string`

##### \_isTyping

`boolean`

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`BaseChannelAdapter`](BaseChannelAdapter.md).[`sendTypingIndicator`](BaseChannelAdapter.md#sendtypingindicator)

***

### setStatus()

> `protected` **setStatus**(`newStatus`, `error?`): `void`

Defined in: [packages/agentos/src/channels/adapters/BaseChannelAdapter.ts:319](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/channels/adapters/BaseChannelAdapter.ts#L319)

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

Defined in: [packages/agentos/src/channels/adapters/BaseChannelAdapter.ts:166](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/channels/adapters/BaseChannelAdapter.ts#L166)

Gracefully shut down the adapter and release all resources.

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`BaseChannelAdapter`](BaseChannelAdapter.md).[`shutdown`](BaseChannelAdapter.md#shutdown)
