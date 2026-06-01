# Type Alias: MemorySourceType

> **MemorySourceType** = `"user_statement"` \| `"agent_inference"` \| `"tool_result"` \| `"observation"` \| `"reflection"` \| `"external"` \| `"fact_graph"` \| `"typed_network"` \| `"retrieved_document"` \| `"human_approval"` \| `"identity_provider"` \| `"system_config"` \| `"external_api"` \| `"memory_summary"`

Defined in: [packages/agentos/src/cognition/memory/core/types.ts:39](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/cognition/memory/core/types.ts#L39)

How the content of this memory was originally produced.

Source type drives trust ranking and confidence-decay multiplier. Higher-
trust sources (`identity_provider`, `system_config`, `tool_result`,
`human_approval`) decay slowest; derived/inferred sources
(`agent_inference`, `memory_summary`, `reflection`) decay fastest. See
`SourceConfidenceDecay` mechanism for the per-type multipliers.
