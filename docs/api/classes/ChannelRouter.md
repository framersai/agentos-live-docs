# Class: ChannelRouter

Defined in: [packages/agentos/src/channels/ChannelRouter.ts:87](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/channels/ChannelRouter.ts#L87)

Central routing hub for all external messaging channels.

## Example

```typescript
const router = new ChannelRouter();

// Register adapters
router.registerAdapter(telegramAdapter);
router.registerAdapter(discordAdapter);

// Add bindings
router.addBinding({
  bindingId: 'b1',
  seedId: 'cipher-001',
  ownerUserId: 'user-1',
  platform: 'telegram',
  channelId: '123456789',
  conversationType: 'direct',
  isActive: true,
  autoBroadcast: false,
});

// Handle inbound messages
router.onMessage(async (message, binding, session) => {
  // Route to StimulusRouter or agent runtime
  await stimulusRouter.ingestChannelMessage(message, binding.seedId);
});

// Send outbound message
await router.sendMessage('cipher-001', 'telegram', '123456789', {
  blocks: [{ type: 'text', text: 'Hello from Cipher!' }],
});
```

## Constructors

### Constructor

> **new ChannelRouter**(): `ChannelRouter`

#### Returns

`ChannelRouter`

## Methods

### addBinding()

> **addBinding**(`binding`): `void`

Defined in: [packages/agentos/src/channels/ChannelRouter.ts:178](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/channels/ChannelRouter.ts#L178)

Add or update a channel binding.

#### Parameters

##### binding

[`ChannelBindingConfig`](../interfaces/ChannelBindingConfig.md)

#### Returns

`void`

***

### broadcast()

> **broadcast**(`seedId`, `content`): `Promise`\<[`ChannelSendResult`](../interfaces/ChannelSendResult.md)[]\>

Defined in: [packages/agentos/src/channels/ChannelRouter.ts:253](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/channels/ChannelRouter.ts#L253)

Broadcast a message from an agent to all auto-broadcast bindings.

#### Parameters

##### seedId

`string`

##### content

[`MessageContent`](../interfaces/MessageContent.md)

#### Returns

`Promise`\<[`ChannelSendResult`](../interfaces/ChannelSendResult.md)[]\>

***

### getAdapter()

> **getAdapter**(`platform`): [`IChannelAdapter`](../interfaces/IChannelAdapter.md) \| `undefined`

Defined in: [packages/agentos/src/channels/ChannelRouter.ts:150](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/channels/ChannelRouter.ts#L150)

Get a registered adapter by platform.

#### Parameters

##### platform

`string`

#### Returns

[`IChannelAdapter`](../interfaces/IChannelAdapter.md) \| `undefined`

***

### getBindingsForConversation()

> **getBindingsForConversation**(`platform`, `conversationId`): [`ChannelBindingConfig`](../interfaces/ChannelBindingConfig.md)[]

Defined in: [packages/agentos/src/channels/ChannelRouter.ts:201](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/channels/ChannelRouter.ts#L201)

Get all bindings for a platform + conversation.

#### Parameters

##### platform

[`ChannelPlatform`](../type-aliases/ChannelPlatform.md)

##### conversationId

`string`

#### Returns

[`ChannelBindingConfig`](../interfaces/ChannelBindingConfig.md)[]

***

### getBindingsForSeed()

> **getBindingsForSeed**(`seedId`): [`ChannelBindingConfig`](../interfaces/ChannelBindingConfig.md)[]

Defined in: [packages/agentos/src/channels/ChannelRouter.ts:194](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/channels/ChannelRouter.ts#L194)

Get all bindings for a seed.

#### Parameters

##### seedId

`string`

#### Returns

[`ChannelBindingConfig`](../interfaces/ChannelBindingConfig.md)[]

***

### getBroadcastBindings()

> **getBroadcastBindings**(`seedId`): [`ChannelBindingConfig`](../interfaces/ChannelBindingConfig.md)[]

Defined in: [packages/agentos/src/channels/ChannelRouter.ts:212](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/channels/ChannelRouter.ts#L212)

Get all auto-broadcast bindings for a seed (used when agent publishes a post).

#### Parameters

##### seedId

`string`

#### Returns

[`ChannelBindingConfig`](../interfaces/ChannelBindingConfig.md)[]

***

### getOrCreateSession()

> **getOrCreateSession**(`seedId`, `platform`, `conversationId`): [`ChannelSession`](../interfaces/ChannelSession.md)

Defined in: [packages/agentos/src/channels/ChannelRouter.ts:296](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/channels/ChannelRouter.ts#L296)

Get or create a session for an agent + conversation.

#### Parameters

##### seedId

`string`

##### platform

[`ChannelPlatform`](../type-aliases/ChannelPlatform.md)

##### conversationId

`string`

#### Returns

[`ChannelSession`](../interfaces/ChannelSession.md)

***

### getSessionsForSeed()

> **getSessionsForSeed**(`seedId`): [`ChannelSession`](../interfaces/ChannelSession.md)[]

Defined in: [packages/agentos/src/channels/ChannelRouter.ts:324](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/channels/ChannelRouter.ts#L324)

Get active sessions for a seed.

#### Parameters

##### seedId

`string`

#### Returns

[`ChannelSession`](../interfaces/ChannelSession.md)[]

***

### getStats()

> **getStats**(): `object`

Defined in: [packages/agentos/src/channels/ChannelRouter.ts:330](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/channels/ChannelRouter.ts#L330)

#### Returns

`object`

##### activeSessions

> **activeSessions**: `number`

##### adapters

> **adapters**: `number`

##### bindings

> **bindings**: `number`

##### totalSessions

> **totalSessions**: `number`

***

### listAdapters()

> **listAdapters**(): [`ChannelInfo`](../interfaces/ChannelInfo.md)[]

Defined in: [packages/agentos/src/channels/ChannelRouter.ts:157](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/channels/ChannelRouter.ts#L157)

List all registered adapters with their info.

#### Returns

[`ChannelInfo`](../interfaces/ChannelInfo.md)[]

***

### onMessage()

> **onMessage**(`handler`): () => `void`

Defined in: [packages/agentos/src/channels/ChannelRouter.ts:223](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/channels/ChannelRouter.ts#L223)

Register a handler for inbound messages. Returns unsubscribe function.

#### Parameters

##### handler

[`InboundMessageHandler`](../type-aliases/InboundMessageHandler.md)

#### Returns

> (): `void`

##### Returns

`void`

***

### registerAdapter()

> **registerAdapter**(`adapter`, `options?`): `void`

Defined in: [packages/agentos/src/channels/ChannelRouter.ts:111](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/channels/ChannelRouter.ts#L111)

Register a channel adapter. The router will subscribe to its events.

#### Parameters

##### adapter

[`IChannelAdapter`](../interfaces/IChannelAdapter.md)

##### options?

[`RegisterAdapterOptions`](../interfaces/RegisterAdapterOptions.md)

#### Returns

`void`

***

### removeBinding()

> **removeBinding**(`bindingId`): `void`

Defined in: [packages/agentos/src/channels/ChannelRouter.ts:186](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/channels/ChannelRouter.ts#L186)

Remove a channel binding.

#### Parameters

##### bindingId

`string`

#### Returns

`void`

***

### sendMessage()

> **sendMessage**(`seedId`, `platform`, `conversationId`, `content`): `Promise`\<[`ChannelSendResult`](../interfaces/ChannelSendResult.md)\>

Defined in: [packages/agentos/src/channels/ChannelRouter.ts:231](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/channels/ChannelRouter.ts#L231)

Send a message from an agent to a specific conversation.

#### Parameters

##### seedId

`string`

##### platform

[`ChannelPlatform`](../type-aliases/ChannelPlatform.md)

##### conversationId

`string`

##### content

[`MessageContent`](../interfaces/MessageContent.md)

#### Returns

`Promise`\<[`ChannelSendResult`](../interfaces/ChannelSendResult.md)\>

***

### sendTypingIndicator()

> **sendTypingIndicator**(`platform`, `conversationId`, `isTyping`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/channels/ChannelRouter.ts:280](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/channels/ChannelRouter.ts#L280)

Send a typing indicator for an agent on a channel.

#### Parameters

##### platform

[`ChannelPlatform`](../type-aliases/ChannelPlatform.md)

##### conversationId

`string`

##### isTyping

`boolean`

#### Returns

`Promise`\<`void`\>

***

### shutdown()

> **shutdown**(): `Promise`\<`void`\>

Defined in: [packages/agentos/src/channels/ChannelRouter.ts:351](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/channels/ChannelRouter.ts#L351)

Shut down all adapters and clear state.

#### Returns

`Promise`\<`void`\>

***

### unregisterAdapter()

> **unregisterAdapter**(`platformKey`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/channels/ChannelRouter.ts:133](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/channels/ChannelRouter.ts#L133)

Unregister and shut down an adapter.

#### Parameters

##### platformKey

`string`

#### Returns

`Promise`\<`void`\>
