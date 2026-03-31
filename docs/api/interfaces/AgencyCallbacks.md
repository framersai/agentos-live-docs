# Interface: AgencyCallbacks

Defined in: [packages/agentos/src/api/types.ts:576](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/types.ts#L576)

Event callbacks registered on `BaseAgentConfig.on`.
All handlers are fire-and-forget (return `void`); errors thrown inside them
are swallowed to prevent disrupting the main run.

## Properties

### agentEnd()?

> `optional` **agentEnd**: (`e`) => `void`

Defined in: [packages/agentos/src/api/types.ts:580](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/types.ts#L580)

Called after an agent produces its final output.

#### Parameters

##### e

`AgentEndEvent`

#### Returns

`void`

***

### agentStart()?

> `optional` **agentStart**: (`e`) => `void`

Defined in: [packages/agentos/src/api/types.ts:578](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/types.ts#L578)

Called immediately before an agent starts.

#### Parameters

##### e

`AgentStartEvent`

#### Returns

`void`

***

### approvalDecided()?

> `optional` **approvalDecided**: (`e`) => `void`

Defined in: [packages/agentos/src/api/types.ts:596](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/types.ts#L596)

Called after an approval decision is resolved.

#### Parameters

##### e

[`ApprovalDecision`](ApprovalDecision.md)

#### Returns

`void`

***

### approvalRequested()?

> `optional` **approvalRequested**: (`e`) => `void`

Defined in: [packages/agentos/src/api/types.ts:594](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/types.ts#L594)

Called when an approval request is raised.

#### Parameters

##### e

[`ApprovalRequest`](ApprovalRequest.md)

#### Returns

`void`

***

### emergentForge()?

> `optional` **emergentForge**: (`e`) => `void`

Defined in: [packages/agentos/src/api/types.ts:588](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/types.ts#L588)

Called when the emergent subsystem forges a new agent.

#### Parameters

##### e

`ForgeEvent`

#### Returns

`void`

***

### error()?

> `optional` **error**: (`e`) => `void`

Defined in: [packages/agentos/src/api/types.ts:586](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/types.ts#L586)

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

### guardrailResult()?

> `optional` **guardrailResult**: (`e`) => `void`

Defined in: [packages/agentos/src/api/types.ts:590](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/types.ts#L590)

Called after a guardrail evaluates an input or output.

#### Parameters

##### e

`GuardrailEvent`

#### Returns

`void`

***

### handoff()?

> `optional` **handoff**: (`e`) => `void`

Defined in: [packages/agentos/src/api/types.ts:582](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/types.ts#L582)

Called when control is handed off between agents.

#### Parameters

##### e

`HandoffEvent`

#### Returns

`void`

***

### limitReached()?

> `optional` **limitReached**: (`e`) => `void`

Defined in: [packages/agentos/src/api/types.ts:592](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/types.ts#L592)

Called when a resource limit is reached.

#### Parameters

##### e

`LimitEvent`

#### Returns

`void`

***

### toolCall()?

> `optional` **toolCall**: (`e`) => `void`

Defined in: [packages/agentos/src/api/types.ts:584](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/types.ts#L584)

Called when an agent invokes a tool.

#### Parameters

##### e

`ToolCallEvent`

#### Returns

`void`
