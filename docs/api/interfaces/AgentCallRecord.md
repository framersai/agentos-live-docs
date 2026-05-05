# Interface: AgentCallRecord

Defined in: [packages/agentos/src/api/types.ts:700](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/types.ts#L700)

A complete record of a single agent invocation within an agency run.
Appended to `GenerateTextResult.agentCalls` and surfaced in `ApprovalRequest.context`.

## Properties

### agent

> **agent**: `string`

Defined in: [packages/agentos/src/api/types.ts:702](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/types.ts#L702)

Name of the agent that was invoked.

***

### durationMs

> **durationMs**: `number`

Defined in: [packages/agentos/src/api/types.ts:746](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/types.ts#L746)

Wall-clock milliseconds for this agent call.

***

### emergent?

> `optional` **emergent**: `boolean`

Defined in: [packages/agentos/src/api/types.ts:748](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/types.ts#L748)

Whether this agent was synthesised at runtime by the emergent subsystem.

***

### guardrailResults?

> `optional` **guardrailResults**: `object`[]

Defined in: [packages/agentos/src/api/types.ts:719](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/types.ts#L719)

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

Defined in: [packages/agentos/src/api/types.ts:704](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/types.ts#L704)

Input prompt or message sent to the agent.

***

### output

> **output**: `string`

Defined in: [packages/agentos/src/api/types.ts:706](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/types.ts#L706)

Final text output produced by the agent.

***

### toolCalls

> **toolCalls**: `object`[]

Defined in: [packages/agentos/src/api/types.ts:708](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/types.ts#L708)

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

Defined in: [packages/agentos/src/api/types.ts:728](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/types.ts#L728)

Token usage for this individual agent call.

#### cacheCreationTokens?

> `optional` **cacheCreationTokens**: `number`

Tokens written as a new prompt-prefix cache entry for this call.
Undefined when the provider does not report cache usage.

#### cacheReadTokens?

> `optional` **cacheReadTokens**: `number`

Tokens served from the provider's prompt-prefix cache for this call.
Undefined when the provider does not report cache usage.

#### completionTokens

> **completionTokens**: `number`

#### costUSD?

> `optional` **costUSD**: `number`

Cost in USD for this call, when available.

#### promptTokens

> **promptTokens**: `number`

#### totalTokens

> **totalTokens**: `number`
