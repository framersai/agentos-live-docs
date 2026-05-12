# Type Alias: AssertNotEqual\<T, U\>

> **AssertNotEqual**\<`T`, `U`\> = \<`V`\>() => `V` *extends* `T` ? `1` : `2` *extends* \<`V`\>() => `V` *extends* `U` ? `1` : `2` ? `false` : `true`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/util.d.cts:16

## Type Parameters

### T

`T`

### U

`U`
