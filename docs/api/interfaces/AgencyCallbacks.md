# Interface: AgencyCallbacks

Defined in: [packages/agentos/src/api/types.ts:899](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/types.ts#L899)

Event callbacks registered on `BaseAgentConfig.on`.
All handlers are fire-and-forget (return `void`); errors thrown inside them
are swallowed to prevent disrupting the main run.

## Properties

### agentEnd()?

> `optional` **agentEnd**: (`e`) => `void`

Defined in: [packages/agentos/src/api/types.ts:903](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/types.ts#L903)

Called after an agent produces its final output.

#### Parameters

##### e

`AgentEndEvent`

#### Returns

`void`

***

### agentStart()?

> `optional` **agentStart**: (`e`) => `void`

Defined in: [packages/agentos/src/api/types.ts:901](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/types.ts#L901)

Called immediately before an agent starts.

#### Parameters

##### e

`AgentStartEvent`

#### Returns

`void`

***

### approvalDecided()?

> `optional` **approvalDecided**: (`e`) => `void`

Defined in: [packages/agentos/src/api/types.ts:919](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/types.ts#L919)

Called after an approval decision is resolved.

#### Parameters

##### e

[`ApprovalDecision`](ApprovalDecision.md)

#### Returns

`void`

***

### approvalRequested()?

> `optional` **approvalRequested**: (`e`) => `void`

Defined in: [packages/agentos/src/api/types.ts:917](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/types.ts#L917)

Called when an approval request is raised.

#### Parameters

##### e

[`ApprovalRequest`](ApprovalRequest.md)

#### Returns

`void`

***

### emergentForge()?

> `optional` **emergentForge**: (`e`) => `void`

Defined in: [packages/agentos/src/api/types.ts:911](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/types.ts#L911)

Called when the emergent subsystem forges a new agent.

#### Parameters

##### e

`ForgeEvent`

#### Returns

`void`

***

### error()?

> `optional` **error**: (`e`) => `void`

Defined in: [packages/agentos/src/api/types.ts:909](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/types.ts#L909)

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

Defined in: [packages/agentos/src/api/types.ts:925](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/types.ts#L925)

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

Defined in: [packages/agentos/src/api/types.ts:913](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/types.ts#L913)

Called after a guardrail evaluates an input or output.

#### Parameters

##### e

`GuardrailEvent`

#### Returns

`void`

***

### handoff()?

> `optional` **handoff**: (`e`) => `void`

Defined in: [packages/agentos/src/api/types.ts:905](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/types.ts#L905)

Called when control is handed off between agents.

#### Parameters

##### e

`HandoffEvent`

#### Returns

`void`

***

### limitReached()?

> `optional` **limitReached**: (`e`) => `void`

Defined in: [packages/agentos/src/api/types.ts:915](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/types.ts#L915)

Called when a resource limit is reached.

#### Parameters

##### e

`LimitEvent`

#### Returns

`void`

***

### toolCall()?

> `optional` **toolCall**: (`e`) => `void`

Defined in: [packages/agentos/src/api/types.ts:907](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/types.ts#L907)

Called when an agent invokes a tool.

#### Parameters

##### e

`ToolCallEvent`

#### Returns

`void`
