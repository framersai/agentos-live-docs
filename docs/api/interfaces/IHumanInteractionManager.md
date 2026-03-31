# Interface: IHumanInteractionManager

Defined in: [packages/agentos/src/orchestration/hitl/IHumanInteractionManager.ts:413](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/hitl/IHumanInteractionManager.ts#L413)

Interface for the AgentOS Human-in-the-Loop Manager.

The HITL Manager enables structured collaboration between AI agents
and human operators, ensuring human oversight for critical decisions
while maintaining efficient autonomous operation.

Key capabilities:
- **Approval Requests**: Seek human approval for high-risk actions
- **Clarification**: Ask humans to resolve ambiguity
- **Output Review**: Have humans review and edit agent outputs
- **Escalation**: Transfer control when agents are uncertain
- **Checkpoints**: Regular human review of ongoing work
- **Feedback Loop**: Learn from human corrections

## Example

```typescript
const hitl = new HumanInteractionManager({
  notificationHandler: async (req) => {
    // Send to UI/Slack/email
    await notifyHuman(req);
  },
  defaultTimeoutMs: 300000, // 5 minutes
});

// Register response handler
hitl.onApprovalResponse((decision) => {
  console.log(`Action ${decision.actionId}: ${decision.approved ? 'Approved' : 'Rejected'}`);
});

// Request approval
const decision = await hitl.requestApproval({
  actionId: 'send-mass-email',
  description: 'Send promotional email to 10,000 subscribers',
  severity: 'high',
  context: { recipientCount: 10000, template: 'promo-q4' },
  reversible: false,
});
```

## Methods

### cancelRequest()

> **cancelRequest**(`requestId`, `reason`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/orchestration/hitl/IHumanInteractionManager.ts:574](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/hitl/IHumanInteractionManager.ts#L574)

Cancels a pending request.

#### Parameters

##### requestId

`string`

Request identifier

##### reason

`string`

Cancellation reason

#### Returns

`Promise`\<`void`\>

***

### checkpoint()

> **checkpoint**(`checkpoint`): `Promise`\<[`CheckpointDecision`](CheckpointDecision.md)\>

Defined in: [packages/agentos/src/orchestration/hitl/IHumanInteractionManager.ts:515](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/hitl/IHumanInteractionManager.ts#L515)

Creates a checkpoint for human review during long-running tasks.

#### Parameters

##### checkpoint

[`WorkflowCheckpoint`](WorkflowCheckpoint.md)

The checkpoint state

#### Returns

`Promise`\<[`CheckpointDecision`](CheckpointDecision.md)\>

Human's checkpoint decision

***

### escalate()

> **escalate**(`context`): `Promise`\<[`EscalationDecision`](../type-aliases/EscalationDecision.md)\>

Defined in: [packages/agentos/src/orchestration/hitl/IHumanInteractionManager.ts:495](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/hitl/IHumanInteractionManager.ts#L495)

Escalates a situation to human control.

#### Parameters

##### context

[`EscalationContext`](EscalationContext.md)

Escalation context

#### Returns

`Promise`\<[`EscalationDecision`](../type-aliases/EscalationDecision.md)\>

Human's decision on how to proceed

***

### getFeedbackHistory()

> **getFeedbackHistory**(`agentId`, `options?`): `Promise`\<[`HumanFeedback`](HumanFeedback.md)[]\>

Defined in: [packages/agentos/src/orchestration/hitl/IHumanInteractionManager.ts:542](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/hitl/IHumanInteractionManager.ts#L542)

Gets feedback history for an agent.

#### Parameters

##### agentId

`string`

Agent identifier

##### options?

Query options

###### limit?

`number`

###### since?

`Date`

###### type?

`"preference"` \| `"correction"` \| `"praise"` \| `"guidance"` \| `"complaint"`

#### Returns

`Promise`\<[`HumanFeedback`](HumanFeedback.md)[]\>

Feedback history

***

### getPendingRequests()

> **getPendingRequests**(): `Promise`\<\{ `approvals`: [`PendingAction`](PendingAction.md)[]; `checkpoints`: [`WorkflowCheckpoint`](WorkflowCheckpoint.md)[]; `clarifications`: [`ClarificationRequest`](ClarificationRequest.md)[]; `edits`: [`DraftOutput`](DraftOutput.md)[]; `escalations`: [`EscalationContext`](EscalationContext.md)[]; \}\>

Defined in: [packages/agentos/src/orchestration/hitl/IHumanInteractionManager.ts:560](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/hitl/IHumanInteractionManager.ts#L560)

Gets all pending requests awaiting human response.

#### Returns

`Promise`\<\{ `approvals`: [`PendingAction`](PendingAction.md)[]; `checkpoints`: [`WorkflowCheckpoint`](WorkflowCheckpoint.md)[]; `clarifications`: [`ClarificationRequest`](ClarificationRequest.md)[]; `edits`: [`DraftOutput`](DraftOutput.md)[]; `escalations`: [`EscalationContext`](EscalationContext.md)[]; \}\>

Pending requests by type

***

### getStatistics()

> **getStatistics**(): [`HITLStatistics`](HITLStatistics.md)

Defined in: [packages/agentos/src/orchestration/hitl/IHumanInteractionManager.ts:585](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/hitl/IHumanInteractionManager.ts#L585)

Gets HITL interaction statistics.

#### Returns

[`HITLStatistics`](HITLStatistics.md)

Current statistics

***

### recordFeedback()

> **recordFeedback**(`feedback`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/orchestration/hitl/IHumanInteractionManager.ts:533](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/hitl/IHumanInteractionManager.ts#L533)

Records human feedback for agent improvement.

#### Parameters

##### feedback

[`HumanFeedback`](HumanFeedback.md)

The feedback to record

#### Returns

`Promise`\<`void`\>

***

### requestApproval()

> **requestApproval**(`action`): `Promise`\<`ApprovalDecision`\>

Defined in: [packages/agentos/src/orchestration/hitl/IHumanInteractionManager.ts:438](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/hitl/IHumanInteractionManager.ts#L438)

Requests human approval before executing an action.

#### Parameters

##### action

[`PendingAction`](PendingAction.md)

The action requiring approval

#### Returns

`Promise`\<`ApprovalDecision`\>

Human's approval decision

#### Example

```typescript
const decision = await hitl.requestApproval({
  actionId: 'delete-records',
  description: 'Delete inactive user accounts older than 2 years',
  severity: 'high',
  category: 'data_modification',
  agentId: 'cleanup-agent',
  context: { accountCount: 5000, criteria: 'inactive > 2y' },
  reversible: false,
  potentialConsequences: ['Data loss', 'User complaints'],
});
```

***

### requestClarification()

> **requestClarification**(`request`): `Promise`\<[`ClarificationResponse`](ClarificationResponse.md)\>

Defined in: [packages/agentos/src/orchestration/hitl/IHumanInteractionManager.ts:457](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/hitl/IHumanInteractionManager.ts#L457)

Requests clarification from a human for ambiguous situations.

#### Parameters

##### request

[`ClarificationRequest`](ClarificationRequest.md)

The clarification request

#### Returns

`Promise`\<[`ClarificationResponse`](ClarificationResponse.md)\>

Human's clarification response

***

### requestEdit()

> **requestEdit**(`draft`): `Promise`\<[`EditedOutput`](EditedOutput.md)\>

Defined in: [packages/agentos/src/orchestration/hitl/IHumanInteractionManager.ts:476](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/hitl/IHumanInteractionManager.ts#L476)

Requests human review and potential editing of agent output.

#### Parameters

##### draft

[`DraftOutput`](DraftOutput.md)

The draft output to review

#### Returns

`Promise`\<[`EditedOutput`](EditedOutput.md)\>

Edited output (may be unchanged)

***

### setNotificationHandler()

> **setNotificationHandler**(`handler`): `void`

Defined in: [packages/agentos/src/orchestration/hitl/IHumanInteractionManager.ts:592](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/hitl/IHumanInteractionManager.ts#L592)

Sets the notification handler for outgoing requests.

#### Parameters

##### handler

[`HITLNotificationHandler`](../type-aliases/HITLNotificationHandler.md)

Handler function

#### Returns

`void`

***

### submitApprovalDecision()

> **submitApprovalDecision**(`decision`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/orchestration/hitl/IHumanInteractionManager.ts:445](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/hitl/IHumanInteractionManager.ts#L445)

Submits an approval decision (typically called by UI/webhook handler).

#### Parameters

##### decision

`ApprovalDecision`

The approval decision

#### Returns

`Promise`\<`void`\>

***

### submitCheckpointDecision()

> **submitCheckpointDecision**(`decision`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/orchestration/hitl/IHumanInteractionManager.ts:522](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/hitl/IHumanInteractionManager.ts#L522)

Submits a checkpoint decision.

#### Parameters

##### decision

[`CheckpointDecision`](CheckpointDecision.md)

The checkpoint decision

#### Returns

`Promise`\<`void`\>

***

### submitClarification()

> **submitClarification**(`response`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/orchestration/hitl/IHumanInteractionManager.ts:464](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/hitl/IHumanInteractionManager.ts#L464)

Submits a clarification response.

#### Parameters

##### response

[`ClarificationResponse`](ClarificationResponse.md)

The clarification response

#### Returns

`Promise`\<`void`\>

***

### submitEdit()

> **submitEdit**(`edited`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/orchestration/hitl/IHumanInteractionManager.ts:483](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/hitl/IHumanInteractionManager.ts#L483)

Submits an edited output.

#### Parameters

##### edited

[`EditedOutput`](EditedOutput.md)

The edited output

#### Returns

`Promise`\<`void`\>

***

### submitEscalationDecision()

> **submitEscalationDecision**(`escalationId`, `decision`): `Promise`\<`void`\>

Defined in: [packages/agentos/src/orchestration/hitl/IHumanInteractionManager.ts:503](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/hitl/IHumanInteractionManager.ts#L503)

Submits an escalation decision.

#### Parameters

##### escalationId

`string`

The escalation identifier

##### decision

[`EscalationDecision`](../type-aliases/EscalationDecision.md)

The human's decision

#### Returns

`Promise`\<`void`\>
