# Interface: ChannelConnectionInfo

Defined in: [packages/agentos/src/channels/types.ts:117](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/channels/types.ts#L117)

Detailed connection info returned by adapters.

## Properties

### connectedSince?

> `optional` **connectedSince**: `string`

Defined in: [packages/agentos/src/channels/types.ts:120](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/channels/types.ts#L120)

When the connection was last established.

***

### errorMessage?

> `optional` **errorMessage**: `string`

Defined in: [packages/agentos/src/channels/types.ts:122](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/channels/types.ts#L122)

Human-readable error if status is 'error'.

***

### platformInfo?

> `optional` **platformInfo**: `Record`\<`string`, `unknown`\>

Defined in: [packages/agentos/src/channels/types.ts:124](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/channels/types.ts#L124)

Platform-specific metadata (e.g., bot username, workspace name).

***

### status

> **status**: [`ChannelConnectionStatus`](../type-aliases/ChannelConnectionStatus.md)

Defined in: [packages/agentos/src/channels/types.ts:118](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/channels/types.ts#L118)
