# Interface: AgencyCallbacks

Defined in: [packages/agentos/src/api/types.ts:821](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/types.ts#L821)

Event callbacks registered on `BaseAgentConfig.on`.
All handlers are fire-and-forget (return `void`); errors thrown inside them
are swallowed to prevent disrupting the main run.

## Properties

### agentEnd()?

> `optional` **agentEnd**: (`e`) => `void`

Defined in: [packages/agentos/src/api/types.ts:825](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/types.ts#L825)

Called after an agent produces its final output.

#### Parameters

##### e

`AgentEndEvent`

#### Returns

`void`

***

### agentStart()?

> `optional` **agentStart**: (`e`) => `void`

Defined in: [packages/agentos/src/api/types.ts:823](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/types.ts#L823)

Called immediately before an agent starts.

#### Parameters

##### e

`AgentStartEvent`

#### Returns

`void`

***

### approvalDecided()?

> `optional` **approvalDecided**: (`e`) => `void`

Defined in: [packages/agentos/src/api/types.ts:841](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/types.ts#L841)

Called after an approval decision is resolved.

#### Parameters

##### e

[`ApprovalDecision`](ApprovalDecision.md)

#### Returns

`void`

***

### approvalRequested()?

> `optional` **approvalRequested**: (`e`) => `void`

Defined in: [packages/agentos/src/api/types.ts:839](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/types.ts#L839)

Called when an approval request is raised.

#### Parameters

##### e

[`ApprovalRequest`](ApprovalRequest.md)

#### Returns

`void`

***

### emergentForge()?

> `optional` **emergentForge**: (`e`) => `void`

Defined in: [packages/agentos/src/api/types.ts:833](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/types.ts#L833)

Called when the emergent subsystem forges a new agent.

#### Parameters

##### e

`ForgeEvent`

#### Returns

`void`

***

### error()?

> `optional` **error**: (`e`) => `void`

Defined in: [packages/agentos/src/api/types.ts:831](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/types.ts#L831)

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

Defined in: [packages/agentos/src/api/types.ts:847](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/types.ts#L847)

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

Defined in: [packages/agentos/src/api/types.ts:835](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/types.ts#L835)

Called after a guardrail evaluates an input or output.

#### Parameters

##### e

`GuardrailEvent`

#### Returns

`void`

***

### handoff()?

> `optional` **handoff**: (`e`) => `void`

Defined in: [packages/agentos/src/api/types.ts:827](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/types.ts#L827)

Called when control is handed off between agents.

#### Parameters

##### e

`HandoffEvent`

#### Returns

`void`

***

### limitReached()?

> `optional` **limitReached**: (`e`) => `void`

Defined in: [packages/agentos/src/api/types.ts:837](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/types.ts#L837)

Called when a resource limit is reached.

#### Parameters

##### e

`LimitEvent`

#### Returns

`void`

***

### toolCall()?

> `optional` **toolCall**: (`e`) => `void`

Defined in: [packages/agentos/src/api/types.ts:829](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/types.ts#L829)

Called when an agent invokes a tool.

#### Parameters

##### e

`ToolCallEvent`

#### Returns

`void`
