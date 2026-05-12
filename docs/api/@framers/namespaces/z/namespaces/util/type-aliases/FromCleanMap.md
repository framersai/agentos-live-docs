# Type Alias: FromCleanMap\<T\>

> **FromCleanMap**\<`T`\> = `` { [k in keyof T as k extends `?${infer K}` ? K : k extends `${infer K}?` ? K : k]: k } ``

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/util.d.cts:166

## Type Parameters

### T

`T` *extends* [`$ZodLooseShape`](../../core/type-aliases/$ZodLooseShape.md)
