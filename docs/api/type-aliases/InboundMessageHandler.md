# Type Alias: InboundMessageHandler()

> **InboundMessageHandler** = (`message`, `binding`, `session`) => `void` \| `Promise`\<`void`\>

Defined in: [packages/agentos/src/io/channels/ChannelRouter.ts:34](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/io/channels/ChannelRouter.ts#L34)

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
