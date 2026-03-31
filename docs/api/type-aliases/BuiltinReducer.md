# Type Alias: BuiltinReducer

> **BuiltinReducer** = `"concat"` \| `"merge"` \| `"max"` \| `"min"` \| `"avg"` \| `"sum"` \| `"last"` \| `"first"` \| `"longest"`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:573](https://github.com/framersai/agentos/blob/209a2acfc5500076d28db827d413020016d1634e/src/orchestration/ir/types.ts#L573)

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
