# Interface: HITLStatistics

Defined in: [packages/agentos/src/orchestration/hitl/IHumanInteractionManager.ts:350](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/hitl/IHumanInteractionManager.ts#L350)

Statistics about HITL interactions.

## Properties

### approvalRate

> **approvalRate**: `number`

Defined in: [packages/agentos/src/orchestration/hitl/IHumanInteractionManager.ts:354](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/hitl/IHumanInteractionManager.ts#L354)

Approval rate

***

### avgResponseTimeMs

> **avgResponseTimeMs**: `number`

Defined in: [packages/agentos/src/orchestration/hitl/IHumanInteractionManager.ts:358](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/hitl/IHumanInteractionManager.ts#L358)

Average response time (ms)

***

### escalationsByReason

> **escalationsByReason**: `Record`\<[`EscalationReason`](../type-aliases/EscalationReason.md), `number`\>

Defined in: [packages/agentos/src/orchestration/hitl/IHumanInteractionManager.ts:362](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/hitl/IHumanInteractionManager.ts#L362)

Escalations by reason

***

### pendingRequests

> **pendingRequests**: `number`

Defined in: [packages/agentos/src/orchestration/hitl/IHumanInteractionManager.ts:364](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/hitl/IHumanInteractionManager.ts#L364)

Pending requests

***

### timedOutRequests

> **timedOutRequests**: `number`

Defined in: [packages/agentos/src/orchestration/hitl/IHumanInteractionManager.ts:366](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/hitl/IHumanInteractionManager.ts#L366)

Timed out requests

***

### totalApprovalRequests

> **totalApprovalRequests**: `number`

Defined in: [packages/agentos/src/orchestration/hitl/IHumanInteractionManager.ts:352](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/hitl/IHumanInteractionManager.ts#L352)

Total approval requests

***

### totalClarifications

> **totalClarifications**: `number`

Defined in: [packages/agentos/src/orchestration/hitl/IHumanInteractionManager.ts:356](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/hitl/IHumanInteractionManager.ts#L356)

Total clarifications requested

***

### totalEscalations

> **totalEscalations**: `number`

Defined in: [packages/agentos/src/orchestration/hitl/IHumanInteractionManager.ts:360](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/hitl/IHumanInteractionManager.ts#L360)

Total escalations
