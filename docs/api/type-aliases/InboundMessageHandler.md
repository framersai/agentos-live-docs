# Type Alias: InboundMessageHandler()

> **InboundMessageHandler** = (`message`, `binding`, `session`) => `void` \| `Promise`\<`void`\>

Defined in: [packages/agentos/src/channels/ChannelRouter.ts:34](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/channels/ChannelRouter.ts#L34)

Handler invoked when an inbound message is received and matched to a seed.

## Parameters

### message

[`ChannelMessage`](../interfaces/ChannelMessage.md)

### binding

[`ChannelBindingConfig`](../interfaces/ChannelBindingConfig.md)

### session

[`ChannelSession`](../interfaces/ChannelSession.md)

## Returns

`void` \| `Promise`\<`void`\>
