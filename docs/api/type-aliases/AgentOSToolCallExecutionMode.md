# Type Alias: AgentOSToolCallExecutionMode

> **AgentOSToolCallExecutionMode** = `"internal"` \| `"external"`

Defined in: [packages/agentos/src/api/types/AgentOSResponse.ts:80](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/types/AgentOSResponse.ts#L80)

Indicates whether a tool request is informational because the runtime will
execute the tool internally, or whether the host must execute the tool and
resume the turn through `handleToolResult(...)`.
