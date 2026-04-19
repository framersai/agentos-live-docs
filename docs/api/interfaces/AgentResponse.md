# Interface: AgentResponse

Defined in: [packages/agentos/src/agents/agency/IAgentCommunicationBus.ts:117](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/agents/agency/IAgentCommunicationBus.ts#L117)

Response to an agent request.

## Properties

### content

> **content**: `unknown`

Defined in: [packages/agentos/src/agents/agency/IAgentCommunicationBus.ts:127](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/agents/agency/IAgentCommunicationBus.ts#L127)

Response content

***

### error?

> `optional` **error**: `string`

Defined in: [packages/agentos/src/agents/agency/IAgentCommunicationBus.ts:129](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/agents/agency/IAgentCommunicationBus.ts#L129)

Error details if status is 'error'

***

### fromAgentId

> **fromAgentId**: `string`

Defined in: [packages/agentos/src/agents/agency/IAgentCommunicationBus.ts:123](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/agents/agency/IAgentCommunicationBus.ts#L123)

Responding agent ID

***

### requestId

> **requestId**: `string`

Defined in: [packages/agentos/src/agents/agency/IAgentCommunicationBus.ts:121](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/agents/agency/IAgentCommunicationBus.ts#L121)

Original request ID

***

### respondedAt

> **respondedAt**: `Date`

Defined in: [packages/agentos/src/agents/agency/IAgentCommunicationBus.ts:131](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/agents/agency/IAgentCommunicationBus.ts#L131)

Timestamp

***

### responseId

> **responseId**: `string`

Defined in: [packages/agentos/src/agents/agency/IAgentCommunicationBus.ts:119](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/agents/agency/IAgentCommunicationBus.ts#L119)

Response identifier

***

### status

> **status**: `"success"` \| `"error"` \| `"timeout"` \| `"rejected"`

Defined in: [packages/agentos/src/agents/agency/IAgentCommunicationBus.ts:125](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/agents/agency/IAgentCommunicationBus.ts#L125)

Response status
