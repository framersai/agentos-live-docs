# Type Alias: $ZodErrorTree\<T, U\>

> **$ZodErrorTree**\<`T`, `U`\> = `T` *extends* [`Primitive`](../../util/type-aliases/Primitive.md) ? `object` : `T` *extends* \[`any`, `...any[]`\] ? `object` : `T` *extends* `any`[] ? `object` : `T` *extends* `object` ? `object` : `object`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/errors.d.cts:166

## Type Parameters

### T

`T`

### U

`U` = `string`
