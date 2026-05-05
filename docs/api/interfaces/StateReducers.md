# Interface: StateReducers

Defined in: [packages/agentos/src/orchestration/ir/types.ts:609](https://github.com/framersai/agentos/blob/369f4181e3a31735ff56401807893a6801760447/src/orchestration/ir/types.ts#L609)

Maps dot-notation field paths in `GraphState.scratch` / `GraphState.artifacts` to
either a `BuiltinReducer` name or a custom `ReducerFn`.

Example:
```ts
const reducers: StateReducers = {
  'scratch.messages': 'concat',
  'artifacts.summary': (a, b) => String(b ?? a),
};
```

## Indexable

\[`fieldPath`: `string`\]: [`ReducerFn`](../type-aliases/ReducerFn.md) \| [`BuiltinReducer`](../type-aliases/BuiltinReducer.md)
