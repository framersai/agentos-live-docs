# Interface: TeamsAuthParams

Defined in: [packages/agentos/src/io/channels/adapters/TeamsChannelAdapter.ts:55](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/io/channels/adapters/TeamsChannelAdapter.ts#L55)

Platform-specific authentication parameters for Microsoft Teams.

## Extends

- `Record`\<`string`, `string` \| `undefined`\>

## Indexable

\[`key`: `string`\]: `string` \| `undefined`

## Properties

### appPassword

> **appPassword**: `string`

Defined in: [packages/agentos/src/io/channels/adapters/TeamsChannelAdapter.ts:57](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/io/channels/adapters/TeamsChannelAdapter.ts#L57)

Bot application password (client secret).

***

### serviceUrl?

> `optional` **serviceUrl**: `string`

Defined in: [packages/agentos/src/io/channels/adapters/TeamsChannelAdapter.ts:61](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/io/channels/adapters/TeamsChannelAdapter.ts#L61)

Bot Framework service URL. Default: 'https://smba.trafficmanager.net/teams/'.

***

### tenantId?

> `optional` **tenantId**: `string`

Defined in: [packages/agentos/src/io/channels/adapters/TeamsChannelAdapter.ts:59](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/io/channels/adapters/TeamsChannelAdapter.ts#L59)

Azure AD tenant ID. Optional for multi-tenant bots.
