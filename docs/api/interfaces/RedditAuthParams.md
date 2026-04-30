# Interface: RedditAuthParams

Defined in: [packages/agentos/src/channels/adapters/RedditChannelAdapter.ts:48](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/channels/adapters/RedditChannelAdapter.ts#L48)

Platform-specific authentication parameters for Reddit.

## Extends

- `Record`\<`string`, `string` \| `undefined`\>

## Indexable

\[`key`: `string`\]: `string` \| `undefined`

## Properties

### clientSecret

> **clientSecret**: `string`

Defined in: [packages/agentos/src/channels/adapters/RedditChannelAdapter.ts:50](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/channels/adapters/RedditChannelAdapter.ts#L50)

OAuth2 client secret.

***

### password

> **password**: `string`

Defined in: [packages/agentos/src/channels/adapters/RedditChannelAdapter.ts:54](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/channels/adapters/RedditChannelAdapter.ts#L54)

Reddit account password for the bot.

***

### userAgent

> **userAgent**: `string`

Defined in: [packages/agentos/src/channels/adapters/RedditChannelAdapter.ts:56](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/channels/adapters/RedditChannelAdapter.ts#L56)

User-Agent string (required by Reddit API TOS).

***

### username

> **username**: `string`

Defined in: [packages/agentos/src/channels/adapters/RedditChannelAdapter.ts:52](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/channels/adapters/RedditChannelAdapter.ts#L52)

Reddit account username for the bot.
