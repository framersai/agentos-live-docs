# Type Alias: MemoryTraceType

> **MemoryTraceType** = `"episodic"` \| `"semantic"` \| `"procedural"` \| `"prospective"`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:62](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/ir/types.ts#L62)

Cognitive memory trace categories, modelled after the psychological taxonomy used
throughout the AgentOS memory subsystem.

- `episodic`    — autobiographical events tied to a moment in time.
- `semantic`    — factual / world-knowledge, not time-stamped.
- `procedural`  — how-to knowledge; encoded skills and routines.
- `prospective` — future-oriented intentions ("remember to …").
