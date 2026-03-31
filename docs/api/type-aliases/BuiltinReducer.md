# Type Alias: BuiltinReducer

> **BuiltinReducer** = `"concat"` \| `"merge"` \| `"max"` \| `"min"` \| `"avg"` \| `"sum"` \| `"last"` \| `"first"` \| `"longest"`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:573](https://github.com/framersai/agentos/blob/ac1e60f8857aef619a8160a2a7cfc7a63e5ee780/src/orchestration/ir/types.ts#L573)

Named built-in reducer strategies for `GraphState.scratch` and `GraphState.artifacts` fields.

- `concat`  — append arrays or concatenate strings.
- `merge`   — deep-merge objects (right wins on conflict).
- `max`     — keep the larger numeric value.
- `min`     — keep the smaller numeric value.
- `avg`     — running arithmetic mean.
- `sum`     — running total.
- `last`    — always overwrite with the latest value (default semantics).
- `first`   — keep the first value; ignore subsequent writes.
- `longest` — keep the longer string or larger array.
