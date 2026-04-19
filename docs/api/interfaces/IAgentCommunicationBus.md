# Interface: IAgentCommunicationBus

Defined in: [packages/agentos/src/agents/agency/IAgentCommunicationBus.ts:335](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/agents/agency/IAgentCommunicationBus.ts#L335)

Interface for the AgentOS Agent Communication Bus.

The Communication Bus enables structured messaging between agents
within an agency, supporting various communication patterns:

- **Point-to-Point**: Direct messages between two agents
- **Broadcast**: Messages to all agents in an agency
- **Request-Response**: Synchronous-style communication
- **Pub/Sub**: Topic-based messaging
- **Handoff**: Structured task transfer between agents

## Example

```typescript
// Initialize bus
const bus = new AgentCommunicationBus({ logger, routingConfig });

// Agent subscribes to messages
bus.subscribe('analyst-gmi', async (msg) => {
  if (msg.type === 'task_delegation') {
    const result = await analyzeData(msg.content);
    await bus.sendToAgent(msg.fromAgentId, {
      type: 'answer',
      content: result,
      inReplyTo: msg.messageId,
    });
  }
});

// Coordinator delegates task
await bus.sendToAgent('analyst-gmi', {
  type: 'task_delegation',
  content: { data: [...], instructions: 'Analyze trends' },
  priority: 'high',
});
```

## Methods

### acknowledgeMessage()

> **acknowledgeMessage**(`messageId`, `agentId`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/agents/agency/IAgentCommunicationBus.ts:555](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/agents/agency/IAgentCommunicationBus.ts#L555)

Acknowledges receipt of a message.

#### Parameters

##### messageId

`string`

Message to acknowledge

##### agentId

`string`

Acknowledging agent

#### Returns

`Promise`\<`void`\>

***

### broadcast()

> **broadcast**(`agencyId`, `message`): `Promise`\<`DeliveryStatus`[]\>

Defined in: [packages/agentos/src/agents/agency/IAgentCommunicationBus.ts:396](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/agents/agency/IAgentCommunicationBus.ts#L396)

Broadcasts a message to all agents in an agency.

#### Parameters

##### agencyId

`string`

Target agency

##### message

`Omit`\<[`AgentMessage`](AgentMessage.md), `"messageId"` \| `"toAgentId"` \| `"sentAt"`\>

Message to broadcast

#### Returns

`Promise`\<`DeliveryStatus`[]\>

Array of delivery statuses

#### Example

```typescript
await bus.broadcast('agency-123', {
  type: 'broadcast',
  content: 'Meeting in 5 minutes',
  priority: 'high',
});
```

***

### broadcastToRoles()

> **broadcastToRoles**(`agencyId`, `roleIds`, `message`): `Promise`\<`DeliveryStatus`[]\>

Defined in: [packages/agentos/src/agents/agency/IAgentCommunicationBus.ts:409](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/agents/agency/IAgentCommunicationBus.ts#L409)

Broadcasts to specific roles within an agency.

#### Parameters

##### agencyId

`string`

Target agency

##### roleIds

`string`[]

Target roles

##### message

`Omit`\<[`AgentMessage`](AgentMessage.md), `"messageId"` \| `"sentAt"`\>

Message to broadcast

#### Returns

`Promise`\<`DeliveryStatus`[]\>

Array of delivery statuses

***

### createTopic()

> **createTopic**(`topic`): `Promise`\<`MessageTopic`\>

Defined in: [packages/agentos/src/agents/agency/IAgentCommunicationBus.ts:513](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/agents/agency/IAgentCommunicationBus.ts#L513)

Creates a message topic.

#### Parameters

##### topic

`Omit`\<`MessageTopic`, `"topicId"`\>

Topic configuration

#### Returns

`Promise`\<`MessageTopic`\>

Created topic

***

### getDeliveryStatus()

> **getDeliveryStatus**(`messageId`): `Promise`\<`DeliveryStatus` \| `null`\>

Defined in: [packages/agentos/src/agents/agency/IAgentCommunicationBus.ts:547](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/agents/agency/IAgentCommunicationBus.ts#L547)

Gets the delivery status of a message.

#### Parameters

##### messageId

`string`

Message identifier

#### Returns

`Promise`\<`DeliveryStatus` \| `null`\>

Delivery status or null if not found

***

### getMessageHistory()

> **getMessageHistory**(`agentId`, `options?`): `Promise`\<[`AgentMessage`](AgentMessage.md)[]\>

Defined in: [packages/agentos/src/agents/agency/IAgentCommunicationBus.ts:583](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/agents/agency/IAgentCommunicationBus.ts#L583)

Gets message history for an agent.

#### Parameters

##### agentId

`string`

Agent identifier

##### options?

Query options

###### direction?

`"both"` \| `"sent"` \| `"received"`

###### limit?

`number`

###### since?

`Date`

###### types?

[`AgentMessageType`](../type-aliases/AgentMessageType.md)[]

#### Returns

`Promise`\<[`AgentMessage`](AgentMessage.md)[]\>

Message history

***

### getStatistics()

> **getStatistics**(): `BusStatistics`

Defined in: [packages/agentos/src/agents/agency/IAgentCommunicationBus.ts:574](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/agents/agency/IAgentCommunicationBus.ts#L574)

Gets message bus statistics.

#### Returns

`BusStatistics`

Current bus statistics

***

### handoff()

> **handoff**(`fromAgentId`, `toAgentId`, `context`): `Promise`\<[`HandoffResult`](HandoffResult.md)\>

Defined in: [packages/agentos/src/agents/agency/IAgentCommunicationBus.ts:468](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/agents/agency/IAgentCommunicationBus.ts#L468)

Initiates a structured handoff between agents.
Used for transferring task ownership with full context.

#### Parameters

##### fromAgentId

`string`

Current owner

##### toAgentId

`string`

New owner

##### context

[`HandoffContext`](HandoffContext.md)

Handoff context

#### Returns

`Promise`\<[`HandoffResult`](HandoffResult.md)\>

Handoff result

#### Example

```typescript
const result = await bus.handoff('analyst-gmi', 'reviewer-gmi', {
  taskId: 'analysis-task-1',
  taskDescription: 'Data analysis for Q4 report',
  progress: 0.8,
  completedWork: ['Data collection', 'Initial analysis'],
  remainingWork: ['Final review', 'Report generation'],
  context: { findings: [...] },
  reason: 'completion',
});
```

***

### publishToTopic()

> **publishToTopic**(`topicId`, `message`): `Promise`\<`DeliveryStatus`[]\>

Defined in: [packages/agentos/src/agents/agency/IAgentCommunicationBus.ts:522](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/agents/agency/IAgentCommunicationBus.ts#L522)

Publishes a message to a topic.

#### Parameters

##### topicId

`string`

Topic identifier

##### message

`Omit`\<[`AgentMessage`](AgentMessage.md), `"messageId"` \| `"sentAt"`\>

Message to publish

#### Returns

`Promise`\<`DeliveryStatus`[]\>

Delivery statuses for all subscribers

***

### requestResponse()

> **requestResponse**(`targetAgentId`, `request`): `Promise`\<[`AgentResponse`](AgentResponse.md)\>

Defined in: [packages/agentos/src/agents/agency/IAgentCommunicationBus.ts:440](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/agents/agency/IAgentCommunicationBus.ts#L440)

Sends a request and waits for a response.
Implements request-response pattern over async messaging.

#### Parameters

##### targetAgentId

`string`

Target agent

##### request

[`AgentRequest`](AgentRequest.md)

Request message

#### Returns

`Promise`\<[`AgentResponse`](AgentResponse.md)\>

Response from target agent

#### Example

```typescript
const response = await bus.requestResponse('expert-gmi', {
  type: 'question',
  content: 'What is the optimal approach?',
  fromAgentId: 'coordinator-gmi',
  timeoutMs: 30000,
});
if (response.status === 'success') {
  console.log('Answer:', response.content);
}
```

***

### retryDelivery()

> **retryDelivery**(`messageId`): `Promise`\<`DeliveryStatus`\>

Defined in: [packages/agentos/src/agents/agency/IAgentCommunicationBus.ts:563](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/agents/agency/IAgentCommunicationBus.ts#L563)

Retries delivery of a failed message.

#### Parameters

##### messageId

`string`

Message to retry

#### Returns

`Promise`\<`DeliveryStatus`\>

New delivery status

***

### sendToAgent()

> **sendToAgent**(`targetAgentId`, `message`): `Promise`\<`DeliveryStatus`\>

Defined in: [packages/agentos/src/agents/agency/IAgentCommunicationBus.ts:356](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/agents/agency/IAgentCommunicationBus.ts#L356)

Sends a message to a specific agent.

#### Parameters

##### targetAgentId

`string`

Target agent identifier

##### message

`Omit`\<[`AgentMessage`](AgentMessage.md), `"messageId"` \| `"toAgentId"` \| `"sentAt"`\>

Message to send (without routing fields)

#### Returns

`Promise`\<`DeliveryStatus`\>

Delivery status

#### Example

```typescript
await bus.sendToAgent('researcher-gmi', {
  type: 'question',
  content: 'What did you find about topic X?',
  priority: 'normal',
});
```

***

### sendToRole()

> **sendToRole**(`agencyId`, `targetRoleId`, `message`): `Promise`\<`DeliveryStatus`\>

Defined in: [packages/agentos/src/agents/agency/IAgentCommunicationBus.ts:370](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/agents/agency/IAgentCommunicationBus.ts#L370)

Sends a message to an agent by role.
If multiple agents have the role, uses load balancing.

#### Parameters

##### agencyId

`string`

Agency context

##### targetRoleId

`string`

Target role identifier

##### message

`Omit`\<[`AgentMessage`](AgentMessage.md), `"messageId"` \| `"toRoleId"` \| `"sentAt"`\>

Message to send

#### Returns

`Promise`\<`DeliveryStatus`\>

Delivery status

***

### subscribe()

> **subscribe**(`agentId`, `handler`, `options?`): `Unsubscribe`

Defined in: [packages/agentos/src/agents/agency/IAgentCommunicationBus.ts:494](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/agents/agency/IAgentCommunicationBus.ts#L494)

Subscribes an agent to receive messages.

#### Parameters

##### agentId

`string`

Agent to subscribe

##### handler

`MessageHandler`

Message handler function

##### options?

`SubscriptionOptions`

Subscription filter options

#### Returns

`Unsubscribe`

Unsubscribe function

#### Example

```typescript
const unsub = bus.subscribe('worker-gmi', async (msg) => {
  console.log('Received:', msg.type, msg.content);
}, {
  messageTypes: ['task_delegation', 'question'],
  minPriority: 'normal',
});

// Later: unsub();
```

***

### subscribeToTopic()

> **subscribeToTopic**(`agentId`, `topicId`, `handler`): `Unsubscribe`

Defined in: [packages/agentos/src/agents/agency/IAgentCommunicationBus.ts:535](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/agents/agency/IAgentCommunicationBus.ts#L535)

Subscribes an agent to a topic.

#### Parameters

##### agentId

`string`

Agent to subscribe

##### topicId

`string`

Topic identifier

##### handler

`MessageHandler`

Message handler

#### Returns

`Unsubscribe`

Unsubscribe function

***

### unsubscribeAll()

> **unsubscribeAll**(`agentId`): `void`

Defined in: [packages/agentos/src/agents/agency/IAgentCommunicationBus.ts:501](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/agents/agency/IAgentCommunicationBus.ts#L501)

Unsubscribes an agent from all messages.

#### Parameters

##### agentId

`string`

Agent to unsubscribe

#### Returns

`void`
