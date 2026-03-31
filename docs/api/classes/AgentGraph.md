# Class: AgentGraph\<TState\>

Defined in: [packages/agentos/src/orchestration/builders/AgentGraph.ts:62](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/builders/AgentGraph.ts#L62)

Fluent builder for agent execution graphs.

Each mutating method returns `this` to support method chaining.  All state is held
in private Maps/arrays; nothing is compiled or validated until `.compile()` is called.

## Type Parameters

### TState

`TState` *extends* [`GraphState`](../interfaces/GraphState.md) = [`GraphState`](../interfaces/GraphState.md)

Narrows the `GraphState` type used in conditional-edge callbacks.
  Defaults to the base `GraphState` when not specified.

## Constructors

### Constructor

> **new AgentGraph**\<`TState`\>(`stateSchema`, `config?`): `AgentGraph`\<`TState`\>

Defined in: [packages/agentos/src/orchestration/builders/AgentGraph.ts:79](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/builders/AgentGraph.ts#L79)

#### Parameters

##### stateSchema

Zod schemas for the three `GraphState` generic partitions.
  - `input`     — shape of the frozen user-provided input passed to `invoke()`.
  - `scratch`   — shape of the mutable node-to-node communication bag.
  - `artifacts` — shape of the accumulated external outputs returned by `invoke()`.

###### artifacts

`any`

Zod schema for `GraphState.artifacts`.

###### input

`any`

Zod schema for `GraphState.input`.

###### scratch

`any`

Zod schema for `GraphState.scratch`.

##### config?

Optional graph-wide configuration overrides.

###### checkpointPolicy?

`"none"` \| `"every_node"` \| `"explicit"`

Graph-wide checkpoint persistence strategy (default: `'none'`).

###### memoryConsistency?

[`MemoryConsistencyMode`](../type-aliases/MemoryConsistencyMode.md)

Graph-wide memory consistency mode (default: `'snapshot'`).

###### reducers?

[`StateReducers`](../interfaces/StateReducers.md)

Field-level merge strategies for `scratch` and `artifacts` fields.

#### Returns

`AgentGraph`\<`TState`\>

## Methods

### addConditionalEdge()

> **addConditionalEdge**(`source`, `condition`): `this`

Defined in: [packages/agentos/src/orchestration/builders/AgentGraph.ts:160](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/builders/AgentGraph.ts#L160)

Add a conditional edge whose target is determined at runtime by a callback.

The `condition` function receives the current `GraphState` and returns the id of
the next node to activate.  The returned id is resolved against the edge list at
runtime; no compile-time validation of the returned id is performed.

Because conditional edges encode the target resolution in a closure, the `target`
field stored in the IR is set to the placeholder `'__CONDITIONAL__'`.

#### Parameters

##### source

`string`

Source node id (or `START`).

##### condition

(`state`) => `string`

Pure function `(state: TState) => string` returning the next node id.

#### Returns

`this`

`this` for chaining.

***

### addDiscoveryEdge()

> **addDiscoveryEdge**(`source`, `config`): `this`

Defined in: [packages/agentos/src/orchestration/builders/AgentGraph.ts:189](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/builders/AgentGraph.ts#L189)

Add a discovery edge whose target is resolved at runtime via the capability discovery engine.

When discovery returns no result, execution falls back to `config.fallbackTarget` (if provided)
or the placeholder `'__DISCOVERY__'`.

#### Parameters

##### source

`string`

Source node id.

##### config

Discovery configuration.
`config.query` is forwarded to the `CapabilityDiscoveryEngine`.
`config.kind` optionally restricts discovery to a specific capability kind.
`config.fallbackTarget` is used when discovery resolves no target.

###### fallbackTarget?

`string`

Fallback node id used when discovery resolves no target.

###### kind?

`"tool"` \| `"skill"` \| `"extension"` \| `"any"`

Optional capability kind filter (`'tool'`, `'skill'`, `'extension'`, or `'any'`).

###### query

`string`

Semantic query forwarded to the capability discovery engine.

#### Returns

`this`

`this` for chaining.

***

### addEdge()

> **addEdge**(`source`, `target`): `this`

Defined in: [packages/agentos/src/orchestration/builders/AgentGraph.ts:136](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/builders/AgentGraph.ts#L136)

Add an unconditional (static) edge that is always followed at runtime.

Either `source` or `target` (or both) may be the `START` / `END` sentinels.

#### Parameters

##### source

`string`

Source node id (or `START`).

##### target

`string`

Target node id (or `END`).

#### Returns

`this`

`this` for chaining.

***

### addNode()

> **addNode**(`id`, `node`): `this`

Defined in: [packages/agentos/src/orchestration/builders/AgentGraph.ts:113](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/builders/AgentGraph.ts#L113)

Add a node to the graph.

The node's `id` field is overridden with the supplied `id` argument so the
user-declared identifier is always canonical.

#### Parameters

##### id

`string`

Unique node identifier within this graph.  Must not equal `START` or `END`.

##### node

[`GraphNode`](../interfaces/GraphNode.md)

A `GraphNode` produced by one of the factory helpers in `builders/nodes.ts`.

#### Returns

`this`

`this` for chaining.

#### Throws

When `id` has already been registered.

***

### addPersonalityEdge()

> **addPersonalityEdge**(`source`, `config`): `this`

Defined in: [packages/agentos/src/orchestration/builders/AgentGraph.ts:227](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/builders/AgentGraph.ts#L227)

Add a personality edge whose target is chosen based on the agent's current trait value.

At runtime the engine reads `config.trait` from the agent's HEXACO/PAD state and routes
to `config.above` when the value is ≥ `config.threshold`, or `config.below` otherwise.

#### Parameters

##### source

`string`

Source node id.

##### config

Personality routing configuration.
`config.trait` identifies the HEXACO/PAD value to inspect.
`config.threshold` is the decision boundary in the 0–1 range.
`config.above` is used when the trait value is greater than or equal to the threshold.
`config.below` is used when the trait value is below the threshold.

###### above

`string`

Target node id when the trait value is at or above the threshold.

###### below

`string`

Target node id when the trait value is below the threshold.

###### threshold

`number`

Decision threshold in range 0–1.

###### trait

`string`

HEXACO/PAD trait name, e.g. `'conscientiousness'` or `'openness'`.

#### Returns

`this`

`this` for chaining.

***

### compile()

> **compile**(`options?`): [`CompiledAgentGraph`](CompiledAgentGraph.md)\<`TState`\>

Defined in: [packages/agentos/src/orchestration/builders/AgentGraph.ts:281](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/builders/AgentGraph.ts#L281)

Compile the builder state into a `CompiledAgentGraph` ready for execution.

Compilation steps:
1. Call `GraphCompiler.compile()` to produce the raw `CompiledExecutionGraph` IR.
2. (Optional, default: enabled) Call `GraphValidator.validate()` to assert structural
   correctness — any validation error or warning causes an exception.
3. Wrap the IR and a checkpoint store in a `CompiledAgentGraph` instance.

Pass `{ validate: false }` to skip validation (e.g. for cyclic graphs under construction).

#### Parameters

##### options?

Optional compilation flags.
`options.checkpointStore` overrides the default `InMemoryCheckpointStore`.
`options.validate` can be set to `false` to skip structural validation.

###### checkpointStore?

[`ICheckpointStore`](../interfaces/ICheckpointStore.md)

Custom checkpoint persistence backend. Defaults to an in-memory store.

###### validate?

`boolean`

Whether to run `GraphValidator.validate()` before returning.
Defaults to `true`. Set to `false` for cyclic or incomplete graphs under construction.

#### Returns

[`CompiledAgentGraph`](CompiledAgentGraph.md)\<`TState`\>

A `CompiledAgentGraph` instance ready for `invoke()` / `stream()` / `resume()`.

#### Throws

When validation is enabled and the graph contains structural errors or warnings.
