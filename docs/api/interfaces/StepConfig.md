# Interface: StepConfig

Defined in: [packages/agentos/src/orchestration/builders/WorkflowBuilder.ts:64](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/builders/WorkflowBuilder.ts#L64)

Configuration for a single workflow step node.

Exactly one of `tool`, `gmi`, `human`, `extension`, or `subgraph` must be provided
to specify the execution strategy.  All remaining fields are optional policies.

## Properties

### discovery?

> `optional` **discovery**: [`DiscoveryPolicy`](DiscoveryPolicy.md)

Defined in: [packages/agentos/src/orchestration/builders/WorkflowBuilder.ts:87](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/builders/WorkflowBuilder.ts#L87)

Capability discovery policy applied before execution.

***

### effectClass?

> `optional` **effectClass**: `"external"` \| `"human"` \| `"pure"` \| `"read"` \| `"write"`

Defined in: [packages/agentos/src/orchestration/builders/WorkflowBuilder.ts:103](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/builders/WorkflowBuilder.ts#L103)

Side-effect classification used by the runtime for scheduling decisions.

***

### extension?

> `optional` **extension**: `object`

Defined in: [packages/agentos/src/orchestration/builders/WorkflowBuilder.ts:81](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/builders/WorkflowBuilder.ts#L81)

Call a method on a registered extension.

#### extensionId

> **extensionId**: `string`

#### method

> **method**: `string`

***

### gmi?

> `optional` **gmi**: `object`

Defined in: [packages/agentos/src/orchestration/builders/WorkflowBuilder.ts:71](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/builders/WorkflowBuilder.ts#L71)

General Model Invocation config. `executionMode` is always overridden to
`'single_turn'` inside a workflow to keep execution deterministic.

#### executionMode?

> `optional` **executionMode**: `"single_turn"`

Ignored at runtime — always coerced to `'single_turn'` by the workflow compiler.

#### instructions

> **instructions**: `string`

#### maxTokens?

> `optional` **maxTokens**: `number`

Hard cap on LLM output tokens for this step.

***

### guardrails?

> `optional` **guardrails**: [`GuardrailPolicy`](GuardrailPolicy.md)

Defined in: [packages/agentos/src/orchestration/builders/WorkflowBuilder.ts:89](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/builders/WorkflowBuilder.ts#L89)

Declarative guardrail policy applied to input and/or output.

***

### human?

> `optional` **human**: `object`

Defined in: [packages/agentos/src/orchestration/builders/WorkflowBuilder.ts:79](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/builders/WorkflowBuilder.ts#L79)

Human-in-the-loop step; suspends the run until a human provides a response.

#### prompt

> **prompt**: `string`

***

### memory?

> `optional` **memory**: [`MemoryPolicy`](MemoryPolicy.md)

Defined in: [packages/agentos/src/orchestration/builders/WorkflowBuilder.ts:85](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/builders/WorkflowBuilder.ts#L85)

Memory read/write policy for this step.

***

### onFailure?

> `optional` **onFailure**: `"abort"` \| `"skip"` \| `"retry"`

Defined in: [packages/agentos/src/orchestration/builders/WorkflowBuilder.ts:93](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/builders/WorkflowBuilder.ts#L93)

What to do when the step fails.

***

### requiresApproval?

> `optional` **requiresApproval**: `boolean`

Defined in: [packages/agentos/src/orchestration/builders/WorkflowBuilder.ts:91](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/builders/WorkflowBuilder.ts#L91)

When `true`, execution suspends and waits for human approval before proceeding.

***

### retryPolicy?

> `optional` **retryPolicy**: `object`

Defined in: [packages/agentos/src/orchestration/builders/WorkflowBuilder.ts:95](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/builders/WorkflowBuilder.ts#L95)

Automatic retry configuration. Only used when `onFailure` is `'retry'`.

#### backoff

> **backoff**: `"exponential"` \| `"linear"` \| `"fixed"`

#### backoffMs

> **backoffMs**: `number`

#### maxAttempts

> **maxAttempts**: `number`

***

### subgraph?

> `optional` **subgraph**: [`CompiledExecutionGraph`](CompiledExecutionGraph.md)

Defined in: [packages/agentos/src/orchestration/builders/WorkflowBuilder.ts:83](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/builders/WorkflowBuilder.ts#L83)

Delegate to a previously compiled sub-workflow or agent graph.

***

### timeout?

> `optional` **timeout**: `number`

Defined in: [packages/agentos/src/orchestration/builders/WorkflowBuilder.ts:101](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/builders/WorkflowBuilder.ts#L101)

Maximum wall-clock execution time in milliseconds.

***

### tool?

> `optional` **tool**: `string`

Defined in: [packages/agentos/src/orchestration/builders/WorkflowBuilder.ts:66](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/builders/WorkflowBuilder.ts#L66)

Name of a registered `ITool` to invoke.

***

### voice?

> `optional` **voice**: [`VoiceNodeConfig`](VoiceNodeConfig.md)

Defined in: [packages/agentos/src/orchestration/builders/WorkflowBuilder.ts:110](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/builders/WorkflowBuilder.ts#L110)

Voice pipeline node configuration.
When provided alongside `executorConfig.type: 'voice'`, these settings are
forwarded to the VoiceNodeExecutor.  Typically set via the `voiceNode()`
builder rather than directly through `StepConfig`.
