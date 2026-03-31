# Interface: ChannelInfo

Defined in: [packages/agentos/src/channels/types.ts:343](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/channels/types.ts#L343)

Metadata about an available channel adapter.

## Properties

### available

> **available**: `boolean`

Defined in: [packages/agentos/src/channels/types.ts:353](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/channels/types.ts#L353)

Whether the adapter's dependencies are installed.

***

### capabilities

> **capabilities**: [`ChannelCapability`](../type-aliases/ChannelCapability.md)[]

Defined in: [packages/agentos/src/channels/types.ts:351](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/channels/types.ts#L351)

Capabilities this adapter supports.

***

### description

> **description**: `string`

Defined in: [packages/agentos/src/channels/types.ts:349](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/channels/types.ts#L349)

Description of the channel.

***

### displayName

> **displayName**: `string`

Defined in: [packages/agentos/src/channels/types.ts:347](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/channels/types.ts#L347)

Human-friendly display name (e.g., "WhatsApp Business").

***

### icon?

> `optional` **icon**: `string`

Defined in: [packages/agentos/src/channels/types.ts:357](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/channels/types.ts#L357)

Icon identifier or URL.

***

### platform

> **platform**: [`ChannelPlatform`](../type-aliases/ChannelPlatform.md)

Defined in: [packages/agentos/src/channels/types.ts:345](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/channels/types.ts#L345)

Platform identifier.

***

### requiredSecrets

> **requiredSecrets**: `string`[]

Defined in: [packages/agentos/src/channels/types.ts:355](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/channels/types.ts#L355)

Required secret IDs for this channel.
