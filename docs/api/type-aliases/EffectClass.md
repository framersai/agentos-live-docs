# Type Alias: EffectClass

> **EffectClass** = `"pure"` \| `"read"` \| `"write"` \| `"external"` \| `"human"`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:47](https://github.com/framersai/agentos/blob/7021709ae8e384df5464f1e2ae8b3fca40f72dbb/src/orchestration/ir/types.ts#L47)

Broad classification of the side-effects a node may produce.
Used by the runtime for scheduling, parallelism gating, and audit logging.

- `pure`     — no I/O; can be cached and parallelised freely.
- `read`     — reads external state but does not mutate it.
- `write`    — mutates external state (DB, API, file-system, …).
- `external` — fire-and-forget external call; mutation status unknown.
- `human`    — requires a human in the loop; execution suspends until resolved.
