# Type Alias: AgencyTraceEvent

> **AgencyTraceEvent** = `AgentStartEvent` \| `AgentEndEvent` \| `HandoffEvent` \| `ToolCallEvent` \| `ForgeEvent` \| `GuardrailEvent` \| `LimitEvent`

Defined in: [packages/agentos/src/api/types.ts:803](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/api/types.ts#L803)

Discriminated union of all structured trace events emitted by the agency run.
Collected in `GenerateTextResult.trace` and emitted via `AgencyCallbacks`.
