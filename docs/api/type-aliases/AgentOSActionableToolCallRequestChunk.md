# Type Alias: AgentOSActionableToolCallRequestChunk

> **AgentOSActionableToolCallRequestChunk** = [`AgentOSToolCallRequestChunk`](../interfaces/AgentOSToolCallRequestChunk.md) & `object`

Defined in: [packages/agentos/src/api/types/AgentOSResponse.ts:241](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/api/types/AgentOSResponse.ts#L241)

A host-actionable tool request chunk. Hosts should execute or surface the
tool call and resume the stream through `handleToolResult(...)`.

## Type Declaration

### executionMode

> **executionMode**: `"external"`

### requiresExternalToolResult

> **requiresExternalToolResult**: `true`
