# Type Alias: AgentOSActionableToolCallRequestChunk

> **AgentOSActionableToolCallRequestChunk** = [`AgentOSToolCallRequestChunk`](../interfaces/AgentOSToolCallRequestChunk.md) & `object`

Defined in: [packages/agentos/src/api/types/AgentOSResponse.ts:241](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/types/AgentOSResponse.ts#L241)

A host-actionable tool request chunk. Hosts should execute or surface the
tool call and resume the stream through `handleToolResult(...)`.

## Type Declaration

### executionMode

> **executionMode**: `"external"`

### requiresExternalToolResult

> **requiresExternalToolResult**: `true`
