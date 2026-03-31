# Type Alias: BuiltinReducer

> **BuiltinReducer** = `"concat"` \| `"merge"` \| `"max"` \| `"min"` \| `"avg"` \| `"sum"` \| `"last"` \| `"first"` \| `"longest"`

Defined in: [packages/agentos/src/orchestration/ir/types.ts:535](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/ir/types.ts#L535)

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
