# Type Alias: AgentOSToolCallExecutionMode

> **AgentOSToolCallExecutionMode** = `"internal"` \| `"external"`

Defined in: [packages/agentos/src/api/types/AgentOSResponse.ts:80](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/types/AgentOSResponse.ts#L80)

Indicates whether a tool request is informational because the runtime will
execute the tool internally, or whether the host must execute the tool and
resume the turn through `handleToolResult(...)`.
