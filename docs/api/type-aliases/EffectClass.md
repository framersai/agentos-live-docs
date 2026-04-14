# Type Alias: EffectClass

> **EffectClass** = `"pure"` \| `"read"` \| `"write"` \| `"external"` \| `"human"`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:47](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/orchestration/ir/types.ts#L47)

Broad classification of the side-effects a node may produce.
Used by the runtime for scheduling, parallelism gating, and audit logging.

- `pure`     — no I/O; can be cached and parallelised freely.
- `read`     — reads external state but does not mutate it.
- `write`    — mutates external state (DB, API, file-system, …).
- `external` — fire-and-forget external call; mutation status unknown.
- `human`    — requires a human in the loop; execution suspends until resolved.
