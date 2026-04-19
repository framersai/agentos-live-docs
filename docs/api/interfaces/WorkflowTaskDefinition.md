# Interface: WorkflowTaskDefinition

Defined in: [packages/agentos/src/orchestration/workflows/WorkflowTypes.ts:54](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/orchestration/workflows/WorkflowTypes.ts#L54)

Declarative task definition within a workflow.

## Properties

### dependsOn?

> `optional` **dependsOn**: `string`[]

Defined in: [packages/agentos/src/orchestration/workflows/WorkflowTypes.ts:58](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/orchestration/workflows/WorkflowTypes.ts#L58)

***

### description?

> `optional` **description**: `string`

Defined in: [packages/agentos/src/orchestration/workflows/WorkflowTypes.ts:57](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/orchestration/workflows/WorkflowTypes.ts#L57)

***

### executor

> **executor**: `object`

Defined in: [packages/agentos/src/orchestration/workflows/WorkflowTypes.ts:59](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/orchestration/workflows/WorkflowTypes.ts#L59)

#### extensionId?

> `optional` **extensionId**: `string`

#### instructions?

> `optional` **instructions**: `string`

#### personaId?

> `optional` **personaId**: `string`

#### roleId?

> `optional` **roleId**: `string`

#### type

> **type**: [`WorkflowTaskExecutorType`](../type-aliases/WorkflowTaskExecutorType.md)

***

### handoff?

> `optional` **handoff**: `Record`\<`string`, `unknown`\>

Defined in: [packages/agentos/src/orchestration/workflows/WorkflowTypes.ts:76](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/orchestration/workflows/WorkflowTypes.ts#L76)

***

### id

> **id**: `string`

Defined in: [packages/agentos/src/orchestration/workflows/WorkflowTypes.ts:55](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/orchestration/workflows/WorkflowTypes.ts#L55)

***

### inputSchema?

> `optional` **inputSchema**: [`JSONSchemaObject`](../type-aliases/JSONSchemaObject.md)

Defined in: [packages/agentos/src/orchestration/workflows/WorkflowTypes.ts:66](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/orchestration/workflows/WorkflowTypes.ts#L66)

***

### metadata?

> `optional` **metadata**: `Record`\<`string`, `unknown`\>

Defined in: [packages/agentos/src/orchestration/workflows/WorkflowTypes.ts:75](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/orchestration/workflows/WorkflowTypes.ts#L75)

***

### name

> **name**: `string`

Defined in: [packages/agentos/src/orchestration/workflows/WorkflowTypes.ts:56](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/orchestration/workflows/WorkflowTypes.ts#L56)

***

### outputSchema?

> `optional` **outputSchema**: [`JSONSchemaObject`](../type-aliases/JSONSchemaObject.md)

Defined in: [packages/agentos/src/orchestration/workflows/WorkflowTypes.ts:67](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/orchestration/workflows/WorkflowTypes.ts#L67)

***

### policyTags?

> `optional` **policyTags**: `string`[]

Defined in: [packages/agentos/src/orchestration/workflows/WorkflowTypes.ts:68](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/orchestration/workflows/WorkflowTypes.ts#L68)

***

### retryPolicy?

> `optional` **retryPolicy**: `object`

Defined in: [packages/agentos/src/orchestration/workflows/WorkflowTypes.ts:69](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/orchestration/workflows/WorkflowTypes.ts#L69)

#### backoffSeconds?

> `optional` **backoffSeconds**: `number`

#### maxAttempts

> **maxAttempts**: `number`

#### strategy?

> `optional` **strategy**: `"exponential"` \| `"linear"` \| `"fixed"`

***

### skippable?

> `optional` **skippable**: `boolean`

Defined in: [packages/agentos/src/orchestration/workflows/WorkflowTypes.ts:74](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/orchestration/workflows/WorkflowTypes.ts#L74)
