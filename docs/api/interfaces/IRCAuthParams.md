# Interface: IRCAuthParams

Defined in: [packages/agentos/src/channels/adapters/IRCChannelAdapter.ts:46](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/channels/adapters/IRCChannelAdapter.ts#L46)

Platform-specific parameters for IRC connections.

## Extends

- `Record`\<`string`, `string` \| `undefined`\>

## Indexable

\[`key`: `string`\]: `string` \| `undefined`

## Properties

### channels?

> `optional` **channels**: `string`

Defined in: [packages/agentos/src/channels/adapters/IRCChannelAdapter.ts:52](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/channels/adapters/IRCChannelAdapter.ts#L52)

Comma-separated list of channels to auto-join.

***

### host

> **host**: `string`

Defined in: [packages/agentos/src/channels/adapters/IRCChannelAdapter.ts:48](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/channels/adapters/IRCChannelAdapter.ts#L48)

IRC server hostname.

***

### password?

> `optional` **password**: `string`

Defined in: [packages/agentos/src/channels/adapters/IRCChannelAdapter.ts:56](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/channels/adapters/IRCChannelAdapter.ts#L56)

Server password (not NickServ — use credential for that).

***

### port?

> `optional` **port**: `string`

Defined in: [packages/agentos/src/channels/adapters/IRCChannelAdapter.ts:50](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/channels/adapters/IRCChannelAdapter.ts#L50)

Server port (default: '6697' for TLS).

***

### realname?

> `optional` **realname**: `string`

Defined in: [packages/agentos/src/channels/adapters/IRCChannelAdapter.ts:54](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/channels/adapters/IRCChannelAdapter.ts#L54)

GECOS / real-name field.

***

### tls?

> `optional` **tls**: `string`

Defined in: [packages/agentos/src/channels/adapters/IRCChannelAdapter.ts:58](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/channels/adapters/IRCChannelAdapter.ts#L58)

Whether to use TLS. Default: 'true'.
