# Type Alias: AgentOSToolCallExecutionMode

> **AgentOSToolCallExecutionMode** = `"internal"` \| `"external"`

Defined in: [packages/agentos/src/api/types/AgentOSResponse.ts:80](https://github.com/framersai/agentos/blob/e72831f0f0d93a558f6ab38097d3d29cfcd4c629/src/api/types/AgentOSResponse.ts#L80)

Indicates whether a tool request is informational because the runtime will
execute the tool internally, or whether the host must execute the tool and
resume the turn through `handleToolResult(...)`.
