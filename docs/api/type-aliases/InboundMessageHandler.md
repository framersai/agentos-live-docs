# Type Alias: InboundMessageHandler()

> **InboundMessageHandler** = (`message`, `binding`, `session`) => `void` \| `Promise`\<`void`\>

Defined in: [packages/agentos/src/channels/ChannelRouter.ts:34](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/channels/ChannelRouter.ts#L34)

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
