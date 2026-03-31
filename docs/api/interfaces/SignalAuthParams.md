# Interface: SignalAuthParams

Defined in: [packages/agentos/src/channels/adapters/SignalChannelAdapter.ts:51](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/channels/adapters/SignalChannelAdapter.ts#L51)

Platform-specific authentication parameters for Signal.

## Extends

- `Record`\<`string`, `string` \| `undefined`\>

## Indexable

\[`key`: `string`\]: `string` \| `undefined`

## Properties

### configDir?

> `optional` **configDir**: `string`

Defined in: [packages/agentos/src/channels/adapters/SignalChannelAdapter.ts:55](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/channels/adapters/SignalChannelAdapter.ts#L55)

Path to signal-cli config/data directory.

***

### daemonSocket?

> `optional` **daemonSocket**: `string`

Defined in: [packages/agentos/src/channels/adapters/SignalChannelAdapter.ts:57](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/channels/adapters/SignalChannelAdapter.ts#L57)

Unix socket or TCP address of signal-cli JSON-RPC daemon.

***

### signalCliPath?

> `optional` **signalCliPath**: `string`

Defined in: [packages/agentos/src/channels/adapters/SignalChannelAdapter.ts:53](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/channels/adapters/SignalChannelAdapter.ts#L53)

Path to the signal-cli binary. Default: 'signal-cli'.

***

### trustMode?

> `optional` **trustMode**: `string`

Defined in: [packages/agentos/src/channels/adapters/SignalChannelAdapter.ts:59](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/channels/adapters/SignalChannelAdapter.ts#L59)

Trust mode for new identities: 'always', 'on-first-use', 'never'. Default: 'on-first-use'.
