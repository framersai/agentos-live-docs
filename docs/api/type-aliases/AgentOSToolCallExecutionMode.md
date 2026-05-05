# Type Alias: AgentOSToolCallExecutionMode

> **AgentOSToolCallExecutionMode** = `"internal"` \| `"external"`

Defined in: [packages/agentos/src/api/types/AgentOSResponse.ts:80](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/api/types/AgentOSResponse.ts#L80)

Indicates whether a tool request is informational because the runtime will
execute the tool internally, or whether the host must execute the tool and
resume the turn through `handleToolResult(...)`.
