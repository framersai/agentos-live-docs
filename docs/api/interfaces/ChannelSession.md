# Interface: ChannelSession

Defined in: [packages/agentos/src/channels/types.ts:315](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/channels/types.ts#L315)

Active session between an agent and a remote conversation.

## Properties

### context?

> `optional` **context**: `Record`\<`string`, `unknown`\>

Defined in: [packages/agentos/src/channels/types.ts:335](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/channels/types.ts#L335)

Session context data (for multi-turn state).

***

### conversationId

> **conversationId**: `string`

Defined in: [packages/agentos/src/channels/types.ts:323](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/channels/types.ts#L323)

Platform-native conversation ID.

***

### conversationType

> **conversationType**: [`ConversationType`](../type-aliases/ConversationType.md)

Defined in: [packages/agentos/src/channels/types.ts:325](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/channels/types.ts#L325)

Conversation type.

***

### isActive

> **isActive**: `boolean`

Defined in: [packages/agentos/src/channels/types.ts:333](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/channels/types.ts#L333)

Whether this session is active.

***

### lastMessageAt

> **lastMessageAt**: `string`

Defined in: [packages/agentos/src/channels/types.ts:329](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/channels/types.ts#L329)

Last message timestamp.

***

### messageCount

> **messageCount**: `number`

Defined in: [packages/agentos/src/channels/types.ts:331](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/channels/types.ts#L331)

Total messages exchanged.

***

### platform

> **platform**: [`ChannelPlatform`](../type-aliases/ChannelPlatform.md)

Defined in: [packages/agentos/src/channels/types.ts:321](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/channels/types.ts#L321)

Platform.

***

### remoteUser?

> `optional` **remoteUser**: [`RemoteUser`](RemoteUser.md)

Defined in: [packages/agentos/src/channels/types.ts:327](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/channels/types.ts#L327)

Remote user (for DMs).

***

### seedId

> **seedId**: `string`

Defined in: [packages/agentos/src/channels/types.ts:319](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/channels/types.ts#L319)

Agent seed ID.

***

### sessionId

> **sessionId**: `string`

Defined in: [packages/agentos/src/channels/types.ts:317](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/channels/types.ts#L317)

Unique session ID.
