# Type Alias: AgentOSActionableToolCallRequestChunk

> **AgentOSActionableToolCallRequestChunk** = [`AgentOSToolCallRequestChunk`](../interfaces/AgentOSToolCallRequestChunk.md) & `object`

Defined in: [packages/agentos/src/api/types/AgentOSResponse.ts:241](https://github.com/framersai/agentos/blob/9cd876525a0929142090c143309112844b6928f9/src/api/types/AgentOSResponse.ts#L241)

A host-actionable tool request chunk. Hosts should execute or surface the
tool call and resume the stream through `handleToolResult(...)`.

## Type Declaration

### executionMode

> **executionMode**: `"external"`

### requiresExternalToolResult

> **requiresExternalToolResult**: `true`
