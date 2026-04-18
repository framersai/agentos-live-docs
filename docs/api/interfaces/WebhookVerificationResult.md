# Interface: WebhookVerificationResult

Defined in: [packages/agentos/src/channels/telephony/types.ts:411](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/channels/telephony/types.ts#L411)

Result of webhook signature verification.

## Properties

### error?

> `optional` **error**: `string`

Defined in: [packages/agentos/src/channels/telephony/types.ts:415](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/channels/telephony/types.ts#L415)

Error message if verification failed.

***

### valid

> **valid**: `boolean`

Defined in: [packages/agentos/src/channels/telephony/types.ts:413](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/channels/telephony/types.ts#L413)

Whether the webhook signature is valid.
