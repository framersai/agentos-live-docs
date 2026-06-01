# Class: WorkflowBuilder

Defined in: [packages/agentos/src/orchestration/builders/WorkflowBuilder.ts:201](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/builders/WorkflowBuilder.ts#L201)

Fluent builder for deterministic DAG workflows.

Steps are appended in declaration order and connected sequentially. Branch and
parallel primitives fan out and automatically rejoin at the next declared step.

Call `.compile()` to validate the graph (must be acyclic) and obtain a
`CompiledWorkflow` ready for `invoke()`, `stream()`, or `resume()`.

## Constructors

### Constructor

> **new WorkflowBuilder**(`name`): `WorkflowBuilder`

Defined in: [packages/agentos/src/orchestration/builders/WorkflowBuilder.ts:220](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/builders/WorkflowBuilder.ts#L220)

#### Parameters

##### name

`string`

Human-readable workflow name.

#### Returns

`WorkflowBuilder`

## Methods

### branch()

> **branch**(`condition`, `routes`): `this`

Defined in: [packages/agentos/src/orchestration/builders/WorkflowBuilder.ts:318](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/builders/WorkflowBuilder.ts#L318)

Append a conditional branch to the workflow.

The `condition` function is evaluated at runtime against `GraphState` and must
return one of the keys of `routes`. Each route becomes its own branch node; all
branches become the collective tail that the next declared step connects from.

#### Parameters

##### condition

(`state`) => `string`

Routing function; return value must match a key in `routes`.

##### routes

`Record`\<`string`, [`StepConfig`](../interfaces/StepConfig.md)\>

Map of route key → step config for each branch arm.

#### Returns

`this`

***

### compile()

> **compile**(`options?`): [`CompiledWorkflow`](CompiledWorkflow.md)

Defined in: [packages/agentos/src/orchestration/builders/WorkflowBuilder.ts:367](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/builders/WorkflowBuilder.ts#L367)

Compile the workflow into an executable `CompiledWorkflow`.

Compilation steps:
1. Validate that `.input()` and `.returns()` schemas were declared.
2. Lower each `InternalStep` into `GraphNode` + `GraphEdge` IR objects,
   threading `tailNodeIds` to connect steps sequentially.
3. Connect all final tail nodes to `END`.
4. Run `GraphCompiler.compile()` to produce a `CompiledExecutionGraph`.
5. Run `GraphValidator.validate()` with `{ requireAcyclic: true }` — throws on cycle.
6. Wrap in a `CompiledWorkflow` with a `GraphRuntime` backed by the given store.

#### Parameters

##### options?

Optional compilation options.

###### checkpointStore?

[`ICheckpointStore`](../interfaces/ICheckpointStore.md)

Custom checkpoint persistence backend; defaults to `InMemoryCheckpointStore`.

###### deps?

`NodeExecutorDeps`

Runtime-execution dependencies forwarded to the underlying
`NodeExecutor`. Wire in `toolOrchestrator` for `tool` nodes,
`loopController` + `providerCall` for `gmi` nodes,
`extensionExecutor` for `extension` nodes, etc. Without these, the
matching node types fail with `success: false`.

**See**

WorkflowRuntimeDeps

#### Returns

[`CompiledWorkflow`](CompiledWorkflow.md)

#### Throws

When `.input()` or `.returns()` was not called.

#### Throws

When the compiled graph contains a cycle (should never happen via this API).

***

### input()

> **input**(`schema`): `this`

Defined in: [packages/agentos/src/orchestration/builders/WorkflowBuilder.ts:236](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/builders/WorkflowBuilder.ts#L236)

Declare the input schema for this workflow.

Accepts a Zod schema or any plain object; the value is forwarded to
`GraphCompiler` which lowers it to JSON Schema via `lowerZodToJsonSchema`.

#### Parameters

##### schema

`any`

Input schema (Zod instance or plain JSON Schema object).

#### Returns

`this`

***

### parallel()

> **parallel**(`steps`, `join`): `this`

Defined in: [packages/agentos/src/orchestration/builders/WorkflowBuilder.ts:333](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/builders/WorkflowBuilder.ts#L333)

Append a parallel fan-out to the workflow.

All `steps` execute concurrently (subject to runtime scheduling). After all
branches complete, their outputs are merged using the `join.merge` reducers.
The parallel branch nodes collectively become the new tail.

#### Parameters

##### steps

[`StepConfig`](../interfaces/StepConfig.md)[]

Array of step configs to execute concurrently.

##### join

Fan-in configuration including merge strategy and reducers.

###### merge

`Record`\<`string`, [`BuiltinReducer`](../type-aliases/BuiltinReducer.md) \| [`ReducerFn`](../type-aliases/ReducerFn.md)\>

###### quorumCount?

`number`

###### strategy

`"all"` \| `"any"` \| `"quorum"`

###### timeout?

`number`

#### Returns

`this`

***

### returns()

> **returns**(`schema`): `this`

Defined in: [packages/agentos/src/orchestration/builders/WorkflowBuilder.ts:246](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/builders/WorkflowBuilder.ts#L246)

Declare the return (output artifacts) schema for this workflow.

#### Parameters

##### schema

`any`

Output schema (Zod instance or plain JSON Schema object).

#### Returns

`this`

***

### step()

> **step**(`id`, `config`): `this`

Defined in: [packages/agentos/src/orchestration/builders/WorkflowBuilder.ts:293](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/builders/WorkflowBuilder.ts#L293)

Append a single named step to the workflow.

The step is connected from all current tail nodes and becomes the new
single-element tail after it is added.

#### Parameters

##### id

`string`

Unique step identifier within this workflow.

##### config

[`StepConfig`](../interfaces/StepConfig.md)

Execution and policy configuration for the step.

#### Returns

`this`

***

### then()

> **then**(`id`, `config`): `this`

Defined in: [packages/agentos/src/orchestration/builders/WorkflowBuilder.ts:304](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/builders/WorkflowBuilder.ts#L304)

Alias for `step()` — reads more naturally when chaining sequential steps.

#### Parameters

##### id

`string`

Unique step identifier.

##### config

[`StepConfig`](../interfaces/StepConfig.md)

Execution and policy configuration.

#### Returns

`this`

***

### transport()

> **transport**(`type`, `config?`): `this`

Defined in: [packages/agentos/src/orchestration/builders/WorkflowBuilder.ts:275](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/builders/WorkflowBuilder.ts#L275)

Attach a transport backend to this workflow.

When `type` is `'voice'`, the compiled workflow will route graph I/O
through the voice transport adapter at runtime. The `config` values
override per-field defaults from `agent.config.json`.

The transport config is stored as `_transportConfig` on the builder
instance and is available for inspection or forwarding to the runtime.

#### Parameters

##### type

`"voice"`

Transport kind; currently only `'voice'` is supported.

##### config?

`Omit`\<`VoiceTransportConfig`, `"type"`\>

Optional voice pipeline overrides (STT, TTS, voice, etc.).

#### Returns

`this`

`this` for fluent chaining.

#### Example

```typescript
const wf = workflow('voice-flow')
  .input(inputSchema)
  .returns(outputSchema)
  .transport('voice', { stt: 'deepgram', tts: 'openai', voice: 'alloy' })
  .step('listen', { tool: 'listen_tool' })
  .compile();
```
