# Interface: WorkflowInvocationRequest

Defined in: [packages/agentos/src/api/types/AgentOSInput.ts:44](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/types/AgentOSInput.ts#L44)

Encapsulates all data and options for a single interaction turn with AgentOS.
This structure is designed to be comprehensive, supporting multimodal inputs,
persona selection, user-specific API keys, explicit feedback, conversation
management, and fine-grained processing controls.

## Interface

AgentOSInput

## Properties

### context?

> `optional` **context**: `Record`\<`string`, `unknown`\>

Defined in: [packages/agentos/src/api/types/AgentOSInput.ts:48](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/types/AgentOSInput.ts#L48)

***

### conversationId?

> `optional` **conversationId**: `string`

Defined in: [packages/agentos/src/api/types/AgentOSInput.ts:47](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/types/AgentOSInput.ts#L47)

***

### definitionId

> **definitionId**: `string`

Defined in: [packages/agentos/src/api/types/AgentOSInput.ts:45](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/types/AgentOSInput.ts#L45)

***

### metadata?

> `optional` **metadata**: `Record`\<`string`, `unknown`\>

Defined in: [packages/agentos/src/api/types/AgentOSInput.ts:50](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/types/AgentOSInput.ts#L50)

***

### roleAssignments?

> `optional` **roleAssignments**: `Record`\<`string`, `string`\>

Defined in: [packages/agentos/src/api/types/AgentOSInput.ts:49](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/types/AgentOSInput.ts#L49)

***

### workflowId?

> `optional` **workflowId**: `string`

Defined in: [packages/agentos/src/api/types/AgentOSInput.ts:46](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/types/AgentOSInput.ts#L46)
