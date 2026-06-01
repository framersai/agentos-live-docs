# Type Alias: AgencyTraceEvent

> **AgencyTraceEvent** = `AgentStartEvent` \| `AgentEndEvent` \| `HandoffEvent` \| `ToolCallEvent` \| `ForgeEvent` \| `GuardrailEvent` \| `LimitEvent`

Defined in: [packages/agentos/src/api/types.ts:881](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/api/types.ts#L881)

Discriminated union of all structured trace events emitted by the agency run.
Collected in `GenerateTextResult.trace` and emitted via `AgencyCallbacks`.
