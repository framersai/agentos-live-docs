# Type Alias: GraphMemoryScope

> **GraphMemoryScope** = `"global"` \| `"persona"` \| `"session"` \| `"conversation"`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:78](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/ir/types.ts#L78)

Visibility scope of a memory trace.

- `global`       — shared across all agents and all sessions.
- `persona`      — private to this agent identity.
- `session`      — lives only for the lifetime of a single run.
- `conversation` — lives only for the current conversation turn window.
