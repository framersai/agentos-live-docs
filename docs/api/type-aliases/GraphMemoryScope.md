# Type Alias: GraphMemoryScope

> **GraphMemoryScope** = `"global"` \| `"persona"` \| `"session"` \| `"conversation"`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:72](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/ir/types.ts#L72)

Visibility scope of a memory trace.

- `global`       — shared across all agents and all sessions.
- `persona`      — private to this agent identity.
- `session`      — lives only for the lifetime of a single run.
- `conversation` — lives only for the current conversation turn window.
