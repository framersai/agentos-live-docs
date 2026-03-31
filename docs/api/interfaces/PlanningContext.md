# Interface: PlanningContext

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:210](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/orchestration/planner/IPlanningEngine.ts#L210)

Context provided to the planning engine.

## Properties

### capabilities?

> `optional` **capabilities**: `string`[]

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:222](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/orchestration/planner/IPlanningEngine.ts#L222)

Available resources/capabilities

***

### conversationHistory?

> `optional` **conversationHistory**: `string`

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:212](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/orchestration/planner/IPlanningEngine.ts#L212)

Current conversation/session context

***

### domainContext?

> `optional` **domainContext**: `string`

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:220](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/orchestration/planner/IPlanningEngine.ts#L220)

Domain-specific knowledge

***

### failedApproaches?

> `optional` **failedApproaches**: `string`[]

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:218](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/orchestration/planner/IPlanningEngine.ts#L218)

Previously failed approaches

***

### retrievedContext?

> `optional` **retrievedContext**: `string`

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:214](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/orchestration/planner/IPlanningEngine.ts#L214)

Retrieved relevant context

***

### userConstraints?

> `optional` **userConstraints**: `string`[]

Defined in: [packages/agentos/src/orchestration/planner/IPlanningEngine.ts:216](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/orchestration/planner/IPlanningEngine.ts#L216)

User preferences/constraints
