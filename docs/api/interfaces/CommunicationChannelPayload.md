# Interface: CommunicationChannelPayload

Defined in: [packages/agentos/src/extensions/types.ts:323](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/extensions/types.ts#L323)

Communication channel payload for custom inter-agent messaging.
Channels handle message transport between agents (e.g., Redis pub/sub, WebSocket).

## Properties

### broadcast()?

> `optional` **broadcast**: (`groupId`, `message`) => `Promise`\<`void`\>

Defined in: [packages/agentos/src/extensions/types.ts:337](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/extensions/types.ts#L337)

Broadcast to a group

#### Parameters

##### groupId

`string`

##### message

`unknown`

#### Returns

`Promise`\<`void`\>

***

### description

> **description**: `string`

Defined in: [packages/agentos/src/extensions/types.ts:327](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/extensions/types.ts#L327)

Channel description

***

### distributed

> **distributed**: `boolean`

Defined in: [packages/agentos/src/extensions/types.ts:329](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/extensions/types.ts#L329)

Whether this channel supports distributed communication

***

### initialize()

> **initialize**: (`config`) => `Promise`\<`void`\>

Defined in: [packages/agentos/src/extensions/types.ts:331](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/extensions/types.ts#L331)

Initialize the channel

#### Parameters

##### config

`Record`\<`string`, `unknown`\>

#### Returns

`Promise`\<`void`\>

***

### name

> **name**: `string`

Defined in: [packages/agentos/src/extensions/types.ts:325](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/extensions/types.ts#L325)

Channel name (e.g., 'redis-pubsub', 'websocket', 'in-memory')

***

### send()

> **send**: (`targetId`, `message`) => `Promise`\<`void`\>

Defined in: [packages/agentos/src/extensions/types.ts:333](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/extensions/types.ts#L333)

Send a message

#### Parameters

##### targetId

`string`

##### message

`unknown`

#### Returns

`Promise`\<`void`\>

***

### shutdown()?

> `optional` **shutdown**: () => `Promise`\<`void`\>

Defined in: [packages/agentos/src/extensions/types.ts:339](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/extensions/types.ts#L339)

Cleanup/shutdown

#### Returns

`Promise`\<`void`\>

***

### subscribe()

> **subscribe**: (`targetId`, `handler`) => () => `void`

Defined in: [packages/agentos/src/extensions/types.ts:335](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/extensions/types.ts#L335)

Subscribe to messages

#### Parameters

##### targetId

`string`

##### handler

(`message`) => `void`

#### Returns

> (): `void`

##### Returns

`void`
