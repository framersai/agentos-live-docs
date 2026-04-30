# Type Alias: AgencyTraceEvent

> **AgencyTraceEvent** = `AgentStartEvent` \| `AgentEndEvent` \| `HandoffEvent` \| `ToolCallEvent` \| `ForgeEvent` \| `GuardrailEvent` \| `LimitEvent`

Defined in: [packages/agentos/src/api/types.ts:803](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/api/types.ts#L803)

Discriminated union of all structured trace events emitted by the agency run.
Collected in `GenerateTextResult.trace` and emitted via `AgencyCallbacks`.
