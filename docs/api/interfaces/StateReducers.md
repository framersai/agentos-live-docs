# Interface: StateReducers

Defined in: [packages/agentos/src/orchestration/ir/types.ts:596](https://github.com/framersai/agentos/blob/c3150c4c6250fd94284bfc6164282706975b97a8/src/orchestration/ir/types.ts#L596)

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
