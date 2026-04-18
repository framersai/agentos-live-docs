# Interface: RetryConfig

Defined in: [packages/agentos/src/channels/adapters/BaseChannelAdapter.ts:35](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/channels/adapters/BaseChannelAdapter.ts#L35)

Options governing connection retry behaviour.

## Properties

### baseDelayMs

> **baseDelayMs**: `number`

Defined in: [packages/agentos/src/channels/adapters/BaseChannelAdapter.ts:39](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/channels/adapters/BaseChannelAdapter.ts#L39)

Initial delay in milliseconds before the first retry. Default: 1000.

***

### jitterFactor

> **jitterFactor**: `number`

Defined in: [packages/agentos/src/channels/adapters/BaseChannelAdapter.ts:43](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/channels/adapters/BaseChannelAdapter.ts#L43)

Jitter factor (0-1) applied to each delay. Default: 0.25.

***

### maxDelayMs

> **maxDelayMs**: `number`

Defined in: [packages/agentos/src/channels/adapters/BaseChannelAdapter.ts:41](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/channels/adapters/BaseChannelAdapter.ts#L41)

Upper-bound delay in milliseconds. Default: 30_000.

***

### maxRetries

> **maxRetries**: `number`

Defined in: [packages/agentos/src/channels/adapters/BaseChannelAdapter.ts:37](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/channels/adapters/BaseChannelAdapter.ts#L37)

Maximum number of retry attempts before giving up. Default: 5.
