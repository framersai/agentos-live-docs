# Interface: WebChatAuthParams

Defined in: [packages/agentos/src/channels/adapters/WebChatChannelAdapter.ts:58](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/channels/adapters/WebChatChannelAdapter.ts#L58)

Platform-specific parameters for WebChat connections.

## Extends

- `Record`\<`string`, `string` \| `undefined`\>

## Indexable

\[`key`: `string`\]: `string` \| `undefined`

## Properties

### apiKey?

> `optional` **apiKey**: `string`

Defined in: [packages/agentos/src/channels/adapters/WebChatChannelAdapter.ts:60](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/channels/adapters/WebChatChannelAdapter.ts#L60)

API key for authenticating WebSocket clients. Optional.

***

### corsOrigins?

> `optional` **corsOrigins**: `string`

Defined in: [packages/agentos/src/channels/adapters/WebChatChannelAdapter.ts:62](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/channels/adapters/WebChatChannelAdapter.ts#L62)

Comma-separated CORS origins (default: '*').

***

### port?

> `optional` **port**: `string`

Defined in: [packages/agentos/src/channels/adapters/WebChatChannelAdapter.ts:64](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/channels/adapters/WebChatChannelAdapter.ts#L64)

Port for standalone HTTP server (default: '8080'). Ignored in attached mode.

***

### wsPath?

> `optional` **wsPath**: `string`

Defined in: [packages/agentos/src/channels/adapters/WebChatChannelAdapter.ts:66](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/channels/adapters/WebChatChannelAdapter.ts#L66)

Path prefix for the WebSocket endpoint (default: '/ws').
