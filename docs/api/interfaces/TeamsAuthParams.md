# Interface: TeamsAuthParams

Defined in: [packages/agentos/src/channels/adapters/TeamsChannelAdapter.ts:55](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/channels/adapters/TeamsChannelAdapter.ts#L55)

Platform-specific authentication parameters for Microsoft Teams.

## Extends

- `Record`\<`string`, `string` \| `undefined`\>

## Indexable

\[`key`: `string`\]: `string` \| `undefined`

## Properties

### appPassword

> **appPassword**: `string`

Defined in: [packages/agentos/src/channels/adapters/TeamsChannelAdapter.ts:57](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/channels/adapters/TeamsChannelAdapter.ts#L57)

Bot application password (client secret).

***

### serviceUrl?

> `optional` **serviceUrl**: `string`

Defined in: [packages/agentos/src/channels/adapters/TeamsChannelAdapter.ts:61](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/channels/adapters/TeamsChannelAdapter.ts#L61)

Bot Framework service URL. Default: 'https://smba.trafficmanager.net/teams/'.

***

### tenantId?

> `optional` **tenantId**: `string`

Defined in: [packages/agentos/src/channels/adapters/TeamsChannelAdapter.ts:59](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/channels/adapters/TeamsChannelAdapter.ts#L59)

Azure AD tenant ID. Optional for multi-tenant bots.
