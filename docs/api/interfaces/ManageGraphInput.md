# Interface: ManageGraphInput

Defined in: [packages/agentos/src/orchestration/tools/ManageGraphTool.ts:14](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/tools/ManageGraphTool.ts#L14)

Input args for the manage_graph tool call.

## Extends

- `Record`\<`string`, `any`\>

## Indexable

\[`key`: `string`\]: `any`

## Properties

### action

> **action**: `"spawn_agent"` \| `"remove_agent"` \| `"reassign_role"` \| `"add_tool"` \| `"fork_branch"`

Defined in: [packages/agentos/src/orchestration/tools/ManageGraphTool.ts:16](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/tools/ManageGraphTool.ts#L16)

What graph modification to perform.

***

### reason

> **reason**: `string`

Defined in: [packages/agentos/src/orchestration/tools/ManageGraphTool.ts:20](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/tools/ManageGraphTool.ts#L20)

Why this modification is needed.

***

### spec

> **spec**: `Record`\<`string`, `unknown`\>

Defined in: [packages/agentos/src/orchestration/tools/ManageGraphTool.ts:18](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/tools/ManageGraphTool.ts#L18)

Specification for the modification (agent config, tool definition, etc.).
