# Type Alias: MemoryTraceType

> **MemoryTraceType** = `"episodic"` \| `"semantic"` \| `"procedural"` \| `"prospective"` \| `"relational"`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:63](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/orchestration/ir/types.ts#L63)

Cognitive memory trace categories, modelled after the psychological taxonomy used
throughout the AgentOS memory subsystem.

- `episodic`    — autobiographical events tied to a moment in time.
- `semantic`    — factual / world-knowledge, not time-stamped.
- `procedural`  — how-to knowledge; encoded skills and routines.
- `prospective` — future-oriented intentions ("remember to …").
- `relational`  — trust, boundary, and relationship-state memory.
