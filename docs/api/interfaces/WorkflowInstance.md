# Interface: WorkflowInstance

Defined in: [packages/agentos/src/orchestration/workflows/WorkflowTypes.ts:132](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/orchestration/workflows/WorkflowTypes.ts#L132)

Runtime snapshot of a workflow instance.

## Properties

### agencyState?

> `optional` **agencyState**: `object`

Defined in: [packages/agentos/src/orchestration/workflows/WorkflowTypes.ts:144](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/orchestration/workflows/WorkflowTypes.ts#L144)

#### agencyId

> **agencyId**: `string`

#### metadata?

> `optional` **metadata**: `Record`\<`string`, `unknown`\>

#### seats

> **seats**: `Record`\<`string`, [`WorkflowAgencySeatSnapshot`](WorkflowAgencySeatSnapshot.md)\>

***

### context?

> `optional` **context**: `Record`\<`string`, `unknown`\>

Defined in: [packages/agentos/src/orchestration/workflows/WorkflowTypes.ts:141](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/orchestration/workflows/WorkflowTypes.ts#L141)

***

### conversationId?

> `optional` **conversationId**: `string`

Defined in: [packages/agentos/src/orchestration/workflows/WorkflowTypes.ts:139](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/orchestration/workflows/WorkflowTypes.ts#L139)

***

### createdAt

> **createdAt**: `string`

Defined in: [packages/agentos/src/orchestration/workflows/WorkflowTypes.ts:137](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/orchestration/workflows/WorkflowTypes.ts#L137)

***

### createdByUserId?

> `optional` **createdByUserId**: `string`

Defined in: [packages/agentos/src/orchestration/workflows/WorkflowTypes.ts:140](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/orchestration/workflows/WorkflowTypes.ts#L140)

***

### definitionId

> **definitionId**: `string`

Defined in: [packages/agentos/src/orchestration/workflows/WorkflowTypes.ts:134](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/orchestration/workflows/WorkflowTypes.ts#L134)

***

### definitionVersion?

> `optional` **definitionVersion**: `string`

Defined in: [packages/agentos/src/orchestration/workflows/WorkflowTypes.ts:135](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/orchestration/workflows/WorkflowTypes.ts#L135)

***

### metadata?

> `optional` **metadata**: `Record`\<`string`, `unknown`\>

Defined in: [packages/agentos/src/orchestration/workflows/WorkflowTypes.ts:149](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/orchestration/workflows/WorkflowTypes.ts#L149)

***

### roleAssignments?

> `optional` **roleAssignments**: `Record`\<`string`, `string`\>

Defined in: [packages/agentos/src/orchestration/workflows/WorkflowTypes.ts:142](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/orchestration/workflows/WorkflowTypes.ts#L142)

***

### status

> **status**: [`WorkflowStatus`](../enumerations/WorkflowStatus.md)

Defined in: [packages/agentos/src/orchestration/workflows/WorkflowTypes.ts:136](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/orchestration/workflows/WorkflowTypes.ts#L136)

***

### tasks

> **tasks**: `Record`\<`string`, [`WorkflowTaskInstance`](WorkflowTaskInstance.md)\>

Defined in: [packages/agentos/src/orchestration/workflows/WorkflowTypes.ts:143](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/orchestration/workflows/WorkflowTypes.ts#L143)

***

### updatedAt

> **updatedAt**: `string`

Defined in: [packages/agentos/src/orchestration/workflows/WorkflowTypes.ts:138](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/orchestration/workflows/WorkflowTypes.ts#L138)

***

### workflowId

> **workflowId**: `string`

Defined in: [packages/agentos/src/orchestration/workflows/WorkflowTypes.ts:133](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/orchestration/workflows/WorkflowTypes.ts#L133)
