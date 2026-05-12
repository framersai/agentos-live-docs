# Type Alias: $ParseAsync()

> **$ParseAsync** = \<`T`\>(`schema`, `value`, `_ctx?`, `_params?`) => `Promise`\<[`output`](output.md)\<`T`\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/parse.d.cts:14

## Type Parameters

### T

`T` *extends* [`$ZodType`](../interfaces/$ZodType-1.md)

## Parameters

### schema

`T`

### value

`unknown`

### \_ctx?

[`ParseContext`](../interfaces/ParseContext.md)\<[`$ZodIssue`]($ZodIssue.md)\>

### \_params?

#### callee?

[`AnyFunc`](../../util/type-aliases/AnyFunc.md)

#### Err?

[`$ZodErrorClass`]($ZodErrorClass.md)

## Returns

`Promise`\<[`output`](output.md)\<`T`\>\>
