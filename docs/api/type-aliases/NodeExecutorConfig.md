# Type Alias: NodeExecutorConfig

> **NodeExecutorConfig** = \{ `instructions`: `string`; `maxInternalIterations?`: `number`; `maxTokens?`: `number`; `parallelTools?`: `boolean`; `temperature?`: `number`; `type`: `"gmi"`; \} \| \{ `args?`: `Record`\<`string`, `unknown`\>; `toolName`: `string`; `type`: `"tool"`; \} \| \{ `extensionId`: `string`; `method`: `string`; `type`: `"extension"`; \} \| \{ `autoAccept?`: `boolean`; `autoReject?`: `boolean` \| `string`; `guardrailOverride?`: `boolean`; `judge?`: \{ `confidenceThreshold?`: `number`; `criteria?`: `string`; `model?`: `string`; `provider?`: `string`; \}; `onTimeout?`: `"accept"` \| `"reject"` \| `"error"`; `prompt`: `string`; `type`: `"human"`; \} \| \{ `guardrailIds`: `string`[]; `onViolation`: `"block"` \| `"reroute"` \| `"warn"` \| `"sanitize"`; `rerouteTarget?`: `string`; `type`: `"guardrail"`; \} \| \{ `condition`: [`GraphCondition`](GraphCondition.md); `type`: `"router"`; \} \| \{ `graphId`: `string`; `inputMapping?`: `Record`\<`string`, `string`\>; `outputMapping?`: `Record`\<`string`, `string`\>; `type`: `"subgraph"`; \} \| \{ `type`: `"voice"`; `voiceConfig`: [`VoiceNodeConfig`](../interfaces/VoiceNodeConfig.md); \}

