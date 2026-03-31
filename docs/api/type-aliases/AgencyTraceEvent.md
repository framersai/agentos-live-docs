# Type Alias: AgencyTraceEvent

> **AgencyTraceEvent** = `AgentStartEvent` \| `AgentEndEvent` \| `HandoffEvent` \| `ToolCallEvent` \| `ForgeEvent` \| `GuardrailEvent` \| `LimitEvent`

Defined in: [packages/agentos/src/api/types.ts:558](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/api/types.ts#L558)

Discriminated union of all structured trace events emitted by the agency run.
Collected in `GenerateTextResult.trace` and emitted via `AgencyCallbacks`.
