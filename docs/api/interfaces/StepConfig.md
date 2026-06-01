# Interface: StepConfig

Defined in: [packages/agentos/src/orchestration/builders/WorkflowBuilder.ts:77](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/builders/WorkflowBuilder.ts#L77)

Configuration for a single workflow step node.

Exactly one of `tool`, `gmi`, `human`, `extension`, or `subgraph` must be provided
to specify the execution strategy.  All remaining fields are optional policies.

## Properties

### discovery?

> `optional` **discovery**: [`DiscoveryPolicy`](DiscoveryPolicy.md)

Defined in: [packages/agentos/src/orchestration/builders/WorkflowBuilder.ts:100](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/builders/WorkflowBuilder.ts#L100)

Capability discovery policy applied before execution.

***

### effectClass?

> `optional` **effectClass**: `"external"` \| `"human"` \| `"pure"` \| `"read"` \| `"write"`

Defined in: [packages/agentos/src/orchestration/builders/WorkflowBuilder.ts:116](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/builders/WorkflowBuilder.ts#L116)

Side-effect classification used by the runtime for scheduling decisions.

***

### extension?

> `optional` **extension**: `object`

Defined in: [packages/agentos/src/orchestration/builders/WorkflowBuilder.ts:94](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/builders/WorkflowBuilder.ts#L94)

Call a method on a registered extension.

#### extensionId

> **extensionId**: `string`

#### method

> **method**: `string`

***

### gmi?

> `optional` **gmi**: `object`

Defined in: [packages/agentos/src/orchestration/builders/WorkflowBuilder.ts:84](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/builders/WorkflowBuilder.ts#L84)

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

Defined in: [packages/agentos/src/orchestration/builders/WorkflowBuilder.ts:102](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/builders/WorkflowBuilder.ts#L102)

Declarative guardrail policy applied to input and/or output.

***

### human?

> `optional` **human**: `object`

Defined in: [packages/agentos/src/orchestration/builders/WorkflowBuilder.ts:92](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/builders/WorkflowBuilder.ts#L92)

Human-in-the-loop step; suspends the run until a human provides a response.

#### prompt

> **prompt**: `string`

***

### memory?

> `optional` **memory**: [`MemoryPolicy`](MemoryPolicy.md)

Defined in: [packages/agentos/src/orchestration/builders/WorkflowBuilder.ts:98](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/builders/WorkflowBuilder.ts#L98)

Memory read/write policy for this step.

***

### onFailure?

> `optional` **onFailure**: `"abort"` \| `"skip"` \| `"retry"`

Defined in: [packages/agentos/src/orchestration/builders/WorkflowBuilder.ts:106](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/builders/WorkflowBuilder.ts#L106)

What to do when the step fails.

***

### outputAs?

> `optional` **outputAs**: `string`

Defined in: [packages/agentos/src/orchestration/builders/WorkflowBuilder.ts:126](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/builders/WorkflowBuilder.ts#L126)

Optional artifact key name. When set, this step's successful `output`
is promoted into `state.artifacts[outputAs]` (the value returned from
`invoke()`). When omitted, the step's output is promoted into
`state.artifacts[<stepId>]` by default. Use this to make your final
step populate a key that matches the shape of your `.returns()`
schema — e.g. `step('publish', { tool: '...', outputAs: 'publishedTo' })`
when `.returns(z.object({ publishedTo: z.array(z.string()) }))`.

***

### requiresApproval?

> `optional` **requiresApproval**: `boolean`

Defined in: [packages/agentos/src/orchestration/builders/WorkflowBuilder.ts:104](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/builders/WorkflowBuilder.ts#L104)

When `true`, execution suspends and waits for human approval before proceeding.

***

### retryPolicy?

> `optional` **retryPolicy**: `object`

Defined in: [packages/agentos/src/orchestration/builders/WorkflowBuilder.ts:108](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/builders/WorkflowBuilder.ts#L108)

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

Defined in: [packages/agentos/src/orchestration/builders/WorkflowBuilder.ts:96](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/builders/WorkflowBuilder.ts#L96)

Delegate to a previously compiled sub-workflow or agent graph.

***

### timeout?

> `optional` **timeout**: `number`

Defined in: [packages/agentos/src/orchestration/builders/WorkflowBuilder.ts:114](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/builders/WorkflowBuilder.ts#L114)

Maximum wall-clock execution time in milliseconds.

***

### tool?

> `optional` **tool**: `string`

Defined in: [packages/agentos/src/orchestration/builders/WorkflowBuilder.ts:79](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/builders/WorkflowBuilder.ts#L79)

Name of a registered `ITool` to invoke.

***

### voice?

> `optional` **voice**: [`VoiceNodeConfig`](VoiceNodeConfig.md)

Defined in: [packages/agentos/src/orchestration/builders/WorkflowBuilder.ts:133](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/builders/WorkflowBuilder.ts#L133)

Voice pipeline node configuration.
When provided alongside `executorConfig.type: 'voice'`, these settings are
forwarded to the VoiceNodeExecutor.  Typically set via the `voiceNode()`
builder rather than directly through `StepConfig`.
