# Interface: DiscordAuthParams

Defined in: [packages/agentos/src/channels/adapters/DiscordChannelAdapter.ts:45](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/channels/adapters/DiscordChannelAdapter.ts#L45)

Platform-specific parameters for Discord connections.

## Extends

- `Record`\<`string`, `string` \| `undefined`\>

## Indexable

\[`key`: `string`\]: `string` \| `undefined`

## Properties

### applicationId?

> `optional` **applicationId**: `string`

Defined in: [packages/agentos/src/channels/adapters/DiscordChannelAdapter.ts:49](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/channels/adapters/DiscordChannelAdapter.ts#L49)

Discord application ID.

***

### botToken?

> `optional` **botToken**: `string`

Defined in: [packages/agentos/src/channels/adapters/DiscordChannelAdapter.ts:47](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/channels/adapters/DiscordChannelAdapter.ts#L47)

Bot token. If provided, overrides credential.

***

### guildId?

> `optional` **guildId**: `string`

Defined in: [packages/agentos/src/channels/adapters/DiscordChannelAdapter.ts:51](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/channels/adapters/DiscordChannelAdapter.ts#L51)

Optional guild (server) ID to scope interactions to a single guild.

***

### intents?

> `optional` **intents**: `string`

Defined in: [packages/agentos/src/channels/adapters/DiscordChannelAdapter.ts:53](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/channels/adapters/DiscordChannelAdapter.ts#L53)

Comma-separated list of additional gateway intents.
