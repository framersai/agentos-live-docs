# Interface: MissionConfig

Defined in: [packages/agentos/src/orchestration/compiler/MissionCompiler.ts:34](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/orchestration/compiler/MissionCompiler.ts#L34)

Top-level configuration object consumed by `MissionCompiler.compile()`.
Produced internally by `MissionBuilder.compile()`.

## Properties

### anchors

> **anchors**: `object`[]

Defined in: [packages/agentos/src/orchestration/compiler/MissionCompiler.ts:80](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/orchestration/compiler/MissionCompiler.ts#L80)

Declarative anchor nodes that must be spliced into the execution order at specific phases.
Anchors allow callers to inject pre-built `GraphNode` objects (e.g. specialised tools or
human-in-the-loop checkpoints) without modifying the planner output.

#### constraints

> **constraints**: `object`

Placement constraints that control where in the phase sequence the anchor is inserted.

##### constraints.after?

> `optional` **after**: `any`

Insert the anchor *after* this node id (sibling anchor id or plan step id).
When the referenced id is not found the anchor is appended to the phase tail.

##### constraints.before?

> `optional` **before**: `any`

Insert the anchor *before* this node id.
Currently reserved for future use; has no effect in this compiler version.

##### constraints.phase?

> `optional` **phase**: `"gather"` \| `"process"` \| `"validate"` \| `"deliver"`

Execution phase the anchor belongs to.  Phases are ordered:
`gather` → `process` → `validate` → `deliver`.

##### constraints.required

> **required**: `boolean`

When `true` the compiler will throw if the anchor cannot be placed.

#### id

> **id**: `string`

Node id assigned to the anchor inside the compiled graph.

#### node

> **node**: [`GraphNode`](GraphNode.md)

Pre-built `GraphNode` to splice in. The compiler overwrites `node.id` with `anchor.id`.

***

### goalTemplate

> **goalTemplate**: `string`

Defined in: [packages/agentos/src/orchestration/compiler/MissionCompiler.ts:43](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/orchestration/compiler/MissionCompiler.ts#L43)

Goal prompt template. Supports `{{variable}}` placeholders (e.g. `{{topic}}`).
The current stub compiler passes it through to generated reasoning nodes.

***

### inputSchema

> **inputSchema**: `any`

Defined in: [packages/agentos/src/orchestration/compiler/MissionCompiler.ts:38](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/orchestration/compiler/MissionCompiler.ts#L38)

Zod schema (or plain JSON-Schema object) describing the mission's input payload.

***

### name

> **name**: `string`

Defined in: [packages/agentos/src/orchestration/compiler/MissionCompiler.ts:36](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/orchestration/compiler/MissionCompiler.ts#L36)

Human-readable mission name; becomes the compiled graph's display name.

***

### plannerConfig

> **plannerConfig**: `object`

Defined in: [packages/agentos/src/orchestration/compiler/MissionCompiler.ts:47](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/orchestration/compiler/MissionCompiler.ts#L47)

Planner configuration controlling step generation and execution budgets.

#### maxIterationsPerNode?

> `optional` **maxIterationsPerNode**: `number`

Maximum LLM iterations a single `gmi` node may consume per invocation.
Forwarded to `gmiNode` as `maxInternalIterations`.

#### maxSteps

> **maxSteps**: `number`

Hard cap on the total number of plan steps the planner may emit.

#### parallelTools?

> `optional` **parallelTools**: `boolean`

When `true`, `gmi` nodes are configured to issue multiple tool calls per turn.
Forwarded to `gmiNode` as `parallelTools`.

#### strategy

> **strategy**: `string`

Routing/planning strategy identifier (e.g. `'linear'`, `'react'`, `'tree-of-thought'`).

***

### policyConfig?

> `optional` **policyConfig**: `object`

Defined in: [packages/agentos/src/orchestration/compiler/MissionCompiler.ts:68](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/orchestration/compiler/MissionCompiler.ts#L68)

Optional mission-level policy overrides.
When set, they are applied to all compiled nodes unless a node already declares
its own policy.

#### discovery?

> `optional` **discovery**: `object`

##### discovery.fallback?

> `optional` **fallback**: `string`

##### discovery.kind?

> `optional` **kind**: `string`

#### guardrails?

> `optional` **guardrails**: `string`[]

Guardrail identifiers applied as output guardrails on every node.

#### memory?

> `optional` **memory**: `object`

##### memory.consistency?

> `optional` **consistency**: [`MemoryConsistencyMode`](../type-aliases/MemoryConsistencyMode.md)

##### memory.read?

> `optional` **read**: `any`

##### memory.write?

> `optional` **write**: `any`

#### personality?

> `optional` **personality**: `object`

##### personality.adaptStyle?

> `optional` **adaptStyle**: `boolean`

##### personality.mood?

> `optional` **mood**: `string`

##### personality.traitRouting?

> `optional` **traitRouting**: `boolean`

***

### returnsSchema

> **returnsSchema**: `any`

Defined in: [packages/agentos/src/orchestration/compiler/MissionCompiler.ts:45](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/orchestration/compiler/MissionCompiler.ts#L45)

Zod schema (or plain JSON-Schema object) describing the mission's output artifacts.
