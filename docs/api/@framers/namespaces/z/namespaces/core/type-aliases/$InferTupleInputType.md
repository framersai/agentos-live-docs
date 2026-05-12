# Type Alias: $InferTupleInputType\<T, Rest\>

> **$InferTupleInputType**\<`T`, `Rest`\> = \[`...TupleInputTypeWithOptionals<T>`, `...(Rest extends SomeType ? input<Rest>[] : [])`\]

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:681

## Type Parameters

### T

`T` *extends* [`TupleItems`](../../util/type-aliases/TupleItems.md)

### Rest

`Rest` *extends* [`SomeType`](SomeType.md) \| `null`
