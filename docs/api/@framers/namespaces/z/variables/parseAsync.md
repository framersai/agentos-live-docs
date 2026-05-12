# Variable: parseAsync()

> `const` **parseAsync**: \<`T`\>(`schema`, `value`, `_ctx?`, `_params?`) => `Promise`\<[`output`](../namespaces/core/type-aliases/output.md)\<`T`\>\>

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/classic/parse.d.cts:18

## Type Parameters

### T

`T` *extends* [`$ZodType`](../namespaces/core/interfaces/$ZodType-1.md)

## Parameters

### schema

`T`

### value

`unknown`

### \_ctx?

[`ParseContext`](../namespaces/core/interfaces/ParseContext.md)\<[`$ZodIssue`](../namespaces/core/type-aliases/$ZodIssue.md)\>

### \_params?

#### callee?

[`AnyFunc`](../namespaces/util/type-aliases/AnyFunc.md)

#### Err?

[`$ZodErrorClass`](../namespaces/core/type-aliases/$ZodErrorClass.md)

## Returns

`Promise`\<[`output`](../namespaces/core/type-aliases/output.md)\<`T`\>\>
