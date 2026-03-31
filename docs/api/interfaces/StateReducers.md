# Interface: StateReducers

Defined in: [packages/agentos/src/orchestration/ir/types.ts:558](https://github.com/framersai/agentos/blob/563be3fc675f9de928227b5191763fc5aa7da9e9/src/orchestration/ir/types.ts#L558)

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
