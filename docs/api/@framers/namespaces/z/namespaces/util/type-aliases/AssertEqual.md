# Type Alias: AssertEqual\<T, U\>

> **AssertEqual**\<`T`, `U`\> = \<`V`\>() => `V` *extends* `T` ? `1` : `2` *extends* \<`V`\>() => `V` *extends* `U` ? `1` : `2` ? `true` : `false`

Defined in: node\_modules/.pnpm/zod@4.3.6/node\_modules/zod/v4/core/util.d.cts:15

## Type Parameters

### T

`T`

### U

`U`
