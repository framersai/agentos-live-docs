# Interface: MessagingChannelPayload

Defined in: [packages/agentos/src/extensions/MessagingChannelPayload.ts:30](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/extensions/MessagingChannelPayload.ts#L30)

Payload shape for `messaging-channel` extension descriptors.

Extension packs register this as the `payload` of an
`ExtensionDescriptor<MessagingChannelPayload>` with
`kind: 'messaging-channel'`.

## Properties

### capabilities

> **capabilities**: [`ChannelCapability`](../type-aliases/ChannelCapability.md)[]

Defined in: [packages/agentos/src/extensions/MessagingChannelPayload.ts:36](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/extensions/MessagingChannelPayload.ts#L36)

Capabilities this channel supports.

***

### displayName

> **displayName**: `string`

Defined in: [packages/agentos/src/extensions/MessagingChannelPayload.ts:34](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/extensions/MessagingChannelPayload.ts#L34)

Human-friendly display name.

***

### platform

> **platform**: [`ChannelPlatform`](../type-aliases/ChannelPlatform.md)

Defined in: [packages/agentos/src/extensions/MessagingChannelPayload.ts:32](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/extensions/MessagingChannelPayload.ts#L32)

Platform identifier (e.g., 'telegram', 'discord').

## Methods

### getConnectionInfo()

> **getConnectionInfo**(): [`ChannelConnectionInfo`](ChannelConnectionInfo.md)

Defined in: [packages/agentos/src/extensions/MessagingChannelPayload.ts:52](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/extensions/MessagingChannelPayload.ts#L52)

Get current connection status.

#### Returns

[`ChannelConnectionInfo`](ChannelConnectionInfo.md)

***

### initialize()

> **initialize**(`auth`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/extensions/MessagingChannelPayload.ts:39](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/extensions/MessagingChannelPayload.ts#L39)

Initialize with credentials.

#### Parameters

##### auth

[`ChannelAuthConfig`](ChannelAuthConfig.md)

#### Returns

`Promise`\<`void`\>

***

### on()

> **on**(`handler`, `eventTypes?`): () => `void`

Defined in: [packages/agentos/src/extensions/MessagingChannelPayload.ts:49](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/extensions/MessagingChannelPayload.ts#L49)

Subscribe to events. Returns unsubscribe function.

#### Parameters

##### handler

[`ChannelEventHandler`](../type-aliases/ChannelEventHandler.md)

##### eventTypes?

[`ChannelEventType`](../type-aliases/ChannelEventType.md)[]

#### Returns

> (): `void`

##### Returns

`void`

***

### sendMessage()

> **sendMessage**(`conversationId`, `content`): `Promise`\<[`ChannelSendResult`](ChannelSendResult.md)\>

Defined in: [packages/agentos/src/extensions/MessagingChannelPayload.ts:44](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/extensions/MessagingChannelPayload.ts#L44)

Send a message to a conversation.

#### Parameters

##### conversationId

`string`

##### content

[`MessageContent`](MessageContent.md)

#### Returns

`Promise`\<[`ChannelSendResult`](ChannelSendResult.md)\>

***

### sendTypingIndicator()

> **sendTypingIndicator**(`conversationId`, `isTyping`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/extensions/MessagingChannelPayload.ts:46](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/extensions/MessagingChannelPayload.ts#L46)

Show/hide typing indicator.

#### Parameters

##### conversationId

`string`

##### isTyping

`boolean`

#### Returns

`Promise`\<`void`\>

***

### shutdown()

> **shutdown**(): `Promise`\<`void`\>

Defined in: [packages/agentos/src/extensions/MessagingChannelPayload.ts:41](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/extensions/MessagingChannelPayload.ts#L41)

Graceful shutdown.

#### Returns

`Promise`\<`void`\>
