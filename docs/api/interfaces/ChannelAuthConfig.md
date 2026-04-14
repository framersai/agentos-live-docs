# Interface: ChannelAuthConfig

Defined in: [packages/agentos/src/channels/types.ts:132](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/channels/types.ts#L132)

Authentication configuration passed to an adapter during initialization.

## Properties

### credential

> **credential**: `string`

Defined in: [packages/agentos/src/channels/types.ts:136](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/channels/types.ts#L136)

Primary credential (bot token, API key, session data, etc.).

***

### params?

> `optional` **params**: `Record`\<`string`, `string`\>

Defined in: [packages/agentos/src/channels/types.ts:138](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/channels/types.ts#L138)

Additional auth parameters (e.g., webhook URL, app secret).

***

### platform

> **platform**: [`ChannelPlatform`](../type-aliases/ChannelPlatform.md)

Defined in: [packages/agentos/src/channels/types.ts:134](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/channels/types.ts#L134)

Platform this config targets.
