# Interface: AgentCallRecord

Defined in: [packages/agentos/src/api/types.ts:419](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/types.ts#L419)

A complete record of a single agent invocation within an agency run.
Appended to `GenerateTextResult.agentCalls` and surfaced in `ApprovalRequest.context`.

## Properties

### agent

> **agent**: `string`

Defined in: [packages/agentos/src/api/types.ts:421](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/types.ts#L421)

Name of the agent that was invoked.

***

### durationMs

> **durationMs**: `number`

Defined in: [packages/agentos/src/api/types.ts:455](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/types.ts#L455)

Wall-clock milliseconds for this agent call.

***

### emergent?

> `optional` **emergent**: `boolean`

Defined in: [packages/agentos/src/api/types.ts:457](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/types.ts#L457)

Whether this agent was synthesised at runtime by the emergent subsystem.

***

### guardrailResults?

> `optional` **guardrailResults**: `object`[]

Defined in: [packages/agentos/src/api/types.ts:438](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/types.ts#L438)

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

Defined in: [packages/agentos/src/api/types.ts:423](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/types.ts#L423)

Input prompt or message sent to the agent.

***

### output

> **output**: `string`

Defined in: [packages/agentos/src/api/types.ts:425](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/types.ts#L425)

Final text output produced by the agent.

***

### toolCalls

> **toolCalls**: `object`[]

Defined in: [packages/agentos/src/api/types.ts:427](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/types.ts#L427)

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

Defined in: [packages/agentos/src/api/types.ts:447](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/types.ts#L447)

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
