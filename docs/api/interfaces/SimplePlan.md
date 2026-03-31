# Interface: SimplePlan

Defined in: [packages/agentos/src/orchestration/compiler/MissionCompiler.ts:116](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/orchestration/compiler/MissionCompiler.ts#L116)

Minimal plan structure produced by the current stub planner. Each step maps
1-to-1 to a `GraphNode` in the compiled IR.

## Properties

### steps

> **steps**: `object`[]

Defined in: [packages/agentos/src/orchestration/compiler/MissionCompiler.ts:117](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/orchestration/compiler/MissionCompiler.ts#L117)

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

#### phase

> **phase**: `"gather"` \| `"process"` \| `"validate"` \| `"deliver"`

Execution phase this step belongs to (governs ordering alongside anchors).

#### toolName?

> `optional` **toolName**: `string`

Required when `action` is `'tool_call'`; the registered tool name.
