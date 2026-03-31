# Interface: AgencyCallbacks

Defined in: [packages/agentos/src/api/types.ts:629](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/types.ts#L629)

Event callbacks registered on `BaseAgentConfig.on`.
All handlers are fire-and-forget (return `void`); errors thrown inside them
are swallowed to prevent disrupting the main run.

## Properties

### agentEnd()?

> `optional` **agentEnd**: (`e`) => `void`

Defined in: [packages/agentos/src/api/types.ts:633](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/types.ts#L633)

Called after an agent produces its final output.

#### Parameters

##### e

`AgentEndEvent`

#### Returns

`void`

***

### agentStart()?

> `optional` **agentStart**: (`e`) => `void`

Defined in: [packages/agentos/src/api/types.ts:631](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/types.ts#L631)

Called immediately before an agent starts.

#### Parameters

##### e

`AgentStartEvent`

#### Returns

`void`

***

### approvalDecided()?

> `optional` **approvalDecided**: (`e`) => `void`

Defined in: [packages/agentos/src/api/types.ts:649](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/types.ts#L649)

Called after an approval decision is resolved.

#### Parameters

##### e

[`ApprovalDecision`](ApprovalDecision.md)

#### Returns

`void`

***

### approvalRequested()?

> `optional` **approvalRequested**: (`e`) => `void`

Defined in: [packages/agentos/src/api/types.ts:647](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/types.ts#L647)

Called when an approval request is raised.

#### Parameters

##### e

[`ApprovalRequest`](ApprovalRequest.md)

#### Returns

`void`

***

### emergentForge()?

> `optional` **emergentForge**: (`e`) => `void`

Defined in: [packages/agentos/src/api/types.ts:641](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/types.ts#L641)

Called when the emergent subsystem forges a new agent.

#### Parameters

##### e

`ForgeEvent`

#### Returns

`void`

***

### error()?

> `optional` **error**: (`e`) => `void`

Defined in: [packages/agentos/src/api/types.ts:639](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/types.ts#L639)

Called when an unhandled error occurs inside an agent.

#### Parameters

##### e

###### agent

`string`

###### error

`Error`

###### timestamp

`number`

#### Returns

`void`

***

### guardrailHitlOverride()?

> `optional` **guardrailHitlOverride**: (`e`) => `void`

Defined in: [packages/agentos/src/api/types.ts:655](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/types.ts#L655)

Called when a post-approval guardrail overrides an HITL approval.
Fires after a tool call was approved but a guardrail detected a
destructive pattern and vetoed the execution.

#### Parameters

##### e

`GuardrailHitlOverrideEvent`

#### Returns

`void`

***

### guardrailResult()?

> `optional` **guardrailResult**: (`e`) => `void`

Defined in: [packages/agentos/src/api/types.ts:643](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/types.ts#L643)

Called after a guardrail evaluates an input or output.

#### Parameters

##### e

`GuardrailEvent`

#### Returns

`void`

***

### handoff()?

> `optional` **handoff**: (`e`) => `void`

Defined in: [packages/agentos/src/api/types.ts:635](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/types.ts#L635)

Called when control is handed off between agents.

#### Parameters

##### e

`HandoffEvent`

#### Returns

`void`

***

### limitReached()?

> `optional` **limitReached**: (`e`) => `void`

Defined in: [packages/agentos/src/api/types.ts:645](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/types.ts#L645)

Called when a resource limit is reached.

#### Parameters

##### e

`LimitEvent`

#### Returns

`void`

***

### toolCall()?

> `optional` **toolCall**: (`e`) => `void`

Defined in: [packages/agentos/src/api/types.ts:637](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/types.ts#L637)

Called when an agent invokes a tool.

#### Parameters

##### e

`ToolCallEvent`

#### Returns

`void`
