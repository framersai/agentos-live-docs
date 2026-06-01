# Type Alias: MemoryTraceType

> **MemoryTraceType** = `"episodic"` \| `"semantic"` \| `"procedural"` \| `"prospective"` \| `"relational"`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:63](https://github.com/framersai/agentos/blob/63ed327fe991cbf5fe1e01bca76416a3aaa76167/src/orchestration/ir/types.ts#L63)

Cognitive memory trace categories, modelled after the psychological taxonomy used
throughout the AgentOS memory subsystem.

- `episodic`    — autobiographical events tied to a moment in time.
- `semantic`    — factual / world-knowledge, not time-stamped.
- `procedural`  — how-to knowledge; encoded skills and routines.
- `prospective` — future-oriented intentions ("remember to …").
- `relational`  — trust, boundary, and relationship-state memory.
