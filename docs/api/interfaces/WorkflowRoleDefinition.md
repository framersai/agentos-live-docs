# Interface: WorkflowRoleDefinition

Defined in: [packages/agentos/src/orchestration/workflows/WorkflowTypes.ts:37](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/orchestration/workflows/WorkflowTypes.ts#L37)

Declarative role definition referenced by workflow tasks.

## Properties

### defaultAssigneeStrategy?

> `optional` **defaultAssigneeStrategy**: `"primary_gmi"` \| `"conversation_owner"` \| `"host_supplied"`

Defined in: [packages/agentos/src/orchestration/workflows/WorkflowTypes.ts:47](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/orchestration/workflows/WorkflowTypes.ts#L47)

***

### description?

> `optional` **description**: `string`

Defined in: [packages/agentos/src/orchestration/workflows/WorkflowTypes.ts:40](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/orchestration/workflows/WorkflowTypes.ts#L40)

***

### displayName

> **displayName**: `string`

Defined in: [packages/agentos/src/orchestration/workflows/WorkflowTypes.ts:39](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/orchestration/workflows/WorkflowTypes.ts#L39)

***

### evolutionRules?

> `optional` **evolutionRules**: [`PersonaEvolutionRule`](PersonaEvolutionRule.md)[]

Defined in: [packages/agentos/src/orchestration/workflows/WorkflowTypes.ts:43](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/orchestration/workflows/WorkflowTypes.ts#L43)

***

### guardrailPolicyTags?

> `optional` **guardrailPolicyTags**: `string`[]

Defined in: [packages/agentos/src/orchestration/workflows/WorkflowTypes.ts:46](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/orchestration/workflows/WorkflowTypes.ts#L46)

***

### metadata?

> `optional` **metadata**: `Record`\<`string`, `unknown`\>

Defined in: [packages/agentos/src/orchestration/workflows/WorkflowTypes.ts:48](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/orchestration/workflows/WorkflowTypes.ts#L48)

***

### personaCapabilityRequirements?

> `optional` **personaCapabilityRequirements**: `string`[]

Defined in: [packages/agentos/src/orchestration/workflows/WorkflowTypes.ts:44](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/orchestration/workflows/WorkflowTypes.ts#L44)

***

### personaId?

> `optional` **personaId**: `string`

Defined in: [packages/agentos/src/orchestration/workflows/WorkflowTypes.ts:41](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/orchestration/workflows/WorkflowTypes.ts#L41)

***

### personaTraits?

> `optional` **personaTraits**: `Record`\<`string`, `unknown`\>

Defined in: [packages/agentos/src/orchestration/workflows/WorkflowTypes.ts:42](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/orchestration/workflows/WorkflowTypes.ts#L42)

***

### roleId

> **roleId**: `string`

Defined in: [packages/agentos/src/orchestration/workflows/WorkflowTypes.ts:38](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/orchestration/workflows/WorkflowTypes.ts#L38)

***

### toolCapabilityRequirements?

> `optional` **toolCapabilityRequirements**: `string`[]

Defined in: [packages/agentos/src/orchestration/workflows/WorkflowTypes.ts:45](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/orchestration/workflows/WorkflowTypes.ts#L45)
