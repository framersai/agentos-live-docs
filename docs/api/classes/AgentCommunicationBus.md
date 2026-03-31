# Class: AgentCommunicationBus

Defined in: [packages/agentos/src/agents/agency/AgentCommunicationBus.ts:93](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/agents/agency/AgentCommunicationBus.ts#L93)

Implementation of the Agent Communication Bus.

Features:
- Point-to-point messaging between agents
- Broadcast to agencies
- Request-response pattern
- Topic-based pub/sub
- Task handoff protocol
- Message persistence and history
- Delivery tracking and retries

## Implements

## Implements

- [`IAgentCommunicationBus`](../interfaces/IAgentCommunicationBus.md)

## Constructors

### Constructor

> **new AgentCommunicationBus**(`config?`): `AgentCommunicationBus`

Defined in: [packages/agentos/src/agents/agency/AgentCommunicationBus.ts:138](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/agents/agency/AgentCommunicationBus.ts#L138)

Creates a new AgentCommunicationBus instance.

#### Parameters

##### config?

`AgentCommunicationBusConfig` = `{}`

Bus configuration

#### Returns

`AgentCommunicationBus`

## Methods

### acknowledgeMessage()

> **acknowledgeMessage**(`messageId`, `agentId`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/agents/agency/AgentCommunicationBus.ts:537](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/agents/agency/AgentCommunicationBus.ts#L537)

Acknowledges receipt of a message.

#### Parameters

##### messageId

`string`

##### agentId

`string`

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IAgentCommunicationBus`](../interfaces/IAgentCommunicationBus.md).[`acknowledgeMessage`](../interfaces/IAgentCommunicationBus.md#acknowledgemessage)

***

### broadcast()

> **broadcast**(`agencyId`, `message`): `Promise`\<`DeliveryStatus`[]\>

Defined in: [packages/agentos/src/agents/agency/AgentCommunicationBus.ts:215](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/agents/agency/AgentCommunicationBus.ts#L215)

Broadcasts a message to all agents in an agency.

#### Parameters

##### agencyId

`string`

##### message

`Omit`\<[`AgentMessage`](../interfaces/AgentMessage.md), `"messageId"` \| `"toAgentId"` \| `"sentAt"`\>

#### Returns

`Promise`\<`DeliveryStatus`[]\>

#### Implementation of

[`IAgentCommunicationBus`](../interfaces/IAgentCommunicationBus.md).[`broadcast`](../interfaces/IAgentCommunicationBus.md#broadcast)

***

### broadcastToRoles()

> **broadcastToRoles**(`agencyId`, `roleIds`, `message`): `Promise`\<`DeliveryStatus`[]\>

Defined in: [packages/agentos/src/agents/agency/AgentCommunicationBus.ts:240](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/agents/agency/AgentCommunicationBus.ts#L240)

Broadcasts to specific roles within an agency.

#### Parameters

##### agencyId

`string`

##### roleIds

`string`[]

##### message

`Omit`\<[`AgentMessage`](../interfaces/AgentMessage.md), `"messageId"` \| `"sentAt"`\>

#### Returns

`Promise`\<`DeliveryStatus`[]\>

#### Implementation of

[`IAgentCommunicationBus`](../interfaces/IAgentCommunicationBus.md).[`broadcastToRoles`](../interfaces/IAgentCommunicationBus.md#broadcasttoroles)

***

### createTopic()

> **createTopic**(`topic`): `Promise`\<`MessageTopic`\>

Defined in: [packages/agentos/src/agents/agency/AgentCommunicationBus.ts:445](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/agents/agency/AgentCommunicationBus.ts#L445)

Creates a message topic.

#### Parameters

##### topic

`Omit`\<`MessageTopic`, `"topicId"`\>

#### Returns

`Promise`\<`MessageTopic`\>

#### Implementation of

[`IAgentCommunicationBus`](../interfaces/IAgentCommunicationBus.md).[`createTopic`](../interfaces/IAgentCommunicationBus.md#createtopic)

***

### getDeliveryStatus()

> **getDeliveryStatus**(`messageId`): `Promise`\<`DeliveryStatus` \| `null`\>

Defined in: [packages/agentos/src/agents/agency/AgentCommunicationBus.ts:530](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/agents/agency/AgentCommunicationBus.ts#L530)

Gets the delivery status of a message.

#### Parameters

##### messageId

`string`

#### Returns

`Promise`\<`DeliveryStatus` \| `null`\>

#### Implementation of

[`IAgentCommunicationBus`](../interfaces/IAgentCommunicationBus.md).[`getDeliveryStatus`](../interfaces/IAgentCommunicationBus.md#getdeliverystatus)

***

### getMessageHistory()

> **getMessageHistory**(`agentId`, `options?`): `Promise`\<[`AgentMessage`](../interfaces/AgentMessage.md)[]\>

Defined in: [packages/agentos/src/agents/agency/AgentCommunicationBus.ts:590](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/agents/agency/AgentCommunicationBus.ts#L590)

Gets message history for an agent.

#### Parameters

##### agentId

`string`

##### options?

###### direction?

`"both"` \| `"sent"` \| `"received"`

###### limit?

`number`

###### since?

`Date`

###### types?

[`AgentMessageType`](../type-aliases/AgentMessageType.md)[]

#### Returns

`Promise`\<[`AgentMessage`](../interfaces/AgentMessage.md)[]\>

#### Implementation of

[`IAgentCommunicationBus`](../interfaces/IAgentCommunicationBus.md).[`getMessageHistory`](../interfaces/IAgentCommunicationBus.md#getmessagehistory)

***

### getStatistics()

> **getStatistics**(): `BusStatistics`

Defined in: [packages/agentos/src/agents/agency/AgentCommunicationBus.ts:583](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/agents/agency/AgentCommunicationBus.ts#L583)

Gets message bus statistics.

#### Returns

`BusStatistics`

#### Implementation of

[`IAgentCommunicationBus`](../interfaces/IAgentCommunicationBus.md).[`getStatistics`](../interfaces/IAgentCommunicationBus.md#getstatistics)

***

### handoff()

> **handoff**(`fromAgentId`, `toAgentId`, `context`): `Promise`\<[`HandoffResult`](../interfaces/HandoffResult.md)\>

Defined in: [packages/agentos/src/agents/agency/AgentCommunicationBus.ts:344](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/agents/agency/AgentCommunicationBus.ts#L344)

Initiates a structured handoff between agents.

#### Parameters

##### fromAgentId

`string`

##### toAgentId

`string`

##### context

[`HandoffContext`](../interfaces/HandoffContext.md)

#### Returns

`Promise`\<[`HandoffResult`](../interfaces/HandoffResult.md)\>

#### Implementation of

[`IAgentCommunicationBus`](../interfaces/IAgentCommunicationBus.md).[`handoff`](../interfaces/IAgentCommunicationBus.md#handoff)

***

### publishToTopic()

> **publishToTopic**(`topicId`, `message`): `Promise`\<`DeliveryStatus`[]\>

Defined in: [packages/agentos/src/agents/agency/AgentCommunicationBus.ts:461](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/agents/agency/AgentCommunicationBus.ts#L461)

Publishes a message to a topic.

#### Parameters

##### topicId

`string`

##### message

`Omit`\<[`AgentMessage`](../interfaces/AgentMessage.md), `"messageId"` \| `"sentAt"`\>

#### Returns

`Promise`\<`DeliveryStatus`[]\>

#### Implementation of

[`IAgentCommunicationBus`](../interfaces/IAgentCommunicationBus.md).[`publishToTopic`](../interfaces/IAgentCommunicationBus.md#publishtotopic)

***

### registerAgent()

> **registerAgent**(`agentId`, `agencyId`, `roleId`): `void`

Defined in: [packages/agentos/src/agents/agency/AgentCommunicationBus.ts:630](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/agents/agency/AgentCommunicationBus.ts#L630)

Registers an agent with an agency for routing.

#### Parameters

##### agentId

`string`

##### agencyId

`string`

##### roleId

`string`

#### Returns

`void`

***

### requestResponse()

> **requestResponse**(`targetAgentId`, `request`): `Promise`\<[`AgentResponse`](../interfaces/AgentResponse.md)\>

Defined in: [packages/agentos/src/agents/agency/AgentCommunicationBus.ts:276](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/agents/agency/AgentCommunicationBus.ts#L276)

Sends a request and waits for a response.

#### Parameters

##### targetAgentId

`string`

##### request

[`AgentRequest`](../interfaces/AgentRequest.md)

#### Returns

`Promise`\<[`AgentResponse`](../interfaces/AgentResponse.md)\>

#### Implementation of

[`IAgentCommunicationBus`](../interfaces/IAgentCommunicationBus.md).[`requestResponse`](../interfaces/IAgentCommunicationBus.md#requestresponse)

***

### retryDelivery()

> **retryDelivery**(`messageId`): `Promise`\<`DeliveryStatus`\>

Defined in: [packages/agentos/src/agents/agency/AgentCommunicationBus.ts:554](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/agents/agency/AgentCommunicationBus.ts#L554)

Retries delivery of a failed message.

#### Parameters

##### messageId

`string`

#### Returns

`Promise`\<`DeliveryStatus`\>

#### Implementation of

[`IAgentCommunicationBus`](../interfaces/IAgentCommunicationBus.md).[`retryDelivery`](../interfaces/IAgentCommunicationBus.md#retrydelivery)

***

### sendToAgent()

> **sendToAgent**(`targetAgentId`, `message`): `Promise`\<`DeliveryStatus`\>

Defined in: [packages/agentos/src/agents/agency/AgentCommunicationBus.ts:160](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/agents/agency/AgentCommunicationBus.ts#L160)

Sends a message to a specific agent.

#### Parameters

##### targetAgentId

`string`

##### message

`Omit`\<[`AgentMessage`](../interfaces/AgentMessage.md), `"messageId"` \| `"toAgentId"` \| `"sentAt"`\>

#### Returns

`Promise`\<`DeliveryStatus`\>

#### Implementation of

[`IAgentCommunicationBus`](../interfaces/IAgentCommunicationBus.md).[`sendToAgent`](../interfaces/IAgentCommunicationBus.md#sendtoagent)

***

### sendToRole()

> **sendToRole**(`agencyId`, `targetRoleId`, `message`): `Promise`\<`DeliveryStatus`\>

Defined in: [packages/agentos/src/agents/agency/AgentCommunicationBus.ts:178](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/agents/agency/AgentCommunicationBus.ts#L178)

Sends a message to an agent by role.

#### Parameters

##### agencyId

`string`

##### targetRoleId

`string`

##### message

`Omit`\<[`AgentMessage`](../interfaces/AgentMessage.md), `"messageId"` \| `"toRoleId"` \| `"sentAt"`\>

#### Returns

`Promise`\<`DeliveryStatus`\>

#### Implementation of

[`IAgentCommunicationBus`](../interfaces/IAgentCommunicationBus.md).[`sendToRole`](../interfaces/IAgentCommunicationBus.md#sendtorole)

***

### subscribe()

> **subscribe**(`agentId`, `handler`, `options?`): `Unsubscribe`

Defined in: [packages/agentos/src/agents/agency/AgentCommunicationBus.ts:395](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/agents/agency/AgentCommunicationBus.ts#L395)

Subscribes an agent to receive messages.

#### Parameters

##### agentId

`string`

##### handler

`MessageHandler`

##### options?

`SubscriptionOptions` = `{}`

#### Returns

`Unsubscribe`

#### Implementation of

[`IAgentCommunicationBus`](../interfaces/IAgentCommunicationBus.md).[`subscribe`](../interfaces/IAgentCommunicationBus.md#subscribe)

***

### subscribeToTopic()

> **subscribeToTopic**(`agentId`, `topicId`, `handler`): `Unsubscribe`

Defined in: [packages/agentos/src/agents/agency/AgentCommunicationBus.ts:502](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/agents/agency/AgentCommunicationBus.ts#L502)

Subscribes an agent to a topic.

#### Parameters

##### agentId

`string`

##### topicId

`string`

##### handler

`MessageHandler`

#### Returns

`Unsubscribe`

#### Implementation of

[`IAgentCommunicationBus`](../interfaces/IAgentCommunicationBus.md).[`subscribeToTopic`](../interfaces/IAgentCommunicationBus.md#subscribetotopic)

***

### unregisterAgent()

> **unregisterAgent**(`agentId`): `void`

Defined in: [packages/agentos/src/agents/agency/AgentCommunicationBus.ts:651](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/agents/agency/AgentCommunicationBus.ts#L651)

Unregisters an agent from routing.

#### Parameters

##### agentId

`string`

#### Returns

`void`

***

### unsubscribeAll()

> **unsubscribeAll**(`agentId`): `void`

Defined in: [packages/agentos/src/agents/agency/AgentCommunicationBus.ts:429](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/agents/agency/AgentCommunicationBus.ts#L429)

Unsubscribes an agent from all messages.

#### Parameters

##### agentId

`string`

#### Returns

`void`

#### Implementation of

[`IAgentCommunicationBus`](../interfaces/IAgentCommunicationBus.md).[`unsubscribeAll`](../interfaces/IAgentCommunicationBus.md#unsubscribeall)
