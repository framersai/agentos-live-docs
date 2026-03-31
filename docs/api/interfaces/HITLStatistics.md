# Interface: HITLStatistics

Defined in: [packages/agentos/src/orchestration/hitl/IHumanInteractionManager.ts:350](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/hitl/IHumanInteractionManager.ts#L350)

Statistics about HITL interactions.

## Properties

### approvalRate

> **approvalRate**: `number`

Defined in: [packages/agentos/src/orchestration/hitl/IHumanInteractionManager.ts:354](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/hitl/IHumanInteractionManager.ts#L354)

Approval rate

***

### avgResponseTimeMs

> **avgResponseTimeMs**: `number`

Defined in: [packages/agentos/src/orchestration/hitl/IHumanInteractionManager.ts:358](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/hitl/IHumanInteractionManager.ts#L358)

Average response time (ms)

***

### escalationsByReason

> **escalationsByReason**: `Record`\<[`EscalationReason`](../type-aliases/EscalationReason.md), `number`\>

Defined in: [packages/agentos/src/orchestration/hitl/IHumanInteractionManager.ts:362](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/hitl/IHumanInteractionManager.ts#L362)

Escalations by reason

***

### pendingRequests

> **pendingRequests**: `number`

Defined in: [packages/agentos/src/orchestration/hitl/IHumanInteractionManager.ts:364](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/hitl/IHumanInteractionManager.ts#L364)

Pending requests

***

### timedOutRequests

> **timedOutRequests**: `number`

Defined in: [packages/agentos/src/orchestration/hitl/IHumanInteractionManager.ts:366](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/hitl/IHumanInteractionManager.ts#L366)

Timed out requests

***

### totalApprovalRequests

> **totalApprovalRequests**: `number`

Defined in: [packages/agentos/src/orchestration/hitl/IHumanInteractionManager.ts:352](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/hitl/IHumanInteractionManager.ts#L352)

Total approval requests

***

### totalClarifications

> **totalClarifications**: `number`

Defined in: [packages/agentos/src/orchestration/hitl/IHumanInteractionManager.ts:356](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/hitl/IHumanInteractionManager.ts#L356)

Total clarifications requested

***

### totalEscalations

> **totalEscalations**: `number`

Defined in: [packages/agentos/src/orchestration/hitl/IHumanInteractionManager.ts:360](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/hitl/IHumanInteractionManager.ts#L360)

Total escalations
