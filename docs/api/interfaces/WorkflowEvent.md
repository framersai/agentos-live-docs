# Interface: WorkflowEvent

Defined in: [packages/agentos/src/orchestration/workflows/WorkflowTypes.ts:155](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/workflows/WorkflowTypes.ts#L155)

Structured event emitted as workflows progress.

## Properties

### definitionId

> **definitionId**: `string`

Defined in: [packages/agentos/src/orchestration/workflows/WorkflowTypes.ts:158](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/workflows/WorkflowTypes.ts#L158)

***

### eventId

> **eventId**: `string`

Defined in: [packages/agentos/src/orchestration/workflows/WorkflowTypes.ts:156](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/workflows/WorkflowTypes.ts#L156)

***

### metadata?

> `optional` **metadata**: `Record`\<`string`, `unknown`\>

Defined in: [packages/agentos/src/orchestration/workflows/WorkflowTypes.ts:170](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/workflows/WorkflowTypes.ts#L170)

***

### payload?

> `optional` **payload**: `Record`\<`string`, `unknown`\>

Defined in: [packages/agentos/src/orchestration/workflows/WorkflowTypes.ts:169](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/workflows/WorkflowTypes.ts#L169)

***

### taskId?

> `optional` **taskId**: `string`

Defined in: [packages/agentos/src/orchestration/workflows/WorkflowTypes.ts:159](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/workflows/WorkflowTypes.ts#L159)

***

### timestamp

> **timestamp**: `string`

Defined in: [packages/agentos/src/orchestration/workflows/WorkflowTypes.ts:160](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/workflows/WorkflowTypes.ts#L160)

***

### type

> **type**: `"error"` \| `"custom"` \| `"workflow_created"` \| `"workflow_status_changed"` \| `"task_status_changed"` \| `"task_output_emitted"` \| `"guardrail_applied"`

Defined in: [packages/agentos/src/orchestration/workflows/WorkflowTypes.ts:161](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/workflows/WorkflowTypes.ts#L161)

***

### workflowId

> **workflowId**: `string`

Defined in: [packages/agentos/src/orchestration/workflows/WorkflowTypes.ts:157](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/workflows/WorkflowTypes.ts#L157)
