# Type Alias: AgentOSActionableToolCallRequestChunk

> **AgentOSActionableToolCallRequestChunk** = [`AgentOSToolCallRequestChunk`](../interfaces/AgentOSToolCallRequestChunk.md) & `object`

Defined in: [packages/agentos/src/api/types/AgentOSResponse.ts:241](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/types/AgentOSResponse.ts#L241)

A host-actionable tool request chunk. Hosts should execute or surface the
tool call and resume the stream through `handleToolResult(...)`.

## Type Declaration

### executionMode

> **executionMode**: `"external"`

### requiresExternalToolResult

> **requiresExternalToolResult**: `true`
