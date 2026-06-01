# Interface: SimplePlan

Defined in: [packages/agentos/src/orchestration/compiler/MissionCompiler.ts:142](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/compiler/MissionCompiler.ts#L142)

Minimal plan structure produced by the current stub planner. Each step maps
1-to-1 to a `GraphNode` in the compiled IR.

## Properties

### steps

> **steps**: `object`[]

Defined in: [packages/agentos/src/orchestration/compiler/MissionCompiler.ts:143](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/compiler/MissionCompiler.ts#L143)

#### action

> **action**: `string`

Step action type, used to select the correct node builder:
- `'reasoning'`   → `gmiNode`
- `'tool_call'`   → `toolNode`
- `'human_input'` → `humanNode`
- `'validation'`  → `guardrailNode`

#### description

> **description**: `string`

Human-readable description injected as the node's instructions or prompt.

#### id

> **id**: `string`

Unique step id; becomes the compiled `GraphNode.id`.

#### maxIterations?

> `optional` **maxIterations**: `number`

Optional per-step override for `gmiNode.maxInternalIterations`. Allows
the planner to give phases that need many tool calls (e.g. gather) a
larger iteration budget than reasoning-only phases (process, deliver,
refine), instead of forcing a single global value across the whole
plan. Falls back to `plannerConfig.maxIterationsPerNode` when unset.

#### phase

> **phase**: `"gather"` \| `"process"` \| `"validate"` \| `"deliver"`

Execution phase this step belongs to (governs ordering alongside anchors).

#### toolName?

> `optional` **toolName**: `string`

Required when `action` is `'tool_call'`; the registered tool name.
