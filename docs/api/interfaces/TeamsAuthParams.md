# Interface: TeamsAuthParams

Defined in: [packages/agentos/src/channels/adapters/TeamsChannelAdapter.ts:55](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/channels/adapters/TeamsChannelAdapter.ts#L55)

Platform-specific authentication parameters for Microsoft Teams.

## Extends

- `Record`\<`string`, `string` \| `undefined`\>

## Indexable

\[`key`: `string`\]: `string` \| `undefined`

## Properties

### appPassword

> **appPassword**: `string`

Defined in: [packages/agentos/src/channels/adapters/TeamsChannelAdapter.ts:57](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/channels/adapters/TeamsChannelAdapter.ts#L57)

Bot application password (client secret).

***

### serviceUrl?

> `optional` **serviceUrl**: `string`

Defined in: [packages/agentos/src/channels/adapters/TeamsChannelAdapter.ts:61](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/channels/adapters/TeamsChannelAdapter.ts#L61)

Bot Framework service URL. Default: 'https://smba.trafficmanager.net/teams/'.

***

### tenantId?

> `optional` **tenantId**: `string`

Defined in: [packages/agentos/src/channels/adapters/TeamsChannelAdapter.ts:59](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/channels/adapters/TeamsChannelAdapter.ts#L59)

Azure AD tenant ID. Optional for multi-tenant bots.