Defined in: [packages/agentos/src/orchestration/ir/types.ts:162](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/orchestration/ir/types.ts#L162)

Describes how the runtime should execute a `GraphNode`.  Each variant maps to a
distinct execution strategy.

- `gmi`        — General Model Invocation: call an LLM with system instructions.
- `tool`       — Invoke a registered `ITool` by name, optionally with static args.
- `extension`  — Call a method on a registered `IExtension`.
- `human`      — Suspend execution and surface a prompt to a human operator.
- `guardrail`  — Run one or more guardrail checks; route or block on violation.
- `router`     — Pure routing node; evaluates a `GraphCondition` and emits no output.
- `subgraph`   — Delegate to another `CompiledExecutionGraph` with optional field mapping.
- `voice`      — Run a voice pipeline session with configurable STT/TTS and turn management.

## Type Declaration

\{ `instructions`: `string`; `maxInternalIterations?`: `number`; `maxTokens?`: `number`; `parallelTools?`: `boolean`; `temperature?`: `number`; `type`: `"gmi"`; \}

### instructions

> **instructions**: `string`

System-level instructions injected before the user message.

### maxInternalIterations?

> `optional` **maxInternalIterations**: `number`

Maximum ReAct loop iterations when `executionMode` is `react_bounded`. Defaults to 10.

### maxTokens?

> `optional` **maxTokens**: `number`

Hard cap on output tokens for this node's completion.

### parallelTools?

> `optional` **parallelTools**: `boolean`

Whether to issue multiple tool calls in a single model turn.

### temperature?

> `optional` **temperature**: `number`

Sampling temperature forwarded to the LLM provider.

### type

> **type**: `"gmi"`

\{ `args?`: `Record`\<`string`, `unknown`\>; `toolName`: `string`; `type`: `"tool"`; \}

### args?

> `optional` **args**: `Record`\<`string`, `unknown`\>

Static arguments merged with runtime-provided arguments before invocation.

### toolName

> **toolName**: `string`

Registered tool name as it appears in the tool catalogue.

### type

> **type**: `"tool"`

\{ `extensionId`: `string`; `method`: `string`; `type`: `"extension"`; \}

### extensionId

> **extensionId**: `string`

Extension identifier as registered in the capability registry.

### method

> **method**: `string`

Name of the extension method to call.

### type

> **type**: `"extension"`

\{ `autoAccept?`: `boolean`; `autoReject?`: `boolean` \| `string`; `guardrailOverride?`: `boolean`; `judge?`: \{ `confidenceThreshold?`: `number`; `criteria?`: `string`; `model?`: `string`; `provider?`: `string`; \}; `onTimeout?`: `"accept"` \| `"reject"` \| `"error"`; `prompt`: `string`; `type`: `"human"`; \}

### autoAccept?

> `optional` **autoAccept**: `boolean`

When `true`, the node auto-accepts without waiting for human input. Useful for testing.

### autoReject?

> `optional` **autoReject**: `boolean` \| `string`

When `true` or a string, the node auto-rejects. A string value is used as the rejection reason.

### guardrailOverride?

> `optional` **guardrailOverride**: `boolean`

Run post-approval guardrails after an automated approval path
(`autoAccept`, `judge`, or timeout-accept). Defaults to `true`.

### judge?

> `optional` **judge**: `object`

Delegates the approval decision to an LLM judge instead of a human.
When the judge's confidence falls below `confidenceThreshold`, execution
falls through to the normal human interrupt.

#### judge.confidenceThreshold?

> `optional` **confidenceThreshold**: `number`

Confidence threshold (0–1). Below this, fall through to human interrupt. Defaults to `0.7`.

#### judge.criteria?

> `optional` **criteria**: `string`

Custom evaluation criteria/rubric.

#### judge.model?

> `optional` **model**: `string`

LLM model to use for the judge call. Defaults to `'gpt-4o-mini'`.

#### judge.provider?

> `optional` **provider**: `string`

LLM provider. Defaults to `'openai'`.

### onTimeout?

> `optional` **onTimeout**: `"accept"` \| `"reject"` \| `"error"`

Behaviour when the node's `timeout` expires.
- `'accept'` — auto-accept.
- `'reject'` — auto-reject.
- `'error'`  — throw a timeout error (default behaviour).

#### Default

```ts
'error'
```

### prompt

> **prompt**: `string`

Message displayed to the human operator while the graph is suspended.

### type

> **type**: `"human"`

\{ `guardrailIds`: `string`[]; `onViolation`: `"block"` \| `"reroute"` \| `"warn"` \| `"sanitize"`; `rerouteTarget?`: `string`; `type`: `"guardrail"`; \}

### guardrailIds

> **guardrailIds**: `string`[]

Ordered list of guardrail identifiers to evaluate.

### onViolation

> **onViolation**: `"block"` \| `"reroute"` \| `"warn"` \| `"sanitize"`

Action taken when any guardrail fires.

### rerouteTarget?

> `optional` **rerouteTarget**: `string`

Node id to route to when `onViolation` is `'reroute'`.

### type

> **type**: `"guardrail"`

\{ `condition`: [`GraphCondition`](GraphCondition.md); `type`: `"router"`; \}

### condition

> **condition**: [`GraphCondition`](GraphCondition.md)

Routing predicate; the returned node-id determines the next edge.

### type

> **type**: `"router"`

\{ `graphId`: `string`; `inputMapping?`: `Record`\<`string`, `string`\>; `outputMapping?`: `Record`\<`string`, `string`\>; `type`: `"subgraph"`; \}

### graphId

> **graphId**: `string`

Id of the `CompiledExecutionGraph` to delegate to.

### inputMapping?

> `optional` **inputMapping**: `Record`\<`string`, `string`\>

Maps parent `scratch` field paths → child `input` field paths.

### outputMapping?

> `optional` **outputMapping**: `Record`\<`string`, `string`\>

Maps child `artifacts` field paths → parent `scratch` field paths.

### type

> **type**: `"subgraph"`

\{ `type`: `"voice"`; `voiceConfig`: [`VoiceNodeConfig`](../interfaces/VoiceNodeConfig.md); \}

### type

> **type**: `"voice"`

### voiceConfig

> **voiceConfig**: [`VoiceNodeConfig`](../interfaces/VoiceNodeConfig.md)

Voice pipeline session configuration.
