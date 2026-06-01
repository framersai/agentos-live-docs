# Class: MissionBuilder

Defined in: [packages/agentos/src/orchestration/builders/MissionBuilder.ts:68](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/builders/MissionBuilder.ts#L68)

Fluent builder that collects mission configuration and validates it at `.compile()` time.

All setter methods return `this` for chaining.  No compilation work is performed until
`.compile()` is called, ensuring fast construction of mission objects at module load time.

## Constructors

### Constructor

> **new MissionBuilder**(`name`): `MissionBuilder`

Defined in: [packages/agentos/src/orchestration/builders/MissionBuilder.ts:101](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/builders/MissionBuilder.ts#L101)

#### Parameters

##### name

`string`

Display name for this mission; passed through to the compiled graph.

#### Returns

`MissionBuilder`

## Methods

### anchor()

> **anchor**(`id`, `node`, `constraints`): `this`

Defined in: [packages/agentos/src/orchestration/builders/MissionBuilder.ts:191](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/builders/MissionBuilder.ts#L191)

Declare an anchor node that will be spliced into the execution order.

Anchors let callers inject pre-built `GraphNode` objects (e.g. specialised tool
invocations, human-in-the-loop checkpoints, or validation guardrails) at precise
positions within the phase-ordered plan without modifying the planner output.

#### Parameters

##### id

`string`

Unique node id assigned to the anchor in the compiled graph.

##### node

[`GraphNode`](../interfaces/GraphNode.md)

Pre-built `GraphNode` (from `gmiNode`, `toolNode`, etc.).

##### constraints

Placement constraints: phase, `after` / `before` ordering.

###### after?

`any`

Insert the anchor *after* this node id (sibling anchor id or plan step id).
When the referenced id is not found the anchor is appended to the phase tail.

###### before?

`any`

Insert the anchor *before* this node id.
Currently reserved for future use; has no effect in this compiler version.

###### phase?

`"gather"` \| `"process"` \| `"validate"` \| `"deliver"`

Execution phase the anchor belongs to.  Phases are ordered:
`gather` → `process` → `validate` → `deliver`.

###### required

`boolean`

When `true` the compiler will throw if the anchor cannot be placed.

#### Returns

`this`

***

### autonomy()

> **autonomy**(`mode`): `this`

Defined in: [packages/agentos/src/orchestration/builders/MissionBuilder.ts:213](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/builders/MissionBuilder.ts#L213)

Set the autonomy mode for this mission.

- `autonomous` — all expansion gates auto-approve. Only stops at hard caps.
- `guided` — every expansion requires explicit user approval.
- `guardrailed` — auto-approves below configurable thresholds, asks above.

#### Parameters

##### mode

Autonomy mode.

`"autonomous"` | `"guided"` | `"guardrailed"`

#### Returns

`this`

***

### branches()

> **branches**(`count`): `this`

Defined in: [packages/agentos/src/orchestration/builders/MissionBuilder.ts:264](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/builders/MissionBuilder.ts#L264)

Set the number of Tree of Thought branches to explore during planning.

#### Parameters

##### count

`number`

Branch count (default: 3, max: 3 for linear/parallel/hierarchical).

#### Returns

`this`

***

### compile()

> **compile**(`options?`): [`CompiledMission`](CompiledMission.md)

Defined in: [packages/agentos/src/orchestration/builders/MissionBuilder.ts:310](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/builders/MissionBuilder.ts#L310)

Validate configuration and compile this mission into a `CompiledMission`.

Required fields: `input`, `goal`, `returns`, `planner`.
Throws with a descriptive message if any required field is missing.

#### Parameters

##### options?

Optional compilation overrides.

###### checkpointStore?

[`ICheckpointStore`](../interfaces/ICheckpointStore.md)

Custom checkpoint store; defaults to `InMemoryCheckpointStore`.

###### deps?

`NodeExecutorDeps`

Runtime-execution dependencies forwarded to the underlying
`NodeExecutor`. Without these, the matching node types fail with
`success: false`. See WorkflowRuntimeDeps.

#### Returns

[`CompiledMission`](CompiledMission.md)

A `CompiledMission` ready to `invoke()`, `stream()`, or `explain()`.

#### Throws

When required builder fields are missing.

***

### costCap()

> **costCap**(`amount`): `this`

Defined in: [packages/agentos/src/orchestration/builders/MissionBuilder.ts:244](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/builders/MissionBuilder.ts#L244)

Set the maximum cost in USD before execution pauses for approval.

#### Parameters

##### amount

`number`

Cost cap in USD.

#### Returns

`this`

***

### executionModel()

> **executionModel**(`model`): `this`

Defined in: [packages/agentos/src/orchestration/builders/MissionBuilder.ts:290](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/builders/MissionBuilder.ts#L290)

Set the default model used for agent node execution.

Can differ from the planner model — e.g., use Opus for planning
but GPT-5.4 for actual agent output generation.

#### Parameters

##### model

`string`

Model identifier string (e.g., 'gpt-5.4').

#### Returns

`this`

***

### goal()

> **goal**(`template`): `this`

Defined in: [packages/agentos/src/orchestration/builders/MissionBuilder.ts:133](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/builders/MissionBuilder.ts#L133)

Set the goal template for this mission.

The template is a free-form string that describes what the mission should achieve.
It may include `{{variable}}` placeholders. The current stub compiler passes
the template through verbatim into generated node instructions; future planner
integrations may interpolate it from runtime input.

Example: `'Research {{topic}} and produce a concise summary'`

#### Parameters

##### template

`string`

Goal prompt template string.

#### Returns

`this`

***

### input()

> **input**(`schema`): `this`

Defined in: [packages/agentos/src/orchestration/builders/MissionBuilder.ts:116](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/builders/MissionBuilder.ts#L116)

Declare the input schema for this mission.

Accepts a Zod schema object or a plain JSON-Schema `Record<string, unknown>`.
The schema is stored in the compiled graph's `stateSchema.input` field and used
by the runtime for optional input validation.

#### Parameters

##### schema

`any`

Zod or JSON-Schema object describing the expected input payload.

#### Returns

`this`

***

### maxAgents()

> **maxAgents**(`count`): `this`

Defined in: [packages/agentos/src/orchestration/builders/MissionBuilder.ts:254](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/builders/MissionBuilder.ts#L254)

Set the maximum number of concurrent agents.

#### Parameters

##### count

`number`

Agent count cap.

#### Returns

`this`

***

### planner()

> **planner**(`config`): `this`

Defined in: [packages/agentos/src/orchestration/builders/MissionBuilder.ts:161](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/builders/MissionBuilder.ts#L161)

Configure planner hints recorded on the mission config.

Today the compiler emits a fixed stub plan regardless of strategy. These
settings are still preserved so planner-backed mission compilation can adopt
them without changing the authoring API.

#### Parameters

##### config

Planner settings including strategy name, step budget, and
                per-node iteration and tool-parallelism caps.

###### maxIterationsPerNode?

`number`

Maximum LLM iterations a single `gmi` node may consume per invocation.
Forwarded to `gmiNode` as `maxInternalIterations`.

###### maxSteps

`number`

Hard cap on the total number of plan steps the planner may emit.

###### parallelTools?

`boolean`

When `true`, `gmi` nodes are configured to issue multiple tool calls per turn.
Forwarded to `gmiNode` as `parallelTools`.

###### plan?

[`SimplePlan`](../interfaces/SimplePlan.md)

Pre-generated plan that bypasses both `style` template selection and
the goal classifier. When set, the compiler validates the plan shape
(non-empty, unique step ids, known actions, valid phases) and uses
the steps directly to build the graph. Intended for callers that
generate plans externally — e.g. wunderland's opt-in
`planner.style: 'llm'` mode that asks an LLM to decompose the goal
into steps at YAML compile time.

Validation is intentionally strict: invalid plans throw at compile
time rather than producing a partially-correct graph that fails
mid-execution.

###### strategy

`string`

Routing/planning strategy identifier (e.g. `'linear'`, `'react'`, `'tree-of-thought'`).

###### style?

`"research"` \| `"creative"` \| `"qa"`

Optional plan-template selector. Picks which fixed stub template the
compiler emits. Defaults to `'research'` (gather → process → deliver →
refine) which matches the prior behaviour. Other values:
- `'qa'`       — short Q&A plan (research-quick → answer)
- `'creative'` — brainstorm → develop-concept → produce-artifact → polish

The real `PlanningEngine` (Task 16+) will deprecate this in favour of
goal-driven plan generation; until then `style` lets users opt into a
less research-shaped graph for non-research goals.

#### Returns

`this`

***

### plannerModel()

> **plannerModel**(`model`): `this`

Defined in: [packages/agentos/src/orchestration/builders/MissionBuilder.ts:277](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/builders/MissionBuilder.ts#L277)

Set the model used for Tree of Thought planning phases.

Use a strong reasoning model here (e.g., claude-opus-4-6, gpt-4o) for
better plan quality. Defaults to the same model as execution if not set.

#### Parameters

##### model

`string`

Model identifier string (e.g., 'claude-opus-4-6').

#### Returns

`this`

***

### policy()

> **policy**(`config`): `this`

Defined in: [packages/agentos/src/orchestration/builders/MissionBuilder.ts:175](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/builders/MissionBuilder.ts#L175)

Apply mission-level policy overrides.

Policies declared here are applied to **all** compiled nodes unless a node already
carries its own policy declaration.  This is the preferred mechanism for setting
blanket guardrails, memory consistency modes, or persona settings across a mission.

#### Parameters

##### config

Policy configuration object.

###### discovery?

\{ `fallback?`: `string`; `kind?`: `string`; \}

###### discovery.fallback?

`string`

###### discovery.kind?

`string`

###### guardrails?

`string`[]

Guardrail identifiers applied as output guardrails on every node.

###### memory?

\{ `consistency?`: [`MemoryConsistencyMode`](../type-aliases/MemoryConsistencyMode.md); `read?`: `any`; `write?`: `any`; \}

###### memory.consistency?

[`MemoryConsistencyMode`](../type-aliases/MemoryConsistencyMode.md)

###### memory.read?

`any`

###### memory.write?

`any`

###### personality?

\{ `adaptStyle?`: `boolean`; `mood?`: `string`; `traitRouting?`: `boolean`; \}

###### personality.adaptStyle?

`boolean`

###### personality.mood?

`string`

###### personality.traitRouting?

`boolean`

#### Returns

`this`

***

### providerStrategy()

> **providerStrategy**(`strategy`, `options?`): `this`

Defined in: [packages/agentos/src/orchestration/builders/MissionBuilder.ts:224](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/builders/MissionBuilder.ts#L224)

Set the provider assignment strategy for this mission.

#### Parameters

##### strategy

`string`

Strategy name: best, cheapest, balanced, explicit, mixed.

##### options?

Optional explicit assignments and fallback strategy.

###### assignments?

`Record`\<`string`, \{ `model?`: `string`; `provider`: `string`; \}\>

###### fallback?

`string`

#### Returns

`this`

***

### returns()

> **returns**(`schema`): `this`

Defined in: [packages/agentos/src/orchestration/builders/MissionBuilder.ts:146](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/builders/MissionBuilder.ts#L146)

Declare the output (return) schema for this mission.

Accepts a Zod schema object or a plain JSON-Schema `Record<string, unknown>`.
The schema is stored in the compiled graph's `stateSchema.artifacts` field.

#### Parameters

##### schema

`any`

Zod or JSON-Schema object describing the expected artifact payload.

#### Returns

`this`
