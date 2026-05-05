# Interface: AgencyCallbacks

Defined in: [packages/agentos/src/api/types.ts:887](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/types.ts#L887)

Event callbacks registered on `BaseAgentConfig.on`.
All handlers are fire-and-forget (return `void`); errors thrown inside them
are swallowed to prevent disrupting the main run.

## Properties

### agentEnd()?

> `optional` **agentEnd**: (`e`) => `void`

Defined in: [packages/agentos/src/api/types.ts:891](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/types.ts#L891)

Called after an agent produces its final output.

#### Parameters

##### e

`AgentEndEvent`

#### Returns

`void`

***

### agentStart()?

> `optional` **agentStart**: (`e`) => `void`

Defined in: [packages/agentos/src/api/types.ts:889](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/types.ts#L889)

Called immediately before an agent starts.

#### Parameters

##### e

`AgentStartEvent`

#### Returns

`void`

***

### approvalDecided()?

> `optional` **approvalDecided**: (`e`) => `void`

Defined in: [packages/agentos/src/api/types.ts:907](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/types.ts#L907)

Called after an approval decision is resolved.

#### Parameters

##### e

[`ApprovalDecision`](ApprovalDecision.md)

#### Returns

`void`

***

### approvalRequested()?

> `optional` **approvalRequested**: (`e`) => `void`

Defined in: [packages/agentos/src/api/types.ts:905](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/types.ts#L905)

Called when an approval request is raised.

#### Parameters

##### e

[`ApprovalRequest`](ApprovalRequest.md)

#### Returns

`void`

***

### emergentForge()?

> `optional` **emergentForge**: (`e`) => `void`

Defined in: [packages/agentos/src/api/types.ts:899](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/types.ts#L899)

Called when the emergent subsystem forges a new agent.

#### Parameters

##### e

`ForgeEvent`

#### Returns

`void`

***

### error()?

> `optional` **error**: (`e`) => `void`

Defined in: [packages/agentos/src/api/types.ts:897](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/types.ts#L897)

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

Defined in: [packages/agentos/src/api/types.ts:913](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/types.ts#L913)

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

Defined in: [packages/agentos/src/api/types.ts:901](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/types.ts#L901)

Called after a guardrail evaluates an input or output.

#### Parameters

##### e

`GuardrailEvent`

#### Returns

`void`

***

### handoff()?

> `optional` **handoff**: (`e`) => `void`

Defined in: [packages/agentos/src/api/types.ts:893](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/types.ts#L893)

Called when control is handed off between agents.

#### Parameters

##### e

`HandoffEvent`

#### Returns

`void`

***

### limitReached()?

> `optional` **limitReached**: (`e`) => `void`

Defined in: [packages/agentos/src/api/types.ts:903](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/types.ts#L903)

Called when a resource limit is reached.

#### Parameters

##### e

`LimitEvent`

#### Returns

`void`

***

### toolCall()?

> `optional` **toolCall**: (`e`) => `void`

Defined in: [packages/agentos/src/api/types.ts:895](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/types.ts#L895)

Called when an agent invokes a tool.

#### Parameters

##### e

`ToolCallEvent`

#### Returns

`void`
