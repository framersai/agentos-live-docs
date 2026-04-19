# Interface: IChannelAdapter

Defined in: [packages/agentos/src/channels/IChannelAdapter.ts:55](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/channels/IChannelAdapter.ts#L55)

Core adapter interface for external messaging channels.

Implementors wrap a platform SDK (e.g., grammY for Telegram, discord.js for
Discord) and normalize all interactions to this common contract.

## Example

```typescript
class TelegramAdapter implements IChannelAdapter {
  readonly platform = 'telegram';
  readonly displayName = 'Telegram';
  readonly capabilities = ['text', 'images', 'inline_keyboard', 'typing_indicator'];

  async initialize(auth: ChannelAuthConfig): Promise<void> {
    this.bot = new Bot(auth.credential);
    await this.bot.start();
  }

  async sendMessage(conversationId, content): Promise<ChannelSendResult> {
    const textBlock = content.blocks.find(b => b.type === 'text');
    const msg = await this.bot.api.sendMessage(conversationId, textBlock.text);
    return { messageId: String(msg.message_id) };
  }
  // ...
}
```

## Properties

### capabilities

> `readonly` **capabilities**: readonly [`ChannelCapability`](../type-aliases/ChannelCapability.md)[]

Defined in: [packages/agentos/src/channels/IChannelAdapter.ts:65](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/channels/IChannelAdapter.ts#L65)

Declared capabilities of this adapter.

***

### displayName

> `readonly` **displayName**: `string`

Defined in: [packages/agentos/src/channels/IChannelAdapter.ts:62](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/channels/IChannelAdapter.ts#L62)

Human-readable display name (e.g., "WhatsApp Business").

***

### platform

> `readonly` **platform**: [`ChannelPlatform`](../type-aliases/ChannelPlatform.md)

Defined in: [packages/agentos/src/channels/IChannelAdapter.ts:59](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/channels/IChannelAdapter.ts#L59)

Platform this adapter serves.

## Methods

### addReaction()?

> `optional` **addReaction**(`conversationId`, `messageId`, `emoji`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/channels/IChannelAdapter.ts:134](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/channels/IChannelAdapter.ts#L134)

Add a reaction to a message. Only available if adapter declares
the `'reactions'` capability.

#### Parameters

##### conversationId

`string`

##### messageId

`string`

##### emoji

`string`

#### Returns

`Promise`\<`void`\>

***

### deleteMessage()?

> `optional` **deleteMessage**(`conversationId`, `messageId`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/channels/IChannelAdapter.ts:128](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/channels/IChannelAdapter.ts#L128)

Delete a previously sent message. Only available if adapter declares
the `'deletion'` capability.

#### Parameters

##### conversationId

`string`

##### messageId

`string`

#### Returns

`Promise`\<`void`\>

***

### editMessage()?

> `optional` **editMessage**(`conversationId`, `messageId`, `content`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/channels/IChannelAdapter.ts:122](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/channels/IChannelAdapter.ts#L122)

Edit a previously sent message. Only available if adapter declares
the `'editing'` capability.

#### Parameters

##### conversationId

`string`

##### messageId

`string`

##### content

[`MessageContent`](MessageContent.md)

#### Returns

`Promise`\<`void`\>

***

### getConnectionInfo()

> **getConnectionInfo**(): [`ChannelConnectionInfo`](ChannelConnectionInfo.md)

Defined in: [packages/agentos/src/channels/IChannelAdapter.ts:85](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/channels/IChannelAdapter.ts#L85)

Get the current connection status and metadata.

#### Returns

[`ChannelConnectionInfo`](ChannelConnectionInfo.md)

***

### getConversationInfo()?

> `optional` **getConversationInfo**(`conversationId`): `Promise`\<\{ `isGroup`: `boolean`; `memberCount?`: `number`; `metadata?`: `Record`\<`string`, `unknown`\>; `name?`: `string`; \}\>

Defined in: [packages/agentos/src/channels/IChannelAdapter.ts:139](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/channels/IChannelAdapter.ts#L139)

Get conversation metadata (name, members, etc.). Useful for group chats.

#### Parameters

##### conversationId

`string`

#### Returns

`Promise`\<\{ `isGroup`: `boolean`; `memberCount?`: `number`; `metadata?`: `Record`\<`string`, `unknown`\>; `name?`: `string`; \}\>

***

### initialize()

> **initialize**(`auth`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/channels/IChannelAdapter.ts:74](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/channels/IChannelAdapter.ts#L74)

Initialize the adapter with authentication credentials.
Called once when the extension is activated. Must be idempotent —
calling initialize on an already-initialized adapter should reconnect.

#### Parameters

##### auth

[`ChannelAuthConfig`](ChannelAuthConfig.md)

#### Returns

`Promise`\<`void`\>

***

### on()

> **on**(`handler`, `eventTypes?`): () => `void`

Defined in: [packages/agentos/src/channels/IChannelAdapter.ts:114](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/channels/IChannelAdapter.ts#L114)

Register a handler for channel events. Multiple handlers can be
registered. Use `eventTypes` to filter which events to receive.

#### Parameters

##### handler

[`ChannelEventHandler`](../type-aliases/ChannelEventHandler.md)

Callback invoked when an event occurs.

##### eventTypes?

[`ChannelEventType`](../type-aliases/ChannelEventType.md)[]

Optional filter. If omitted, handler receives all events.

#### Returns

Unsubscribe function.

> (): `void`

##### Returns

`void`

***

### sendMessage()

> **sendMessage**(`conversationId`, `content`): `Promise`\<[`ChannelSendResult`](ChannelSendResult.md)\>

Defined in: [packages/agentos/src/channels/IChannelAdapter.ts:96](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/channels/IChannelAdapter.ts#L96)

Send a message to a conversation on the external platform.

#### Parameters

##### conversationId

`string`

Platform-native conversation/chat ID.

##### content

[`MessageContent`](MessageContent.md)

Message content to send.

#### Returns

`Promise`\<[`ChannelSendResult`](ChannelSendResult.md)\>

The platform-assigned message ID.

***

### sendTypingIndicator()

> **sendTypingIndicator**(`conversationId`, `isTyping`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/channels/IChannelAdapter.ts:102](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/channels/IChannelAdapter.ts#L102)

Send a typing indicator to a conversation. Not all platforms support
this — check `capabilities` for `'typing_indicator'`.

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

Defined in: [packages/agentos/src/channels/IChannelAdapter.ts:80](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/channels/IChannelAdapter.ts#L80)

Gracefully shut down the adapter, closing connections and releasing
resources. Called during extension deactivation or application shutdown.

#### Returns

`Promise`\<`void`\>
