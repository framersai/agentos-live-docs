# Interface: HandoffContext

Defined in: [packages/agentos/src/agents/agency/IAgentCommunicationBus.ts:141](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/agents/agency/IAgentCommunicationBus.ts#L141)

Context for task handoff between agents.

## Properties

### completedWork

> **completedWork**: `string`[]

Defined in: [packages/agentos/src/agents/agency/IAgentCommunicationBus.ts:149](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/agents/agency/IAgentCommunicationBus.ts#L149)

Work completed so far

***

### context

> **context**: `Record`\<`string`, `unknown`\>

Defined in: [packages/agentos/src/agents/agency/IAgentCommunicationBus.ts:153](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/agents/agency/IAgentCommunicationBus.ts#L153)

Relevant context/data

***

### deadline?

> `optional` **deadline**: `Date`

Defined in: [packages/agentos/src/agents/agency/IAgentCommunicationBus.ts:159](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/agents/agency/IAgentCommunicationBus.ts#L159)

Deadline if any

***

### instructions?

> `optional` **instructions**: `string`

Defined in: [packages/agentos/src/agents/agency/IAgentCommunicationBus.ts:157](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/agents/agency/IAgentCommunicationBus.ts#L157)

Instructions for receiving agent

***

### progress

> **progress**: `number`

Defined in: [packages/agentos/src/agents/agency/IAgentCommunicationBus.ts:147](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/agents/agency/IAgentCommunicationBus.ts#L147)

Current progress (0-1)

***

### reason

> **reason**: `"escalation"` \| `"timeout"` \| `"completion"` \| `"specialization"` \| `"capacity"`

Defined in: [packages/agentos/src/agents/agency/IAgentCommunicationBus.ts:155](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/agents/agency/IAgentCommunicationBus.ts#L155)

Reason for handoff

***

### remainingWork

> **remainingWork**: `string`[]

Defined in: [packages/agentos/src/agents/agency/IAgentCommunicationBus.ts:151](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/agents/agency/IAgentCommunicationBus.ts#L151)

Remaining work items

***

### taskDescription

> **taskDescription**: `string`

Defined in: [packages/agentos/src/agents/agency/IAgentCommunicationBus.ts:145](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/agents/agency/IAgentCommunicationBus.ts#L145)

Task description

***

### taskId

> **taskId**: `string`

Defined in: [packages/agentos/src/agents/agency/IAgentCommunicationBus.ts:143](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/agents/agency/IAgentCommunicationBus.ts#L143)

Task being handed off
