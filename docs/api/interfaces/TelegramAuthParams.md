# Interface: TelegramAuthParams

Defined in: [packages/agentos/src/channels/adapters/TelegramChannelAdapter.ts:43](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/channels/adapters/TelegramChannelAdapter.ts#L43)

Platform-specific parameters for Telegram connections.

## Extends

- `Record`\<`string`, `string` \| `undefined`\>

## Indexable

\[`key`: `string`\]: `string` \| `undefined`

## Properties

### botToken?

> `optional` **botToken**: `string`

Defined in: [packages/agentos/src/channels/adapters/TelegramChannelAdapter.ts:45](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/channels/adapters/TelegramChannelAdapter.ts#L45)

Bot token from BotFather. If provided, overrides credential.

***

### webhookSecret?

> `optional` **webhookSecret**: `string`

Defined in: [packages/agentos/src/channels/adapters/TelegramChannelAdapter.ts:49](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/channels/adapters/TelegramChannelAdapter.ts#L49)

Webhook secret token for verifying incoming updates.

***

### webhookUrl?

> `optional` **webhookUrl**: `string`

Defined in: [packages/agentos/src/channels/adapters/TelegramChannelAdapter.ts:47](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/channels/adapters/TelegramChannelAdapter.ts#L47)

Webhook URL. If not provided, long polling is used.
