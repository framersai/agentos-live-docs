# Interface: AgentCallRecord

Defined in: [packages/agentos/src/api/types.ts:644](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/types.ts#L644)

A complete record of a single agent invocation within an agency run.
Appended to `GenerateTextResult.agentCalls` and surfaced in `ApprovalRequest.context`.

## Properties

### agent

> **agent**: `string`

Defined in: [packages/agentos/src/api/types.ts:646](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/types.ts#L646)

Name of the agent that was invoked.

***

### durationMs

> **durationMs**: `number`

Defined in: [packages/agentos/src/api/types.ts:680](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/types.ts#L680)

Wall-clock milliseconds for this agent call.

***

### emergent?

> `optional` **emergent**: `boolean`

Defined in: [packages/agentos/src/api/types.ts:682](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/types.ts#L682)

Whether this agent was synthesised at runtime by the emergent subsystem.

***

### guardrailResults?

> `optional` **guardrailResults**: `object`[]

Defined in: [packages/agentos/src/api/types.ts:663](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/types.ts#L663)

Guardrail evaluation results for this agent call.

#### action

> **action**: `string`

Action taken by the guardrail (e.g. `"allow"`, `"block"`, `"redact"`).

#### id

> **id**: `string`

Guardrail identifier.

#### passed

> **passed**: `boolean`

Whether the guardrail check passed.

***

### input

> **input**: `string`

Defined in: [packages/agentos/src/api/types.ts:648](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/types.ts#L648)

Input prompt or message sent to the agent.

***

### output

> **output**: `string`

Defined in: [packages/agentos/src/api/types.ts:650](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/types.ts#L650)

Final text output produced by the agent.

***

### toolCalls

> **toolCalls**: `object`[]

Defined in: [packages/agentos/src/api/types.ts:652](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/types.ts#L652)

Ordered list of tool invocations made during this call.

#### args

> **args**: `unknown`

Arguments supplied by the model.

#### error?

> `optional` **error**: `string`

Error message if the tool failed.

#### name

> **name**: `string`

Tool name.

#### result?

> `optional` **result**: `unknown`

Return value from the tool (present on success).

***

### usage

> **usage**: `object`

Defined in: [packages/agentos/src/api/types.ts:672](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/types.ts#L672)

Token usage for this individual agent call.

#### completionTokens

> **completionTokens**: `number`

#### costUSD?

> `optional` **costUSD**: `number`

Cost in USD for this call, when available.

#### promptTokens

> **promptTokens**: `number`

#### totalTokens

> **totalTokens**: `number`
