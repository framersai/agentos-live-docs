# Abstract Class: BaseChannelAdapter\<TAuthParams\>

Defined in: [packages/agentos/src/channels/adapters/BaseChannelAdapter.ts:79](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/channels/adapters/BaseChannelAdapter.ts#L79)

Abstract base class that implements common [IChannelAdapter](../interfaces/IChannelAdapter.md)
behaviour. Concrete adapters (Telegram, Discord, IRC, ...) extend this
class and implement the three abstract hooks:

- `doConnect(auth)` -- establish the platform connection.
- `doSendMessage(conversationId, content)` -- deliver a message.
- `doShutdown()` -- tear down the platform connection.

## Extended by

- [`TelegramChannelAdapter`](TelegramChannelAdapter.md)
- [`DiscordChannelAdapter`](DiscordChannelAdapter.md)
- [`SlackChannelAdapter`](SlackChannelAdapter.md)
- [`WhatsAppChannelAdapter`](WhatsAppChannelAdapter.md)
- [`WebChatChannelAdapter`](WebChatChannelAdapter.md)
- [`TwitterChannelAdapter`](TwitterChannelAdapter.md)
- [`RedditChannelAdapter`](RedditChannelAdapter.md)
- [`IRCChannelAdapter`](IRCChannelAdapter.md)
- [`SignalChannelAdapter`](SignalChannelAdapter.md)
- [`TeamsChannelAdapter`](TeamsChannelAdapter.md)
- [`GoogleChatChannelAdapter`](GoogleChatChannelAdapter.md)

## Type Parameters

### TAuthParams

`TAuthParams` *extends* `Record`\<`string`, `string` \| `undefined`\> = `Record`\<`string`, `string`\>

Shape of the platform-specific `params` object
  inside [ChannelAuthConfig](../interfaces/ChannelAuthConfig.md). Defaults to `Record<string, string>`.

## Implements

- [`IChannelAdapter`](../interfaces/IChannelAdapter.md)

## Constructors

### Constructor

> **new BaseChannelAdapter**\<`TAuthParams`\>(`retryConfig?`): `BaseChannelAdapter`\<`TAuthParams`\>

Defined in: [packages/agentos/src/channels/adapters/BaseChannelAdapter.ts:111](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/channels/adapters/BaseChannelAdapter.ts#L111)

#### Parameters

##### retryConfig?

`Partial`\<[`RetryConfig`](../interfaces/RetryConfig.md)\>

#### Returns

`BaseChannelAdapter`\<`TAuthParams`\>

## Properties

### auth

> `protected` **auth**: [`ChannelAuthConfig`](../interfaces/ChannelAuthConfig.md) & `object` \| `undefined`

Defined in: [packages/agentos/src/channels/adapters/BaseChannelAdapter.ts:97](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/channels/adapters/BaseChannelAdapter.ts#L97)

Stored auth config so `reconnect()` can re-use it.

***

### capabilities

> `abstract` `readonly` **capabilities**: readonly [`ChannelCapability`](../type-aliases/ChannelCapability.md)[]

Defined in: [packages/agentos/src/channels/adapters/BaseChannelAdapter.ts:87](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/channels/adapters/BaseChannelAdapter.ts#L87)

Declared capabilities of this adapter.

#### Implementation of

[`IChannelAdapter`](../interfaces/IChannelAdapter.md).[`capabilities`](../interfaces/IChannelAdapter.md#capabilities)

***

### connectedSince

> `protected` **connectedSince**: `string` \| `undefined`

Defined in: [packages/agentos/src/channels/adapters/BaseChannelAdapter.ts:92](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/channels/adapters/BaseChannelAdapter.ts#L92)

***

### displayName

> `abstract` `readonly` **displayName**: `string`

Defined in: [packages/agentos/src/channels/adapters/BaseChannelAdapter.ts:86](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/channels/adapters/BaseChannelAdapter.ts#L86)

Human-readable display name (e.g., "WhatsApp Business").

#### Implementation of

[`IChannelAdapter`](../interfaces/IChannelAdapter.md).[`displayName`](../interfaces/IChannelAdapter.md#displayname)

***

### errorMessage

> `protected` **errorMessage**: `string` \| `undefined`

Defined in: [packages/agentos/src/channels/adapters/BaseChannelAdapter.ts:93](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/channels/adapters/BaseChannelAdapter.ts#L93)

***

### platform

> `abstract` `readonly` **platform**: [`ChannelPlatform`](../type-aliases/ChannelPlatform.md)

Defined in: [packages/agentos/src/channels/adapters/BaseChannelAdapter.ts:85](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/channels/adapters/BaseChannelAdapter.ts#L85)

Platform this adapter serves.

#### Implementation of

[`IChannelAdapter`](../interfaces/IChannelAdapter.md).[`platform`](../interfaces/IChannelAdapter.md#platform)

***

### platformInfo

> `protected` **platformInfo**: `Record`\<`string`, `unknown`\> = `{}`

Defined in: [packages/agentos/src/channels/adapters/BaseChannelAdapter.ts:94](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/channels/adapters/BaseChannelAdapter.ts#L94)

***

### retryConfig

> `protected` `readonly` **retryConfig**: [`RetryConfig`](../interfaces/RetryConfig.md)

Defined in: [packages/agentos/src/channels/adapters/BaseChannelAdapter.ts:101](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/channels/adapters/BaseChannelAdapter.ts#L101)

***

### status

> `protected` **status**: [`ChannelConnectionStatus`](../type-aliases/ChannelConnectionStatus.md) = `'disconnected'`

Defined in: [packages/agentos/src/channels/adapters/BaseChannelAdapter.ts:91](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/channels/adapters/BaseChannelAdapter.ts#L91)

## Methods

### doConnect()

> `abstract` `protected` **doConnect**(`auth`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/channels/adapters/BaseChannelAdapter.ts:124](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/channels/adapters/BaseChannelAdapter.ts#L124)

Establish the platform connection using the supplied credentials.
Called by [initialize](#initialize) after state has been set to `connecting`.
Must throw on failure — the base class handles retry and state changes.

#### Parameters

##### auth

[`ChannelAuthConfig`](../interfaces/ChannelAuthConfig.md) & `object`

#### Returns

`Promise`\<`void`\>

***

### doSendMessage()

> `abstract` `protected` **doSendMessage**(`conversationId`, `content`): `Promise`\<[`ChannelSendResult`](../interfaces/ChannelSendResult.md)\>

Defined in: [packages/agentos/src/channels/adapters/BaseChannelAdapter.ts:132](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/channels/adapters/BaseChannelAdapter.ts#L132)

Deliver a message to the external platform.
Called by [sendMessage](#sendmessage) only when the adapter is `connected`.

#### Parameters

##### conversationId

`string`

##### content

[`MessageContent`](../interfaces/MessageContent.md)

#### Returns

`Promise`\<[`ChannelSendResult`](../interfaces/ChannelSendResult.md)\>

***

### doShutdown()

> `abstract` `protected` **doShutdown**(): `Promise`\<`void`\>

Defined in: [packages/agentos/src/channels/adapters/BaseChannelAdapter.ts:141](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/channels/adapters/BaseChannelAdapter.ts#L141)

Release platform resources (close WebSocket, stop polling, etc.).
Called by [shutdown](#shutdown) before the state transitions to `disconnected`.

#### Returns

`Promise`\<`void`\>

***

### emit()

> `protected` **emit**(`event`): `void`

Defined in: [packages/agentos/src/channels/adapters/BaseChannelAdapter.ts:265](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/channels/adapters/BaseChannelAdapter.ts#L265)

Emit an event to all matching subscribers.
Subclasses call this when the platform SDK receives an inbound event.

#### Parameters

##### event

[`ChannelEvent`](../interfaces/ChannelEvent.md)

#### Returns

`void`

***

### emitConnectionChange()

> `protected` **emitConnectionChange**(): `void`

Defined in: [packages/agentos/src/channels/adapters/BaseChannelAdapter.ts:296](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/channels/adapters/BaseChannelAdapter.ts#L296)

Convenience helper: emit a `connection_change` event with the current
status. Called automatically by [setStatus](#setstatus).

#### Returns

`void`

***

### getConnectionInfo()

> **getConnectionInfo**(): [`ChannelConnectionInfo`](../interfaces/ChannelConnectionInfo.md)

Defined in: [packages/agentos/src/channels/adapters/BaseChannelAdapter.ts:205](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/channels/adapters/BaseChannelAdapter.ts#L205)

Get the current connection status and metadata.

#### Returns

[`ChannelConnectionInfo`](../interfaces/ChannelConnectionInfo.md)

#### Implementation of

[`IChannelAdapter`](../interfaces/IChannelAdapter.md).[`getConnectionInfo`](../interfaces/IChannelAdapter.md#getconnectioninfo)

***

### hasCapability()

> `protected` **hasCapability**(`cap`): `boolean`

Defined in: [packages/agentos/src/channels/adapters/BaseChannelAdapter.ts:312](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/channels/adapters/BaseChannelAdapter.ts#L312)

Check whether this adapter declares a specific capability.

#### Parameters

##### cap

[`ChannelCapability`](../type-aliases/ChannelCapability.md)

#### Returns

`boolean`

***

### initialize()

> **initialize**(`auth`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/channels/adapters/BaseChannelAdapter.ts:151](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/channels/adapters/BaseChannelAdapter.ts#L151)

Initialize the adapter with auth credentials. If already connected this
will shut down the existing connection first (idempotent).

#### Parameters

##### auth

[`ChannelAuthConfig`](../interfaces/ChannelAuthConfig.md)

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IChannelAdapter`](../interfaces/IChannelAdapter.md).[`initialize`](../interfaces/IChannelAdapter.md#initialize)

***

### on()

> **on**(`handler`, `eventTypes?`): () => `void`

Defined in: [packages/agentos/src/channels/adapters/BaseChannelAdapter.ts:248](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/channels/adapters/BaseChannelAdapter.ts#L248)

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

#### Implementation of

[`IChannelAdapter`](../interfaces/IChannelAdapter.md).[`on`](../interfaces/IChannelAdapter.md#on)

***

### reconnect()

> **reconnect**(): `Promise`\<`void`\>

Defined in: [packages/agentos/src/channels/adapters/BaseChannelAdapter.ts:186](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/channels/adapters/BaseChannelAdapter.ts#L186)

Manually trigger a reconnection attempt using stored credentials.
Useful for UI-driven "reconnect" buttons.

#### Returns

`Promise`\<`void`\>

***

### sendMessage()

> **sendMessage**(`conversationId`, `content`): `Promise`\<[`ChannelSendResult`](../interfaces/ChannelSendResult.md)\>

Defined in: [packages/agentos/src/channels/adapters/BaseChannelAdapter.ts:218](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/channels/adapters/BaseChannelAdapter.ts#L218)

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

#### Implementation of

[`IChannelAdapter`](../interfaces/IChannelAdapter.md).[`sendMessage`](../interfaces/IChannelAdapter.md#sendmessage)

***

### sendTypingIndicator()

> **sendTypingIndicator**(`_conversationId`, `_isTyping`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/channels/adapters/BaseChannelAdapter.ts:234](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/channels/adapters/BaseChannelAdapter.ts#L234)

Default stub — platforms that support typing indicators should override.

#### Parameters

##### \_conversationId

`string`

##### \_isTyping

`boolean`

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IChannelAdapter`](../interfaces/IChannelAdapter.md).[`sendTypingIndicator`](../interfaces/IChannelAdapter.md#sendtypingindicator)

***

### setStatus()

> `protected` **setStatus**(`newStatus`, `error?`): `void`

Defined in: [packages/agentos/src/channels/adapters/BaseChannelAdapter.ts:319](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/channels/adapters/BaseChannelAdapter.ts#L319)

Transition to a new connection status and emit an event.

#### Parameters

##### newStatus

[`ChannelConnectionStatus`](../type-aliases/ChannelConnectionStatus.md)

##### error?

`string`

#### Returns

`void`

***

### shutdown()

> **shutdown**(): `Promise`\<`void`\>

Defined in: [packages/agentos/src/channels/adapters/BaseChannelAdapter.ts:166](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/channels/adapters/BaseChannelAdapter.ts#L166)

Gracefully shut down the adapter and release all resources.

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IChannelAdapter`](../interfaces/IChannelAdapter.md).[`shutdown`](../interfaces/IChannelAdapter.md#shutdown)
