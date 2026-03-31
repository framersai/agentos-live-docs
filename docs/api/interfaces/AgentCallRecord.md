# Interface: AgentCallRecord

Defined in: [packages/agentos/src/api/types.ts:452](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/types.ts#L452)

A complete record of a single agent invocation within an agency run.
Appended to `GenerateTextResult.agentCalls` and surfaced in `ApprovalRequest.context`.

## Properties

### agent

> **agent**: `string`

Defined in: [packages/agentos/src/api/types.ts:454](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/types.ts#L454)

Name of the agent that was invoked.

***

### durationMs

> **durationMs**: `number`

Defined in: [packages/agentos/src/api/types.ts:488](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/types.ts#L488)

Wall-clock milliseconds for this agent call.

***

### emergent?

> `optional` **emergent**: `boolean`

Defined in: [packages/agentos/src/api/types.ts:490](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/types.ts#L490)

Whether this agent was synthesised at runtime by the emergent subsystem.

***

### guardrailResults?

> `optional` **guardrailResults**: `object`[]

Defined in: [packages/agentos/src/api/types.ts:471](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/types.ts#L471)

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

Defined in: [packages/agentos/src/api/types.ts:456](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/types.ts#L456)

Input prompt or message sent to the agent.

***

### output

> **output**: `string`

Defined in: [packages/agentos/src/api/types.ts:458](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/types.ts#L458)

Final text output produced by the agent.

***

### toolCalls

> **toolCalls**: `object`[]

Defined in: [packages/agentos/src/api/types.ts:460](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/types.ts#L460)

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

Defined in: [packages/agentos/src/api/types.ts:480](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/types.ts#L480)

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
