# Type Alias: AgentOSActionableToolCallRequestChunk

> **AgentOSActionableToolCallRequestChunk** = [`AgentOSToolCallRequestChunk`](../interfaces/AgentOSToolCallRequestChunk.md) & `object`

Defined in: [packages/agentos/src/api/types/AgentOSResponse.ts:241](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/api/types/AgentOSResponse.ts#L241)

A host-actionable tool request chunk. Hosts should execute or surface the
tool call and resume the stream through `handleToolResult(...)`.

## Type Declaration

### executionMode

> **executionMode**: `"external"`

### requiresExternalToolResult

> **requiresExternalToolResult**: `true`
