# Type Alias: GraphMemoryScope

> **GraphMemoryScope** = `"global"` \| `"persona"` \| `"session"` \| `"conversation"`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:78](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/ir/types.ts#L78)

Visibility scope of a memory trace.

- `global`       — shared across all agents and all sessions.
- `persona`      — private to this agent identity.
- `session`      — lives only for the lifetime of a single run.
- `conversation` — lives only for the current conversation turn window.
