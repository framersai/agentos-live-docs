# Class: HumanInteractionManager

Defined in: [packages/agentos/src/orchestration/hitl/HumanInteractionManager.ts:78](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/orchestration/hitl/HumanInteractionManager.ts#L78)

Implementation of the Human-in-the-Loop Manager.

Features:
- Approval requests with severity levels
- Clarification requests with options
- Output review and editing
- Escalation handling
- Workflow checkpoints
- Feedback collection for learning

## Implements

## Implements

- [`IHumanInteractionManager`](../interfaces/IHumanInteractionManager.md)

## Constructors

### Constructor

> **new HumanInteractionManager**(`config?`): `HumanInteractionManager`

Defined in: [packages/agentos/src/orchestration/hitl/HumanInteractionManager.ts:124](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/orchestration/hitl/HumanInteractionManager.ts#L124)

Creates a new HumanInteractionManager instance.

#### Parameters

##### config?

[`HumanInteractionManagerConfig`](../interfaces/HumanInteractionManagerConfig.md) = `{}`

Configuration options

#### Returns

`HumanInteractionManager`

## Methods

### cancelRequest()

> **cancelRequest**(`requestId`, `reason`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/orchestration/hitl/HumanInteractionManager.ts:556](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/orchestration/hitl/HumanInteractionManager.ts#L556)

Cancels a pending request.

#### Parameters

##### requestId

`string`

##### reason

`string`

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IHumanInteractionManager`](../interfaces/IHumanInteractionManager.md).[`cancelRequest`](../interfaces/IHumanInteractionManager.md#cancelrequest)

***

### checkpoint()

> **checkpoint**(`checkpoint`): `Promise`\<[`CheckpointDecision`](../interfaces/CheckpointDecision.md)\>

Defined in: [packages/agentos/src/orchestration/hitl/HumanInteractionManager.ts:435](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/orchestration/hitl/HumanInteractionManager.ts#L435)

Creates a checkpoint for human review.

#### Parameters

##### checkpoint

[`WorkflowCheckpoint`](../interfaces/WorkflowCheckpoint.md)

#### Returns

`Promise`\<[`CheckpointDecision`](../interfaces/CheckpointDecision.md)\>

#### Implementation of

[`IHumanInteractionManager`](../interfaces/IHumanInteractionManager.md).[`checkpoint`](../interfaces/IHumanInteractionManager.md#checkpoint)

***

### escalate()

> **escalate**(`context`): `Promise`\<[`EscalationDecision`](../type-aliases/EscalationDecision.md)\>

Defined in: [packages/agentos/src/orchestration/hitl/HumanInteractionManager.ts:373](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/orchestration/hitl/HumanInteractionManager.ts#L373)

Escalates a situation to human control.

#### Parameters

##### context

[`EscalationContext`](../interfaces/EscalationContext.md)

#### Returns

`Promise`\<[`EscalationDecision`](../type-aliases/EscalationDecision.md)\>

#### Implementation of

[`IHumanInteractionManager`](../interfaces/IHumanInteractionManager.md).[`escalate`](../interfaces/IHumanInteractionManager.md#escalate)

***

### getFeedbackHistory()

> **getFeedbackHistory**(`agentId`, `options?`): `Promise`\<[`HumanFeedback`](../interfaces/HumanFeedback.md)[]\>

Defined in: [packages/agentos/src/orchestration/hitl/HumanInteractionManager.ts:505](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/orchestration/hitl/HumanInteractionManager.ts#L505)

Gets feedback history for an agent.

#### Parameters

##### agentId

`string`

##### options?

###### limit?

`number`

###### since?

`Date`

###### type?

`"preference"` \| `"correction"` \| `"praise"` \| `"guidance"` \| `"complaint"`

#### Returns

`Promise`\<[`HumanFeedback`](../interfaces/HumanFeedback.md)[]\>

#### Implementation of

[`IHumanInteractionManager`](../interfaces/IHumanInteractionManager.md).[`getFeedbackHistory`](../interfaces/IHumanInteractionManager.md#getfeedbackhistory)

***

### getPendingRequests()

> **getPendingRequests**(): `Promise`\<\{ `approvals`: [`PendingAction`](../interfaces/PendingAction.md)[]; `checkpoints`: [`WorkflowCheckpoint`](../interfaces/WorkflowCheckpoint.md)[]; `clarifications`: [`ClarificationRequest`](../interfaces/ClarificationRequest.md)[]; `edits`: [`DraftOutput`](../interfaces/DraftOutput.md)[]; `escalations`: [`EscalationContext`](../interfaces/EscalationContext.md)[]; \}\>

Defined in: [packages/agentos/src/orchestration/hitl/HumanInteractionManager.ts:537](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/orchestration/hitl/HumanInteractionManager.ts#L537)

Gets all pending requests awaiting human response.

#### Returns

`Promise`\<\{ `approvals`: [`PendingAction`](../interfaces/PendingAction.md)[]; `checkpoints`: [`WorkflowCheckpoint`](../interfaces/WorkflowCheckpoint.md)[]; `clarifications`: [`ClarificationRequest`](../interfaces/ClarificationRequest.md)[]; `edits`: [`DraftOutput`](../interfaces/DraftOutput.md)[]; `escalations`: [`EscalationContext`](../interfaces/EscalationContext.md)[]; \}\>

#### Implementation of

[`IHumanInteractionManager`](../interfaces/IHumanInteractionManager.md).[`getPendingRequests`](../interfaces/IHumanInteractionManager.md#getpendingrequests)

***

### getStatistics()

> **getStatistics**(): [`HITLStatistics`](../interfaces/HITLStatistics.md)

Defined in: [packages/agentos/src/orchestration/hitl/HumanInteractionManager.ts:602](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/orchestration/hitl/HumanInteractionManager.ts#L602)

Gets HITL interaction statistics.

#### Returns

[`HITLStatistics`](../interfaces/HITLStatistics.md)

#### Implementation of

[`IHumanInteractionManager`](../interfaces/IHumanInteractionManager.md).[`getStatistics`](../interfaces/IHumanInteractionManager.md#getstatistics)

***

### recordFeedback()

> **recordFeedback**(`feedback`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/orchestration/hitl/HumanInteractionManager.ts:487](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/orchestration/hitl/HumanInteractionManager.ts#L487)

Records human feedback for agent improvement.

#### Parameters

##### feedback

[`HumanFeedback`](../interfaces/HumanFeedback.md)

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IHumanInteractionManager`](../interfaces/IHumanInteractionManager.md).[`recordFeedback`](../interfaces/IHumanInteractionManager.md#recordfeedback)

***

### requestApproval()

> **requestApproval**(`action`): `Promise`\<`ApprovalDecision`\>

Defined in: [packages/agentos/src/orchestration/hitl/HumanInteractionManager.ts:141](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/orchestration/hitl/HumanInteractionManager.ts#L141)

Requests human approval before executing an action.

#### Parameters

##### action

[`PendingAction`](../interfaces/PendingAction.md)

#### Returns

`Promise`\<`ApprovalDecision`\>

#### Implementation of

[`IHumanInteractionManager`](../interfaces/IHumanInteractionManager.md).[`requestApproval`](../interfaces/IHumanInteractionManager.md#requestapproval)

***

### requestClarification()

> **requestClarification**(`request`): `Promise`\<[`ClarificationResponse`](../interfaces/ClarificationResponse.md)\>

Defined in: [packages/agentos/src/orchestration/hitl/HumanInteractionManager.ts:232](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/orchestration/hitl/HumanInteractionManager.ts#L232)

Requests clarification from a human.

#### Parameters

##### request

[`ClarificationRequest`](../interfaces/ClarificationRequest.md)

#### Returns

`Promise`\<[`ClarificationResponse`](../interfaces/ClarificationResponse.md)\>

#### Implementation of

[`IHumanInteractionManager`](../interfaces/IHumanInteractionManager.md).[`requestClarification`](../interfaces/IHumanInteractionManager.md#requestclarification)

***

### requestEdit()

> **requestEdit**(`draft`): `Promise`\<[`EditedOutput`](../interfaces/EditedOutput.md)\>

Defined in: [packages/agentos/src/orchestration/hitl/HumanInteractionManager.ts:298](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/orchestration/hitl/HumanInteractionManager.ts#L298)

Requests human review and potential editing of agent output.

#### Parameters

##### draft

[`DraftOutput`](../interfaces/DraftOutput.md)

#### Returns

`Promise`\<[`EditedOutput`](../interfaces/EditedOutput.md)\>

#### Implementation of

[`IHumanInteractionManager`](../interfaces/IHumanInteractionManager.md).[`requestEdit`](../interfaces/IHumanInteractionManager.md#requestedit)

***

### setNotificationHandler()

> **setNotificationHandler**(`handler`): `void`

Defined in: [packages/agentos/src/orchestration/hitl/HumanInteractionManager.ts:609](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/orchestration/hitl/HumanInteractionManager.ts#L609)

Sets the notification handler.

#### Parameters

##### handler

[`HITLNotificationHandler`](../type-aliases/HITLNotificationHandler.md)

#### Returns

`void`

#### Implementation of

[`IHumanInteractionManager`](../interfaces/IHumanInteractionManager.md).[`setNotificationHandler`](../interfaces/IHumanInteractionManager.md#setnotificationhandler)

***

### submitApprovalDecision()

> **submitApprovalDecision**(`decision`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/orchestration/hitl/HumanInteractionManager.ts:196](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/orchestration/hitl/HumanInteractionManager.ts#L196)

Submits an approval decision.

#### Parameters

##### decision

`ApprovalDecision`

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IHumanInteractionManager`](../interfaces/IHumanInteractionManager.md).[`submitApprovalDecision`](../interfaces/IHumanInteractionManager.md#submitapprovaldecision)

***

### submitCheckpointDecision()

> **submitCheckpointDecision**(`decision`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/orchestration/hitl/HumanInteractionManager.ts:466](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/orchestration/hitl/HumanInteractionManager.ts#L466)

Submits a checkpoint decision.

#### Parameters

##### decision

[`CheckpointDecision`](../interfaces/CheckpointDecision.md)

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IHumanInteractionManager`](../interfaces/IHumanInteractionManager.md).[`submitCheckpointDecision`](../interfaces/IHumanInteractionManager.md#submitcheckpointdecision)

***

### submitClarification()

> **submitClarification**(`response`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/orchestration/hitl/HumanInteractionManager.ts:273](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/orchestration/hitl/HumanInteractionManager.ts#L273)

Submits a clarification response.

#### Parameters

##### response

[`ClarificationResponse`](../interfaces/ClarificationResponse.md)

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IHumanInteractionManager`](../interfaces/IHumanInteractionManager.md).[`submitClarification`](../interfaces/IHumanInteractionManager.md#submitclarification)

***

### submitEdit()

> **submitEdit**(`edited`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/orchestration/hitl/HumanInteractionManager.ts:348](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/orchestration/hitl/HumanInteractionManager.ts#L348)

Submits an edited output.

#### Parameters

##### edited

[`EditedOutput`](../interfaces/EditedOutput.md)

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IHumanInteractionManager`](../interfaces/IHumanInteractionManager.md).[`submitEdit`](../interfaces/IHumanInteractionManager.md#submitedit)

***

### submitEscalationDecision()

> **submitEscalationDecision**(`escalationId`, `decision`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/orchestration/hitl/HumanInteractionManager.ts:409](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/orchestration/hitl/HumanInteractionManager.ts#L409)

Submits an escalation decision.

#### Parameters

##### escalationId

`string`

##### decision

[`EscalationDecision`](../type-aliases/EscalationDecision.md)

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IHumanInteractionManager`](../interfaces/IHumanInteractionManager.md).[`submitEscalationDecision`](../interfaces/IHumanInteractionManager.md#submitescalationdecision)
