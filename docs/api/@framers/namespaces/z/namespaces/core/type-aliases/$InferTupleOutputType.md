# Type Alias: $InferTupleOutputType\<T, Rest\>

> **$InferTupleOutputType**\<`T`, `Rest`\> = \[`...TupleOutputTypeWithOptionals<T>`, `...(Rest extends SomeType ? output<Rest>[] : [])`\]

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/schemas.d.cts:692

## Type Parameters

### T

`T` *extends* [`TupleItems`](../../util/type-aliases/TupleItems.md)

### Rest

`Rest` *extends* [`SomeType`](SomeType.md) \| `null`
