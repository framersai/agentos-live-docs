# Type Alias: AgencyTraceEvent

> **AgencyTraceEvent** = `AgentStartEvent` \| `AgentEndEvent` \| `HandoffEvent` \| `ToolCallEvent` \| `ForgeEvent` \| `GuardrailEvent` \| `LimitEvent`

Defined in: [packages/agentos/src/api/types.ts:611](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/api/types.ts#L611)

Discriminated union of all structured trace events emitted by the agency run.
Collected in `GenerateTextResult.trace` and emitted via `AgencyCallbacks`.
