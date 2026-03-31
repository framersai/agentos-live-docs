# Interface: ChannelBindingConfig

Defined in: [packages/agentos/src/channels/types.ts:289](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/channels/types.ts#L289)

Binding between an agent (seed) and a channel on an external platform.
Extended from the original Wunderland `ChannelBinding` with additional fields
for the full channel system.

## Properties

### autoBroadcast

> **autoBroadcast**: `boolean`

Defined in: [packages/agentos/src/channels/types.ts:307](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/channels/types.ts#L307)

Whether agent posts should auto-broadcast to this channel.

***

### bindingId

> **bindingId**: `string`

Defined in: [packages/agentos/src/channels/types.ts:291](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/channels/types.ts#L291)

Unique binding identifier.

***

### channelId

> **channelId**: `string`

Defined in: [packages/agentos/src/channels/types.ts:299](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/channels/types.ts#L299)

Platform-native channel/chat ID.

***

### conversationType

> **conversationType**: [`ConversationType`](../type-aliases/ConversationType.md)

Defined in: [packages/agentos/src/channels/types.ts:301](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/channels/types.ts#L301)

Type of conversation.

***

### credentialId?

> `optional` **credentialId**: `string`

Defined in: [packages/agentos/src/channels/types.ts:303](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/channels/types.ts#L303)

Credential ID (references encrypted credential in vault).

***

### isActive

> **isActive**: `boolean`

Defined in: [packages/agentos/src/channels/types.ts:305](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/channels/types.ts#L305)

Whether this binding is active.

***

### ownerUserId

> **ownerUserId**: `string`

Defined in: [packages/agentos/src/channels/types.ts:295](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/channels/types.ts#L295)

Owner user ID (for permission checks).

***

### platform

> **platform**: [`ChannelPlatform`](../type-aliases/ChannelPlatform.md)

Defined in: [packages/agentos/src/channels/types.ts:297](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/channels/types.ts#L297)

Target platform.

***

### platformConfig?

> `optional` **platformConfig**: `Record`\<`string`, `unknown`\>

Defined in: [packages/agentos/src/channels/types.ts:309](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/channels/types.ts#L309)

Platform-specific configuration.

***

### seedId

> **seedId**: `string`

Defined in: [packages/agentos/src/channels/types.ts:293](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/channels/types.ts#L293)

Agent seed ID.
