# Interface: SlackAuthParams

Defined in: [packages/agentos/src/channels/adapters/SlackChannelAdapter.ts:45](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/channels/adapters/SlackChannelAdapter.ts#L45)

Platform-specific parameters for Slack connections.

## Extends

- `Record`\<`string`, `string` \| `undefined`\>

## Indexable

\[`key`: `string`\]: `string` \| `undefined`

## Properties

### appToken?

> `optional` **appToken**: `string`

Defined in: [packages/agentos/src/channels/adapters/SlackChannelAdapter.ts:51](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/channels/adapters/SlackChannelAdapter.ts#L51)

App-level token (xapp-*) for Socket Mode. If omitted, HTTP mode is used.

***

### botToken?

> `optional` **botToken**: `string`

Defined in: [packages/agentos/src/channels/adapters/SlackChannelAdapter.ts:47](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/channels/adapters/SlackChannelAdapter.ts#L47)

Bot token (xoxb-*). If provided, overrides credential.

***

### port?

> `optional` **port**: `string`

Defined in: [packages/agentos/src/channels/adapters/SlackChannelAdapter.ts:53](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/channels/adapters/SlackChannelAdapter.ts#L53)

Port for HTTP mode (default: '3000'). Ignored when using Socket Mode.

***

### signingSecret?

> `optional` **signingSecret**: `string`

Defined in: [packages/agentos/src/channels/adapters/SlackChannelAdapter.ts:49](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/channels/adapters/SlackChannelAdapter.ts#L49)

Signing secret for verifying Slack requests.
