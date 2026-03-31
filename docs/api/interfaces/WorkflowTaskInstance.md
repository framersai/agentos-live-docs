# Interface: WorkflowTaskInstance

Defined in: [packages/agentos/src/orchestration/workflows/WorkflowTypes.ts:104](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/workflows/WorkflowTypes.ts#L104)

Runtime snapshot of a single task inside a workflow instance.

## Properties

### assignedExecutorId?

> `optional` **assignedExecutorId**: `string`

Defined in: [packages/agentos/src/orchestration/workflows/WorkflowTypes.ts:108](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/workflows/WorkflowTypes.ts#L108)

***

### assignedRoleId?

> `optional` **assignedRoleId**: `string`

Defined in: [packages/agentos/src/orchestration/workflows/WorkflowTypes.ts:107](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/workflows/WorkflowTypes.ts#L107)

***

### completedAt?

> `optional` **completedAt**: `string`

Defined in: [packages/agentos/src/orchestration/workflows/WorkflowTypes.ts:110](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/workflows/WorkflowTypes.ts#L110)

***

### definitionId

> **definitionId**: `string`

Defined in: [packages/agentos/src/orchestration/workflows/WorkflowTypes.ts:105](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/workflows/WorkflowTypes.ts#L105)

***

### error?

> `optional` **error**: `object`

Defined in: [packages/agentos/src/orchestration/workflows/WorkflowTypes.ts:112](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/workflows/WorkflowTypes.ts#L112)

#### code?

> `optional` **code**: `string`

#### details?

> `optional` **details**: `unknown`

#### message

> **message**: `string`

***

### metadata?

> `optional` **metadata**: `Record`\<`string`, `unknown`\>

Defined in: [packages/agentos/src/orchestration/workflows/WorkflowTypes.ts:117](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/workflows/WorkflowTypes.ts#L117)

***

### output?

> `optional` **output**: `unknown`

Defined in: [packages/agentos/src/orchestration/workflows/WorkflowTypes.ts:111](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/workflows/WorkflowTypes.ts#L111)

***

### startedAt?

> `optional` **startedAt**: `string`

Defined in: [packages/agentos/src/orchestration/workflows/WorkflowTypes.ts:109](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/workflows/WorkflowTypes.ts#L109)

***

### status

> **status**: [`WorkflowTaskStatus`](../enumerations/WorkflowTaskStatus.md)

Defined in: [packages/agentos/src/orchestration/workflows/WorkflowTypes.ts:106](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/workflows/WorkflowTypes.ts#L106)
