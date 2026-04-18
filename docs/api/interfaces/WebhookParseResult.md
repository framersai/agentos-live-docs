# Interface: WebhookParseResult

Defined in: [packages/agentos/src/channels/telephony/types.ts:419](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/channels/telephony/types.ts#L419)

Result of parsing a provider webhook into normalized events.

## Properties

### events

> **events**: [`NormalizedCallEvent`](../type-aliases/NormalizedCallEvent.md)[]

Defined in: [packages/agentos/src/channels/telephony/types.ts:421](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/channels/telephony/types.ts#L421)

Normalized events extracted from the webhook.

***

### rawData?

> `optional` **rawData**: `unknown`

Defined in: [packages/agentos/src/channels/telephony/types.ts:423](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/channels/telephony/types.ts#L423)

Provider-specific raw data for debugging.
